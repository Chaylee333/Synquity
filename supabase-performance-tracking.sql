-- ============================================
-- POST PERFORMANCE TRACKING SCHEMA
-- ============================================
-- This schema tracks the "Since posted" gain/loss for each post
-- by comparing the ticker price at posting vs current price
-- 
-- Based on existing DB schema - works with existing tables:
-- - posts (has stock_price_at_posting, performance_outcome, ranking_score)
-- - post_performance_tracking (has stock_performance, performance_percent)
-- - company_metrics (has price data for tickers)
-- - companies (has ticker info)

-- ============================================
-- 1. TICKER PRICES TABLE (NEW)
-- Stores daily closing prices for all tickers
-- Separate from company_metrics for historical tracking
-- ============================================

CREATE TABLE IF NOT EXISTS public.ticker_prices (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticker TEXT NOT NULL,
    price NUMERIC NOT NULL,
    price_date DATE NOT NULL DEFAULT CURRENT_DATE,
    open_price NUMERIC,
    high_price NUMERIC,
    low_price NUMERIC,
    volume BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one price per ticker per day
    CONSTRAINT ticker_prices_ticker_date_unique UNIQUE(ticker, price_date),
    -- Reference companies table
    CONSTRAINT ticker_prices_ticker_fkey FOREIGN KEY (ticker) REFERENCES public.companies(ticker)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ticker_prices_ticker_date 
ON public.ticker_prices(ticker, price_date DESC);

CREATE INDEX IF NOT EXISTS idx_ticker_prices_date 
ON public.ticker_prices(price_date DESC);

-- ============================================
-- 2. ADD TRACKING COLUMNS TO post_performance_tracking
-- Your existing table needs a few more columns
-- ============================================

-- Add price_at_posting if not exists
ALTER TABLE public.post_performance_tracking 
ADD COLUMN IF NOT EXISTS price_at_posting NUMERIC;

-- Add current_price if not exists
ALTER TABLE public.post_performance_tracking 
ADD COLUMN IF NOT EXISTS current_price NUMERIC;

-- Add ticker reference if not exists
ALTER TABLE public.post_performance_tracking 
ADD COLUMN IF NOT EXISTS ticker TEXT;

-- Add days_since_posting if not exists
ALTER TABLE public.post_performance_tracking 
ADD COLUMN IF NOT EXISTS days_since_posting INTEGER DEFAULT 0;

-- ============================================
-- 3. FUNCTION: Sync Prices from company_metrics
-- Copies latest prices from company_metrics to ticker_prices
-- ============================================

CREATE OR REPLACE FUNCTION sync_company_metrics_to_ticker_prices()
RETURNS void AS $$
BEGIN
    -- Insert today's prices from company_metrics into ticker_prices
    INSERT INTO public.ticker_prices (ticker, price, price_date)
    SELECT 
        cm.ticker,
        cm.price,
        CURRENT_DATE
    FROM public.company_metrics cm
    INNER JOIN (
        -- Get the latest record for each ticker
        SELECT ticker, MAX(recorded_at) as max_recorded
        FROM public.company_metrics
        GROUP BY ticker
    ) latest ON cm.ticker = latest.ticker AND cm.recorded_at = latest.max_recorded
    WHERE cm.price IS NOT NULL
    ON CONFLICT (ticker, price_date) 
    DO UPDATE SET price = EXCLUDED.price;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. FUNCTION: Update Post Performance
-- Call this daily to update all post performances
-- ============================================

CREATE OR REPLACE FUNCTION update_post_performance()
RETURNS void AS $$
DECLARE
    post_record RECORD;
    latest_price NUMERIC;
    perf_percent NUMERIC;
    stock_perf NUMERIC;
    days_diff INTEGER;
BEGIN
    -- First, sync prices from company_metrics to ticker_prices
    PERFORM sync_company_metrics_to_ticker_prices();
    
    -- Loop through all posts with a ticker and initial price
    FOR post_record IN 
        SELECT 
            p.id,
            p.ticker,
            p.stock_price_at_posting,
            p.created_at,
            p.sentiment
        FROM public.posts p
        WHERE p.ticker IS NOT NULL 
          AND p.stock_price_at_posting IS NOT NULL
          AND p.stock_price_at_posting > 0
    LOOP
        -- Get the latest price for this ticker (try ticker_prices first, then company_metrics)
        SELECT price INTO latest_price
        FROM public.ticker_prices
        WHERE ticker = post_record.ticker
        ORDER BY price_date DESC
        LIMIT 1;
        
        -- Fallback to company_metrics if no ticker_prices
        IF latest_price IS NULL THEN
            SELECT price INTO latest_price
            FROM public.company_metrics
            WHERE ticker = post_record.ticker
            ORDER BY recorded_at DESC
            LIMIT 1;
        END IF;
        
        -- Skip if no price data available
        IF latest_price IS NULL THEN
            CONTINUE;
        END IF;
        
        -- Calculate performance percentage
        perf_percent := ((latest_price - post_record.stock_price_at_posting) / post_record.stock_price_at_posting) * 100;
        stock_perf := perf_percent; -- Same value for stock_performance
        days_diff := CURRENT_DATE - post_record.created_at::DATE;
        
        -- Insert or update the tracking record
        INSERT INTO public.post_performance_tracking (
            post_id,
            ticker,
            price_at_posting,
            current_price,
            performance_percent,
            stock_performance,
            days_since_posting,
            last_calculated_at
        ) VALUES (
            post_record.id,
            post_record.ticker,
            post_record.stock_price_at_posting,
            latest_price,
            perf_percent,
            stock_perf,
            days_diff,
            NOW()
        )
        ON CONFLICT (post_id) 
        DO UPDATE SET
            ticker = EXCLUDED.ticker,
            current_price = EXCLUDED.current_price,
            performance_percent = EXCLUDED.performance_percent,
            stock_performance = EXCLUDED.stock_performance,
            days_since_posting = EXCLUDED.days_since_posting,
            last_calculated_at = NOW();
            
        -- Also update the post's performance_outcome for OracleRank
        -- Store as decimal (0.05 = 5%)
        UPDATE public.posts
        SET performance_outcome = perf_percent / 100
        WHERE id = post_record.id;
        
    END LOOP;
    
    RAISE NOTICE 'Post performance update completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. FUNCTION: Get Latest Price for Ticker
-- Helper function to get the most recent price
-- ============================================

CREATE OR REPLACE FUNCTION get_latest_ticker_price(p_ticker TEXT)
RETURNS NUMERIC AS $$
DECLARE
    latest_price NUMERIC;
BEGIN
    -- Try ticker_prices first
    SELECT price INTO latest_price
    FROM public.ticker_prices
    WHERE ticker = p_ticker
    ORDER BY price_date DESC
    LIMIT 1;
    
    -- Fallback to company_metrics
    IF latest_price IS NULL THEN
        SELECT price INTO latest_price
        FROM public.company_metrics
        WHERE ticker = p_ticker
        ORDER BY recorded_at DESC
        LIMIT 1;
    END IF;
    
    RETURN latest_price;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. TRIGGER: Record Ticker Price at Post Creation
-- Automatically sets stock_price_at_posting when a post is created
-- ============================================

CREATE OR REPLACE FUNCTION set_stock_price_at_posting()
RETURNS TRIGGER AS $$
DECLARE
    current_price NUMERIC;
BEGIN
    -- Only set if ticker is provided and price not already set
    IF NEW.ticker IS NOT NULL AND NEW.stock_price_at_posting IS NULL THEN
        -- Try ticker_prices first
        SELECT price INTO current_price
        FROM public.ticker_prices
        WHERE ticker = NEW.ticker
        ORDER BY price_date DESC
        LIMIT 1;
        
        -- Fallback to company_metrics
        IF current_price IS NULL THEN
            SELECT price INTO current_price
            FROM public.company_metrics
            WHERE ticker = NEW.ticker
            ORDER BY recorded_at DESC
            LIMIT 1;
        END IF;
        
        IF current_price IS NOT NULL THEN
            NEW.stock_price_at_posting := current_price;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS trigger_set_stock_price ON public.posts;
CREATE TRIGGER trigger_set_stock_price
    BEFORE INSERT ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION set_stock_price_at_posting();

-- ============================================
-- 7. TRIGGER: Create Performance Tracking Record
-- Automatically creates a tracking record when a post is created
-- ============================================

CREATE OR REPLACE FUNCTION create_initial_performance_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create if we have a ticker and initial price
    IF NEW.ticker IS NOT NULL AND NEW.stock_price_at_posting IS NOT NULL THEN
        INSERT INTO public.post_performance_tracking (
            post_id,
            ticker,
            price_at_posting,
            current_price,
            performance_percent,
            stock_performance,
            days_since_posting,
            last_calculated_at
        ) VALUES (
            NEW.id,
            NEW.ticker,
            NEW.stock_price_at_posting,
            NEW.stock_price_at_posting,  -- Initially same as posting price
            0,  -- 0% change initially
            0,
            0,
            NOW()
        )
        ON CONFLICT (post_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS trigger_create_performance_tracking ON public.posts;
CREATE TRIGGER trigger_create_performance_tracking
    AFTER INSERT ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_performance_tracking();

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- Ticker Prices - Public read access
ALTER TABLE public.ticker_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view ticker prices" ON public.ticker_prices;
CREATE POLICY "Anyone can view ticker prices"
ON public.ticker_prices FOR SELECT
USING (true);

-- Service role can manage ticker prices
DROP POLICY IF EXISTS "Service role can manage ticker prices" ON public.ticker_prices;
CREATE POLICY "Service role can manage ticker prices"
ON public.ticker_prices FOR ALL
USING (auth.role() = 'service_role');

-- Post Performance Tracking - Public read access
ALTER TABLE public.post_performance_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view post performance" ON public.post_performance_tracking;
CREATE POLICY "Anyone can view post performance"
ON public.post_performance_tracking FOR SELECT
USING (true);

-- Service role can manage performance tracking
DROP POLICY IF EXISTS "Service role can manage performance tracking" ON public.post_performance_tracking;
CREATE POLICY "Service role can manage performance tracking"
ON public.post_performance_tracking FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_ticker ON public.posts(ticker);
CREATE INDEX IF NOT EXISTS idx_posts_stock_price ON public.posts(stock_price_at_posting) WHERE stock_price_at_posting IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_post_performance_ticker ON public.post_performance_tracking(ticker);
CREATE INDEX IF NOT EXISTS idx_company_metrics_ticker_recorded ON public.company_metrics(ticker, recorded_at DESC);

-- ============================================
-- 10. INITIALIZE: Sync existing prices and update performance
-- Run this once after creating the tables
-- ============================================

-- Sync current prices from company_metrics to ticker_prices
SELECT sync_company_metrics_to_ticker_prices();

-- Update all existing posts' performance
SELECT update_post_performance();

-- ============================================
-- 11. SCHEDULED JOB SETUP (Supabase pg_cron)
-- Run daily at market close (4 PM ET = 9 PM UTC)
-- ============================================

-- IMPORTANT: pg_cron is only available on Supabase Pro plans and above.
-- If you're on the free tier, skip this section and use manual updates.

-- Step 1: Enable pg_cron extension (Pro plan required)
-- Go to Supabase Dashboard > Database > Extensions > Enable pg_cron
-- OR run: CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Step 2: Schedule daily updates (run this AFTER enabling pg_cron)
-- Uncomment and run these lines separately:
/*
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'update-post-performance-daily',
    '0 21 * * 1-5',                       -- 9 PM UTC (4 PM ET), Mon-Fri
    $$SELECT update_post_performance()$$
);
*/

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove a scheduled job:
-- SELECT cron.unschedule('update-post-performance-daily');

-- ============================================
-- ALTERNATIVE: Manual Updates (Free Tier)
-- ============================================
-- If pg_cron is not available, simply run this manually
-- or set up an external scheduler (e.g., GitHub Actions, Vercel Cron):
-- 
-- SELECT update_post_performance();

-- ============================================
-- 12. SAMPLE DATA: Insert ticker prices from company_metrics
-- This populates ticker_prices with existing company data
-- ============================================

-- Insert sample prices for common tickers if they exist in companies table
INSERT INTO public.ticker_prices (ticker, price, price_date)
SELECT 
    c.ticker,
    COALESCE(
        (SELECT cm.price FROM public.company_metrics cm WHERE cm.ticker = c.ticker ORDER BY cm.recorded_at DESC LIMIT 1),
        CASE c.ticker
            WHEN 'AAPL' THEN 189.95
            WHEN 'NVDA' THEN 875.28
            WHEN 'TSLA' THEN 248.50
            WHEN 'MSFT' THEN 378.91
            WHEN 'AMD' THEN 156.32
            WHEN 'GOOGL' THEN 141.80
            WHEN 'AMZN' THEN 178.25
            WHEN 'META' THEN 505.75
            ELSE 100.00
        END
    ),
    CURRENT_DATE
FROM public.companies c
ON CONFLICT (ticker, price_date) DO UPDATE SET
    price = EXCLUDED.price;

-- ============================================
-- SUMMARY
-- ============================================
-- 
-- New Table:
-- - ticker_prices: Daily historical stock prices
--
-- Updated Table:
-- - post_performance_tracking: Added columns for detailed tracking
--
-- Functions:
-- 1. sync_company_metrics_to_ticker_prices() - Syncs from company_metrics
-- 2. update_post_performance() - Main daily update function
-- 3. get_latest_ticker_price() - Helper to get latest price
-- 4. set_stock_price_at_posting() - Trigger function for new posts
-- 5. create_initial_performance_tracking() - Trigger for tracking record
--
-- Triggers:
-- 1. trigger_set_stock_price - Sets initial price on post creation
-- 2. trigger_create_performance_tracking - Creates tracking record
--
-- Data Flow:
-- 1. Stock prices come from company_metrics table (your existing data)
-- 2. sync_company_metrics_to_ticker_prices() copies to ticker_prices
-- 3. update_post_performance() calculates returns for all posts
-- 4. Results stored in post_performance_tracking table
-- 5. UI reads from post_performance_tracking for "Since posted" display
--
-- To manually update all posts:
-- SELECT update_post_performance();
--
-- To check a specific post's performance:
-- SELECT * FROM post_performance_tracking WHERE post_id = <your_post_id>;
--
