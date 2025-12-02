import { Award, TrendingUp, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef } from 'react';

interface CreatorRankingsProps {
  onCreatorClick: (creatorId: string) => void;
}

const topCreators = [
  {
    rank: 1,
    id: 'tech-investor-42',
    username: 'TechInvestor42',
    avatar: 'TI',
    verified: true,
    monthlyReturn: 23.5,
    posts: 342,
    followers: 15600,
    pnlAnnualized: 78.5
  },
  {
    rank: 2,
    id: 'wall-street-oracle',
    username: 'WallStreetOracle',
    avatar: 'WO',
    verified: true,
    monthlyReturn: 18.2,
    posts: 256,
    followers: 22400,
    pnlAnnualized: 82.3
  },
  {
    rank: 3,
    id: 'dividend-king',
    username: 'DividendKing',
    avatar: 'DK',
    verified: true,
    monthlyReturn: 12.8,
    posts: 189,
    followers: 11200,
    pnlAnnualized: 65.2
  },
  {
    rank: 4,
    id: 'green-portfolio',
    username: 'GreenPortfolio',
    avatar: 'GP',
    verified: false,
    monthlyReturn: 15.4,
    posts: 234,
    followers: 8900,
    pnlAnnualized: 52.8
  },
  {
    rank: 5,
    id: 'market-watch-2025',
    username: 'MarketWatch2025',
    avatar: 'MW',
    verified: true,
    monthlyReturn: 9.6,
    posts: 412,
    followers: 18700,
    pnlAnnualized: 45.6
  },
  {
    rank: 6,
    id: 'chip-collector',
    username: 'ChipCollector',
    avatar: 'CC',
    verified: false,
    monthlyReturn: 14.3,
    posts: 167,
    followers: 6500,
    pnlAnnualized: 38.9
  },
  {
    rank: 7,
    id: 'options-wizard',
    username: 'OptionsWizard',
    avatar: 'OW',
    verified: true,
    monthlyReturn: 28.7,
    posts: 298,
    followers: 19800,
    pnlAnnualized: 95.4
  },
  {
    rank: 8,
    id: 'value-hunter',
    username: 'ValueHunter',
    avatar: 'VH',
    verified: false,
    monthlyReturn: 11.2,
    posts: 143,
    followers: 5400,
    pnlAnnualized: 41.2
  },
];

export function CreatorRankings({ onCreatorClick }: CreatorRankingsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
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
          <Award className="w-5 h-5 text-amber-600" />
          Top Content Creators
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
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {topCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => onCreatorClick(creator.id)}
                className="flex-shrink-0 w-64 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-500">
                    #{creator.rank}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      creator.monthlyReturn >= 20 ? 'bg-emerald-100 text-emerald-700' :
                      creator.monthlyReturn >= 10 ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {creator.monthlyReturn}%
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-emerald-500 text-white">
                      {creator.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-slate-900 truncate">{creator.username}</span>
                      {creator.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {(creator.followers / 1000).toFixed(1)}K followers
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Posts</span>
                    <span className="text-slate-900">{creator.posts}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-slate-500">P&L % (Annualized)</span>
                  <span className={`${
                    creator.pnlAnnualized >= 50 ? 'text-emerald-600' :
                    creator.pnlAnnualized >= 25 ? 'text-slate-600' :
                    'text-red-600'
                  }`}>
                    +{creator.pnlAnnualized}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}