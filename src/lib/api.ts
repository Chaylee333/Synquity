import { supabase } from './supabase';

// ============================================
// COMPANIES & TICKERS
// ============================================

export async function fetchCompanies() {
    const { data, error } = await supabase
        .from('companies')
        .select(`
      *,
      company_metrics (*),
      ticker_community_metrics (*)
    `)
        .order('ticker', { ascending: true });

    if (error) {
        console.error('Error fetching companies:', error);
        return [];
    }

    return data || [];
}

export async function fetchTickerDetails(ticker: string) {
    const { data, error } = await supabase
        .from('companies')
        .select(`
      *,
      company_metrics (*),
      ticker_community_metrics (*)
    `)
        .eq('ticker', ticker)
        .single();

    if (error) {
        console.error('Error fetching ticker details:', error);
        return null;
    }

    return data;
}

export async function searchTickers(query: string, limit: number = 10) {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = query.toUpperCase();

    const { data, error } = await supabase
        .from('companies')
        .select('ticker, name, industry')
        .or(`ticker.ilike.%${searchTerm}%,name.ilike.%${query}%`)
        .limit(limit);

    if (error) {
        console.error('Error searching tickers:', error);
        return [];
    }

    return data || [];
}

// ============================================
// POSTS
// ============================================

export async function fetchPosts(filters?: {
    ticker?: string;
    category?: string;
    authorId?: string;
    limit?: number;
    sortBy?: 'latest' | 'ranking';
}) {
    let query = supabase
        .from('posts')
        .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified,
        reputation_score
      ),
      post_likes (count),
      comments (count),
      post_performance_tracking (*)
    `);

    if (filters?.sortBy === 'ranking') {
        query = query.order('ranking_score', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    if (filters?.ticker) {
        query = query.eq('ticker', filters.ticker);
    }

    if (filters?.category) {
        query = query.eq('category', filters.category);
    }

    if (filters?.authorId) {
        query = query.eq('author_id', filters.authorId);
    }

    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }

    return data || [];
}

// ============================================
// TRENDING POSTS
// ============================================

export async function fetchTrendingPosts(limit: number = 10) {
    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified
      ),
      post_likes (count)
    `)
        .order('post_likes.count', { foreignTable: 'post_likes', ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching trending posts:', error);
        return [];
    }
    return data || [];
}

// ============================================
// COMMENTS
// ============================================

export async function fetchComments(postId: number) {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles:author_id (
                id,
                username,
                full_name,
                avatar_url,
                is_verified
            ),
            comment_likes (count)
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
            const replies = await fetchReplies(comment.id);
            return {
                ...comment,
                replies: replies
            };
        })
    );

    return commentsWithReplies;
}

export async function fetchReplies(commentId: number): Promise<any[]> {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles:author_id (
                id,
                username,
                full_name,
                avatar_url,
                is_verified
            ),
            comment_likes (count)
        `)
        .eq('parent_id', commentId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching replies:', error);
        return [];
    }

    // Recursively fetch nested replies
    const repliesWithNested = await Promise.all(
        (data || []).map(async (reply) => {
            const nestedReplies = await fetchReplies(reply.id);
            return {
                ...reply,
                replies: nestedReplies
            };
        })
    );

    return repliesWithNested;
}

export async function addComment(postId: number, content: string, parentId?: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            author_id: user.id,
            content,
            parent_id: parentId || null,
            created_at: new Date().toISOString()
        })
        .select(`
            *,
            profiles:author_id (
                id,
                username,
                full_name,
                avatar_url,
                is_verified
            )
        `)
        .single();

    if (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
    return data;
}

export async function fetchPostById(postId: number) {
    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified
      ),
      post_likes (count),
      comments (
        *,
        profiles:author_id (
          id,
          username,
          full_name,
          avatar_url,
          is_verified
        )
      ),
      post_performance_tracking (*)
    `)
        .eq('id', postId)
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    return data;
}

// Fetch the latest price for a ticker
export async function fetchLatestTickerPrice(ticker: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ticker_prices')
        .select('price')
        .eq('ticker', ticker.toUpperCase())
        .order('price_date', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching ticker price:', error);
        return null;
    }

    return data?.price || null;
}

export async function createPost(post: {
    title: string;
    content: string;
    ticker: string;
    category: string;
    sentiment?: string;
    market?: string;
    time_horizon?: string;
    risk_profile?: string;
}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Get the current price for the ticker to store as stock_price_at_posting
    let stockPriceAtPosting: number | null = null;
    if (post.ticker) {
        stockPriceAtPosting = await fetchLatestTickerPrice(post.ticker);
    }

    const { data, error } = await supabase
        .from('posts')
        .insert({
            ...post,
            author_id: user.id,
            stock_price_at_posting: stockPriceAtPosting,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating post:', error);
        throw error;
    }

    return data;
}

export async function fetchUserPosts(userId: string) {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles!posts_author_id_fkey (
                id,
                username,
                full_name,
                avatar_url
            ),
            post_likes (count),
            comments (count)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }

    // Transform the data to include counts
    const transformedData = (data || []).map(post => ({
        ...post,
        like_count: post.post_likes?.[0]?.count || 0,
        comment_count: post.comments?.[0]?.count || 0,
    }));

    return transformedData;
}

export async function fetchUserComments(userId: string) {
    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles!comments_author_id_fkey (
                id,
                username,
                full_name,
                avatar_url
            ),
            posts!comments_post_id_fkey (
                id,
                title,
                ticker
            ),
            comment_likes (count)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user comments:', error);
        return [];
    }

    return data || [];
}

export async function fetchUserPerformanceMetrics(userId: string) {
    const { data, error } = await supabase
        .from('creator_performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        // If no performance metrics exist yet, return null
        if (error.code === 'PGRST116') {
            return null;
        }
        console.error('Error fetching user performance metrics:', error);
        return null;
    }

    return data;
}

// ============================================
// CREATORS
// ============================================

export async function fetchCreators(sortBy: 'sharpe_ratio' | 'pnl_annualized_percent' = 'sharpe_ratio') {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      creator_performance_metrics (*),
      posts (count)
    `)
        .not('creator_performance_metrics', 'is', null)
        .order(sortBy, { foreignTable: 'creator_performance_metrics', ascending: false });

    if (error) {
        console.error('Error fetching creators:', error);
        return [];
    }

    return data || [];
}

export async function fetchCreatorProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
      *,
      creator_performance_metrics (*),
      posts!posts_author_id_fkey (
        *,
        post_likes (count),
        comments (count)
      )
    `)
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching creator profile:', error);
        return null;
    }

    return data;
}

// ============================================
// FOLLOWS
// ============================================

export async function followUser(followingId: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('follows')
        .insert({
            follower_id: user.id,
            following_id: followingId,
        });

    if (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

export async function unfollowUser(followingId: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', followingId);

    if (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}

export async function checkIfFollowing(followingId: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return false;
    }

    const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single();

    return !!data && !error;
}

export async function fetchUserFollowCounts(userId: string) {
    const { count: followersCount, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

    if (followersError) {
        console.error('Error fetching followers count:', followersError);
    }

    const { count: followingCount, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

    if (followingError) {
        console.error('Error fetching following count:', followingError);
    }

    return {
        followers: followersCount || 0,
        following: followingCount || 0
    };
}

// ============================================
// LIKES
// ============================================

export async function togglePostLike(postId: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', postId);

        if (error) throw error;
        return false; // unliked
    } else {
        // Like
        const { error } = await supabase
            .from('post_likes')
            .insert({
                user_id: user.id,
                post_id: postId,
            });

        if (error) throw error;
        return true; // liked
    }
}

export async function checkPostLiked(postId: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return false;
    }

    const { data } = await supabase
        .from('post_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

    return !!data;
}

export async function getPostLikeCount(postId: number) {
    const { count, error } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

    if (error) {
        console.error('Error getting post like count:', error);
        return 0;
    }

    return count || 0;
}

export async function toggleCommentLike(commentId: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    console.log('Toggling comment like for:', { userId: user.id, commentId });

    // Check if already liked
    const { data: existingLike, error: selectError } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

    if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking comment like:', selectError);
        throw new Error(`Failed to check like status: ${selectError.message}`);
    }

    if (existingLike) {
        // Unlike
        console.log('Unliking comment...');
        const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('user_id', user.id)
            .eq('comment_id', commentId);

        if (error) {
            console.error('Error unliking comment:', error);
            throw new Error(`Failed to unlike: ${error.message}`);
        }
        console.log('Comment unliked successfully');
        return false; // unliked
    } else {
        // Like
        console.log('Liking comment...');
        const { error } = await supabase
            .from('comment_likes')
            .insert({
                user_id: user.id,
                comment_id: commentId,
            });

        if (error) {
            console.error('Error liking comment:', error);
            throw new Error(`Failed to like: ${error.message}`);
        }
        console.log('Comment liked successfully');
        return true; // liked
    }
}

export async function checkCommentLiked(commentId: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return false;
    }

    const { data } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

    return !!data;
}

export async function getCommentLikeCount(commentId: number) {
    const { count, error } = await supabase
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

    if (error) {
        console.error('Error getting comment like count:', error);
        return 0;
    }

    return count || 0;
}

// ============================================
// SAVED POSTS
// ============================================

export async function toggleSavedPost(postId: number) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Check if already saved
    const { data: existingSave } = await supabase
        .from('saved_posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

    if (existingSave) {
        // Unsave
        const { error } = await supabase
            .from('saved_posts')
            .delete()
            .eq('user_id', user.id)
            .eq('post_id', postId);

        if (error) throw error;
        return false; // unsaved
    } else {
        // Save
        const { error } = await supabase
            .from('saved_posts')
            .insert({
                user_id: user.id,
                post_id: postId,
            });

        if (error) throw error;
        return true; // saved
    }
}

// ============================================
// TICKER SENTIMENT VOTES
// ============================================

export async function voteTickerSentiment(ticker: string, sentiment: 'bullish' | 'bearish') {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase
        .from('ticker_sentiment_votes')
        .upsert({
            user_id: user.id,
            ticker: ticker,
            sentiment: sentiment,
        });

    if (error) {
        console.error('Error voting on ticker sentiment:', error);
        throw error;
    }
}

// ============================================
// PROFILE MANAGEMENT
// ============================================

export async function uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    // Update the profile with the new avatar URL
    await updateProfile({ avatar_url: publicUrl });

    // Also update auth user metadata
    await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    return publicUrl;
}

export async function updateProfile(profileData: {
    username?: string;
    full_name?: string;
    bio?: string;
    website?: string;
    location?: string;
    avatar_url?: string;
}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Update profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            ...profileData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (profileError) {
        console.error('Error updating profile:', profileError);
        throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    // Also update auth user metadata for username and full_name
    if (profileData.username || profileData.full_name) {
        const { error: authError } = await supabase.auth.updateUser({
            data: {
                ...(profileData.username && { username: profileData.username }),
                ...(profileData.full_name && { full_name: profileData.full_name }),
            }
        });

        if (authError) {
            console.error('Error updating auth metadata:', authError);
            // Don't throw here, profile was already updated
        }
    }

    return true;
}

export async function fetchUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }

    return data;
}

// ============================================
// USER SETTINGS
// ============================================

export async function fetchUserSettings() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching user settings:', error);
        throw error;
    }

    // Return default settings if none exist
    if (!data) {
        return {
            email_notifications: true,
            new_followers_notifications: true,
            post_interactions_notifications: true,
        };
    }

    return data;
}

export async function updateUserSettings(settings: {
    email_notifications?: boolean;
    new_followers_notifications?: boolean;
    post_interactions_notifications?: boolean;
}) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Upsert settings (insert if not exists, update if exists)
    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: user.id,
            ...settings,
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error('Error updating user settings:', error);
        throw new Error(`Failed to update settings: ${error.message}`);
    }

    return true;
}

// ============================================
// PASSWORD MANAGEMENT
// ============================================

export async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        console.error('Error updating password:', error);
        throw new Error(`Failed to update password: ${error.message}`);
    }

    return true;
}

// ============================================
// TICKER PRICE MANAGEMENT
// ============================================

// Fetch all available ticker prices
export async function fetchTickerPrices() {
    const { data, error } = await supabase
        .from('ticker_prices')
        .select('*')
        .order('price_date', { ascending: false });

    if (error) {
        console.error('Error fetching ticker prices:', error);
        return [];
    }

    return data;
}

// Insert or update a ticker price (for admin/service use)
export async function upsertTickerPrice(ticker: string, price: number, priceDate?: string) {
    const { data, error } = await supabase
        .from('ticker_prices')
        .upsert({
            ticker: ticker.toUpperCase(),
            price,
            price_date: priceDate || new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting ticker price:', error);
        throw error;
    }

    return data;
}

// Fetch post performance tracking for a specific post
export async function fetchPostPerformance(postId: number) {
    const { data, error } = await supabase
        .from('post_performance_tracking')
        .select('*')
        .eq('post_id', postId)
        .order('tracking_date', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching post performance:', error);
        return null;
    }

    return data;
}
