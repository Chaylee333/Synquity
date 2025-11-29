# 🚀 Quick Setup: Populate US Equity Tickers

Follow these steps to populate your database with US equity tickers.

## Step 1: Get Your Supabase Service Key

1. Go to your Supabase Dashboard
2. Navigate to: **Settings** → **API**
3. Copy the **`service_role` key** (⚠️ Keep this secret!)

## Step 2: Set Environment Variable

### Option A: Add to `.env` file

Create or edit `.env` in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### Option B: Export temporarily (current session only)

```bash
export SUPABASE_SERVICE_KEY="your_service_role_key_here"
```

## Step 3: Run the Seed Script

```bash
npm run seed:tickers
```

You should see output like:
```
🌱 Starting ticker seeding process...

✅ Inserted/Updated: AAPL - Apple Inc.
✅ Inserted/Updated: MSFT - Microsoft Corporation
✅ Inserted/Updated: GOOGL - Alphabet Inc.
...

📊 Seeding complete!
   ✅ Success: 60
   ❌ Errors: 0
   📈 Total: 60
```

## Step 4: Verify in Supabase

Run this query in Supabase SQL Editor:

```sql
SELECT COUNT(*) as total_tickers FROM companies;
SELECT * FROM companies LIMIT 10;
```

## What's Included?

The seed script includes **60 major US tickers**:

### 🏢 Technology (15 tickers)
AAPL, MSFT, GOOGL, AMZN, NVDA, META, AVGO, AMD, INTC, QCOM, TXN, CRM, ORCL, ADBE, CSCO

### 💰 Financial Services (11 tickers)
BRK.B, JPM, V, MA, BAC, WFC, PYPL, SQ, COIN

### 🏥 Healthcare (5 tickers)
UNH, JNJ, LLY, ABBV, PFE

### 🛒 Consumer (8 tickers)
WMT, PG, KO, PEP, COST, NKE, MCD, DIS

### 🚗 Automotive & EV (6 tickers)
TSLA, RIVN, LCID, F, GM, NIO

### 📱 Communication Services (3 tickers)
DIS, NFLX, CMCSA

### ⚡ Energy (2 tickers)
XOM, CVX

### 🏭 Industrials (3 tickers)
BA, HON, UPS

### 🌐 Other High-Growth (7 tickers)
PLTR, SNOW, SHOP, ABNB, UBER, DASH, BABA

## Next Steps

### Add More Tickers

See `scripts/README.md` for:
- How to add ALL US tickers (8,000+)
- Using SEC EDGAR data
- Using financial data APIs
- Importing from CSV

### Add Stock Price Data

Create `company_metrics` entries with real-time pricing:

```sql
INSERT INTO company_metrics (ticker, price, change, change_percent, market_cap, pe_ratio)
VALUES ('AAPL', 178.23, 1.34, 0.76, '$2.78T', 29.1);
```

### Enable Ticker Search

The search API is already set up! Users can now:
1. Search for tickers in the Discover page
2. Click on tickers to see detailed profiles
3. View posts and discussions for each ticker

## Troubleshooting

### ❌ Error: Missing Supabase credentials

**Solution:** Make sure you set `SUPABASE_SERVICE_KEY` in your `.env` file or export it

### ❌ Error: Permission denied

**Solution:** You need the **Service Role Key**, NOT the anon key

### ❌ Some tickers failed to insert

**Solution:** Check the error messages. Usually this means:
- Database connection issue
- Table doesn't exist (run migrations first)
- Invalid data format

## Security Warning ⚠️

**NEVER commit your `.env` file or Service Role Key to Git!**

Make sure `.env` is in your `.gitignore`:

```bash
echo ".env" >> .gitignore
```

## Done! 🎉

Your database now has ticker data and users can search for companies!


