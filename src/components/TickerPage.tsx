import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { TickerKPIs } from './TickerKPIs';
import { BullBearThesis } from './BullBearThesis';
import { TickerDDPosts } from './TickerDDPosts';

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
    // Crowd-sourced metrics
    sentimentScore: '8.7/10',
    sentimentChange: 12,
    bullBearRatio: '78% Bull',
    discussionVolume: '14.2K posts',
    discussionChange: 24,
    avgPriceTarget: 985,
    convictionScore: '9.1/10',
    trendingRank: 1,
  },
  TSLA: {
    name: 'Tesla, Inc.',
    price: 238.45,
    change: -5.23,
    changePercent: -2.15,
    // Financial metrics
    revenue: '$96.8B',
    eps: 3.12,
    marketCap: '$758B',
    pe: 76.4,
    grossMargin: '18.2%',
    operatingMargin: '9.2%',
    freeCashFlow: '$4.4B',
    revenueGrowth: '+19.4%',
    // Crowd-sourced metrics
    sentimentScore: '6.2/10',
    sentimentChange: -8,
    bullBearRatio: '52% Bull',
    discussionVolume: '22.8K posts',
    discussionChange: 45,
    avgPriceTarget: 265,
    convictionScore: '6.8/10',
    trendingRank: 2,
  },
  AAPL: {
    name: 'Apple Inc.',
    price: 178.23,
    change: 1.34,
    changePercent: 0.76,
    // Financial metrics
    revenue: '$383.3B',
    eps: 6.13,
    marketCap: '$2.78T',
    pe: 29.1,
    grossMargin: '44.1%',
    operatingMargin: '30.5%',
    freeCashFlow: '$99.6B',
    revenueGrowth: '+2.1%',
    // Crowd-sourced metrics
    sentimentScore: '7.4/10',
    sentimentChange: 5,
    bullBearRatio: '68% Bull',
    discussionVolume: '8.5K posts',
    discussionChange: -12,
    avgPriceTarget: 195,
    convictionScore: '7.6/10',
    trendingRank: 5,
  },
  MSFT: {
    name: 'Microsoft Corporation',
    price: 412.45,
    change: 8.32,
    changePercent: 2.06,
    // Financial metrics
    revenue: '$227.6B',
    eps: 11.06,
    marketCap: '$3.07T',
    pe: 37.3,
    grossMargin: '69.8%',
    operatingMargin: '43.1%',
    freeCashFlow: '$72.7B',
    revenueGrowth: '+15.7%',
    // Crowd-sourced metrics
    sentimentScore: '8.1/10',
    sentimentChange: 9,
    bullBearRatio: '71% Bull',
    discussionVolume: '6.3K posts',
    discussionChange: 18,
    avgPriceTarget: 445,
    convictionScore: '8.4/10',
    trendingRank: 3,
  },
  AMD: {
    name: 'Advanced Micro Devices, Inc.',
    price: 145.78,
    change: -2.34,
    changePercent: -1.58,
    // Financial metrics
    revenue: '$22.7B',
    eps: 3.61,
    marketCap: '$235B',
    pe: 40.4,
    grossMargin: '50.1%',
    operatingMargin: '5.8%',
    freeCashFlow: '$1.3B',
    revenueGrowth: '+8.9%',
    // Crowd-sourced metrics
    sentimentScore: '7.2/10',
    sentimentChange: 3,
    bullBearRatio: '65% Bull',
    discussionVolume: '9.7K posts',
    discussionChange: 34,
    avgPriceTarget: 165,
    convictionScore: '7.1/10',
    trendingRank: 4,
  },
};

export function TickerPage({ ticker, onNavigateHome, onCreatorClick, onPostClick }: TickerPageProps) {
  const data = tickerData[ticker] || {
    name: `${ticker} Stock`,
    price: 100.00,
    change: 0,
    marketCap: 'N/A',
    pe: 0,
    eps: 0,
    volume: '0',
    avgVolume: '0',
    dayHigh: 0,
    dayLow: 0,
    week52High: 0,
    week52Low: 0,
  };

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
              <div className="flex items-center gap-3">
                <h1 className="text-slate-900">${ticker}</h1>
                <span className="text-slate-600">{data.name}</span>
                {data.change > 0 ? (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>${data.price.toFixed(2)}</span>
                    <span>(+{data.change}%)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                    <span>${data.price.toFixed(2)}</span>
                    <span>({data.change}%)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <TickerKPIs ticker={ticker} data={data} />
          <BullBearThesis ticker={ticker} />
          <TickerDDPosts ticker={ticker} onCreatorClick={onCreatorClick} onPostClick={onPostClick} />
        </div>
      </div>
    </>
  );
}