import { supabase } from './supabase';

/**
 * OracleRank Algorithm Implementation
 * 
 * This file contains the logic for:
 * 1. Updating Post Outcomes (Did the stock move as predicted?)
 * 2. Updating User Reputation (Did the user upvote good posts?)
 * 3. Updating Post Rankings (Score based on upvoter reputation)
 */

// Mock function to get current stock price
// In a real app, this would call a financial data API
async function getCurrentPrice(_ticker: string): Promise<number> {
    // Simulate price movement for demo purposes
    // Randomly return a price between -5% and +5% of a base 100
    // In reality, we'd need the historical price too
    return 100 + (Math.random() * 10 - 5);
}

export async function runOracle() {
    console.log('🔮 Oracle starting...');

    try {
        await updatePostOutcomes();
        await updateUserReputation();
        await updatePostRankings();
        console.log('✨ Oracle finished successfully!');
    } catch (error) {
        console.error('❌ Oracle failed:', error);
    }
}

async function updatePostOutcomes() {
    console.log('  Updating post outcomes...');

    // 1. Fetch posts that need outcome calculation
    // For simplicity, we'll just fetch the last 50 posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, ticker, sentiment, stock_price_at_posting, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw error;

    for (const post of posts) {
        if (!post.stock_price_at_posting) continue;

        // Get current price (mocked)
        const currentPrice = await getCurrentPrice(post.ticker);

        // Calculate return
        const priceReturn = (currentPrice - post.stock_price_at_posting) / post.stock_price_at_posting;

        // Calculate outcome based on sentiment
        // Bullish: Positive return is good
        // Bearish: Negative return is good
        let outcome = 0;
        if (post.sentiment === 'bullish') {
            outcome = priceReturn;
        } else if (post.sentiment === 'bearish') {
            outcome = -priceReturn; // Original line
        }

        console.log(`Updating post ${post.id} (${post.ticker}): Initial ${post.stock_price_at_posting}, Current ${currentPrice}, Outcome ${outcome.toFixed(4)}`);

        // Update post
        const { error: updateError } = await supabase
            .from('posts')
            .update({ performance_outcome: outcome })
            .eq('id', post.id);

        if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError);
        }
    }
}

async function updateUserReputation() {
    console.log('  Updating user reputation...');

    // 1. Fetch all users
    const { data: users, error } = await supabase
        .from('profiles')
        .select('id');

    if (error) throw error;

    for (const user of users) {
        // 2. Get all posts upvoted by this user
        const { data: upvotes } = await supabase
            .from('post_likes')
            .select('post_id, posts(performance_outcome)')
            .eq('user_id', user.id);

        if (!upvotes || upvotes.length === 0) continue;

        // 3. Calculate aggregate score
        let totalOutcome = 0;
        let count = 0;

        for (const vote of upvotes) {
            // @ts-ignore - Supabase types might be tricky with nested joins
            const outcome = vote.posts?.performance_outcome;
            if (outcome !== null && outcome !== undefined) {
                totalOutcome += outcome;
                count++;
            }
        }

        if (count === 0) continue;

        // Sigmoid-like normalization to 0-1 range (centered at 0.5)
        // A simple approach: 0.5 + (avg_outcome * factor)
        // Capped between 0 and 1
        const avgOutcome = totalOutcome / count;
        const reputationScore = Math.max(0, Math.min(1, 0.5 + (avgOutcome * 5))); // *5 to amplify small returns

        // 4. Update user profile
        await supabase
            .from('profiles')
            .update({ reputation_score: reputationScore })
            .eq('id', user.id);
    }
}

async function updatePostRankings() {
    console.log('  Updating post rankings...');

    // 1. Fetch active posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, performance_outcome') // Select performance_outcome to filter
        .is('performance_outcome', null) // Only update posts with null performance_outcome
        .not('stock_price_at_posting', 'is', null); // Only update posts with initial price

    if (error) {
        console.error('Error fetching posts for oracle:', error);
        return;
    }

    console.log(`Found ${posts?.length || 0} posts to update rankings for.`);

    for (const post of posts) {
        // 2. Get upvoters for this post
        const { data: upvotes } = await supabase
            .from('post_likes')
            .select('user_id, profiles(reputation_score)')
            .eq('post_id', post.id);

        if (!upvotes) continue;

        // 3. Sum reputation scores
        let rankingScore = 0;
        for (const vote of upvotes) {
            // @ts-ignore
            const rep = vote.profiles?.reputation_score || 0.5; // Default to 0.5 if null
            rankingScore += rep;
        }

        // 4. Update post ranking score
        await supabase
            .from('posts')
            .update({ ranking_score: rankingScore })
            .eq('id', post.id);
    }
}
