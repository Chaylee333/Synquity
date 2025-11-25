import { TrendingUp } from 'lucide-react';
import { TickerRankings } from './TickerRankings';
import { CreatorRankings } from './CreatorRankings';
import { TrendingPosts } from './TrendingPosts';
import { Button } from './ui/button';
import { ForumHeader } from './ForumHeader';
import { useState } from 'react';

interface TrendingPageProps {
  onTickerClick: (ticker: string) => void;
  onCreatorClick: (creatorId: string) => void;
  onPostClick: (postId: number) => void;
  onNavigateHome: () => void;
  onBrowseClick?: () => void;
  onCreatorsClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onMyFeedClick: () => void;
}

export function TrendingPage({
  onTickerClick,
  onCreatorClick,
  onPostClick,
  onNavigateHome,
  onBrowseClick,
  onCreatorsClick,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onSettingsClick,
  onMyFeedClick
}: TrendingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <ForumHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onDiscoverClick={onNavigateHome}
        onTrendingClick={() => { }} // Already on trending
        onCreatorsClick={onCreatorsClick}
        onMyFeedClick={onMyFeedClick}
        currentPage="trending"
      />

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