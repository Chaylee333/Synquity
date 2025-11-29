-- ============================================
-- MY FEED PAGE - RLS POLICIES (SIMPLIFIED)
-- ============================================

-- ============================================
-- POSTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
ON public.posts FOR SELECT
USING (auth.uid() = author_id);

CREATE POLICY "Users can insert their own posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- COMMENTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comments"
ON public.comments FOR SELECT
USING (auth.uid() = author_id);

CREATE POLICY "Users can insert their own comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE
USING (auth.uid() = author_id);

-- ============================================
-- CREATOR PERFORMANCE METRICS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view their own performance metrics" ON public.creator_performance_metrics;
DROP POLICY IF EXISTS "Users can insert their own performance metrics" ON public.creator_performance_metrics;
DROP POLICY IF EXISTS "Users can update their own performance metrics" ON public.creator_performance_metrics;

ALTER TABLE public.creator_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own performance metrics"
ON public.creator_performance_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own performance metrics"
ON public.creator_performance_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own performance metrics"
ON public.creator_performance_metrics FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POST LIKES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view likes on their own posts" ON public.post_likes;

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

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
-- COMMENT LIKES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view likes on their own comments" ON public.comment_likes;

ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Users can view their own profile for my feed" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile for my feed" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile for my feed"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile for my feed"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_author_created ON public.posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_author_created ON public.comments(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_creator_metrics_user_id ON public.creator_performance_metrics(user_id);


