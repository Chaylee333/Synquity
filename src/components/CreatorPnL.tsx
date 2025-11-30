import { TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CreatorPnLProps {
  mockPnL: number;
  mockReturn: number;
  pnlAnnualized?: number;
  pnlSinceJoining?: number;
  sharpeRatio?: number;
}

export function CreatorPnL({ mockPnL, mockReturn, pnlAnnualized, pnlSinceJoining, sharpeRatio }: CreatorPnLProps) {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Mock Portfolio Based On DD Posts
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

          {/* P&L Metrics */}
          <div className="space-y-3">
            {pnlAnnualized !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-slate-600">P&L % (Annualized):</span>
                <Badge 
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{pnlAnnualized}%
                </Badge>
              </div>
            )}
            {pnlSinceJoining !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-slate-600">P&L % Since Joining:</span>
                <Badge 
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{pnlSinceJoining}%
                </Badge>
              </div>
            )}
            {sharpeRatio !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Sharpe Ratio:</span>
                <Badge 
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {sharpeRatio.toFixed(2)}
                </Badge>
              </div>
            )}
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
  );
}