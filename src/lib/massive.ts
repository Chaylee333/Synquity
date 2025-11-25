/**
 * Massive.com (formerly Polygon.io) API Integration
 * Documentation: https://polygon.io/docs/stocks/getting-started
 */

const MASSIVE_API_KEY = import.meta.env.VITE_MASSIVE_API_KEY || '';
const MASSIVE_BASE_URL = 'https://api.polygon.io';

// Debug: Log if API key is loaded
if (MASSIVE_API_KEY) {
    console.log('✅ Massive API key loaded:', MASSIVE_API_KEY.substring(0, 8) + '...');
} else {
    console.warn('⚠️ Massive API key is NOT loaded. Make sure VITE_MASSIVE_API_KEY is in .env.local');
}

interface MassiveQuote {
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
}

interface MassiveTickerDetails {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name: string;
    description?: string;
    homepage_url?: string;
    total_employees?: number;
    list_date?: string;
    market_cap?: number;
    share_class_shares_outstanding?: number;
    weighted_shares_outstanding?: number;
    sic_description?: string;
    ticker_root?: string;
}

interface MassiveAgg {
    o: number; // open
    h: number; // high
    l: number; // low
    c: number; // close
    v: number; // volume
    t: number; // timestamp
    n?: number; // number of transactions
}

/**
 * Get real-time quote for a ticker
 * Endpoint: GET /v2/aggs/ticker/{ticker}/prev
 */
export async function getMassiveQuote(ticker: string): Promise<MassiveQuote | null> {
    try {
        console.log(`📊 Fetching Massive quote for ${ticker}...`);
        
        if (!MASSIVE_API_KEY) {
            console.error('❌ Massive API key is not configured');
            return null;
        }

        console.log('✅ API key found, making API calls...');

        // Get previous day's close
        const prevUrl = `${MASSIVE_BASE_URL}/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${MASSIVE_API_KEY}`;
        console.log('🔗 Calling:', prevUrl.replace(MASSIVE_API_KEY, 'API_KEY_HIDDEN'));
        const prevResponse = await fetch(prevUrl);
        
        if (!prevResponse.ok) {
            console.error(`❌ Massive API error (prev): ${prevResponse.status} ${prevResponse.statusText}`);
            const errorText = await prevResponse.text();
            console.error('Error response:', errorText);
            return null;
        }

        const prevData = await prevResponse.json();
        console.log('✅ Previous day data received:', prevData);
        
        if (!prevData.results || prevData.results.length === 0) {
            console.error('❌ No previous day data available');
            return null;
        }

        const prevResult = prevData.results[0];
        console.log('📈 Previous close:', prevResult.c);
        
        // Get current snapshot (real-time quote)
        const snapshotUrl = `${MASSIVE_BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apiKey=${MASSIVE_API_KEY}`;
        console.log('🔗 Calling snapshot:', snapshotUrl.replace(MASSIVE_API_KEY, 'API_KEY_HIDDEN'));
        const snapshotResponse = await fetch(snapshotUrl);
        
        if (!snapshotResponse.ok) {
            console.error(`❌ Massive API error (snapshot): ${snapshotResponse.status} ${snapshotResponse.statusText}`);
            const errorText = await snapshotResponse.text();
            console.error('Error response:', errorText);
            // Fallback to previous day data if snapshot fails
            return {
                ticker: ticker,
                price: prevResult.c,
                change: 0,
                changePercent: 0,
                volume: prevResult.v,
                high: prevResult.h,
                low: prevResult.l,
                open: prevResult.o,
                previousClose: prevResult.c,
                timestamp: prevResult.t,
            };
        }

        const snapshotData = await snapshotResponse.json();
        
        if (!snapshotData.ticker) {
            console.error('No snapshot data available');
            // Fallback to previous day data
            return {
                ticker: ticker,
                price: prevResult.c,
                change: 0,
                changePercent: 0,
                volume: prevResult.v,
                high: prevResult.h,
                low: prevResult.l,
                open: prevResult.o,
                previousClose: prevResult.c,
                timestamp: prevResult.t,
            };
        }

        const currentPrice = snapshotData.ticker.day?.c || snapshotData.ticker.prevDay?.c || prevResult.c;
        const previousClose = snapshotData.ticker.prevDay?.c || prevResult.c;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        const quote = {
            ticker: ticker,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            volume: snapshotData.ticker.day?.v || prevResult.v,
            high: snapshotData.ticker.day?.h || prevResult.h,
            low: snapshotData.ticker.day?.l || prevResult.l,
            open: snapshotData.ticker.day?.o || prevResult.o,
            previousClose: previousClose,
            timestamp: snapshotData.ticker.updated || prevResult.t,
        };

        console.log('✅ Successfully fetched quote:', {
            ticker: quote.ticker,
            price: quote.price,
            change: quote.change.toFixed(2),
            changePercent: quote.changePercent.toFixed(2) + '%'
        });

        return quote;
    } catch (error) {
        console.error('❌ Error fetching Massive quote:', error);
        return null;
    }
}

/**
 * Get detailed company information
 * Endpoint: GET /v3/reference/tickers/{ticker}
 */
export async function getMassiveTickerDetails(ticker: string): Promise<MassiveTickerDetails | null> {
    try {
        console.log(`🏢 Fetching Massive ticker details for ${ticker}...`);
        
        if (!MASSIVE_API_KEY) {
            console.error('❌ Massive API key is not configured');
            return null;
        }

        const url = `${MASSIVE_BASE_URL}/v3/reference/tickers/${ticker}?apiKey=${MASSIVE_API_KEY}`;
        console.log('🔗 Calling:', url.replace(MASSIVE_API_KEY, 'API_KEY_HIDDEN'));
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`❌ Massive API error: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error('Error response:', errorText);
            return null;
        }

        const data = await response.json();
        console.log('✅ Ticker details received:', data);
        
        if (!data.results) {
            console.error('❌ No ticker details available');
            return null;
        }

        console.log('✅ Successfully fetched ticker details:', {
            name: data.results.name,
            market_cap: data.results.market_cap
        });

        return data.results;
    } catch (error) {
        console.error('❌ Error fetching Massive ticker details:', error);
        return null;
    }
}

/**
 * Get historical aggregates (for charts)
 * Endpoint: GET /v2/aggs/ticker/{ticker}/range/{multiplier}/{timespan}/{from}/{to}
 */
export async function getMassiveAggregates(
    ticker: string,
    multiplier: number = 1,
    timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' = 'day',
    from: string, // YYYY-MM-DD
    to: string    // YYYY-MM-DD
): Promise<MassiveAgg[]> {
    try {
        if (!MASSIVE_API_KEY) {
            console.error('Massive API key is not configured');
            return [];
        }

        const url = `${MASSIVE_BASE_URL}/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=50000&apiKey=${MASSIVE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`Massive API error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        
        if (!data.results) {
            console.error('No aggregate data available');
            return [];
        }

        return data.results;
    } catch (error) {
        console.error('Error fetching Massive aggregates:', error);
        return [];
    }
}

/**
 * Format large numbers (e.g., market cap)
 */
export function formatMarketCap(value: number): string {
    if (value >= 1_000_000_000_000) {
        return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    } else if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    } else {
        return `$${value.toLocaleString()}`;
    }
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

/**
 * Check if market is currently open (US market hours: 9:30 AM - 4:00 PM ET, Mon-Fri)
 */
export function isMarketOpen(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Weekend check
    if (day === 0 || day === 6) {
        return false;
    }
    
    // Convert to ET
    const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hours = etTime.getHours();
    const minutes = etTime.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    
    // Market hours: 9:30 AM - 4:00 PM ET
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60;    // 4:00 PM
    
    return timeInMinutes >= marketOpen && timeInMinutes < marketClose;
}

