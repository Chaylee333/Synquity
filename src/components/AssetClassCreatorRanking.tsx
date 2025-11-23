import { Award, TrendingUp, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useRef } from 'react';

interface AssetClassCreatorRankingProps {
  assetClass: string;
  onCreatorClick: (creatorId: string) => void;
  onSeeAllClick: (assetClass: string) => void;
}

// Mock data for different asset classes
const creatorsByAssetClass: Record<string, any[]> = {
  Equities: [
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
      accuracy: 78,
      specialty: 'Tech Stocks'
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
      accuracy: 82,
      specialty: 'Large Cap'
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
      accuracy: 85,
      specialty: 'Dividends'
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
      accuracy: 72,
      specialty: 'Growth'
    },
    {
      rank: 5,
      id: 'value-hunter',
      username: 'ValueHunter',
      avatar: 'VH',
      verified: false,
      totalPnL: 52100,
      monthlyReturn: 11.2,
      posts: 143,
      followers: 5400,
      accuracy: 81,
      specialty: 'Value'
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
      accuracy: 69,
      specialty: 'Semiconductors'
    },
  ],
  Options: [
    {
      rank: 1,
      id: 'options-wizard',
      username: 'OptionsWizard',
      avatar: 'OW',
      verified: true,
      totalPnL: 203450,
      monthlyReturn: 28.7,
      posts: 298,
      followers: 19800,
      accuracy: 65,
      specialty: 'Spreads'
    },
    {
      rank: 2,
      id: 'theta-gang',
      username: 'ThetaGang',
      avatar: 'TG',
      verified: true,
      totalPnL: 178900,
      monthlyReturn: 22.4,
      posts: 412,
      followers: 21500,
      accuracy: 73,
      specialty: 'Credit Spreads'
    },
    {
      rank: 3,
      id: 'volatility-trader',
      username: 'VolatilityTrader',
      avatar: 'VT',
      verified: true,
      totalPnL: 145600,
      monthlyReturn: 19.8,
      posts: 267,
      followers: 16200,
      accuracy: 68,
      specialty: 'VIX Trading'
    },
    {
      rank: 4,
      id: 'iron-condor-pro',
      username: 'IronCondorPro',
      avatar: 'IC',
      verified: false,
      totalPnL: 98700,
      monthlyReturn: 16.5,
      posts: 189,
      followers: 12300,
      accuracy: 71,
      specialty: 'Iron Condors'
    },
    {
      rank: 5,
      id: 'earnings-plays',
      username: 'EarningsPlays',
      avatar: 'EP',
      verified: true,
      totalPnL: 87450,
      monthlyReturn: 24.1,
      posts: 234,
      followers: 14700,
      accuracy: 62,
      specialty: 'Earnings'
    },
    {
      rank: 6,
      id: 'straddle-master',
      username: 'StraddleMaster',
      avatar: 'SM',
      verified: false,
      totalPnL: 72300,
      monthlyReturn: 18.9,
      posts: 156,
      followers: 9800,
      accuracy: 66,
      specialty: 'Straddles'
    },
  ],
  Macro: [
    {
      rank: 1,
      id: 'macro-bull',
      username: 'MacroBull',
      avatar: 'MB',
      verified: true,
      totalPnL: 412000,
      monthlyReturn: 15.7,
      posts: 178,
      followers: 28900,
      accuracy: 79,
      specialty: 'Interest Rates'
    },
    {
      rank: 2,
      id: 'fed-watcher',
      username: 'FedWatcher',
      avatar: 'FW',
      verified: true,
      totalPnL: 356700,
      monthlyReturn: 13.2,
      posts: 245,
      followers: 32100,
      accuracy: 84,
      specialty: 'Central Banking'
    },
    {
      rank: 3,
      id: 'global-markets',
      username: 'GlobalMarkets',
      avatar: 'GM',
      verified: true,
      totalPnL: 289500,
      monthlyReturn: 11.8,
      posts: 198,
      followers: 24600,
      accuracy: 81,
      specialty: 'International'
    },
    {
      rank: 4,
      id: 'inflation-tracker',
      username: 'InflationTracker',
      avatar: 'IT',
      verified: false,
      totalPnL: 198400,
      monthlyReturn: 14.5,
      posts: 167,
      followers: 18200,
      accuracy: 76,
      specialty: 'Inflation'
    },
    {
      rank: 5,
      id: 'bond-king',
      username: 'BondKing',
      avatar: 'BK',
      verified: true,
      totalPnL: 167800,
      monthlyReturn: 9.4,
      posts: 134,
      followers: 15900,
      accuracy: 88,
      specialty: 'Fixed Income'
    },
    {
      rank: 6,
      id: 'rates-analyst',
      username: 'RatesAnalyst',
      avatar: 'RA',
      verified: false,
      totalPnL: 142300,
      monthlyReturn: 12.1,
      posts: 156,
      followers: 13400,
      accuracy: 77,
      specialty: 'Yield Curves'
    },
  ],
  Crypto: [
    {
      rank: 1,
      id: 'crypto-whale',
      username: 'CryptoWhale',
      avatar: 'CW',
      verified: true,
      totalPnL: 567800,
      monthlyReturn: 42.3,
      posts: 423,
      followers: 45600,
      accuracy: 68,
      specialty: 'Bitcoin'
    },
    {
      rank: 2,
      id: 'defi-degen',
      username: 'DeFiDegen',
      avatar: 'DD',
      verified: true,
      totalPnL: 489200,
      monthlyReturn: 38.7,
      posts: 512,
      followers: 38900,
      accuracy: 64,
      specialty: 'DeFi'
    },
    {
      rank: 3,
      id: 'eth-maximalist',
      username: 'EthMaximalist',
      avatar: 'EM',
      verified: true,
      totalPnL: 423500,
      monthlyReturn: 35.2,
      posts: 389,
      followers: 34200,
      accuracy: 71,
      specialty: 'Ethereum'
    },
    {
      rank: 4,
      id: 'alt-coin-hunter',
      username: 'AltCoinHunter',
      avatar: 'AH',
      verified: false,
      totalPnL: 367900,
      monthlyReturn: 51.8,
      posts: 678,
      followers: 29800,
      accuracy: 58,
      specialty: 'Altcoins'
    },
    {
      rank: 5,
      id: 'nft-trader',
      username: 'NFTTrader',
      avatar: 'NT',
      verified: false,
      totalPnL: 298400,
      monthlyReturn: 29.3,
      posts: 345,
      followers: 22100,
      accuracy: 62,
      specialty: 'NFTs'
    },
    {
      rank: 6,
      id: 'layer2-bull',
      username: 'Layer2Bull',
      avatar: 'L2',
      verified: true,
      totalPnL: 256700,
      monthlyReturn: 33.6,
      posts: 278,
      followers: 19500,
      accuracy: 69,
      specialty: 'Layer 2'
    },
  ],
  FX: [
    {
      rank: 1,
      id: 'forex-master',
      username: 'ForexMaster',
      avatar: 'FM',
      verified: true,
      totalPnL: 234500,
      monthlyReturn: 16.8,
      posts: 312,
      followers: 27400,
      accuracy: 74,
      specialty: 'EUR/USD'
    },
    {
      rank: 2,
      id: 'currency-trader',
      username: 'CurrencyTrader',
      avatar: 'CT',
      verified: true,
      totalPnL: 198700,
      monthlyReturn: 14.3,
      posts: 267,
      followers: 23800,
      accuracy: 77,
      specialty: 'Major Pairs'
    },
    {
      rank: 3,
      id: 'carry-trade-king',
      username: 'CarryTradeKing',
      avatar: 'CK',
      verified: true,
      totalPnL: 176400,
      monthlyReturn: 11.9,
      posts: 189,
      followers: 19600,
      accuracy: 81,
      specialty: 'Carry Trades'
    },
    {
      rank: 4,
      id: 'emerging-markets',
      username: 'EmergingMarkets',
      avatar: 'EM',
      verified: false,
      totalPnL: 145300,
      monthlyReturn: 18.7,
      posts: 234,
      followers: 16200,
      accuracy: 69,
      specialty: 'EM Currencies'
    },
    {
      rank: 5,
      id: 'gbp-specialist',
      username: 'GBPSpecialist',
      avatar: 'GS',
      verified: true,
      totalPnL: 123800,
      monthlyReturn: 13.4,
      posts: 198,
      followers: 14500,
      accuracy: 75,
      specialty: 'GBP Pairs'
    },
    {
      rank: 6,
      id: 'yen-trader',
      username: 'YenTrader',
      avatar: 'YT',
      verified: false,
      totalPnL: 108900,
      monthlyReturn: 15.2,
      posts: 167,
      followers: 12800,
      accuracy: 72,
      specialty: 'JPY Pairs'
    },
  ],
};

export function AssetClassCreatorRanking({ assetClass, onCreatorClick, onSeeAllClick }: AssetClassCreatorRankingProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const creators = creatorsByAssetClass[assetClass] || [];

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

  const getIcon = () => {
    switch (assetClass) {
      case 'Equities': return '📈';
      case 'Options': return '📊';
      case 'Macro': return '🌍';
      case 'Crypto': return '₿';
      case 'FX': return '💱';
      default: return '📊';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span>{getIcon()}</span>
          <span>{assetClass} Creators</span>
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
          <Button
            variant="default"
            size="sm"
            onClick={() => onSeeAllClick(assetClass)}
          >
            See All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {creators.map((creator) => (
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
                    <AvatarFallback>{creator.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-slate-900 truncate">{creator.username}</span>
                      {creator.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {creator.specialty}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total P&L</span>
                    <span className={`${
                      creator.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      ${(creator.totalPnL / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Followers</span>
                    <span className="text-slate-900">{(creator.followers / 1000).toFixed(1)}K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Accuracy</span>
                  <span className={`${
                    creator.accuracy >= 75 ? 'text-emerald-600' :
                    creator.accuracy >= 65 ? 'text-slate-600' :
                    'text-red-600'
                  }`}>
                    {creator.accuracy}%
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
