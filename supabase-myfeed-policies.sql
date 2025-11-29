-- ============================================
-- MY FEED PAGE - RLS POLICIES
-- ============================================
-- This SQL file contains all the Row Level Security policies
-- needed for the My Feed page functionality.
-- It's designed to be idempotent (can be run multiple times safely).

-- ============================================
-- POSTS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own posts
CREATE POLICY "Users can view their own posts"
ON public.posts FOR SELECT
USING (auth.uid() = author_id);

-- Policy: Users can insert their own posts
CREATE POLICY "Users can insert their own posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- COMMENTS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own comments
CREATE POLICY "Users can view their own comments"
ON public.comments FOR SELECT
USING (auth.uid() = author_id);

-- Policy: Users can insert their own comments
CREATE POLICY "Users can insert their own comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- CREATOR PERFORMANCE METRICS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own performance metrics" ON public.creator_performance_metrics;
DROP POLICY IF EXISTS "Users can insert their own performance metrics" ON public.creator_performance_metrics;
DROP POLICY IF EXISTS "Users can update their own performance metrics" ON public.creator_performance_metrics;

-- Enable RLS
ALTER TABLE public.creator_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own performance metrics
CREATE POLICY "Users can view their own performance metrics"
ON public.creator_performance_metrics FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own performance metrics
CREATE POLICY "Users can insert their own performance metrics"
ON public.creator_performance_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own performance metrics
CREATE POLICY "Users can update their own performance metrics"
ON public.creator_performance_metrics FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POST LIKES TABLE POLICIES (for counting likes on user's posts)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view likes on their own posts" ON public.post_likes;

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view likes on their own posts
CREATE POLICY "Users can view likes on their own posts"
ON public.post_likes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_likes.post_id
    AND posts.author_id = auth.uid()
  )
);

-- ============================================
-- COMMENT LIKES TABLE POLICIES (for counting likes on user's comments)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view likes on their own comments" ON public.comment_likes;

-- Enable RLS
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view likes on their own comments
CREATE POLICY "Users can view likes on their own comments"
ON public.comment_likes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.comments
    WHERE comments.id = comment_likes.comment_id
    AND comments.author_id = auth.uid()
  )
);

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile for my feed" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile for my feed" ON public.profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile for my feed"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile for my feed"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- SAVED POSTS TABLE POLICIES (future feature)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can insert their own saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can delete their own saved posts" ON public.saved_posts;

-- Enable RLS
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own saved posts
CREATE POLICY "Users can view their own saved posts"
ON public.saved_posts FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can save posts
CREATE POLICY "Users can insert their own saved posts"
ON public.saved_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can unsave posts
CREATE POLICY "Users can delete their own saved posts"
ON public.saved_posts FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS TABLE POLICIES (for follower/following counts)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their followers and following" ON public.follows;
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their followers and who they're following
CREATE POLICY "Users can view their followers and following"
ON public.follows FOR SELECT
USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Policy: Users can follow others
CREATE POLICY "Users can follow others"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Policy: Users can unfollow others
CREATE POLICY "Users can unfollow others"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);

-- ============================================
-- POST PERFORMANCE TRACKING POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view performance of their own posts" ON public.post_performance_tracking;

-- Enable RLS
ALTER TABLE public.post_performance_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view performance tracking for their own posts
CREATE POLICY "Users can view performance of their own posts"
ON public.post_performance_tracking FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = post_performance_tracking.post_id
    AND posts.author_id = auth.uid()
  )
);

-- ============================================
-- HELPER VIEWS FOR MY FEED PAGE
-- ============================================

-- Drop existing views if they exist
DROP VIEW IF EXISTS user_feed_stats;

-- Create a view for user feed statistics (optional, for performance)
CREATE OR REPLACE VIEW user_feed_stats AS
SELECT 
  p.id as user_id,
  p.username,
  p.full_name,
  p.avatar_url,
  COUNT(DISTINCT posts.id) as total_posts,
  COUNT(DISTINCT comments.id) as total_comments,
  COALESCE(SUM(post_likes_count.like_count), 0) as total_post_likes,
  COALESCE(SUM(comment_likes_count.like_count), 0) as total_comment_likes
FROM public.profiles p
LEFT JOIN public.posts ON posts.author_id = p.id
LEFT JOIN public.comments ON comments.author_id = p.id
LEFT JOIN (
  SELECT post_id, COUNT(*) as like_count
  FROM public.post_likes
  GROUP BY post_id
) post_likes_count ON post_likes_count.post_id = posts.id
LEFT JOIN (
  SELECT comment_id, COUNT(*) as like_count
  FROM public.comment_likes
  GROUP BY comment_id
) comment_likes_count ON comment_likes_count.comment_id = comments.id
GROUP BY p.id, p.username, p.full_name, p.avatar_url;

-- Grant access to authenticated users
GRANT SELECT ON user_feed_stats TO authenticated;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Create indexes if they don't exist for My Feed page queries
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author_created ON public.comments(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_creator_metrics_user_id ON public.creator_performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$ 
BEGIN 
  RAISE NOTICE 'My Feed RLS policies and indexes have been successfully created/updated!';
  RAISE NOTICE 'The following features are now enabled:';
  RAISE NOTICE '  ✓ Users can view, create, update, and delete their own posts';
  RAISE NOTICE '  ✓ Users can view, create, update, and delete their own comments';
  RAISE NOTICE '  ✓ Users can view and update their own performance metrics';
  RAISE NOTICE '  ✓ Users can view likes and comments on their content';
  RAISE NOTICE '  ✓ Users can save/unsave posts';
  RAISE NOTICE '  ✓ Users can follow/unfollow other users';
  RAISE NOTICE '  ✓ Performance indexes created for faster queries';
END $$;


