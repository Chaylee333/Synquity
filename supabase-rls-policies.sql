-- Row Level Security (RLS) Policies for Synquity
-- Run these commands in your Supabase SQL Editor
-- This script is IDEMPOTENT - safe to run multiple times

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Post Likes
DROP POLICY IF EXISTS "Post likes are viewable by everyone" ON public.post_likes;
DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
DROP POLICY IF EXISTS "Users can unlike posts" ON public.post_likes;

-- Comment Likes
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can like comments" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can unlike comments" ON public.comment_likes;

-- Saved Posts
DROP POLICY IF EXISTS "Users can view their own saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can unsave posts" ON public.saved_posts;

-- Follows
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;

-- Ticker Sentiment Votes
DROP POLICY IF EXISTS "Ticker sentiment votes are viewable by everyone" ON public.ticker_sentiment_votes;
DROP POLICY IF EXISTS "Users can vote on ticker sentiment" ON public.ticker_sentiment_votes;
DROP POLICY IF EXISTS "Users can update their ticker sentiment vote" ON public.ticker_sentiment_votes;
DROP POLICY IF EXISTS "Users can delete their ticker sentiment vote" ON public.ticker_sentiment_votes;

-- Read-only tables
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Company metrics are viewable by everyone" ON public.company_metrics;
DROP POLICY IF EXISTS "Creator performance metrics are viewable by everyone" ON public.creator_performance_metrics;
DROP POLICY IF EXISTS "Post performance tracking is viewable by everyone" ON public.post_performance_tracking;
DROP POLICY IF EXISTS "Ticker community metrics are viewable by everyone" ON public.ticker_community_metrics;

-- User Settings
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_sentiment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_community_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES - Everyone can read, users can update their own
-- ============================================

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- POSTS - Everyone can read, authenticated users can create
-- ============================================

CREATE POLICY "Posts are viewable by everyone"
ON public.posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- COMMENTS - Everyone can read, authenticated users can create
-- ============================================

CREATE POLICY "Comments are viewable by everyone"
ON public.comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- POST_LIKES - Users can manage their own likes
-- ============================================

CREATE POLICY "Post likes are viewable by everyone"
ON public.post_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like posts"
ON public.post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
ON public.post_likes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- COMMENT_LIKES - Users can manage their own likes
-- ============================================

CREATE POLICY "Comment likes are viewable by everyone"
ON public.comment_likes FOR SELECT
USING (true);

CREATE POLICY "Users can like comments"
ON public.comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
ON public.comment_likes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- SAVED_POSTS - Users can manage their own saved posts
-- ============================================

CREATE POLICY "Users can view their own saved posts"
ON public.saved_posts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
ON public.saved_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts"
ON public.saved_posts FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS - Users can manage their own follows
-- ============================================

CREATE POLICY "Follows are viewable by everyone"
ON public.follows FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);

-- ============================================
-- TICKER_SENTIMENT_VOTES - Users can manage their own votes
-- ============================================

CREATE POLICY "Ticker sentiment votes are viewable by everyone"
ON public.ticker_sentiment_votes FOR SELECT
USING (true);

CREATE POLICY "Users can vote on ticker sentiment"
ON public.ticker_sentiment_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their ticker sentiment vote"
ON public.ticker_sentiment_votes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their ticker sentiment vote"
ON public.ticker_sentiment_votes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- READ-ONLY TABLES - Everyone can read
-- ============================================

CREATE POLICY "Companies are viewable by everyone"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Company metrics are viewable by everyone"
ON public.company_metrics FOR SELECT
USING (true);

CREATE POLICY "Creator performance metrics are viewable by everyone"
ON public.creator_performance_metrics FOR SELECT
USING (true);

CREATE POLICY "Post performance tracking is viewable by everyone"
ON public.post_performance_tracking FOR SELECT
USING (true);

CREATE POLICY "Ticker community metrics are viewable by everyone"
ON public.ticker_community_metrics FOR SELECT
USING (true);

-- ============================================
-- USER SETTINGS - Users can manage their own settings
-- ============================================
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================
-- DONE! ✅ All RLS policies are now configured
-- This script is safe to run multiple times
-- ============================================
