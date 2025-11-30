import { FileText, ThumbsUp, MessageSquare, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface TickerDDPostsProps {
  ticker: string;
  onCreatorClick: (creatorId: string) => void;
  onPostClick: (postId: number) => void;
}

const ddPostsData: Record<string, any[]> = {
  NVDA: [
    {
      id: 1,
      title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
      author: 'TechInvestor42',
      authorId: 'tech-investor-42',
      avatar: 'TI',
      verified: true,
      timestamp: '2 hours ago',
      preview: 'I\'ve spent the last month analyzing NVIDIA\'s position in the AI market. Here\'s why I believe they\'re uniquely positioned to capture the majority of AI infrastructure spending over the next decade...',
      upvotes: 892,
      comments: 156,
      readTime: '12 min',
    },
    {
      id: 2,
      title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
      author: 'WallStreetOracle',
      authorId: 'wall-street-oracle',
      avatar: 'WO',
      verified: true,
      timestamp: '5 hours ago',
      preview: 'Most investors focus on the hardware, but CUDA is the real moat. Let me break down why switching costs are insurmountable for NVDA\'s enterprise customers...',
      upvotes: 654,
      comments: 98,
      readTime: '8 min',
    },
    {
      id: 3,
      title: 'NVDA Valuation Model: Fair Value Analysis Using DCF',
      author: 'ValueHunter',
      authorId: 'value-hunter',
      avatar: 'VH',
      verified: false,
      timestamp: '1 day ago',
      preview: 'Running multiple scenarios with conservative estimates for AI market growth, here\'s what my DCF model shows for NVDA\'s intrinsic value...',
      upvotes: 423,
      comments: 67,
      readTime: '15 min',
    },
  ],
  TSLA: [
    {
      id: 4,
      title: 'TSLA: The Energy Company Disguised as a Car Maker',
      author: 'GreenPortfolio',
      authorId: 'green-portfolio',
      avatar: 'GP',
      verified: false,
      timestamp: '3 hours ago',
      preview: 'Everyone focuses on vehicle deliveries, but the energy storage business is growing 100%+ YoY and has better margins. Here\'s why this could be a $50B business...',
      upvotes: 567,
      comments: 134,
      readTime: '10 min',
    },
    {
      id: 5,
      title: 'Cybertruck Economics: Production Costs vs Revenue Potential',
      author: 'MarketWatch2025',
      authorId: 'market-watch-2025',
      avatar: 'MW',
      verified: true,
      timestamp: '8 hours ago',
      preview: 'Breaking down the per-unit economics of Cybertruck production. With 1M+ reservations and improving manufacturing efficiency, margins could surprise to the upside...',
      upvotes: 445,
      comments: 89,
      readTime: '9 min',
    },
  ],
};

export function TickerDDPosts({ ticker, onCreatorClick, onPostClick }: TickerDDPostsProps) {
  const posts = ddPostsData[ticker] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Latest Due Diligence Posts
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
                    <h3 className="text-slate-900 mb-2 hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-3 line-clamp-2">
                      {post.preview}
                    </p>

                    <div className="flex items-center gap-3 text-slate-500">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:text-emerald-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreatorClick(post.authorId);
                        }}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.authorAvatar} />
                          <AvatarFallback className="text-xs bg-emerald-500 text-white">
                            {post.author?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                        {post.verified && (
                          <BadgeCheck className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <span>{post.readTime} read</span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-slate-500">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                      <Badge variant="secondary" className="ml-auto">Due Diligence</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No DD posts available for ${ticker} yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}