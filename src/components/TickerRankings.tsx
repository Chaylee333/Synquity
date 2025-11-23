import { TrendingUp, TrendingDown, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef } from 'react';

interface TickerRankingsProps {
  onTickerClick: (ticker: string) => void;
}

const trendingTickers = [
  { 
    rank: 1, 
    ticker: 'NVDA', 
    name: 'NVIDIA Corp',
    price: 875.42,
    change: 12.5,
    volume: '245M',
    mentions: 1247,
    sentiment: 85
  },
  { 
    rank: 2, 
    ticker: 'TSLA', 
    name: 'Tesla Inc',
    price: 238.56,
    change: 8.3,
    volume: '189M',
    mentions: 983,
    sentiment: 72
  },
  { 
    rank: 3, 
    ticker: 'AAPL', 
    name: 'Apple Inc',
    price: 186.43,
    change: -2.1,
    volume: '156M',
    mentions: 756,
    sentiment: 45
  },
  { 
    rank: 4, 
    ticker: 'AMD', 
    name: 'Advanced Micro Devices',
    price: 165.23,
    change: 5.7,
    volume: '98M',
    mentions: 654,
    sentiment: 78
  },
  { 
    rank: 5, 
    ticker: 'MSFT', 
    name: 'Microsoft Corp',
    price: 412.89,
    change: 3.2,
    volume: '134M',
    mentions: 589,
    sentiment: 68
  },
  { 
    rank: 6, 
    ticker: 'GME', 
    name: 'GameStop Corp',
    price: 23.45,
    change: 15.8,
    volume: '78M',
    mentions: 501,
    sentiment: 92
  },
  { 
    rank: 7, 
    ticker: 'SPY', 
    name: 'S&P 500 ETF',
    price: 485.67,
    change: 1.4,
    volume: '312M',
    mentions: 478,
    sentiment: 55
  },
  { 
    rank: 8, 
    ticker: 'PLTR', 
    name: 'Palantir Technologies',
    price: 32.12,
    change: 6.9,
    volume: '67M',
    mentions: 445,
    sentiment: 81
  },
];

export function TickerRankings({ onTickerClick }: TickerRankingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Trending Tickers
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {trendingTickers.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => onTickerClick(stock.ticker)}
                className="flex-shrink-0 w-64 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-500">
                    #{stock.rank}
                  </div>
                  {stock.change > 0 ? (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stock.change}%
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {Math.abs(stock.change)}%
                    </Badge>
                  )}
                </div>

                <div className="mb-3">
                  <div className="text-slate-900 mb-1">${stock.ticker}</div>
                  <div className="text-slate-500 text-sm truncate">{stock.name}</div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price</span>
                    <span className="text-slate-900">${stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volume</span>
                    <span className="text-slate-900">{stock.volume}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{stock.mentions}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">Sentiment</span>
                    <span className={`${
                      stock.sentiment >= 70 ? 'text-emerald-600' :
                      stock.sentiment >= 50 ? 'text-slate-600' :
                      'text-red-600'
                    }`}>
                      {stock.sentiment}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}