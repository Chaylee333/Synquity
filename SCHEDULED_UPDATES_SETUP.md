# Scheduled Post Performance Updates Setup

This guide explains how to set up automated daily updates for the "Since posted" performance tracking.

## Overview

The system updates all posts' performance metrics daily by:
1. Syncing latest ticker prices from `company_metrics` to `ticker_prices`
2. Calculating performance percentage for each post
3. Storing results in `post_performance_tracking`

## Option 1: Supabase Edge Function with Cron (Recommended)

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm
npm install -g supabase

# Or download from: https://github.com/supabase/cli/releases
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link to Your Project

```bash
cd /path/to/Synquity-1
supabase link --project-ref YOUR_PROJECT_REF
```

Find your project ref in: Supabase Dashboard → Project Settings → General → Reference ID

### Step 4: Deploy the Edge Function

```bash
supabase functions deploy update-post-performance
```

### Step 5: Set Up the Cron Schedule

Go to Supabase Dashboard → Edge Functions → update-post-performance → Schedules

Add a new schedule:
- **Name**: `daily-performance-update`
- **Schedule**: `0 21 * * 1-5` (9 PM UTC / 4 PM ET, Mon-Fri)

Or via CLI:
```bash
supabase functions deploy update-post-performance --schedule "0 21 * * 1-5"
```

### Step 6: Test the Function

```bash
# Test locally
supabase functions serve update-post-performance

# Or invoke directly
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/update-post-performance \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## Option 2: External Cron Service (Free Alternative)

If you prefer not to use Supabase Edge Functions, you can use external services.

### Using GitHub Actions

Create `.github/workflows/update-performance.yml`:

```yaml
name: Update Post Performance

on:
  schedule:
    # Run at 9 PM UTC (4 PM ET) on weekdays
    - cron: '0 21 * * 1-5'
  workflow_dispatch: # Allow manual trigger

jobs:
  update-performance:
    runs-on: ubuntu-latest
    steps:
      - name: Update Post Performance
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/rest/v1/rpc/update_post_performance" \
            -H "apikey: ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}" \
            -H "Content-Type: application/json"
```

Add these secrets to your GitHub repo:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your service role key (from Project Settings → API)

### Using Vercel Cron

If your app is on Vercel, create `api/cron/update-performance.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await supabase.rpc('update_post_performance');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/update-performance",
      "schedule": "0 21 * * 1-5"
    }
  ]
}
```

---

## Option 3: Manual Updates

If you don't need automation, simply run this SQL query whenever you want to update:

```sql
SELECT update_post_performance();
```

---

## Monitoring & Debugging

### Check Last Update Time

```sql
SELECT MAX(last_calculated_at) as last_update 
FROM post_performance_tracking;
```

### View Recent Performance Data

```sql
SELECT 
    p.title,
    p.ticker,
    ppt.performance_percent,
    ppt.days_since_posting,
    ppt.last_calculated_at
FROM posts p
JOIN post_performance_tracking ppt ON p.id = ppt.post_id
ORDER BY ppt.last_calculated_at DESC
LIMIT 20;
```

### Check for Posts Missing Performance Data

```sql
SELECT p.id, p.title, p.ticker, p.stock_price_at_posting
FROM posts p
LEFT JOIN post_performance_tracking ppt ON p.id = ppt.post_id
WHERE ppt.post_id IS NULL
  AND p.ticker IS NOT NULL;
```

---

## Schedule Explanation

The cron expression `0 21 * * 1-5` means:
- `0` - At minute 0
- `21` - At hour 21 (9 PM UTC)
- `*` - Every day of the month
- `*` - Every month
- `1-5` - Monday through Friday

This runs at 4 PM Eastern Time (market close) on trading days.

---

## Troubleshooting

### Function Not Running?
1. Check Edge Function logs in Supabase Dashboard
2. Verify the schedule is set correctly
3. Test manually with `SELECT update_post_performance();`

### No Performance Data?
1. Ensure `company_metrics` has price data for the tickers
2. Check that posts have `stock_price_at_posting` set
3. Run `SELECT sync_company_metrics_to_ticker_prices();` first

### Wrong Performance Values?
1. Verify `stock_price_at_posting` is correct on the post
2. Check `ticker_prices` has the correct current price
3. The formula is: `((current - initial) / initial) * 100`

