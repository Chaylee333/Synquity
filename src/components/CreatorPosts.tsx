import { FileText, ThumbsUp, MessageSquare, TrendingUp, TrendingDown, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';

interface CreatorPostsProps {
  creatorId: string;
  onTickerClick: (ticker: string) => void;
  onPostClick: (postId: number) => void;
  newPosts?: Array<any>;
  isOwnProfile?: boolean;
}

const postsData: Record<string, any[]> = {
  'tech-investor-42': [
    {
      id: 1,
      title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
      ticker: 'NVDA',
      author: 'TechInvestor42',
      avatar: 'TI',
      verified: true,
      timestamp: '2h ago',
      summary: 'Comprehensive analysis of NVIDIA\'s AI chip ecosystem moat, data center revenue trajectory, and competitive positioning against AMD and Intel.',
      likes: 892,
      comments: 156,
      sentiment: 'bullish',
      stockPerformance: 8.5,
    },
    {
      id: 2,
      title: 'AMD vs INTC: Chip Wars Continue - My Analysis',
      ticker: 'AMD',
      author: 'TechInvestor42',
      avatar: 'TI',
      verified: true,
      timestamp: '1d ago',
      summary: 'Looking at the competitive dynamics in the CPU market - AMD continues to gain server market share while Intel struggles with manufacturing challenges.',
      likes: 445,
      comments: 89,
      sentiment: 'bullish',
      stockPerformance: -1.2,
    },
    {
      id: 3,
      title: 'Why I\'m Bullish on AAPL Services Revenue',
      ticker: 'AAPL',
      author: 'TechInvestor42',
      avatar: 'TI',
      verified: true,
      timestamp: '3d ago',
      summary: 'Everyone focuses on iPhone sales, but the services segment is the real story - this is a $100B annual run-rate business with 70%+ margins.',
      likes: 623,
      comments: 112,
      sentiment: 'bullish',
      stockPerformance: 2.3,
    },
    {
      id: 4,
      title: 'GOOGL: Undervalued AI Play Hidden in Plain Sight',
      ticker: 'GOOGL',
      author: 'TechInvestor42',
      avatar: 'TI',
      verified: true,
      timestamp: '5d ago',
      summary: 'While everyone chases NVDA, Google has been quietly building the most comprehensive AI ecosystem - DeepMind, Gemini, TPUs are game changers.',
      likes: 734,
      comments: 145,
      sentiment: 'bullish',
      stockPerformance: 3.7,
    },
  ],
  'wall-street-oracle': [
    {
      id: 5,
      title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
      ticker: 'NVDA',
      author: 'WallStreetOracle',
      avatar: 'WO',
      verified: true,
      timestamp: '5h ago',
      summary: 'Most investors focus on the hardware, but CUDA is the real moat - 76% of ML engineers prefer it over alternatives, creating insurmountable switching costs.',
      likes: 654,
      comments: 98,
      sentiment: 'bullish',
      stockPerformance: 6.8,
    },
    {
      id: 6,
      title: 'SPY Options Strategy for This Week\'s Fed Decision',
      ticker: 'SPY',
      author: 'WallStreetOracle',
      avatar: 'WO',
      verified: true,
      timestamp: '12h ago',
      summary: 'Here\'s my iron condor setup for the FOMC meeting - risk management is key with implied volatility this high, targeting 15% ROI.',
      likes: 512,
      comments: 76,
      sentiment: 'neutral',
      stockPerformance: 0.5,
    },
    {
      id: 7,
      title: 'TSLA Earnings Play - My Position and Risk Analysis',
      ticker: 'TSLA',
      author: 'WallStreetOracle',
      avatar: 'WO',
      verified: true,
      timestamp: '2d ago',
      summary: 'Setting up a pre-earnings strangle on TSLA with defined risk parameters - here\'s my thesis, strike selection, and max loss scenarios.',
      likes: 423,
      comments: 67,
      sentiment: 'neutral',
      stockPerformance: 3.2,
    },
  ],
  'green-portfolio': [
    {
      id: 8,
      title: 'TSLA: The Energy Company Disguised as a Car Maker',
      ticker: 'TSLA',
      author: 'GreenPortfolio',
      avatar: 'GP',
      verified: false,
      timestamp: '3h ago',
      summary: 'Energy storage business growing 100%+ YoY while everyone focuses on vehicle deliveries - this is the hidden catalyst for 2025.',
      likes: 567,
      comments: 134,
      sentiment: 'bullish',
      stockPerformance: 3.2,
    },
    {
      id: 9,
      title: 'Why I\'m Bullish on Renewable Energy Stocks in 2025',
      ticker: 'ENPH',
      author: 'GreenPortfolio',
      avatar: 'GP',
      verified: false,
      timestamp: '1d ago',
      summary: 'With new government incentives and falling costs, solar companies like ENPH are positioned for massive growth - full DD on market dynamics.',
      likes: 389,
      comments: 78,
      sentiment: 'bullish',
      stockPerformance: 5.1,
    },
    {
      id: 10,
      title: 'NEE: The Dividend King of Clean Energy',
      ticker: 'NEE',
      author: 'GreenPortfolio',
      avatar: 'GP',
      verified: false,
      timestamp: '4d ago',
      summary: 'NextEra Energy combines growth and dividends - my analysis shows why this is the perfect core holding for long-term portfolios.',
      likes: 298,
      comments: 45,
      sentiment: 'bullish',
      stockPerformance: 1.8,
    },
  ],
};

export function CreatorPosts({ creatorId, onTickerClick, onPostClick, newPosts = [], isOwnProfile }: CreatorPostsProps) {
  const [selectedTicker, setSelectedTicker] = useState<string>('All');
  const existingPosts = postsData[creatorId] || [];
  const posts = [...newPosts, ...existingPosts];

  // Get unique tickers sorted by total likes
  const tickerLikes = posts.reduce((acc, post) => {
    acc[post.ticker] = (acc[post.ticker] || 0) + post.likes;
    return acc;
  }, {} as Record<string, number>);

  const uniqueTickers = Object.entries(tickerLikes)
    .sort(([, a], [, b]) => b - a)
    .map(([ticker]) => ticker);

  // Filter posts by selected ticker
  const filteredPosts = selectedTicker === 'All' 
    ? posts 
    : posts.filter(post => post.ticker === selectedTicker);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Posts & Analysis
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedTicker === 'All' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTicker('All')}
            >
              All
            </Button>
            {uniqueTickers.map((ticker) => (
              <Button
                key={ticker}
                variant={selectedTicker === ticker ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTicker(ticker)}
              >
                {ticker}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onPostClick(post.id)}
              >
                {/* Author Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{post.author}</span>
                      {post.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 cursor-pointer"
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
                    <span className="text-slate-500 text-sm">{post.timestamp}</span>
                  </div>
                </div>

                {/* Title and Summary */}
                <h3 className="text-slate-900 mb-2">{post.title}</h3>
                <p className="text-slate-600 mb-3">{post.summary}</p>

                {/* Stock Performance Since Post */}
                <div className="mb-3 p-2 bg-slate-50 rounded flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Stock performance since post:</span>
                  <div className={`flex items-center gap-1 ${
                    post.stockPerformance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {post.stockPerformance >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{post.stockPerformance >= 0 ? '+' : ''}{post.stockPerformance}%</span>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center gap-4 text-slate-500">
                  <span>👍 {post.likes} likes</span>
                  <span>💬 {post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No posts available for {selectedTicker === 'All' ? 'this creator' : selectedTicker}.
          </div>
        )}
      </CardContent>
    </Card>
  );
}