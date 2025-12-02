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
          {/* P&L Metrics */}
          <div className="space-y-3">
            {pnlAnnualized !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">P&L % (Annualized):</span>
                <Badge 
                  variant="secondary"
                  className={`${pnlAnnualized >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {pnlAnnualized >= 0 ? '+' : ''}{pnlAnnualized}%
                </Badge>
              </div>
            )}
            {pnlSinceJoining !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600">P&L % Since Joining:</span>
                <Badge 
                  variant="secondary"
                  className={`${pnlSinceJoining >= 0 ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {pnlSinceJoining >= 0 ? '+' : ''}{pnlSinceJoining}%
                </Badge>
              </div>
            )}
            {sharpeRatio !== undefined && (
              <div className="flex items-center justify-between">
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

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Monthly Return:</span>
            <Badge 
              variant="secondary"
              className="bg-blue-100 text-blue-700"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {mockReturn}%
            </Badge>
          </div>

          <div className="text-slate-500 text-sm pt-4 border-t border-blue-200">
            Paper trading account • Starting balance: $100,000
          </div>
        </div>
      </CardContent>
    </Card>
  );
}