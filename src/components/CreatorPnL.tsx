import { TrendingUp, Wallet, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CreatorPnLProps {
  brokeragePnL: number;
  brokerageReturn: number;
  mockPnL: number;
  mockReturn: number;
}

export function CreatorPnL({ brokeragePnL, brokerageReturn, mockPnL, mockReturn }: CreatorPnLProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-2 border-emerald-200 bg-emerald-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Brokerage Account (Verified)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-slate-600 mb-1">Total P&L</div>
              <div className={`text-3xl ${brokeragePnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {brokeragePnL >= 0 ? '+' : ''}{brokeragePnL >= 0 ? '$' : '-$'}
                {Math.abs(brokeragePnL).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Monthly Return:</span>
              <Badge 
                variant="secondary"
                className="bg-emerald-100 text-emerald-700"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {brokerageReturn}%
              </Badge>
            </div>

            <div className="pt-4 border-t border-emerald-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-slate-500 mb-1">1M</div>
                  <div className="text-emerald-600">+12.3%</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">3M</div>
                  <div className="text-emerald-600">+28.7%</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">YTD</div>
                  <div className="text-emerald-600">+{brokerageReturn}%</div>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-sm pt-2">
              Connected to TD Ameritrade • Last synced 2 hours ago
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Mock Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-slate-600 mb-1">Total P&L</div>
              <div className={`text-3xl ${mockPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {mockPnL >= 0 ? '+' : ''}{mockPnL >= 0 ? '$' : '-$'}
                {Math.abs(mockPnL).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Monthly Return:</span>
              <Badge 
                variant="secondary"
                className="bg-blue-100 text-blue-700"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {mockReturn}%
              </Badge>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-slate-500 mb-1">1M</div>
                  <div className="text-emerald-600">+8.4%</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">3M</div>
                  <div className="text-emerald-600">+15.2%</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">YTD</div>
                  <div className="text-emerald-600">+{mockReturn}%</div>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-sm pt-2">
              Paper trading account • Starting balance: $100,000
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
