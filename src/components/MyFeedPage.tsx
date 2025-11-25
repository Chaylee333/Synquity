import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BadgeCheck, MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { ForumHeader } from './ForumHeader';
import { useAuth } from '../contexts/AuthContext';
import { createPost, fetchUserPosts, fetchUserComments, fetchUserPerformanceMetrics } from '../lib/api';
import { toast } from 'sonner';

interface MyFeedPageProps {
  onNavigateHome: () => void;
  onTickerClick: (ticker: string) => void;
  onPostClick: (postId: number) => void;
  onCreatorClick: (creatorId: string) => void;
  onTrendingClick?: () => void;
  onCreatorsClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

export function MyFeedPage({
  onNavigateHome,
  onTickerClick,
  onPostClick,
  onCreatorClick,
  onTrendingClick,
  onCreatorsClick,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onSettingsClick
}: MyFeedPageProps) {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Post creation state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [ticker, setTicker] = useState('');
  const [category, setCategory] = useState('DD');
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [market, setMarket] = useState('Equities');
  const [timeHorizon, setTimeHorizon] = useState('Medium');
  const [riskProfile, setRiskProfile] = useState('Moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [posts, comments, metrics] = await Promise.all([
        fetchUserPosts(user!.id),
        fetchUserComments(user!.id),
        fetchUserPerformanceMetrics(user!.id)
      ]);
      setUserPosts(posts);
      setPostsCount(posts.length);
      setCommentsCount(comments.length);
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your feed data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !ticker) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        title,
        content,
        ticker: ticker.toUpperCase(),
        category,
        sentiment,
        market,
        time_horizon: timeHorizon,
        risk_profile: riskProfile,
      });

      // Reset form
      setTitle('');
      setContent('');
      setTicker('');
      setCategory('DD');
      setSentiment('neutral');
      setMarket('Equities');
      setTimeHorizon('Medium');
      setRiskProfile('Moderate');

      toast.success('Post created successfully!');
      await loadUserData(); // Reload posts
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Navigation */}
      <ForumHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onDiscoverClick={onNavigateHome}
        onTrendingClick={onTrendingClick}
        onCreatorsClick={onCreatorsClick}
        onMyFeedClick={() => { }} // Already on My Feed
        currentPage="myfeed"
      />

      <div className="container mx-auto px-4 py-8 pb-20 max-w-5xl">
        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback className="text-2xl bg-emerald-500 text-white">
                    {user.user_metadata.full_name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {user.user_metadata.full_name}
                  </h1>
                  <p className="text-slate-500 font-medium">@{user.user_metadata.username}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-slate-600 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{postsCount}</div>
                      <div>Posts</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{commentsCount}</div>
                      <div>Comments</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Sidebar - Quick Stats */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">Total Posts</span>
                      <span className="font-semibold text-slate-900">{postsCount}</span>
                    </div>
                    <Separator />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">Total Comments</span>
                      <span className="font-semibold text-slate-900">{commentsCount}</span>
                    </div>
                    <Separator />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600">Member Since</span>
                      <span className="font-semibold text-slate-900 text-sm">{joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              {performanceMetrics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceMetrics.specialty && (
                      <div>
                        <div className="text-slate-500 text-sm mb-1">Specialty</div>
                        <div className="font-semibold text-slate-900">{performanceMetrics.specialty}</div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div>
                      <div className="text-slate-500 text-sm mb-1">P&L % (Annualized)</div>
                      <div className={`font-bold text-lg flex items-center gap-1 ${
                        performanceMetrics.pnl_annualized_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {performanceMetrics.pnl_annualized_percent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {performanceMetrics.pnl_annualized_percent >= 0 ? '+' : ''}{performanceMetrics.pnl_annualized_percent.toFixed(1)}%
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="text-slate-500 text-sm mb-1">P&L % Since Joining</div>
                      <div className={`font-bold text-lg flex items-center gap-1 ${
                        performanceMetrics.pnl_since_joining_percent >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {performanceMetrics.pnl_since_joining_percent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {performanceMetrics.pnl_since_joining_percent >= 0 ? '+' : ''}{performanceMetrics.pnl_since_joining_percent.toFixed(1)}%
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="text-slate-500 text-sm mb-1">Sharpe Ratio</div>
                      <div className="font-bold text-slate-900 text-lg">
                        {performanceMetrics.sharpe_ratio.toFixed(2)}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="text-slate-500 text-sm mb-1">Average Drawdown %</div>
                      <div className="font-bold text-red-600 text-lg">
                        {performanceMetrics.avg_drawdown_percent.toFixed(1)}%
                      </div>
                    </div>

                    {performanceMetrics.credibility_score && (
                      <>
                        <Separator />
                        <div>
                          <div className="text-slate-500 text-sm mb-1">Credibility Score</div>
                          <div className="font-bold text-blue-600 text-lg">
                            {performanceMetrics.credibility_score}/100
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Post Creation Box */}
              <Card>
                <CardHeader>
                  <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPost} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticker">Stock Ticker *</Label>
                      <Input
                        id="ticker"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="e.g., AAPL, TSLA, NVDA"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your analysis, insights, or news..."
                        required
                        className="w-full min-h-[150px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD">Due Diligence</SelectItem>
                            <SelectItem value="News">News</SelectItem>
                            <SelectItem value="Discussion">Discussion</SelectItem>
                            <SelectItem value="Question">Question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="sentiment">Sentiment</Label>
                        <Select value={sentiment} onValueChange={(v: any) => setSentiment(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bullish">🐂 Bullish</SelectItem>
                            <SelectItem value="bearish">🐻 Bearish</SelectItem>
                            <SelectItem value="neutral">⚖️ Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="market">Market</Label>
                        <Select value={market} onValueChange={setMarket}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Equities">Equities</SelectItem>
                            <SelectItem value="Crypto">Crypto</SelectItem>
                            <SelectItem value="Commodities">Commodities</SelectItem>
                            <SelectItem value="FX">FX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="timeHorizon">Time Horizon</Label>
                        <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Short">Short</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Long">Long</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="riskProfile">Risk Profile</Label>
                        <Select value={riskProfile} onValueChange={setRiskProfile}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* User's Posts Feed */}
              <Card>
                <CardHeader>
                  <CardTitle>My Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-500">
                      Loading your posts...
                    </div>
                  ) : userPosts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      You haven't created any posts yet. Create your first post above!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                          onClick={() => onPostClick(post.id)}
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-emerald-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onTickerClick(post.ticker);
                                }}
                              >
                                ${post.ticker}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={
                                  post.sentiment === 'bullish'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : post.sentiment === 'bearish'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-slate-100 text-slate-700'
                                }
                              >
                                {post.sentiment === 'bullish' && '🐂'}
                                {post.sentiment === 'bearish' && '🐻'}
                                {post.sentiment === 'neutral' && '⚖️'}
                                {' '}{post.sentiment}
                              </Badge>
                              <span className="text-slate-500 text-sm">
                                {formatTimeAgo(post.created_at)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-slate-900 font-semibold mb-2 hover:text-emerald-600">
                            {post.title}
                          </h3>

                          <p className="text-slate-600 mb-3 line-clamp-2">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {post.like_count || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.comment_count || 0}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

