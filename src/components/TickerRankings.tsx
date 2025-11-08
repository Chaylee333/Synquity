import { TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Trending Tickers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {trendingTickers.map((stock) => (
            <div
              key={stock.ticker}
              onClick={() => onTickerClick(stock.ticker)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div className="text-slate-500 w-8">
                #{stock.rank}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-900">${stock.ticker}</span>
                  <span className="text-slate-500 truncate">{stock.name}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>${stock.price.toFixed(2)}</span>
                  <span>•</span>
                  <span>Vol: {stock.volume}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
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
                <div className="flex items-center gap-1 text-slate-500">
                  <MessageSquare className="w-3 h-3" />
                  <span>{stock.mentions}</span>
                </div>
              </div>

              <div className="w-16 text-right">
                <div className="text-slate-500 mb-1">Sentiment</div>
                <div className={`${
                  stock.sentiment >= 70 ? 'text-emerald-600' :
                  stock.sentiment >= 50 ? 'text-slate-600' :
                  'text-red-600'
                }`}>
                  {stock.sentiment}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
