import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const trendingStocks = [
  { ticker: 'NVDA', change: 12.5, price: 875.42, mentions: 1247 },
  { ticker: 'TSLA', change: 8.3, price: 238.56, mentions: 983 },
  { ticker: 'AAPL', change: -2.1, price: 186.43, mentions: 756 },
  { ticker: 'AMD', change: 5.7, price: 165.23, mentions: 654 },
  { ticker: 'MSFT', change: 3.2, price: 412.89, mentions: 589 },
];

const trendingTopics = [
  { title: 'AI Stocks Rally', posts: 234 },
  { title: 'Fed Rate Decision', posts: 189 },
  { title: 'Tech Earnings Season', posts: 167 },
  { title: 'EV Market Growth', posts: 143 },
  { title: 'Banking Crisis Fears', posts: 128 },
];

export function TrendingSidebar() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Trending Stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingStocks.map((stock) => (
              <div 
                key={stock.ticker} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">${stock.ticker}</span>
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
                  <div className="text-slate-500 mt-1">
                    ${stock.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-slate-500">
                  {stock.mentions} mentions
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            Hot Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div 
                key={topic.title}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">#{index + 1}</span>
                  <span className="text-slate-900">{topic.title}</span>
                </div>
                <span className="text-slate-500">{topic.posts}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
