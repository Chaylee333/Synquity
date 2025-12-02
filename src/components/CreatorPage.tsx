import { ArrowLeft, BadgeCheck, Loader2, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { CreatorPnL } from './CreatorPnL';
import { CreatorPosts } from './CreatorPosts';
import { useState, useEffect } from 'react';
import { followUser, unfollowUser, checkIfFollowing, fetchCreatorProfile } from '../lib/api';
import { toast } from 'sonner';

// Helper to check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

interface CreatorPageProps {
  creatorId: string;
  onNavigateHome: () => void;
  onTickerClick: (ticker: string) => void;
  onPostClick: (postId: number) => void;
  isLoggedIn?: boolean;
  currentUserId?: string;
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
    pnlAnnualized: 41.2,
    pnlSinceJoining: 158.6,
    sharpeRatio: 2.2,
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
    pnlAnnualized: 38.2,
    pnlSinceJoining: 142.8,
    sharpeRatio: 2.6,
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
    pnlAnnualized: 28.3,
    pnlSinceJoining: 72.5,
    sharpeRatio: 1.8,
  },
};

export function CreatorPage({ 
  creatorId, 
  onNavigateHome, 
  onTickerClick, 
  onPostClick,
  isLoggedIn = false,
  currentUserId = ''
}: CreatorPageProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [creatorUUID, setCreatorUUID] = useState<string | null>(null);
  const [dbCreator, setDbCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch creator from database if creatorId is a UUID
  useEffect(() => {
    async function loadCreator() {
      setIsLoading(true);
      
      if (isValidUUID(creatorId)) {
        // It's a UUID, fetch from database
        try {
          const profile = await fetchCreatorProfile(creatorId);
          if (profile) {
            setDbCreator(profile);
            setCreatorUUID(creatorId);
          }
        } catch (error) {
          console.error('Error fetching creator profile:', error);
        }
      } else {
        // It's a slug, use mock data
        setCreatorUUID(null);
      }
      
      setIsLoading(false);
    }
    loadCreator();
  }, [creatorId]);

  // Use database creator if available, otherwise fall back to mock data
  const mockCreator = creatorData[creatorId] || {
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
    pnlAnnualized: 0,
    pnlSinceJoining: 0,
    sharpeRatio: 0,
  };

  const creator = dbCreator ? {
    username: dbCreator.username || dbCreator.full_name || 'Unknown User',
    avatar: dbCreator.avatar_url || '',
    avatar_url: dbCreator.avatar_url,
    verified: dbCreator.is_verified || false,
    bio: dbCreator.bio || 'Stock market enthusiast',
    followers: dbCreator.follower_count || 0,
    following: dbCreator.following_count || 0,
    posts: dbCreator.post_count || 0,
    joinedDate: dbCreator.created_at ? `Joined ${new Date(dbCreator.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 'Recently joined',
    brokeragePnL: 0,
    brokerageReturn: 0,
    mockPnL: dbCreator.performance_metrics?.pnl_absolute_dollars || 0,
    mockReturn: dbCreator.performance_metrics?.pnl_annualized_percent || 0,
    pnlAnnualized: dbCreator.performance_metrics?.pnl_annualized_percent || 0,
    pnlSinceJoining: dbCreator.performance_metrics?.pnl_since_joining_percent || 0,
    sharpeRatio: dbCreator.performance_metrics?.sharpe_ratio || 0,
  } : mockCreator;

  const [followerCount, setFollowerCount] = useState(creator.followers);
  const isOwnProfile = isLoggedIn && (currentUserId === creatorId || currentUserId === creatorUUID);

  // Update follower count when creator changes
  useEffect(() => {
    setFollowerCount(creator.followers);
  }, [creator.followers]);

  // Check if current user is following this creator
  useEffect(() => {
    async function checkFollowStatus() {
      // Only check if we have a valid UUID and user is logged in
      if (isLoggedIn && !isOwnProfile && creatorUUID) {
        try {
          const following = await checkIfFollowing(creatorUUID);
          setIsFollowing(following);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    }
    checkFollowStatus();
  }, [isLoggedIn, creatorUUID, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to follow creators');
      return;
    }

    // Need a valid UUID to follow
    if (!creatorUUID) {
      toast.error('Cannot follow this creator (demo profile)');
      return;
    }

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(creatorUUID);
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        toast.success(`Unfollowed ${creator.username}`);
      } else {
        await followUser(creatorUUID);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast.success(`Now following ${creator.username}`);
      }
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      toast.error(error.message || 'Failed to update follow status');
    } finally {
      setIsFollowLoading(false);
    }
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
                <AvatarImage src={creator.avatar_url} />
                <AvatarFallback className="text-2xl bg-emerald-500 text-white">
                  {creator.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
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
                    <span className="text-slate-900">{followerCount.toLocaleString()}</span> followers
                  </div>
                  <div>
                    <span className="text-slate-900">{creator.following}</span> following
                  </div>
                  <div className="ml-auto text-slate-500">
                    {creator.joinedDate}
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "gap-2" : ""}
                    >
                      {isFollowLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        'Follow'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PnL Dashboard */}
          <CreatorPnL 
            mockPnL={creator.mockPnL}
            mockReturn={creator.mockReturn}
            pnlAnnualized={creator.pnlAnnualized}
            pnlSinceJoining={creator.pnlSinceJoining}
            sharpeRatio={creator.sharpeRatio}
          />

          {/* Posts */}
          <CreatorPosts 
            creatorId={creatorId}
            onTickerClick={onTickerClick}
            onPostClick={onPostClick}
            newPosts={[]}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </>
  );
}
