import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CreatorPnL } from './CreatorPnL';
import { CreatorPosts } from './CreatorPosts';

interface CreatorPageProps {
  creatorId: string;
  onNavigateHome: () => void;
  onTickerClick: (ticker: string) => void;
  onPostClick: (postId: number) => void;
}

const creatorData: Record<string, any> = {
  'tech-investor-42': {
    username: 'TechInvestor42',
    avatar: 'TI',
    verified: true,
    bio: 'Tech-focused investor | AI & Semiconductors | Ex-FAANG Engineer | Sharing my DD and market analysis',
    followers: 15600,
    following: 234,
    posts: 342,
    joinedDate: 'Joined March 2023',
    brokeragePnL: 156780,
    brokerageReturn: 23.5,
    mockPnL: 89430,
    mockReturn: 18.2,
  },
  'wall-street-oracle': {
    username: 'WallStreetOracle',
    avatar: 'WO',
    verified: true,
    bio: 'Professional trader with 15+ years experience | Options strategies | Risk management | Not financial advice',
    followers: 22400,
    following: 89,
    posts: 256,
    joinedDate: 'Joined January 2023',
    brokeragePnL: 298450,
    brokerageReturn: 18.2,
    mockPnL: 145670,
    mockReturn: 12.8,
  },
  'green-portfolio': {
    username: 'GreenPortfolio',
    avatar: 'GP',
    verified: false,
    bio: 'Clean energy & ESG investing | Long-term growth | Building a sustainable portfolio for the future',
    followers: 8900,
    following: 456,
    posts: 234,
    joinedDate: 'Joined July 2023',
    brokeragePnL: 67890,
    brokerageReturn: 15.4,
    mockPnL: 34210,
    mockReturn: 11.6,
  },
};

export function CreatorPage({ creatorId, onNavigateHome, onTickerClick, onPostClick }: CreatorPageProps) {
  const creator = creatorData[creatorId] || {
    username: 'Unknown User',
    avatar: 'U',
    verified: false,
    bio: 'Stock market enthusiast',
    followers: 0,
    following: 0,
    posts: 0,
    joinedDate: 'Recently joined',
    brokeragePnL: 0,
    brokerageReturn: 0,
    mockPnL: 0,
    mockReturn: 0,
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl">{creator.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-slate-900">{creator.username}</h1>
                  {creator.verified && (
                    <BadgeCheck className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                <p className="text-slate-600 mb-4 max-w-2xl">
                  {creator.bio}
                </p>

                <div className="flex items-center gap-6 text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-900">{creator.posts}</span> posts
                  </div>
                  <div>
                    <span className="text-slate-900">{creator.followers.toLocaleString()}</span> followers
                  </div>
                  <div>
                    <span className="text-slate-900">{creator.following}</span> following
                  </div>
                  <div className="ml-auto text-slate-500">
                    {creator.joinedDate}
                  </div>
                </div>

                <Button>Follow</Button>
              </div>
            </div>
          </div>

          {/* PnL Dashboard */}
          <CreatorPnL 
            brokeragePnL={creator.brokeragePnL}
            brokerageReturn={creator.brokerageReturn}
            mockPnL={creator.mockPnL}
            mockReturn={creator.mockReturn}
          />

          {/* Posts */}
          <CreatorPosts 
            creatorId={creatorId}
            onTickerClick={onTickerClick}
            onPostClick={onPostClick}
          />
        </div>
      </div>
    </>
  );
}