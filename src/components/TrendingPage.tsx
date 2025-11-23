import { TrendingUp } from 'lucide-react';
import { TickerRankings } from './TickerRankings';
import { CreatorRankings } from './CreatorRankings';
import { TrendingPosts } from './TrendingPosts';
import { Button } from './ui/button';

interface TrendingPageProps {
  onTickerClick: (ticker: string) => void;
  onCreatorClick: (creatorId: string) => void;
  onPostClick: (postId: number) => void;
  onNavigateHome: () => void;
  onBrowseClick: () => void;
  onCreatorsClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function TrendingPage({ 
  onTickerClick, 
  onCreatorClick, 
  onPostClick, 
  onNavigateHome,
  onBrowseClick, 
  onCreatorsClick, 
  onLoginClick, 
  onSignupClick 
}: TrendingPageProps) {
  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h1 className="text-slate-900">StockTalk Forum</h1>
            </div>

            {/* Center Navigation */}
            <nav className="flex items-center gap-2">
              <Button variant="ghost" onClick={onNavigateHome}>Discover</Button>
              <Button variant="default">Trending</Button>
              <Button variant="ghost" onClick={onCreatorsClick}>Creators</Button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onLoginClick}>Log In / Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-slate-900 mb-2">Trending Now</h2>
          <p className="text-slate-600">
            Real-time trending posts, tickers, and top content creators
          </p>
        </div>

        {/* Rankings - Stacked Vertically */}
        <div className="space-y-6">
          <TrendingPosts onPostClick={onPostClick} onTickerClick={onTickerClick} />
          <TickerRankings onTickerClick={onTickerClick} />
          <CreatorRankings onCreatorClick={onCreatorClick} />
        </div>
      </div>
    </>
  );
}