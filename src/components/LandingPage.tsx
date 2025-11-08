import { TrendingUp } from 'lucide-react';
import { TickerRankings } from './TickerRankings';
import { CreatorRankings } from './CreatorRankings';

interface LandingPageProps {
  onTickerClick: (ticker: string) => void;
  onCreatorClick: (creatorId: string) => void;
}

export function LandingPage({ onTickerClick, onCreatorClick }: LandingPageProps) {
  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <h1 className="text-slate-900">StockTalk Forum</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-slate-900 mb-2">Trending Today</h2>
          <p className="text-slate-600">
            Discover the most discussed stocks and top content creators
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TickerRankings onTickerClick={onTickerClick} />
          <CreatorRankings onCreatorClick={onCreatorClick} />
        </div>
      </div>
    </>
  );
}
