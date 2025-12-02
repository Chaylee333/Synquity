import { Flame, ThumbsUp, MessageSquare, BadgeCheck, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Loader2, Sparkles } from 'lucide-react';
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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100/50">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg shadow-orange-500/20">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">Trending Posts</span>
          <Badge variant="gradient" className="ml-1 text-xs font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            Oracle Ranked
          </Badge>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('left')}
            className="h-9 w-9 p-0 rounded-xl border-orange-200 hover:bg-orange-100 hover:border-orange-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll('right')}
            className="h-9 w-9 p-0 rounded-xl border-orange-200 hover:bg-orange-100 hover:border-orange-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
              <span className="text-slate-500 font-medium">Loading trending posts...</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            >
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={() => onPostClick(post.id)}
                  className="flex-shrink-0 w-80 p-5 rounded-2xl border border-slate-200/60 bg-white cursor-pointer
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20
                    animate-slide-up opacity-0"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      variant="success"
                      className="px-3 py-1 font-semibold cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTickerClick(post.ticker);
                      }}
                    >
                      ${post.ticker}
                    </Badge>
                    <Badge 
                      variant={
                        post.sentiment === 'bullish' ? 'success' :
                        post.sentiment === 'bearish' ? 'destructive' : 'outline'
                      }
                      className="capitalize"
                    >
                      {post.sentiment}
                    </Badge>
                    {post.rankingScore > 0 && (
                      <Badge 
                        variant="gradient"
                        className="text-xs ml-auto"
                      >
                        🔮 {post.rankingScore.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-slate-900 font-semibold mb-3 line-clamp-2 min-h-[3rem] leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Stock Performance Since Post */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-500 text-sm font-medium">Since posted:</span>
                    <div className={`flex items-center gap-1.5 font-semibold ${
                      post.stockPerformance >= 0 ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      <div className={`p-1 rounded-lg ${
                        post.stockPerformance >= 0 ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {post.stockPerformance >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span>{post.stockPerformance >= 0 ? '+' : ''}{post.stockPerformance.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                      <AvatarImage src={post.authorAvatar} />
                      <AvatarFallback className="text-xs">
                        {post.author?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-700 font-medium text-sm">{post.author}</span>
                      {post.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-sm pt-3 border-t border-slate-100">
                    <span>{post.timestamp}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-medium">{post.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{post.comments}</span>
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
