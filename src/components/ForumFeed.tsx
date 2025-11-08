import { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { DiscussionCard } from './DiscussionCard';

interface ForumFeedProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
}

const mockDiscussions = [
  {
    id: 1,
    title: 'NVDA earnings beat expectations - What\'s next?',
    author: 'TechInvestor42',
    avatar: 'TI',
    timestamp: '2 hours ago',
    category: 'earnings',
    ticker: 'NVDA',
    content: 'NVIDIA just posted incredible Q4 results. Data center revenue up 279% YoY. Are we looking at a continued rally or time to take profits?',
    upvotes: 234,
    comments: 89,
    tags: ['Tech', 'AI', 'Earnings'],
  },
  {
    id: 2,
    title: 'Why I\'m bullish on renewable energy stocks in 2025',
    author: 'GreenPortfolio',
    avatar: 'GP',
    timestamp: '4 hours ago',
    category: 'dd',
    ticker: 'ENPH',
    content: 'With new government incentives and falling costs, solar companies like ENPH are positioned for massive growth. Here\'s my DD...',
    upvotes: 156,
    comments: 43,
    tags: ['Energy', 'DD', 'Long'],
  },
  {
    id: 3,
    title: 'Market correction incoming? Analyzing recent trends',
    author: 'MarketWatch2025',
    avatar: 'MW',
    timestamp: '5 hours ago',
    category: 'discussion',
    ticker: 'SPY',
    content: 'Looking at historical patterns, we might be due for a pullback. SPY showing signs of exhaustion at these levels.',
    upvotes: 312,
    comments: 127,
    tags: ['Market', 'Technical Analysis'],
  },
  {
    id: 4,
    title: 'TSLA delivery numbers exceed estimates',
    author: 'ElonFanboy',
    avatar: 'EF',
    timestamp: '7 hours ago',
    category: 'news',
    ticker: 'TSLA',
    content: 'Q4 deliveries came in at 485K vs 475K expected. Stock up 8% in pre-market. Bulls are back!',
    upvotes: 445,
    comments: 203,
    tags: ['Tesla', 'News', 'EV'],
  },
  {
    id: 5,
    title: 'Best dividend stocks for passive income?',
    author: 'DividendKing',
    avatar: 'DK',
    timestamp: '9 hours ago',
    category: 'discussion',
    ticker: 'KO',
    content: 'Building a dividend portfolio for retirement. Looking at KO, JNJ, PG. What are your top picks?',
    upvotes: 89,
    comments: 56,
    tags: ['Dividends', 'Income', 'Long'],
  },
  {
    id: 6,
    title: 'AMD vs Intel: Which chip stock to buy now?',
    author: 'ChipCollector',
    avatar: 'CC',
    timestamp: '12 hours ago',
    category: 'discussion',
    ticker: 'AMD',
    content: 'Both are trading at interesting levels. AMD has better growth but INTC is cheaper. Thoughts?',
    upvotes: 178,
    comments: 92,
    tags: ['Tech', 'Semiconductors'],
  },
];

export function ForumFeed({ selectedCategory, onCategoryChange, searchQuery }: ForumFeedProps) {
  const filteredDiscussions = useMemo(() => {
    return mockDiscussions.filter(discussion => {
      const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="dd">DD</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filteredDiscussions.length > 0 ? (
          filteredDiscussions.map(discussion => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            No discussions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
