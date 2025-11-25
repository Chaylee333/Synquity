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
        is_verified
      ),
      post_likes (count),
      comments (count),
      post_performance_tracking (*)
    `)
        .order('created_at', { ascending: false });

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

    const { data, error } = await supabase
        .from('posts')
        .insert({
            ...post,
            author_id: user.id,
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
      posts (
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
