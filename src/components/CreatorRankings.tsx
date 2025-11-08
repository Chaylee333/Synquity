import { Award, TrendingUp, FileText, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

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
    totalPnL: 156780,
    monthlyReturn: 23.5,
    posts: 342,
    followers: 15600,
    accuracy: 78
  },
  {
    rank: 2,
    id: 'wall-street-oracle',
    username: 'WallStreetOracle',
    avatar: 'WO',
    verified: true,
    totalPnL: 298450,
    monthlyReturn: 18.2,
    posts: 256,
    followers: 22400,
    accuracy: 82
  },
  {
    rank: 3,
    id: 'dividend-king',
    username: 'DividendKing',
    avatar: 'DK',
    verified: true,
    totalPnL: 89320,
    monthlyReturn: 12.8,
    posts: 189,
    followers: 11200,
    accuracy: 85
  },
  {
    rank: 4,
    id: 'green-portfolio',
    username: 'GreenPortfolio',
    avatar: 'GP',
    verified: false,
    totalPnL: 67890,
    monthlyReturn: 15.4,
    posts: 234,
    followers: 8900,
    accuracy: 72
  },
  {
    rank: 5,
    id: 'market-watch-2025',
    username: 'MarketWatch2025',
    avatar: 'MW',
    verified: true,
    totalPnL: 124560,
    monthlyReturn: 9.6,
    posts: 412,
    followers: 18700,
    accuracy: 76
  },
  {
    rank: 6,
    id: 'chip-collector',
    username: 'ChipCollector',
    avatar: 'CC',
    verified: false,
    totalPnL: 45230,
    monthlyReturn: 14.3,
    posts: 167,
    followers: 6500,
    accuracy: 69
  },
  {
    rank: 7,
    id: 'options-wizard',
    username: 'OptionsWizard',
    avatar: 'OW',
    verified: true,
    totalPnL: 203450,
    monthlyReturn: 28.7,
    posts: 298,
    followers: 19800,
    accuracy: 65
  },
  {
    rank: 8,
    id: 'value-hunter',
    username: 'ValueHunter',
    avatar: 'VH',
    verified: false,
    totalPnL: 52100,
    monthlyReturn: 11.2,
    posts: 143,
    followers: 5400,
    accuracy: 81
  },
];

export function CreatorRankings({ onCreatorClick }: CreatorRankingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          Top Content Creators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {topCreators.map((creator) => (
            <div
              key={creator.id}
              onClick={() => onCreatorClick(creator.id)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div className="text-slate-500 w-8">
                #{creator.rank}
              </div>

              <Avatar className="w-10 h-10">
                <AvatarFallback>{creator.avatar}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-900">{creator.username}</span>
                  {creator.verified && (
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{creator.posts}</span>
                  </div>
                  <span>•</span>
                  <span>{(creator.followers / 1000).toFixed(1)}K followers</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className={`${
                  creator.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  ${(creator.totalPnL / 1000).toFixed(1)}K
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

              <div className="w-20 text-right">
                <div className="text-slate-500 mb-1">Accuracy</div>
                <div className={`${
                  creator.accuracy >= 75 ? 'text-emerald-600' :
                  creator.accuracy >= 65 ? 'text-slate-600' :
                  'text-red-600'
                }`}>
                  {creator.accuracy}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
