# Massive.com API Integration Setup

This guide will help you integrate live stock market data from [Massive.com](https://massive.com/) (formerly Polygon.io) into your application.

## What is Massive.com?

Massive.com provides institutional-grade financial market data with:
- ✅ Real-time stock quotes and pricing
- ✅ Historical market data
- ✅ Company details and fundamentals
- ✅ Options, futures, forex, and crypto data
- ✅ Simple RESTful API with excellent documentation
- ✅ Client libraries for Python, JavaScript, Go, and Java

## Features Integrated

### Live Stock Data
When users visit a ticker page (e.g., `/ticker/AAPL`), the app now displays:

1. **Real-time Price Data**
   - Current stock price
   - Price change ($)
   - Percentage change (%)
   - Market status (open/closed indicator)
   - Last update timestamp

2. **Today's Trading Metrics**
   - Open price
   - Previous close
   - Day's high
   - Day's low
   - Trading volume

3. **Company Information**
   - Official company name
   - Company description
   - Market capitalization
   - Website link
   - And more...

4. **Interactive Features**
   - Refresh button to get latest data
   - Market status indicator (green when open, red when closed)
   - Loading states for better UX
   - Toast notifications for refresh actions

## Setup Instructions

### Step 1: Get Your API Key

1. Visit [Massive.com](https://massive.com/) (or [Polygon.io](https://polygon.io/))
2. Sign up for a free account
3. Go to your [API Dashboard](https://polygon.io/dashboard/api-keys)
4. Copy your API key

**Free Tier Includes:**
- 5 API calls per minute
- Full access to stocks data
- Perfect for development and testing

### Step 2: Add API Key to Environment Variables

Add the following to your `.env.local` file:

```bash
# Massive.com API Configuration
VITE_MASSIVE_API_KEY=your_api_key_here
```

**Example `.env.local` file:**
```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Massive.com API
VITE_MASSIVE_API_KEY=AbCdEfGh123456789
```

### Step 3: Restart Development Server

After adding the API key, restart your dev server:

```bash
npm run dev
```

### Step 4: Test the Integration

1. Navigate to the Discover tab
2. Search for a ticker (e.g., "AAPL")
3. Click on the ticker to view its page
4. You should see live data loading!

## API Endpoints Used

The integration uses the following Massive.com API endpoints:

### 1. Previous Day Close
```
GET /v2/aggs/ticker/{ticker}/prev
```
Gets the previous trading day's data including open, high, low, close, and volume.

### 2. Real-time Snapshot
```
GET /v2/snapshot/locale/us/markets/stocks/tickers/{ticker}
```
Gets the current real-time quote and today's trading data.

### 3. Ticker Details
```
GET /v3/reference/tickers/{ticker}
```
Gets comprehensive company information including name, description, market cap, and more.

## Code Architecture

### New Files Created

1. **`src/lib/massive.ts`** - Massive.com API integration
   - `getMassiveQuote()` - Fetches real-time quotes
   - `getMassiveTickerDetails()` - Fetches company details
   - `getMassiveAggregates()` - Fetches historical data (for future charts)
   - `formatMarketCap()` - Formats market cap (B, T, M)
   - `formatTimestamp()` - Formats timestamps
   - `isMarketOpen()` - Checks if US market is open

### Modified Files

1. **`src/components/TickerPage.tsx`**
   - Added live data fetching on page load
   - Added refresh button functionality
   - Displays real-time price, volume, high/low
   - Shows market status indicator
   - Merged live data with existing mock data

2. **`src/components/DiscoverPage.tsx`**
   - Added ticker search functionality
   - Dropdown shows search results
   - Click to navigate to ticker page

## Usage Example

```typescript
import { getMassiveQuote, getMassiveTickerDetails } from '../lib/massive';

// Fetch real-time quote
const quote = await getMassiveQuote('AAPL');
console.log(quote);
// {
//   ticker: "AAPL",
//   price: 178.23,
//   change: 1.34,
//   changePercent: 0.76,
//   volume: 45234567,
//   high: 179.45,
//   low: 176.89,
//   ...
// }

// Fetch company details
const details = await getMassiveTickerDetails('AAPL');
console.log(details);
// {
//   ticker: "AAPL",
//   name: "Apple Inc.",
//   description: "Apple Inc. designs, manufactures...",
//   market_cap: 2780000000000,
//   ...
// }
```

## Future Enhancements

Consider adding these features:

1. **Price Charts**
   - Use `getMassiveAggregates()` to fetch historical data
   - Integrate with Chart.js or Recharts
   - Add different timeframes (1D, 1W, 1M, 1Y)

2. **Real-time WebSocket**
   - Subscribe to live price updates
   - Show streaming prices without refresh
   - Add blinking/animation on price changes

3. **Options Data**
   - Show options chain
   - Display implied volatility
   - Greeks calculation

4. **News Integration**
   - Company news feed
   - Market sentiment analysis
   - Earnings transcripts

5. **Comparison Tool**
   - Compare multiple stocks
   - Sector performance
   - Peer analysis

## Pricing

Visit [Massive.com Pricing](https://polygon.io/pricing) for detailed pricing information.

**Free Tier:**
- 5 API calls per minute
- Delayed data (15 minutes)
- Perfect for development

**Starter ($29/month):**
- 100 API calls per minute
- Real-time data for US stocks
- Ideal for production apps

**Developer & Professional Plans:**
- Higher rate limits
- WebSocket streaming
- Options, forex, crypto data

## Troubleshooting

### "Missing Massive API key" Error
- Make sure you've added `VITE_MASSIVE_API_KEY` to `.env.local`
- Restart your development server after adding the key

### "Unable to fetch live data"
- Check if your API key is valid
- Verify you haven't exceeded rate limits (5 calls/min on free tier)
- Check browser console for detailed error messages

### Ticker Not Found
- Make sure the ticker symbol is valid (e.g., "AAPL" not "Apple")
- US equity tickers only (for now)
- Try searching on [Yahoo Finance](https://finance.yahoo.com/) to verify ticker

### Data Seems Delayed
- Free tier has 15-minute delayed data
- Upgrade to Starter plan for real-time data
- Market must be open for real-time updates

## Resources

- [Massive.com Documentation](https://polygon.io/docs/stocks/getting-started)
- [API Reference](https://polygon.io/docs/stocks)
- [Rate Limits](https://polygon.io/docs/stocks/get-rate-limits)
- [Status Page](https://status.polygon.io/)
- [Support](https://polygon.io/contact)

## Questions?

If you have questions or issues with the integration:
1. Check the [Massive.com documentation](https://polygon.io/docs)
2. Review the code in `src/lib/massive.ts`
3. Check browser console for errors
4. Verify API key is correct in `.env.local`

Happy trading! 📈

