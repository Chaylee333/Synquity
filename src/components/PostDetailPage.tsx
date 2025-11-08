import { useState } from 'react';
import { ArrowLeft, ThumbsUp, MessageSquare, BadgeCheck, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';

interface PostDetailPageProps {
  postId: number;
  onNavigateHome: () => void;
  onTickerClick: (ticker: string) => void;
  onCreatorClick: (creatorId: string) => void;
}

const allPosts: Record<number, any> = {
  1: {
    id: 1,
    title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
    author: 'TechInvestor42',
    authorId: 'tech-investor-42',
    avatar: 'TI',
    verified: true,
    timestamp: '2 hours ago',
    ticker: 'NVDA',
    category: 'DD',
    readTime: '12 min',
    content: `I've spent the last month analyzing NVIDIA's position in the AI market, and I believe they're uniquely positioned to capture the majority of AI infrastructure spending over the next decade. Here's my comprehensive analysis.

## Executive Summary

NVIDIA currently holds approximately 95% market share in AI training chips and around 80% in AI inference. This isn't just about being first to market - it's about building an ecosystem that's nearly impossible to replicate.

## The CUDA Moat

While everyone focuses on NVIDIA's hardware advantages, the real moat is CUDA. CUDA is a parallel computing platform that allows developers to use GPU acceleration for general purpose processing. Here's why it matters:

- **10+ years of optimization**: CUDA has been in development since 2006, with thousands of engineers contributing to libraries, frameworks, and tools
- **Developer ecosystem**: Over 3 million developers are trained in CUDA, with university courses and certifications built around it
- **Software libraries**: Thousands of pre-built libraries for everything from deep learning to scientific computing
- **Switching costs**: Migrating from CUDA to alternatives like AMD's ROCm or Intel's OneAPI requires significant code rewrites

## Market Opportunity

The AI chip market is projected to grow from $45B in 2023 to $250B by 2027. NVIDIA is positioned to capture 70%+ of this:

- **Data Center Revenue**: Currently $18B quarterly, growing at 150%+ YoY
- **Enterprise AI adoption**: Still in early innings, with most companies just beginning their AI transformation
- **Edge AI**: New opportunity in automotive, robotics, and IoT devices

## Financial Projections

Based on my DCF model with conservative assumptions:
- 2024 Revenue: $110B (vs $60B in 2023)
- 2025 Revenue: $155B
- Operating Margin: 55-60%
- Free Cash Flow: $70B+ by 2025

## Risks to Consider

1. **Competition**: AMD is improving, and hyperscalers are building custom chips
2. **Valuation**: Trading at 35x forward earnings, requires sustained growth
3. **Geopolitical**: China restrictions could impact 20-25% of revenue
4. **Customer concentration**: Top 4 customers represent 40% of data center revenue

## My Position

I'm long NVDA with a 5-year time horizon. Current price of $875 offers attractive entry for long-term holders. Target price: $1,200 by end of 2025.

*This is not financial advice. Do your own research.*`,
    upvotes: 892,
    liked: false,
  },
  2: {
    id: 2,
    title: 'Why NVDA\'s Moat is Wider Than You Think: A Technical Analysis',
    author: 'WallStreetOracle',
    authorId: 'wall-street-oracle',
    avatar: 'WO',
    verified: true,
    timestamp: '5 hours ago',
    ticker: 'NVDA',
    category: 'DD',
    readTime: '8 min',
    content: `Most investors focus on the hardware, but CUDA is the real moat. Let me break down why switching costs are insurmountable for NVDA's enterprise customers.

## The Technical Lock-in

When a company invests in NVIDIA infrastructure, they're not just buying GPUs. They're buying into an entire ecosystem:

### Software Stack
- CUDA Toolkit
- cuDNN (Deep Neural Network library)
- TensorRT (Inference optimization)
- RAPIDS (Data science acceleration)

### Development Investment
Companies have spent millions on:
- Training their engineering teams on CUDA
- Building proprietary tools and frameworks
- Optimizing their models for NVIDIA hardware

### Performance Advantage
Current benchmarks show:
- H100 vs MI300: 40% faster in AI training
- Better power efficiency
- Superior memory bandwidth

## Why AMD Can't Compete Yet

While AMD's MI300 is impressive on paper, the software ecosystem is years behind. ROCm (AMD's CUDA alternative) is improving but still lacks:
- Comprehensive library support
- Mature tooling
- Developer mindshare

## Investment Thesis

This technical moat translates to pricing power and margin expansion. NVIDIA can charge premium prices because the total cost of ownership (including development time and optimization) still favors their platform.

Price target: $1,000 within 6 months.`,
    upvotes: 654,
    liked: false,
  },
  8: {
    id: 8,
    title: 'TSLA: The Energy Company Disguised as a Car Maker',
    author: 'GreenPortfolio',
    authorId: 'green-portfolio',
    avatar: 'GP',
    verified: false,
    timestamp: '3 hours ago',
    ticker: 'TSLA',
    category: 'DD',
    readTime: '10 min',
    content: `Everyone focuses on vehicle deliveries, but the energy storage business is growing 100%+ YoY and has better margins. Here's why this could be a $50B business.

## Energy Storage: The Hidden Gem

Tesla Energy deployed 14.7 GWh in Q4 2024, up from 4.0 GWh in Q4 2023. This 268% growth is being completely overlooked by the market.

### Why Energy Storage Matters

1. **Higher Margins**: Energy storage gross margins are 25-30% vs 18-20% for automotive
2. **Less Competition**: Tesla has 3-5 year lead in battery manufacturing at scale
3. **Massive TAM**: Grid storage market projected to be $500B+ by 2030

### The Products

**Megapack**: Utility-scale storage
- $2M per unit
- Backlog of 3+ years
- Used by utilities worldwide

**Powerwall**: Residential storage
- $11,500 per unit
- Perfect complement to solar
- Growing adoption in CA, TX, and internationally

### Financial Impact

If energy storage reaches $25B in revenue by 2027 (very achievable at current growth rates) with 28% margins, that's $7B in gross profit - nearly 30% of total automotive gross profit from a business that most investors ignore.

## Why This Changes The Valuation

Tesla trades like a car company (P/E of 45) but should trade like a diversified technology and energy company. Comps:
- Traditional auto: P/E of 6-8
- Energy companies: P/E of 12-15
- Tech companies: P/E of 25-35
- **Tesla (blended)**: Should be P/E of 50-60

My fair value: $285 per share, 20% upside from current levels.`,
    upvotes: 567,
    liked: false,
  },
};

const initialComments: Record<number, any[]> = {
  1: [
    {
      id: 1,
      author: 'MarketWatch2025',
      authorId: 'market-watch-2025',
      avatar: 'MW',
      verified: true,
      timestamp: '1 hour ago',
      content: 'Excellent analysis! One thing to add: the networking infrastructure (NVLink, InfiniBand) is another massive moat. It\'s not just about individual GPUs but how they communicate in large clusters.',
      upvotes: 45,
      liked: false,
    },
    {
      id: 2,
      author: 'ChipCollector',
      authorId: 'chip-collector',
      avatar: 'CC',
      verified: false,
      timestamp: '45 minutes ago',
      content: 'Great DD. However, I think you\'re underestimating the custom chip threat. Google\'s TPUs and Amazon\'s Trainium are getting better fast, and they represent a huge portion of the market.',
      upvotes: 23,
      liked: false,
    },
    {
      id: 3,
      author: 'ValueHunter',
      authorId: 'value-hunter',
      avatar: 'VH',
      verified: false,
      timestamp: '30 minutes ago',
      content: 'The valuation concerns are real though. Even with your aggressive growth assumptions, we\'re paying a premium multiple. What\'s your margin of safety here?',
      upvotes: 18,
      liked: false,
    },
  ],
  2: [
    {
      id: 4,
      author: 'TechInvestor42',
      authorId: 'tech-investor-42',
      avatar: 'TI',
      verified: true,
      timestamp: '3 hours ago',
      content: 'Spot on about the software moat. I\'ve worked with both CUDA and ROCm - the developer experience difference is night and day. AMD has the hardware but needs 2-3 more years on software.',
      upvotes: 67,
      liked: false,
    },
  ],
  8: [
    {
      id: 5,
      author: 'DividendKing',
      authorId: 'dividend-king',
      avatar: 'DK',
      verified: true,
      timestamp: '2 hours ago',
      content: 'Interesting perspective on the energy business. I hadn\'t considered how much this could change the valuation framework. Thanks for the detailed breakdown!',
      upvotes: 34,
      liked: false,
    },
    {
      id: 6,
      author: 'OptionsWizard',
      authorId: 'options-wizard',
      avatar: 'OW',
      verified: true,
      timestamp: '1 hour ago',
      content: 'The Megapack margins are impressive, but isn\'t there a risk that competition catches up? What about the Chinese battery manufacturers?',
      upvotes: 12,
      liked: false,
    },
  ],
};

export function PostDetailPage({ postId, onNavigateHome, onTickerClick, onCreatorClick }: PostDetailPageProps) {
  const post = allPosts[postId];
  const [comments, setComments] = useState(initialComments[postId] || []);
  const [newComment, setNewComment] = useState('');
  const [postLiked, setPostLiked] = useState(post?.liked || false);
  const [postUpvotes, setPostUpvotes] = useState(post?.upvotes || 0);
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [commentUpvotes, setCommentUpvotes] = useState<Record<number, number>>({});

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Post not found</div>
      </div>
    );
  }

  const handlePostLike = () => {
    if (postLiked) {
      setPostUpvotes(postUpvotes - 1);
      setPostLiked(false);
    } else {
      setPostUpvotes(postUpvotes + 1);
      setPostLiked(true);
    }
  };

  const handleCommentLike = (commentId: number, currentUpvotes: number) => {
    const isLiked = commentLikes[commentId];
    if (isLiked) {
      setCommentUpvotes({ ...commentUpvotes, [commentId]: (commentUpvotes[commentId] || currentUpvotes) - 1 });
      setCommentLikes({ ...commentLikes, [commentId]: false });
    } else {
      setCommentUpvotes({ ...commentUpvotes, [commentId]: (commentUpvotes[commentId] || currentUpvotes) + 1 });
      setCommentLikes({ ...commentLikes, [commentId]: true });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 100,
        author: 'You',
        authorId: 'current-user',
        avatar: 'YU',
        verified: false,
        timestamp: 'Just now',
        content: newComment,
        upvotes: 0,
        liked: false,
      };
      setComments([comment, ...comments]);
      setNewComment('');
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

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                  onClick={() => onTickerClick(post.ticker)}
                >
                  ${post.ticker}
                </Badge>
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-slate-500">• {post.readTime} read</span>
              </div>

              <h1 className="text-slate-900 mb-4">{post.title}</h1>

              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                  onClick={() => onCreatorClick(post.authorId)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{post.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{post.author}</span>
                      {post.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <span className="text-slate-500">{post.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant={postLiked ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={handlePostLike}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {postUpvotes}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {comments.length}
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Post Content */}
            <div className="prose prose-slate max-w-none mb-8">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {post.content}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Comments Section */}
            <div>
              <h2 className="text-slate-900 mb-4">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} className="gap-2">
                    <Send className="w-4 h-4" />
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar 
                        className="w-8 h-8 cursor-pointer"
                        onClick={() => onCreatorClick(comment.authorId)}
                      >
                        <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-slate-900 cursor-pointer hover:text-emerald-600"
                            onClick={() => onCreatorClick(comment.authorId)}
                          >
                            {comment.author}
                          </span>
                          {comment.verified && (
                            <BadgeCheck className="w-3 h-3 text-blue-600" />
                          )}
                          <span className="text-slate-500">• {comment.timestamp}</span>
                        </div>

                        <p className="text-slate-700 mb-2">
                          {comment.content}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          className={`gap-1 h-7 ${commentLikes[comment.id] ? 'text-emerald-600' : 'text-slate-500'}`}
                          onClick={() => handleCommentLike(comment.id, comment.upvotes)}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {commentUpvotes[comment.id] ?? comment.upvotes}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
