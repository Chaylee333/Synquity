import { TrendingUp, Award, BadgeCheck, TrendingDown, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface AssetClassSeeAllPageProps {
  assetClass: string;
  onNavigateHome: () => void;
  onCreatorsClick: () => void;
  onCreatorClick: (creatorId: string) => void;
  onTrendingClick: () => void;
}

// Reuse the same data structure
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
    {
      rank: 7,
      id: 'market-watch-2025',
      username: 'MarketWatch2025',
      avatar: 'MW',
      verified: true,
      totalPnL: 124560,
      monthlyReturn: 9.6,
      posts: 412,
      followers: 18700,
      accuracy: 76,
      specialty: 'Market Analysis'
    },
    {
      rank: 8,
      id: 'growth-investor',
      username: 'GrowthInvestor',
      avatar: 'GI',
      verified: true,
      totalPnL: 98450,
      monthlyReturn: 17.8,
      posts: 298,
      followers: 13200,
      accuracy: 74,
      specialty: 'Growth Stocks'
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

export function AssetClassSeeAllPage({
  assetClass,
  onNavigateHome,
  onCreatorsClick,
  onCreatorClick,
  onTrendingClick
}: AssetClassSeeAllPageProps) {
  const creators = creatorsByAssetClass[assetClass] || [];

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h1 className="text-slate-900">Synquity</h1>
            </div>

            {/* Center Navigation */}
            <nav className="flex items-center gap-2">
              <Button variant="ghost" onClick={onNavigateHome}>Discover</Button>
              <Button variant="ghost" onClick={onTrendingClick}>Trending</Button>
              <Button variant="ghost" onClick={onCreatorsClick}>Creators</Button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline">Log In</Button>
              <Button variant="default">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back button and header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onCreatorsClick}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Asset Classes
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{getIcon()}</span>
            <h2 className="text-slate-900">All {assetClass} Creators</h2>
          </div>
          <p className="text-slate-600">
            {creators.length} creators ranked by performance
          </p>
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((creator) => (
            <Card
              key={creator.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onCreatorClick(creator.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-slate-500">
                    #{creator.rank}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${creator.monthlyReturn >= 20 ? 'bg-emerald-100 text-emerald-700' :
                        creator.monthlyReturn >= 10 ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                      }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {creator.monthlyReturn}%
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={creator.avatar_url} />
                    <AvatarFallback className="bg-emerald-500 text-white text-lg">
                      {creator.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 truncate">{creator.username}</span>
                      {creator.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-slate-500">{creator.specialty}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-slate-500 mb-1">Total P&L</div>
                    <div className={`${creator.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                      ${(creator.totalPnL / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Followers</div>
                    <div className="text-slate-900">{(creator.followers / 1000).toFixed(1)}K</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Posts</div>
                    <div className="text-slate-900">{creator.posts}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Accuracy</div>
                    <div className={`${creator.accuracy >= 75 ? 'text-emerald-600' :
                        creator.accuracy >= 65 ? 'text-slate-600' :
                          'text-red-600'
                      }`}>
                      {creator.accuracy}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}