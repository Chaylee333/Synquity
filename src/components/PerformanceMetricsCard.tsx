import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export interface PerformanceMetrics {
    specialty?: string;
    pnl_annualized_percent?: number;
    pnl_since_joining_percent?: number;
    sharpe_ratio?: number;
    avg_drawdown_percent?: number;
    credibility_score?: number;
    reputation_score?: number;
}

interface PerformanceMetricsCardProps {
    metrics: PerformanceMetrics;
    className?: string;
}

export function PerformanceMetricsCard({ metrics, className }: PerformanceMetricsCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {metrics.specialty && (
                    <div>
                        <div className="text-slate-500 text-sm mb-1">Specialty</div>
                        <div className="font-semibold text-slate-900">{metrics.specialty}</div>
                    </div>
                )}

                {metrics.pnl_annualized_percent !== undefined && (
                    <div>
                        <div className="text-slate-500 text-sm mb-1">P&L % (Annualized)</div>
                        <div className={`font-bold text-lg flex items-center gap-1 ${metrics.pnl_annualized_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            {metrics.pnl_annualized_percent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {metrics.pnl_annualized_percent >= 0 ? '+' : ''}{metrics.pnl_annualized_percent.toFixed(1)}%
                        </div>
                        <Separator className="mt-4" />
                    </div>
                )}

                {metrics.pnl_since_joining_percent !== undefined && (
                    <div>
                        <div className="text-slate-500 text-sm mb-1">P&L % Since Joining</div>
                        <div className={`font-bold text-lg flex items-center gap-1 ${metrics.pnl_since_joining_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            {metrics.pnl_since_joining_percent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {metrics.pnl_since_joining_percent >= 0 ? '+' : ''}{metrics.pnl_since_joining_percent.toFixed(1)}%
                        </div>
                        <Separator className="mt-4" />
                    </div>
                )}

                {metrics.sharpe_ratio !== undefined && (
                    <div>
                        <div className="text-slate-500 text-sm mb-1">Sharpe Ratio</div>
                        <div className="font-bold text-slate-900 text-lg">
                            {metrics.sharpe_ratio.toFixed(2)}
                        </div>
                        <Separator className="mt-4" />
                    </div>
                )}

                {metrics.avg_drawdown_percent !== undefined && (
                    <div>
                        <div className="text-slate-500 text-sm mb-1">Average Drawdown %</div>
                        <div className="font-bold text-red-600 text-lg">
                            {metrics.avg_drawdown_percent.toFixed(1)}%
                        </div>
                    </div>
                )}

                {metrics.reputation_score !== undefined && (
                    <>
                        <Separator />
                        <div>
                            <div className="text-slate-500 text-sm mb-1">Oracle Reputation Score</div>
                            <div className="font-bold text-purple-600 text-lg">
                                {(metrics.reputation_score * 100).toFixed(0)}
                            </div>
                        </div>
                    </>
                )}

                {metrics.credibility_score !== undefined && (
                    <>
                        <Separator />
                        <div>
                            <div className="text-slate-500 text-sm mb-1">Credibility Score</div>
                            <div className="font-bold text-blue-600 text-lg">
                                {metrics.credibility_score}/100
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
