import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

interface TickerKPIsProps {
  ticker: string;
  data: any;
}

export function TickerKPIs({ ticker, data }: TickerKPIsProps) {
  const financialKPIs = [
    { label: 'Revenue (TTM)', value: data.revenue },
    { label: 'EPS (Diluted)', value: `$${data.eps}` },
    { label: 'Market Cap', value: data.marketCap },
    { label: 'P/E Ratio', value: data.pe },
    { label: 'Gross Margin', value: data.grossMargin },
    { label: 'Operating Margin', value: data.operatingMargin },
    { label: 'Free Cash Flow', value: data.freeCashFlow },
    { label: 'Revenue Growth YoY', value: data.revenueGrowth },
  ];

  const crowdsourcedKPIs = [
    { label: 'Sentiment Score', value: data.sentimentScore, change: data.sentimentChange },
    { label: 'Bull/Bear Ratio', value: data.bullBearRatio },
    { label: 'Discussion Volume', value: data.discussionVolume, change: data.discussionChange },
    { label: 'Avg Price Target', value: `$${data.avgPriceTarget}` },
    { label: 'Conviction Score', value: data.convictionScore },
    { label: 'Trending Rank', value: `#${data.trendingRank}` },
  ];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Financial Metrics
          </CardTitle>
          <p className="text-slate-500">Data from latest earnings release</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {financialKPIs.map((kpi) => (
              <div key={kpi.label} className="space-y-1">
                <div className="text-slate-500">{kpi.label}</div>
                <div className="text-slate-900">{kpi.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crowd-sourced KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Community Insights
          </CardTitle>
          <p className="text-slate-500">Crowd-sourced metrics from forum activity</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {crowdsourcedKPIs.map((kpi) => (
              <div key={kpi.label} className="space-y-1">
                <div className="text-slate-500">{kpi.label}</div>
                <div className="flex items-center gap-2">
                  <div className="text-slate-900">{kpi.value}</div>
                  {kpi.change && (
                    <span className={`text-xs ${kpi.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}