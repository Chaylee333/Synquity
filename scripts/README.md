# 📊 Ticker Database Seeding Guide

This guide explains how to populate your Synquity database with US equity tickers.

## Quick Start (60 Major Tickers)

The `seed-tickers.ts` script includes **60 major US equities** across all sectors.

### Prerequisites

1. Install dependencies (if not already done):
```bash
npm install
```

2. Set up your environment variables:
```bash
# In your .env file, add:
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

**Important:** You need the **Service Role Key** (not the anon key) for seeding. Find it in:
- Supabase Dashboard → Settings → API → Service Role Key (secret)

### Run the Seed Script

```bash
npm run seed:tickers
```

This will insert/update ~60 major tickers including:
- 🏢 Mega-cap tech (AAPL, MSFT, GOOGL, NVDA, META, TSLA)
- 💰 Financial services (JPM, BAC, V, MA, PYPL, COIN)
- 🏥 Healthcare (UNH, JNJ, PFE, LLY)
- 🛒 Consumer (WMT, COST, NKE, MCD)
- ⚡ Energy (XOM, CVX)
- 🏭 Industrials (BA, HON, UPS)
- 🚗 Automotive & EV (F, GM, RIVN, LCID)
- And more!

## Advanced: Seed ALL US Tickers (8,000+)

To get a complete list of US tickers, you have several options:

### Option 1: Download from SEC EDGAR

1. Download the company tickers JSON from SEC:
```bash
curl https://www.sec.gov/files/company_tickers.json -o company_tickers.json
```

2. Create a script to parse and insert (see `seed-from-sec.ts` example below)

### Option 2: Use a Financial Data API

Popular free APIs:
- **Polygon.io** (Free tier: 5 API calls/minute)
- **Alpha Vantage** (Free tier: 25 requests/day)  
- **IEX Cloud** (Free tier available)
- **Twelve Data** (Free tier: 800 requests/day)

### Option 3: Download CSV from Data Source

1. Download ticker list from:
   - https://www.nasdaq.com/market-activity/stocks/screener
   - https://www.nyse.com/listings_directory/stock
   - https://github.com/datasets/s-and-p-500 (S&P 500 only)

2. Convert CSV to SQL insert statements

## Example: Seed from SEC Data

Create `scripts/seed-from-sec.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedFromSEC() {
  // Read the SEC data
  const data = JSON.parse(fs.readFileSync('company_tickers.json', 'utf8'));
  
  for (const [key, company] of Object.entries(data)) {
    const ticker = company.ticker;
    const name = company.title;
    
    await supabase.from('companies').upsert({
      ticker,
      name,
      industry: 'Unknown', // You'll need to fetch this from another source
      description: '',
      employees: null,
      founded: null
    }, { onConflict: 'ticker' });
    
    console.log(`✅ ${ticker}`);
  }
}

seedFromSEC();
```

## What Gets Seeded

The `companies` table gets populated with:
- ✅ **ticker** (e.g., "AAPL")
- ✅ **name** (e.g., "Apple Inc.")
- ✅ **industry** (e.g., "Technology")
- ✅ **description** (company description)
- ✅ **employees** (employee count)
- ✅ **founded** (founding year)

## Next Steps

After seeding tickers:

1. **Add Company Metrics** - Populate `company_metrics` table with:
   - Stock prices
   - Market cap
   - P/E ratio
   - Financial data

2. **Enable Search** - The frontend already has search functionality

3. **Set up Price Updates** - Create a cron job or scheduled function to update prices

## Troubleshooting

### Error: Missing Supabase credentials
**Solution:** Make sure both `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set

### Error: Permission denied  
**Solution:** Make sure you're using the **Service Role Key**, not the anon key

### Error: Unique constraint violation
**Solution:** The script uses `upsert()` so this shouldn't happen. If it does, clear the companies table first.

## Useful Queries

Check how many tickers you have:
```sql
SELECT COUNT(*) FROM companies;
```

View recent insertions:
```sql
SELECT * FROM companies ORDER BY created_at DESC LIMIT 10;
```

Search for a ticker:
```sql
SELECT * FROM companies WHERE ticker ILIKE '%TSLA%' OR name ILIKE '%Tesla%';
```

