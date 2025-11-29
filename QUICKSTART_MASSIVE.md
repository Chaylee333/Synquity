# 🚀 Quick Start: Massive.com Live Data Integration

## Get Your Ticker Pages Live in 3 Steps!

### Step 1: Get API Key (2 minutes)

1. Go to **[Massive.com](https://massive.com/)** or **[Polygon.io](https://polygon.io/)**
2. Click **"Create API Key"** or **"Sign Up"**
3. After signup, go to [Dashboard → API Keys](https://polygon.io/dashboard/api-keys)
4. Copy your API key (looks like: `AbCdEfGh123456789`)

**Free tier includes:**
- ✅ 5 API calls/minute
- ✅ All US stocks data
- ✅ Perfect for development

---

### Step 2: Add API Key to .env.local

Open or create `.env.local` in your project root and add:

```bash
VITE_MASSIVE_API_KEY=your_api_key_here
```

**Full example `.env.local`:**
```bash
# Supabase (existing)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Massive.com (NEW - add this line)
VITE_MASSIVE_API_KEY=AbCdEfGh123456789
```

---

### Step 3: Restart Dev Server

```bash
npm run dev
```

---

## ✅ Test It Out

1. Open your app at `http://localhost:3000`
2. Go to **Discover** tab
3. Search for "AAPL" in the search bar
4. Click on **Apple Inc.**
5. Watch the live data load! 🎉

You should see:
- ✅ Real-time stock price
- ✅ Price change % (green/red)
- ✅ Market status (🟢 Open / 🔴 Closed)
- ✅ Today's trading data (open, high, low, volume)
- ✅ Company description
- ✅ Refresh button for latest data

---

## 🎯 What's Integrated?

### Ticker Page Features

When users click on any ticker, they now see:

**Header:**
- Real-time price with $ value
- Price change with % and trend arrow (↗️/↘️)
- Market status badge (Open/Closed)
- Refresh button to get latest data
- Last updated timestamp

**Today's Trading Box:**
- Open price
- Previous close
- Day's high (green)
- Day's low (red)
- Volume with comma formatting

**About Company:**
- Full company description from Massive.com
- Link to company website
- Market capitalization (formatted: $2.78T)

---

## 🔍 How It Works

### Discover Page Search
1. User types "aapl" in search bar
2. Debounced search (300ms) queries your Supabase `companies` table
3. Dropdown shows matching tickers
4. Click navigates to ticker page

### Ticker Page Live Data
1. Page loads → fetches 2 API calls:
   - `getMassiveQuote()` - real-time price, volume, high/low
   - `getMassiveTickerDetails()` - company info, market cap
2. Merges live data with mock data (for fields not in API yet)
3. Shows loading spinner while fetching
4. Refresh button re-fetches latest data

---

## 📊 API Calls Made

For each ticker page view, 2 API calls are made:

1. **Previous Day + Snapshot** (counts as 2 calls)
   - `GET /v2/aggs/ticker/AAPL/prev`
   - `GET /v2/snapshot/locale/us/markets/stocks/tickers/AAPL`
   
2. **Ticker Details** (counts as 1 call)
   - `GET /v3/reference/tickers/AAPL`

**Free tier = 5 calls/min = ~1-2 ticker page views per minute**

---

## 🐛 Troubleshooting

### "Unable to fetch live data"
- ✅ Check `.env.local` has `VITE_MASSIVE_API_KEY=...`
- ✅ Restart dev server after adding key
- ✅ Verify API key is valid on Polygon dashboard
- ✅ Check browser console for errors

### Ticker not found
- ✅ Make sure ticker is in your database (run `npm run seed:tickers` first)
- ✅ Use correct ticker symbol (AAPL not Apple)
- ✅ US equities only (for now)

### Data is delayed
- ✅ Free tier = 15-min delayed data
- ✅ Upgrade to Starter ($29/mo) for real-time
- ✅ Market must be open for real-time updates

### Rate limit exceeded
- ✅ Free tier = 5 calls/minute
- ✅ Wait 1 minute before refreshing
- ✅ Upgrade plan for higher limits

---

## 🚀 Next Steps

### 1. Add Price Charts
Use `getMassiveAggregates()` to fetch historical data:

```typescript
import { getMassiveAggregates } from '../lib/massive';

const data = await getMassiveAggregates(
  'AAPL',
  1,
  'day',
  '2024-01-01',
  '2024-12-31'
);
// Returns array of daily OHLCV data
```

### 2. Add WebSocket for Real-time Updates
Upgrade to paid plan and use Massive WebSocket API for live streaming prices

### 3. Add More Tickers
Use the ticker search in Discover to add more companies to your database

### 4. Show Financial Ratios
Integrate Massive Financials API for P/E, EPS, revenue, etc.

---

## 📚 Full Documentation

See **[MASSIVE_SETUP.md](./MASSIVE_SETUP.md)** for:
- Detailed API documentation
- Code architecture explanation
- Advanced features
- Pricing information
- Full troubleshooting guide

---

## 🎉 You're All Set!

Your ticker pages now show live market data! Users can:
- ✅ Search tickers in real-time
- ✅ View live stock prices
- ✅ See market status
- ✅ Refresh for latest data
- ✅ Read company descriptions

**Try it now:** Search for AAPL, TSLA, NVDA, or any US stock! 📈


