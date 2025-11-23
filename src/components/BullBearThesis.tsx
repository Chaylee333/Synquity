import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from './ui/progress';

interface BullBearThesisProps {
  ticker: string;
}

const thesisData: Record<string, any> = {
  NVDA: {
    bullPercentage: 78,
    bullPoints: [
      'AI demand continues to surge with data center revenue up 279% YoY',
      'Strong competitive moat in GPU technology and CUDA ecosystem',
      'Expanding into new markets: automotive, robotics, and edge computing',
      'Consistent earnings beats and raised guidance for next quarters',
    ],
    bearPoints: [
      'Valuation concerns with P/E ratio significantly above industry average',
      'Increasing competition from AMD and custom AI chips from cloud providers',
      'Potential slowdown in enterprise AI spending amid economic uncertainty',
      'Heavy reliance on few large customers for data center revenue',
    ],
  },
  TSLA: {
    bullPercentage: 65,
    bullPoints: [
      'Q4 delivery numbers exceeded analyst expectations',
      'Cybertruck production ramping up with strong order backlog',
      'Energy storage business showing significant growth potential',
      'FSD technology improving with potential for licensing revenue',
    ],
    bearPoints: [
      'Increased competition in EV market from traditional automakers',
      'Margin compression due to multiple price cuts throughout the year',
      'Execution risk on multiple new product launches (Roadster, Semi)',
      'Regulatory challenges in key markets including China and Europe',
    ],
  },
};

export function BullBearThesis({ ticker }: BullBearThesisProps) {
  const thesis = thesisData[ticker] || {
    bullPercentage: 50,
    bullPoints: [
      'Strong revenue growth and market position',
      'Innovative product pipeline',
    ],
    bearPoints: [
      'Market volatility and economic headwinds',
      'Competitive pressures increasing',
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Sentiment: Bull vs Bear</CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="text-emerald-600">Bull {thesis.bullPercentage}%</span>
              <span className="text-red-600">Bear {100 - thesis.bullPercentage}%</span>
            </div>
            <Progress value={thesis.bullPercentage} className="h-3" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-slate-900">Bull Thesis</h3>
            </div>
            <ul className="space-y-3">
              {thesis.bullPoints.map((point: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span className="text-slate-700 flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="text-slate-900">Bear Thesis</h3>
            </div>
            <ul className="space-y-3">
              {thesis.bearPoints.map((point: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-slate-700 flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
