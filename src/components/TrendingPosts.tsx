import { Flame, ThumbsUp, MessageSquare, BadgeCheck, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef, useState, useEffect } from 'react';
import { fetchPosts } from '../lib/api';

interface TrendingPostsProps {
  onPostClick: (postId: number) => void;
  onTickerClick: (ticker: string) => void;
}

interface TrendingPost {
  id: number;
  title: string;
  ticker: string;
  author: string;
  authorAvatar?: string;
  avatar: string;
  verified: boolean;
  upvotes: number;
  comments: number;
  timestamp: string;
  summary: string;
  sentiment: string;
  stockPerformance: number;
  rankingScore: number;
}

// Fallback mock data in case API returns no posts
const fallbackPosts: TrendingPost[] = [
  {
    id: 1,
    title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
    ticker: 'NVDA',
    author: 'TechInvestor42',
    avatar: 'TI',
    verified: true,
    upvotes: 892,
    comments: 124,
    timestamp: '2h ago',
    summary: 'Comprehensive analysis of NVIDIA\'s AI chip ecosystem moat, data center revenue trajectory, and competitive positioning against AMD and Intel.',
    sentiment: 'bullish',
    stockPerformance: 8.5,
    rankingScore: 15.2,
  },
  {
    id: 8,
    title: 'TSLA: The Energy Company Disguised as a Car Maker',
    ticker: 'TSLA',
    author: 'GreenPortfolio',
    avatar: 'GP',
    verified: false,
    upvotes: 567,
    comments: 89,
    timestamp: '3h ago',
    summary: 'Energy storage business growing 100%+ YoY while everyone focuses on vehicle deliveries - this is the hidden catalyst for 2025.',
    sentiment: 'bullish',
    stockPerformance: 3.2,
    rankingScore: 12.8,
  },
  {
    id: 2,
    title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
    ticker: 'NVDA',
    author: 'WallStreetOracle',
    avatar: 'WO',
    verified: true,
    upvotes: 654,
    comments: 76,
    timestamp: '5h ago',
    summary: 'Most investors focus on the hardware, but CUDA is the real moat - 76% of ML engineers prefer it over alternatives.',
    sentiment: 'bullish',
    stockPerformance: 6.8,
    rankingScore: 11.5,
  },
  {
    id: 3,
    title: 'Apple\'s Services Revenue: The Underappreciated Growth Driver',
    ticker: 'AAPL',
    author: 'DividendKing',
    avatar: 'DK',
    verified: true,
    upvotes: 423,
    comments: 52,
    timestamp: '6h ago',
    summary: 'Services now represent 22% of total revenue with 70%+ margins - this is a $100B annual run-rate business that most analysts undervalue.',
    sentiment: 'bullish',
    stockPerformance: 1.8,
    rankingScore: 9.2,
  },
  {
    id: 4,
    title: 'AMD vs NVDA: A Data Center Showdown',
    ticker: 'AMD',
    author: 'ChipCollector',
    avatar: 'CC',
    verified: false,
    upvotes: 389,
    comments: 67,
    timestamp: '8h ago',
    summary: 'MI300 benchmarks are impressive with 40% better performance per watt, but is it enough to challenge NVIDIA\'s ecosystem?',
    sentiment: 'neutral',
    stockPerformance: -1.5,
    rankingScore: 7.8,
  },
  {
    id: 5,
    title: 'Microsoft\'s AI Capex: $50B Investment Thesis',
    ticker: 'MSFT',
    author: 'MarketWatch2025',
    avatar: 'MW',
    verified: true,
    upvotes: 512,
    comments: 94,
    timestamp: '10h ago',
    summary: 'Azure AI is seeing explosive 100%+ growth and Microsoft is investing $50B in infrastructure - here\'s why it\'s justified.',
    sentiment: 'bullish',
    stockPerformance: 4.3,
    rankingScore: 6.5,
  },
];

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
}

export function TrendingPosts({ onPostClick, onTickerClick }: TrendingPostsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrendingPosts() {
      try {
        setLoading(true);
        // Fetch posts sorted by ranking_score (OracleRank algorithm)
        const apiPosts = await fetchPosts({ sortBy: 'ranking', limit: 20 });
        
        if (apiPosts && apiPosts.length > 0) {
          // Transform API data to component format
          const transformedPosts: TrendingPost[] = apiPosts.map((post: any) => ({
            id: post.id,
            title: post.title,
            ticker: post.ticker || 'N/A',
            author: post.profiles?.username || post.profiles?.full_name || 'Anonymous',
            authorAvatar: post.profiles?.avatar_url || '',
            avatar: post.profiles?.username?.substring(0, 2).toUpperCase() || 'AN',
            verified: post.profiles?.is_verified || false,
            upvotes: post.post_likes?.[0]?.count || 0,
            comments: post.comments?.[0]?.count || 0,
            timestamp: formatTimeAgo(post.created_at),
            summary: post.content?.substring(0, 200) + '...' || '',
            sentiment: post.sentiment || 'neutral',
            stockPerformance: post.post_performance_tracking?.[0]?.performance_percent || 
                              (post.performance_outcome ? post.performance_outcome * 100 : 0),
            rankingScore: post.ranking_score || 0,
          }));
          
          setPosts(transformedPosts);
        } else {
          // Use fallback mock data if no posts from API
          setPosts(fallbackPosts);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        // Use fallback mock data on error
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingPosts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          Trending Posts
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            🔮 Ranked by Oracle
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500">Loading trending posts...</span>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="flex-shrink-0 w-80 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all bg-white"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTickerClick(post.ticker);
                      }}
                    >
                      ${post.ticker}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={
                        post.sentiment === 'bullish'
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          : post.sentiment === 'bearish'
                          ? 'border-red-200 text-red-700 bg-red-50'
                          : 'border-slate-200 text-slate-700'
                      }
                    >
                      {post.sentiment}
                    </Badge>
                    {post.rankingScore > 0 && (
                      <Badge 
                        variant="outline"
                        className="border-purple-200 text-purple-700 bg-purple-50 text-xs"
                      >
                        🔮 {post.rankingScore.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 mb-3 line-clamp-2">
                    {post.summary}
                  </p>

                  {/* Stock Performance Since Post */}
                  <div className="mb-3 p-2 bg-slate-50 rounded flex items-center justify-between">
                    <span className="text-slate-600 text-sm">Since posted:</span>
                    <div className={`flex items-center gap-1 ${
                      post.stockPerformance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {post.stockPerformance >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{post.stockPerformance >= 0 ? '+' : ''}{post.stockPerformance.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback className="text-xs bg-emerald-500 text-white">
                        {post.author?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-700">{post.author}</span>
                    {post.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-sm">{post.timestamp}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
