```javascript
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, BadgeCheck, MessageCircle, ThumbsUp, Bold, Italic, List, Type, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Check, X } from 'lucide-react';
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
import { PerformanceMetricsCard } from './PerformanceMetricsCard';
import { useAuth } from '../contexts/AuthContext';
import { createPost, fetchUserPosts, fetchUserComments, fetchUserPerformanceMetrics, fetchUserFollowCounts, fetchCreatorProfile, searchTickers } from '../lib/api';
import { toast } from 'sonner';
import { RichTextEditor, RichTextEditorRef, htmlToMarkdown } from './ui/rich-text-editor';

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'ranking'>('ranking');
  const [tickerSuggestions, setTickerSuggestions] = useState<any[]>([]);
  const [showTickerSuggestions, setShowTickerSuggestions] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

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
  const editorRef = useRef<RichTextEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormat = (command: string, value?: string) => {
    editorRef.current?.execCommand(command, value);
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [posts, comments, metrics, followCounts, profile] = await Promise.all([
        fetchUserPosts(user!.id),
        fetchUserComments(user!.id),
        fetchUserPerformanceMetrics(user!.id),
        fetchUserFollowCounts(user!.id),
        fetchCreatorProfile(user!.id)
      ]);
      setUserPosts(posts);
      setPostsCount(posts.length);
      setCommentsCount(comments.length);
      setCommentsCount(comments.length);

      // Merge profile reputation into metrics
      const enhancedMetrics = {
        ...metrics,
        reputation_score: profile?.reputation_score
      };
      setPerformanceMetrics(enhancedMetrics);

      setFollowersCount(followCounts.followers);
      setFollowersCount(followCounts.followers);
      setFollowingCount(followCounts.following);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your feed data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Insert image using execCommand
      editorRef.current?.execCommand('insertImage', imageUrl);
      editorRef.current?.focus();
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert HTML content to Markdown
    const markdownContent = htmlToMarkdown(content);

    if (!title.trim() || !markdownContent.trim() || !ticker.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        content: markdownContent.trim(),
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
    if (seconds < 3600) return `${ Math.floor(seconds / 60) }m ago`;
    if (seconds < 86400) return `${ Math.floor(seconds / 3600) }h ago`;
    if (seconds < 604800) return `${ Math.floor(seconds / 86400) }d ago`;
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
                  {userProfile?.reputation_score !== undefined && (
                    <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-700 border-purple-200">
                      🔮 Reputation: {(userProfile.reputation_score * 100).toFixed(0)}
                    </Badge>
                  )}
                  <div className="flex flex-wrap gap-6 text-sm text-slate-600 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{postsCount}</div>
                      <div>Posts</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{commentsCount}</div>
                      <div>Comments</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{followersCount}</div>
                      <div>Followers</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-slate-900 text-lg font-bold">{followingCount}</div>
                      <div>Following</div>
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
                <PerformanceMetricsCard metrics={performanceMetrics} />
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

                    <div className="relative">
                      <Label htmlFor="ticker">Stock Ticker *</Label>
                      <Input
                        id="ticker"
                        value={ticker}
                        onChange={async (e) => {
                          const value = e.target.value.toUpperCase();
                          setTicker(value);

                          if (value.length > 0) {
                            const suggestions = await searchTickers(value, 5);
                            setTickerSuggestions(suggestions);
                            setShowTickerSuggestions(true);
                          } else {
                            setTickerSuggestions([]);
                            setShowTickerSuggestions(false);
                          }
                        }}
                        onBlur={() => {
                          // Delay hiding to allow click on suggestion
                          setTimeout(() => setShowTickerSuggestions(false), 200);
                        }}
                        onFocus={() => {
                          if (ticker.length > 0 && tickerSuggestions.length > 0) {
                            setShowTickerSuggestions(true);
                          }
                        }}
                        placeholder="e.g., AAPL, TSLA, NVDA"
                        required
                      />
                      {showTickerSuggestions && tickerSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {tickerSuggestions.map((suggestion) => (
                            <div
                              key={suggestion.ticker}
                              className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                              onClick={() => {
                                setTicker(suggestion.ticker);
                                setShowTickerSuggestions(false);
                              }}
                            >
                              <div className="font-semibold text-slate-900">{suggestion.ticker}</div>
                              <div className="text-sm text-slate-600">{suggestion.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="content" className="mb-2 block">Content *</Label>
                      <div className="border border-slate-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                        {/* Toolbar */}
                        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-1 flex-wrap">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={() => handleFormat('bold')}
                            title="Bold"
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={() => handleFormat('italic')}
                            title="Italic"
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                          <div className="w-px h-4 bg-slate-300 mx-1" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={() => handleFormat('formatBlock', '<h1>')}
                            title="Heading 1"
                          >
                            <Type className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={() => handleFormat('formatBlock', '<h2>')}
                            title="Heading 2"
                          >
                            <Type className="w-4 h-4 text-xs" />
                          </Button>
                          <div className="w-px h-4 bg-slate-300 mx-1" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={() => handleFormat('insertUnorderedList')}
                            title="Bullet List"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={`h - 8 w - 8 p - 0 hover: bg - slate - 200 text - slate - 600 ${ showLinkInput ? 'bg-slate-200' : '' } `}
                            onClick={() => {
                              if (showLinkInput) {
                                setShowLinkInput(false);
                                setLinkUrl('');
                              } else {
                                setShowLinkInput(true);
                              }
                            }}
                            title="Link"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          {showLinkInput && (
                            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-1 h-8 animate-in fade-in slide-in-from-left-2">
                              <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://"
                                className="h-6 w-40 text-sm px-1 outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (linkUrl) {
                                      handleFormat('createLink', linkUrl);
                                      setShowLinkInput(false);
                                      setLinkUrl('');
                                    }
                                  }
                                }}
                                autoFocus
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-slate-100 text-emerald-600"
                                onClick={() => {
                                  if (linkUrl) {
                                    handleFormat('createLink', linkUrl);
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                  }
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-slate-100 text-slate-400"
                                onClick={() => {
                                  setShowLinkInput(false);
                                  setLinkUrl('');
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-200 text-slate-600"
                            onClick={handleImageUpload}
                            title="Image"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Hidden file input for image uploads */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        <RichTextEditor
                          ref={editorRef}
                          value={content}
                          onChange={setContent}
                          placeholder="Share your analysis, insights, or news..."
                          className="w-full min-h-[300px] px-4 py-3 focus:outline-none resize-y bg-white text-slate-900 placeholder:text-slate-400 [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-slate-400"
                        />
                      </div>
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

                    <div className="grid grid-cols-2 gap-4">
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
                            <SelectItem value="Short">Short Term</SelectItem>
                            <SelectItem value="Medium">Medium Term</SelectItem>
                            <SelectItem value="Long">Long Term</SelectItem>
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Posts</CardTitle>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ranking">🔮 Oracle Rank</SelectItem>
                      <SelectItem value="latest">🕒 Latest</SelectItem>
                    </SelectContent>
                  </Select>
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

                          <div className="flex items-center gap-2 flex-wrap">
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
                            {post.market && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {post.market}
                              </Badge>
                            )}
                            {post.time_horizon && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {post.time_horizon === 'Short' ? 'Short Term' : post.time_horizon === 'Medium' ? 'Medium Term' : post.time_horizon === 'Long' ? 'Long Term' : post.time_horizon}
                              </Badge>
                            )}
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

