import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, TrendingUpIcon, Users, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMassiveQuote, getMassiveTickerDetails, formatMarketCap, formatTimestamp, isMarketOpen } from '../lib/massive';
import { toast } from 'sonner';

interface TickerPageProps {
  ticker: string;
  onNavigateHome: () => void;
  onCreatorClick: (creatorId: string) => void;
  onPostClick: (postId: number) => void;
}

// Mock data for ticker details
const tickerData: Record<string, any> = {
  NVDA: {
    name: 'NVIDIA Corporation',
    price: 875.42,
    change: 23.45,
    changePercent: 2.75,
    // Financial metrics
    revenue: '$60.9B',
    eps: 22.45,
    marketCap: '$2.15T',
    pe: 39.0,
    grossMargin: '72.4%',
    operatingMargin: '54.2%',
    freeCashFlow: '$27.6B',
    revenueGrowth: '+125.9%',
    dividendYield: '0.03%',
    beta: 1.68,
    // Crowd-sourced metrics
    sentimentScore: '8.7/10',
    sentimentChange: 12,
    bullPercentage: 78,
    bearPercentage: 22,
    discussionVolume: '14.2K posts',
    discussionChange: 24,
    avgPriceTarget: 985,
    convictionScore: '9.1/10',
    trendingRank: 1,
    // Thesis
    bullThesis: 'NVIDIA\'s AI dominance is undeniable with CUDA ecosystem creating an insurmountable moat. Data center revenue growing 200%+ YoY with margins expanding. Every major tech company is locked into their platform for AI training and inference.',
    bearThesis: 'Valuation stretched at 39x P/E with competition heating up from AMD and custom chips from hyperscalers. China export restrictions could impact 20% of revenue. Market may be overestimating AI capex sustainability.',
    // Insights
    insights: [
      'Strong institutional buying with 67% of shares held by institutions',
      'Q4 earnings beat estimates by 12%, guiding higher for FY25',
      'New Blackwell architecture seeing unprecedented demand, fully sold out through 2025',
      'Gaming segment rebounding with 15% QoQ growth',
    ],
    // Community-Suggested KPIs
    communityKPIs: [
      { label: 'GPU Shipments (Q)', value: '3.8M units', change: '+28%' },
      { label: 'Data Center Rev', value: '$47.5B', change: '+217%' },
      { label: 'CUDA Adoption', value: '76%', change: '+8%' },
      { label: 'AI Accelerator Share', value: '92%', change: '+5%' },
    ],
  },
  TSLA: {
    name: 'Tesla, Inc.',
    price: 238.45,
    change: -5.23,
    changePercent: -2.15,
    revenue: '$96.8B',
    eps: 3.12,
    marketCap: '$758B',
    pe: 76.4,
    grossMargin: '18.2%',
    operatingMargin: '9.2%',
    freeCashFlow: '$4.4B',
    revenueGrowth: '+19.4%',
    dividendYield: '0.00%',
    beta: 2.01,
    sentimentScore: '6.2/10',
    sentimentChange: -8,
    bullPercentage: 52,
    bearPercentage: 48,
    discussionVolume: '22.8K posts',
    discussionChange: 45,
    avgPriceTarget: 265,
    convictionScore: '6.8/10',
    trendingRank: 2,
    bullThesis: 'Energy business growing 100%+ YoY while everyone focuses on vehicles. FSD improving rapidly with version 12. Optimus robot could be transformational. Cybertruck ramping production.',
    bearThesis: 'Vehicle margins compressing due to price cuts. Competition intensifying from Chinese EVs. Musk distraction with other ventures. Valuation still expensive despite pullback.',
    insights: [
      'Energy storage deployments hit record 4 GWh in Q4',
      'Price cuts in China signal demand weakness',
      'Model Y remains best-selling vehicle globally',
      'FSD take rate improving to 15% of new deliveries',
    ],
    communityKPIs: [
      { label: 'Vehicle Deliveries (Q)', value: '484K units', change: '+38%' },
      { label: 'Energy Storage (Q)', value: '4.0 GWh', change: '+125%' },
      { label: 'FSD Adoption Rate', value: '15%', change: '+5%' },
      { label: 'Supercharger Stalls', value: '55K', change: '+34%' },
    ],
  },
  AAPL: {
    name: 'Apple Inc.',
    price: 178.23,
    change: 1.34,
    changePercent: 0.76,
    revenue: '$383.3B',
    eps: 6.13,
    marketCap: '$2.78T',
    pe: 29.1,
    grossMargin: '44.1%',
    operatingMargin: '30.5%',
    freeCashFlow: '$99.6B',
    revenueGrowth: '+2.1%',
    dividendYield: '0.50%',
    beta: 1.29,
    sentimentScore: '7.4/10',
    sentimentChange: 5,
    bullPercentage: 68,
    bearPercentage: 32,
    discussionVolume: '8.5K posts',
    discussionChange: -12,
    avgPriceTarget: 195,
    convictionScore: '7.6/10',
    trendingRank: 5,
    bullThesis: 'Services revenue growing steadily with 70%+ margins. iPhone 15 cycle strong in emerging markets. Vision Pro opening new category. $99B FCF enables massive buybacks.',
    bearThesis: 'iPhone unit growth stagnant. China weakness persisting. Innovation pipeline questioned. Regulatory risks in EU and US.',
    insights: [
      'Services now 22% of revenue with accelerating growth',
      'India manufacturing expanding rapidly',
      'Vision Pro pre-orders exceeded expectations',
      'Buyback authorization increased to $110B',
    ],
    communityKPIs: [
      { label: 'iPhone ASP', value: '$895', change: '+6%' },
      { label: 'Services ARPU', value: '$11.50/mo', change: '+12%' },
      { label: 'Wearables Revenue', value: '$41.2B', change: '+8%' },
      { label: 'Active Installed Base', value: '2.2B devices', change: '+9%' },
    ],
  },
  MSFT: {
    name: 'Microsoft Corporation',
    price: 412.45,
    change: 8.32,
    changePercent: 2.06,
    revenue: '$227.6B',
    eps: 11.06,
    marketCap: '$3.07T',
    pe: 37.3,
    grossMargin: '69.8%',
    operatingMargin: '43.1%',
    freeCashFlow: '$72.7B',
    revenueGrowth: '+15.7%',
    dividendYield: '0.77%',
    beta: 0.91,
    sentimentScore: '8.1/10',
    sentimentChange: 9,
    bullPercentage: 71,
    bearPercentage: 29,
    discussionVolume: '6.3K posts',
    discussionChange: 18,
    avgPriceTarget: 445,
    convictionScore: '8.4/10',
    trendingRank: 3,
    bullThesis: 'Azure AI growing 100%+ with strong enterprise adoption. GitHub Copilot seeing rapid monetization. Office 365 Copilot launching with premium pricing. Cloud margins expanding.',
    bearThesis: 'AI infrastructure capex reaching $50B annually. OpenAI partnership risks. Competition from Google and AWS intensifying.',
    insights: [
      'Azure revenue up 30% YoY with AI contributing 6 points',
      'Copilot customers growing 40% QoQ',
      'Gaming division strong with Activision integration',
      'Enterprise renewal rates at record highs',
    ],
    communityKPIs: [
      { label: 'Azure Revenue (Q)', value: '$25.7B', change: '+30%' },
      { label: 'Office 365 MAU', value: '382M users', change: '+14%' },
      { label: 'Copilot Subscribers', value: '3.8M seats', change: '+67%' },
      { label: 'Gaming Revenue (Q)', value: '$5.6B', change: '+49%' },
    ],
  },
  AMD: {
    name: 'Advanced Micro Devices, Inc.',
    price: 145.78,
    change: -2.34,
    changePercent: -1.58,
    revenue: '$22.7B',
    eps: 3.61,
    marketCap: '$235B',
    pe: 40.4,
    grossMargin: '50.1%',
    operatingMargin: '5.8%',
    freeCashFlow: '$1.3B',
    revenueGrowth: '+8.9%',
    dividendYield: '0.00%',
    beta: 1.92,
    sentimentScore: '7.2/10',
    sentimentChange: 3,
    bullPercentage: 65,
    bearPercentage: 35,
    discussionVolume: '9.7K posts',
    discussionChange: 34,
    avgPriceTarget: 165,
    convictionScore: '7.1/10',
    trendingRank: 4,
    bullThesis: 'MI300 showing strong competitive performance against NVIDIA. Data center segment growing rapidly. Market share gains in both CPU and GPU. Xilinx acquisition synergies materializing.',
    bearThesis: 'Still far behind NVIDIA in software ecosystem. Data center margins lower than expected. PC market weakness continuing.',
    insights: [
      'MI300 shipments exceeding $2B in first year',
      'Server CPU market share now at 24%',
      'Major cloud providers adopting MI300',
      'Embedded segment declining on auto weakness',
    ],
    communityKPIs: [
      { label: 'MI300 Revenue (Q)', value: '$550M', change: '+185%' },
      { label: 'Server CPU Share', value: '24%', change: '+3%' },
      { label: 'Data Center Revenue', value: '$6.5B', change: '+122%' },
      { label: 'GPU Market Share', value: '19%', change: '+5%' },
    ],
  },
};

// Mock DD posts data
const ddPostsByTicker: Record<string, any[]> = {
  NVDA: [
    {
      id: 1,
      title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
      author: 'TechInvestor42',
      authorId: 'tech-investor-42',
      avatar: 'TI',
      verified: true,
      credibilityScore: 87,
      summary: 'Comprehensive analysis of NVIDIA\'s AI chip ecosystem moat, data center revenue trajectory, and competitive positioning.',
      likes: 892,
      comments: 124,
      timestamp: '2h ago',
      sentiment: 'bullish',
      stockPerformance: 8.5,
    },
    {
      id: 2,
      title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
      author: 'WallStreetOracle',
      authorId: 'wall-street-oracle',
      avatar: 'WO',
      verified: true,
      credibilityScore: 92,
      summary: 'Most investors focus on the hardware, but CUDA is the real moat - 76% of ML engineers prefer it over alternatives.',
      likes: 654,
      comments: 78,
      timestamp: '5h ago',
      sentiment: 'bullish',
      stockPerformance: 6.8,
    },
    {
      id: 11,
      title: 'NVDA Valuation Concerns: Is 39x P/E Justified?',
      author: 'ValueHunter',
      authorId: 'value-hunter',
      avatar: 'VH',
      verified: false,
      credibilityScore: 81,
      summary: 'Historical analysis shows tech stocks at these multiples tend to underperform. Competition from AMD and custom chips is real.',
      likes: 189,
      comments: 92,
      timestamp: '8h ago',
      sentiment: 'bearish',
      stockPerformance: 2.1,
    },
    {
      id: 12,
      title: 'Blackwell Architecture: Game Changer or Incremental Upgrade?',
      author: 'ChipCollector',
      authorId: 'chip-collector',
      avatar: 'CC',
      verified: false,
      credibilityScore: 69,
      summary: 'Deep technical breakdown of Blackwell improvements. Performance gains are real but not as revolutionary as Hopper was.',
      likes: 167,
      comments: 34,
      timestamp: '1d ago',
      sentiment: 'neutral',
      stockPerformance: -1.2,
    },
  ],
  TSLA: [
    {
      id: 8,
      title: 'TSLA: The Energy Company Disguised as a Car Maker',
      author: 'GreenPortfolio',
      authorId: 'green-portfolio',
      avatar: 'GP',
      verified: false,
      credibilityScore: 72,
      summary: 'Energy storage business growing 100%+ YoY while everyone focuses on vehicle deliveries - this is the hidden catalyst.',
      likes: 567,
      comments: 89,
      timestamp: '3h ago',
      sentiment: 'bullish',
      stockPerformance: 3.2,
    },
  ],
};

export function TickerPage({ ticker, onNavigateHome, onCreatorClick, onPostClick }: TickerPageProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'earliest'>('latest');
  const [liveQuote, setLiveQuote] = useState<any>(null);
  const [tickerDetails, setTickerDetails] = useState<any>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Fetch live data from Massive.com
  const fetchLiveData = async (showToast = false) => {
    console.log(`🔄 Starting live data fetch for ${ticker}...`);
    if (showToast) setIsRefreshing(true);
    else setIsLoadingLive(true);

    try {
      const [quote, details] = await Promise.all([
        getMassiveQuote(ticker),
        getMassiveTickerDetails(ticker)
      ]);

      console.log('📊 Quote result:', quote);
      console.log('🏢 Details result:', details);

      if (quote) {
        console.log('✅ Setting live quote state:', quote);
        setLiveQuote(quote);
        setLastUpdated(formatTimestamp(quote.timestamp));
        if (showToast) {
          toast.success('Live data refreshed!');
        }
      } else {
        console.warn('⚠️ No quote data received, using fallback');
        if (showToast) {
          toast.error('Unable to fetch live data. Using fallback data.');
        }
      }

      if (details) {
        console.log('✅ Setting ticker details state:', details);
        setTickerDetails(details);
      } else {
        console.warn('⚠️ No ticker details received');
      }
    } catch (error) {
      console.error('❌ Error fetching live data:', error);
      if (showToast) {
        toast.error('Failed to refresh data.');
      }
    } finally {
      setIsLoadingLive(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, [ticker]);

  // Merge live data with mock data (for fields not yet in API)
  const mockData = tickerData[ticker] || {
    name: `${ticker} Stock`,
    price: 100.00,
    change: 0,
    changePercent: 0,
    marketCap: 'N/A',
    pe: 0,
    eps: 0,
    bullPercentage: 50,
    bearPercentage: 50,
    bullThesis: 'No data available',
    bearThesis: 'No data available',
    insights: [],
  };

  const data = {
    ...mockData,
    name: tickerDetails?.name || mockData.name,
    price: liveQuote?.price || mockData.price,
    change: liveQuote?.change || mockData.change,
    changePercent: liveQuote?.changePercent || mockData.changePercent,
    marketCap: tickerDetails?.market_cap ? formatMarketCap(tickerDetails.market_cap) : mockData.marketCap,
    description: tickerDetails?.description || mockData.description,
    high: liveQuote?.high,
    low: liveQuote?.low,
    volume: liveQuote?.volume,
    open: liveQuote?.open,
    previousClose: liveQuote?.previousClose,
  };

  console.log('📊 Final merged data being displayed:', {
    ticker,
    hasLiveQuote: !!liveQuote,
    hasTickerDetails: !!tickerDetails,
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    marketCap: data.marketCap
  });

  const posts = ddPostsByTicker[ticker] || [];

  // Sort posts based on selection
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'earliest') return a.id - b.id;
    return b.id - a.id; // latest
  });

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-slate-900">${ticker}</h1>
                <span className="text-slate-600">{data.name}</span>
                {isLoadingLive ? (
                  <div className="flex items-center gap-2 text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading live data...</span>
                  </div>
                ) : (
                  <>
                    {data.changePercent > 0 ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <TrendingUp className="w-5 h-5" />
                        <span>${data.price.toFixed(2)}</span>
                        <span>(+{data.changePercent.toFixed(2)}%)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <TrendingDown className="w-5 h-5" />
                        <span>${data.price.toFixed(2)}</span>
                        <span>({data.changePercent.toFixed(2)}%)</span>
                      </div>
                    )}
                    {liveQuote && (
                      <>
                        <Badge variant="outline" className={isMarketOpen() ? 'border-emerald-500 text-emerald-700' : 'border-slate-400 text-slate-600'}>
                          {isMarketOpen() ? '🟢 Market Open' : '🔴 Market Closed'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchLiveData(true)}
                          disabled={isRefreshing}
                          className="gap-2"
                        >
                          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
              {lastUpdated && !isLoadingLive && (
                <div className="text-sm text-slate-500 mt-1">
                  Last updated: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Financial Metrics */}
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Financial Metrics
                    {liveQuote && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        LIVE
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Live Trading Data */}
                  {liveQuote && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="text-slate-700 font-medium mb-3">Today's Trading</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-slate-500 text-sm mb-1">Open</div>
                          <div className="text-slate-900 font-semibold">${data.open?.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-sm mb-1">Prev Close</div>
                          <div className="text-slate-900 font-semibold">${data.previousClose?.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-sm mb-1">Day High</div>
                          <div className="text-emerald-600 font-semibold">${data.high?.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-sm mb-1">Day Low</div>
                          <div className="text-red-600 font-semibold">${data.low?.toFixed(2)}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-slate-500 text-sm mb-1">Volume</div>
                          <div className="text-slate-900 font-semibold">{data.volume?.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fundamental Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-slate-500 mb-1">Market Cap</div>
                      <div className="text-slate-900 font-medium">{data.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">P/E Ratio</div>
                      <div className="text-slate-900">{data.pe}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Revenue</div>
                      <div className="text-slate-900">{data.revenue}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">EPS</div>
                      <div className="text-slate-900">{data.eps}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Gross Margin</div>
                      <div className="text-slate-900">{data.grossMargin}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Operating Margin</div>
                      <div className="text-slate-900">{data.operatingMargin}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Free Cash Flow</div>
                      <div className="text-slate-900">{data.freeCashFlow}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Rev Growth</div>
                      <div className="text-emerald-600">{data.revenueGrowth}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Div Yield</div>
                      <div className="text-slate-900">{data.dividendYield}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Beta</div>
                      <div className="text-slate-900">{data.beta}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-slate-900 mb-3">Community Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sentiment</span>
                        <span className="text-emerald-600">{data.sentimentScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Discussion</span>
                        <span className="text-slate-900">{data.discussionVolume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Avg Target</span>
                        <span className="text-slate-900">${data.avgPriceTarget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Conviction</span>
                        <span className="text-emerald-600">{data.convictionScore}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community-Suggested KPIs */}
              {data.communityKPIs && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Community-Suggested KPIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.communityKPIs.map((kpi: any, index: number) => (
                        <div key={index}>
                          <div className="text-slate-500 mb-1">{kpi.label}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-900">{kpi.value}</span>
                            <span className={kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>
                              {kpi.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Company Description */}
            {tickerDetails?.description && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>About {data.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">{tickerDetails.description}</p>
                  {tickerDetails.homepage_url && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <a
                        href={tickerDetails.homepage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Visit Website →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Community Sentiment and Insights */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Community Sentiment & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Bull vs Bear Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="text-emerald-600">Bull {data.bullPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">Bear {data.bearPercentage}%</span>
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${data.bullPercentage}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${data.bearPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Bull vs Bear Thesis */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-emerald-900">Bull Thesis</h4>
                    </div>
                    <p className="text-emerald-800">{data.bullThesis}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <h4 className="text-red-900">Bear Thesis</h4>
                    </div>
                    <p className="text-red-800">{data.bearThesis}</p>
                  </div>
                </div>

                {/* Insights */}
                <div>
                  <h4 className="text-slate-900 mb-3">Key Insights from Community</h4>
                  <div className="space-y-2">
                    {data.insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <p className="text-slate-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Diligence Posts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Due Diligence Posts</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'latest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('latest')}
                    >
                      Latest
                    </Button>
                    <Button
                      variant={sortBy === 'popular' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('popular')}
                    >
                      Popular
                    </Button>
                    <Button
                      variant={sortBy === 'earliest' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('earliest')}
                    >
                      Earliest
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {sortedPosts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No due diligence posts available for {ticker}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                        onClick={() => onPostClick(post.id)}
                      >
                        {/* Author Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreatorClick(post.authorId);
                            }}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={post.authorAvatar} />
                              <AvatarFallback className="bg-emerald-500 text-white">
                                {post.author?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-900">{post.author}</span>
                              {post.verified && (
                                <BadgeCheck className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                post.sentiment === 'bull'
                                  ? 'border-emerald-200 text-emerald-700'
                                  : post.sentiment === 'bear'
                                  ? 'border-red-200 text-red-700'
                                  : 'border-slate-200 text-slate-700'
                              }
                            >
                              {post.sentiment}
                            </Badge>
                            <span className="text-slate-500 text-sm">{post.timestamp}</span>
                          </div>
                        </div>

                        {/* Title and Summary */}
                        <h4 className="text-slate-900 mb-2">{post.title}</h4>
                        <p className="text-slate-600 mb-3">{post.summary}</p>

                        {/* Stock Performance Since Post */}
                        <div className="mb-3 p-2 bg-slate-50 rounded flex items-center justify-between">
                          <span className="text-slate-600 text-sm">Stock performance since post:</span>
                          <div className={`flex items-center gap-1 ${
                            post.stockPerformance >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {post.stockPerformance >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{post.stockPerformance >= 0 ? '+' : ''}{post.stockPerformance}%</span>
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center gap-4 text-slate-500">
                          <span>👍 {post.likes} likes</span>
                          <span>💬 {post.comments} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}