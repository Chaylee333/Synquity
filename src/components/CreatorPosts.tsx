import { FileText, ThumbsUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CreatorPostsProps {
  creatorId: string;
  onTickerClick: (ticker: string) => void;
  onPostClick: (postId: number) => void;
}

const postsData: Record<string, any[]> = {
  'tech-investor-42': [
    {
      id: 1,
      title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
      ticker: 'NVDA',
      timestamp: '2 hours ago',
      preview: 'I\'ve spent the last month analyzing NVIDIA\'s position in the AI market. Here\'s why I believe they\'re uniquely positioned to capture the majority of AI infrastructure spending...',
      upvotes: 892,
      comments: 156,
      category: 'DD',
    },
    {
      id: 2,
      title: 'AMD vs INTC: Chip Wars Continue - My Analysis',
      ticker: 'AMD',
      timestamp: '1 day ago',
      preview: 'Looking at the competitive dynamics in the CPU market. AMD continues to gain server market share while Intel struggles with manufacturing challenges...',
      upvotes: 445,
      comments: 89,
      category: 'Analysis',
    },
    {
      id: 3,
      title: 'Why I\'m Bullish on AAPL Services Revenue',
      ticker: 'AAPL',
      timestamp: '3 days ago',
      preview: 'Everyone focuses on iPhone sales, but the services segment is the real story. Here\'s my breakdown of why this could drive AAPL to new highs...',
      upvotes: 623,
      comments: 112,
      category: 'DD',
    },
    {
      id: 4,
      title: 'GOOGL: Undervalued AI Play Hidden in Plain Sight',
      ticker: 'GOOGL',
      timestamp: '5 days ago',
      preview: 'While everyone chases NVDA, Google has been quietly building the most comprehensive AI ecosystem. DeepMind, Gemini, TPUs - here\'s the full picture...',
      upvotes: 734,
      comments: 145,
      category: 'DD',
    },
  ],
  'wall-street-oracle': [
    {
      id: 5,
      title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
      ticker: 'NVDA',
      timestamp: '5 hours ago',
      preview: 'Most investors focus on the hardware, but CUDA is the real moat. Let me break down why switching costs are insurmountable for enterprise customers...',
      upvotes: 654,
      comments: 98,
      category: 'DD',
    },
    {
      id: 6,
      title: 'SPY Options Strategy for This Week\'s Fed Decision',
      ticker: 'SPY',
      timestamp: '12 hours ago',
      preview: 'Here\'s my iron condor setup for the FOMC meeting. Risk management is key with implied volatility this high...',
      upvotes: 512,
      comments: 76,
      category: 'Strategy',
    },
    {
      id: 7,
      title: 'TSLA Earnings Play - My Position and Risk Analysis',
      ticker: 'TSLA',
      timestamp: '2 days ago',
      preview: 'Setting up a pre-earnings strangle on TSLA. Here\'s my thesis, strike selection, and defined risk parameters...',
      upvotes: 423,
      comments: 67,
      category: 'Options',
    },
  ],
  'green-portfolio': [
    {
      id: 8,
      title: 'TSLA: The Energy Company Disguised as a Car Maker',
      ticker: 'TSLA',
      timestamp: '3 hours ago',
      preview: 'Everyone focuses on vehicle deliveries, but the energy storage business is growing 100%+ YoY with better margins. This could be a $50B business...',
      upvotes: 567,
      comments: 134,
      category: 'DD',
    },
    {
      id: 9,
      title: 'Why I\'m Bullish on Renewable Energy Stocks in 2025',
      ticker: 'ENPH',
      timestamp: '1 day ago',
      preview: 'With new government incentives and falling costs, solar companies like ENPH are positioned for massive growth. Here\'s my full DD...',
      upvotes: 389,
      comments: 78,
      category: 'DD',
    },
    {
      id: 10,
      title: 'NEE: The Dividend King of Clean Energy',
      ticker: 'NEE',
      timestamp: '4 days ago',
      preview: 'NextEra Energy combines growth and dividends. My analysis shows why this is the perfect core holding for long-term portfolios...',
      upvotes: 298,
      comments: 45,
      category: 'Analysis',
    },
  ],
};

export function CreatorPosts({ creatorId, onTickerClick, onPostClick }: CreatorPostsProps) {
  const posts = postsData[creatorId] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-600" />
          Posts & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onPostClick(post.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTickerClick(post.ticker);
                        }}
                      >
                        ${post.ticker}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>

                    <h3 className="text-slate-900 mb-2 hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {post.preview}
                    </p>

                    <div className="flex items-center gap-4 text-slate-500">
                      <span>{post.timestamp}</span>
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No posts available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}