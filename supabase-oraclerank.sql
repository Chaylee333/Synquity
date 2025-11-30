-- Add reputation_score to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reputation_score numeric DEFAULT 0.5;

-- Add ranking_score and performance_outcome to posts
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS ranking_score numeric DEFAULT 0;

ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS performance_outcome numeric;

-- Create an index for faster sorting by ranking_score
CREATE INDEX IF NOT EXISTS idx_posts_ranking_score ON public.posts (ranking_score DESC);

-- Create an index for querying posts by ticker for performance updates
CREATE INDEX IF NOT EXISTS idx_posts_ticker ON public.posts (ticker);
