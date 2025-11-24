import { TrendingUp, Users, TrendingDown, BadgeCheck, Target, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { ForumHeader } from './ForumHeader';

interface CreatorsPageProps {
  onNavigateHome: () => void;
  onCreatorClick: (creatorId: string) => void;
  onTrendingClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

type RankingMode = 'risk-adjusted' | 'absolute';

const creatorsData = [
  {
    rank: 1,
    id: 'macro-bull',
    username: 'MacroBull',
    avatar: 'MB',
    verified: true,
    followers: 28900,
    posts: 178,
    specialty: 'Macro Trading',
    // Risk-adjusted metrics
    pnlAnnualizedPercent: 42.3,
    pnlSinceJoiningPercent: 156.7,
    sharpeRatio: 2.8,
    avgDrawdownPercent: -5.2,
    // Absolute metrics
    pnlAbsoluteDollars: 412000,
  },
  {
    rank: 2,
    id: 'crypto-whale',
    username: 'CryptoWhale',
    avatar: 'CW',
    verified: true,
    followers: 45600,
    posts: 423,
    specialty: 'Crypto',
    pnlAnnualizedPercent: 68.5,
    pnlSinceJoiningPercent: 234.2,
    sharpeRatio: 1.9,
    avgDrawdownPercent: -12.8,
    pnlAbsoluteDollars: 567800,
  },
  {
    rank: 3,
    id: 'wall-street-oracle',
    username: 'WallStreetOracle',
    avatar: 'WO',
    verified: true,
    followers: 22400,
    posts: 256,
    specialty: 'Equities',
    pnlAnnualizedPercent: 38.2,
    pnlSinceJoiningPercent: 142.8,
    sharpeRatio: 2.6,
    avgDrawdownPercent: -5.8,
    pnlAbsoluteDollars: 298450,
  },
  {
    rank: 4,
    id: 'fed-watcher',
    username: 'FedWatcher',
    avatar: 'FW',
    verified: true,
    followers: 32100,
    posts: 245,
    specialty: 'Macro',
    pnlAnnualizedPercent: 31.7,
    pnlSinceJoiningPercent: 128.4,
    sharpeRatio: 3.1,
    avgDrawdownPercent: -4.2,
    pnlAbsoluteDollars: 356700,
  },
  {
    rank: 5,
    id: 'defi-degen',
    username: 'DeFiDegen',
    avatar: 'DD',
    verified: true,
    followers: 38900,
    posts: 512,
    specialty: 'DeFi',
    pnlAnnualizedPercent: 54.2,
    pnlSinceJoiningPercent: 189.6,
    sharpeRatio: 1.7,
    avgDrawdownPercent: -16.4,
    pnlAbsoluteDollars: 489200,
  },
  {
    rank: 6,
    id: 'options-wizard',
    username: 'OptionsWizard',
    avatar: 'OW',
    verified: true,
    followers: 19800,
    posts: 298,
    specialty: 'Options',
    pnlAnnualizedPercent: 45.8,
    pnlSinceJoiningPercent: 167.3,
    sharpeRatio: 2.3,
    avgDrawdownPercent: -7.8,
    pnlAbsoluteDollars: 203450,
  },
  {
    rank: 7,
    id: 'eth-maximalist',
    username: 'EthMaximalist',
    avatar: 'EM',
    verified: true,
    followers: 34200,
    posts: 389,
    specialty: 'Ethereum',
    pnlAnnualizedPercent: 49.3,
    pnlSinceJoiningPercent: 178.9,
    sharpeRatio: 2.0,
    avgDrawdownPercent: -11.2,
    pnlAbsoluteDollars: 423500,
  },
  {
    rank: 8,
    id: 'global-markets',
    username: 'GlobalMarkets',
    avatar: 'GM',
    verified: true,
    followers: 24600,
    posts: 198,
    specialty: 'International',
    pnlAnnualizedPercent: 28.6,
    pnlSinceJoiningPercent: 112.4,
    sharpeRatio: 2.7,
    avgDrawdownPercent: -5.1,
    pnlAbsoluteDollars: 289500,
  },
  {
    rank: 9,
    id: 'forex-master',
    username: 'ForexMaster',
    avatar: 'FM',
    verified: true,
    followers: 27400,
    posts: 312,
    specialty: 'FX',
    pnlAnnualizedPercent: 33.4,
    pnlSinceJoiningPercent: 134.7,
    sharpeRatio: 2.4,
    avgDrawdownPercent: -6.5,
    pnlAbsoluteDollars: 234500,
  },
  {
    rank: 10,
    id: 'theta-gang',
    username: 'ThetaGang',
    avatar: 'TG',
    verified: true,
    followers: 21500,
    posts: 412,
    specialty: 'Options',
    pnlAnnualizedPercent: 36.9,
    pnlSinceJoiningPercent: 148.2,
    sharpeRatio: 2.5,
    avgDrawdownPercent: -7.2,
    pnlAbsoluteDollars: 178900,
  },
  {
    rank: 11,
    id: 'alt-coin-hunter',
    username: 'AltCoinHunter',
    avatar: 'AH',
    verified: false,
    followers: 29800,
    posts: 678,
    specialty: 'Altcoins',
    pnlAnnualizedPercent: 72.4,
    pnlSinceJoiningPercent: 267.8,
    sharpeRatio: 1.5,
    avgDrawdownPercent: -19.8,
    pnlAbsoluteDollars: 367900,
  },
  {
    rank: 12,
    id: 'tech-investor-42',
    username: 'TechInvestor42',
    avatar: 'TI',
    verified: true,
    followers: 15600,
    posts: 342,
    specialty: 'Tech Stocks',
    pnlAnnualizedPercent: 41.2,
    pnlSinceJoiningPercent: 158.6,
    sharpeRatio: 2.2,
    avgDrawdownPercent: -8.4,
    pnlAbsoluteDollars: 156780,
  },
  {
    rank: 13,
    id: 'nft-trader',
    username: 'NFTTrader',
    avatar: 'NT',
    verified: false,
    followers: 22100,
    posts: 345,
    specialty: 'NFTs',
    pnlAnnualizedPercent: 43.7,
    pnlSinceJoiningPercent: 162.3,
    sharpeRatio: 1.8,
    avgDrawdownPercent: -14.6,
    pnlAbsoluteDollars: 298400,
  },
  {
    rank: 14,
    id: 'inflation-tracker',
    username: 'InflationTracker',
    avatar: 'IT',
    verified: false,
    followers: 18200,
    posts: 167,
    specialty: 'Macro',
    pnlAnnualizedPercent: 29.8,
    pnlSinceJoiningPercent: 119.3,
    sharpeRatio: 2.6,
    avgDrawdownPercent: -5.4,
    pnlAbsoluteDollars: 198400,
  },
  {
    rank: 15,
    id: 'currency-trader',
    username: 'CurrencyTrader',
    avatar: 'CT',
    verified: true,
    followers: 23800,
    posts: 267,
    specialty: 'FX',
    pnlAnnualizedPercent: 27.3,
    pnlSinceJoiningPercent: 108.9,
    sharpeRatio: 2.8,
    avgDrawdownPercent: -4.6,
    pnlAbsoluteDollars: 198700,
  },
  {
    rank: 16,
    id: 'layer2-bull',
    username: 'Layer2Bull',
    avatar: 'L2',
    verified: true,
    followers: 19500,
    posts: 278,
    specialty: 'Layer 2',
    pnlAnnualizedPercent: 47.6,
    pnlSinceJoiningPercent: 172.4,
    sharpeRatio: 2.0,
    avgDrawdownPercent: -10.8,
    pnlAbsoluteDollars: 256700,
  },
  {
    rank: 17,
    id: 'carry-trade-king',
    username: 'CarryTradeKing',
    avatar: 'CK',
    verified: true,
    followers: 19600,
    posts: 189,
    specialty: 'FX',
    pnlAnnualizedPercent: 24.9,
    pnlSinceJoiningPercent: 98.7,
    sharpeRatio: 3.0,
    avgDrawdownPercent: -3.4,
    pnlAbsoluteDollars: 176400,
  },
  {
    rank: 18,
    id: 'bond-king',
    username: 'BondKing',
    avatar: 'BK',
    verified: true,
    followers: 15900,
    posts: 134,
    specialty: 'Fixed Income',
    pnlAnnualizedPercent: 18.4,
    pnlSinceJoiningPercent: 76.8,
    sharpeRatio: 3.2,
    avgDrawdownPercent: -2.8,
    pnlAbsoluteDollars: 167800,
  },
  {
    rank: 19,
    id: 'volatility-trader',
    username: 'VolatilityTrader',
    avatar: 'VT',
    verified: true,
    followers: 16200,
    posts: 267,
    specialty: 'Options',
    pnlAnnualizedPercent: 34.8,
    pnlSinceJoiningPercent: 139.6,
    sharpeRatio: 2.3,
    avgDrawdownPercent: -8.9,
    pnlAbsoluteDollars: 145600,
  },
  {
    rank: 20,
    id: 'emerging-markets',
    username: 'EmergingMarkets',
    avatar: 'EM',
    verified: false,
    followers: 16200,
    posts: 234,
    specialty: 'EM Currencies',
    pnlAnnualizedPercent: 32.1,
    pnlSinceJoiningPercent: 128.7,
    sharpeRatio: 2.1,
    avgDrawdownPercent: -9.4,
    pnlAbsoluteDollars: 145300,
  },
];

export function CreatorsPage({
  onNavigateHome,
  onCreatorClick,
  onTrendingClick,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onSettingsClick
}: CreatorsPageProps) {
  const [rankingMode, setRankingMode] = useState<RankingMode>('risk-adjusted');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort creators based on ranking mode
  const sortedCreators = [...creatorsData].sort((a, b) => {
    if (rankingMode === 'risk-adjusted') {
      // Sort by Sharpe Ratio (higher is better)
      return b.sharpeRatio - a.sharpeRatio;
    } else {
      // Sort by absolute P&L dollars (higher is better)
      return b.pnlAbsoluteDollars - a.pnlAbsoluteDollars;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <ForumHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onDiscoverClick={onNavigateHome}
        onTrendingClick={onTrendingClick}
        onCreatorsClick={() => { }} // Already on creators
        currentPage="creators"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-amber-600" />
            <h2 className="text-slate-900">Top Content Creators</h2>
          </div>
          <p className="text-slate-600">
            Discover the best performing content creators based on their trading performance
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="mb-6 flex gap-3">
          <Button
            variant={rankingMode === 'risk-adjusted' ? 'default' : 'outline'}
            onClick={() => setRankingMode('risk-adjusted')}
          >
            Risk-Adjusted Returns
          </Button>
          <Button
            variant={rankingMode === 'absolute' ? 'default' : 'outline'}
            onClick={() => setRankingMode('absolute')}
          >
            Absolute Returns (Annualized)
          </Button>
        </div>

        {/* Ranking Table */}
        <Card>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 text-slate-600">Rank</div>
                <div className="col-span-4 text-slate-600">Creator</div>
                {rankingMode === 'risk-adjusted' ? (
                  <>
                    <div className="col-span-2 text-slate-600 text-right">P&L % (Annualized)</div>
                    <div className="col-span-2 text-slate-600 text-right">P&L % Since Joining</div>
                    <div className="col-span-2 text-slate-600 text-right">Sharpe Ratio</div>
                    <div className="col-span-1 text-slate-600 text-right">Average Drawdown %</div>
                  </>
                ) : (
                  <>
                    <div className="col-span-3 text-slate-600 text-right">P&L % (Annualized)</div>
                    <div className="col-span-4 text-slate-600 text-right">P&L ($)</div>
                  </>
                )}
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-200">
              {sortedCreators.map((creator, index) => (
                <div
                  key={creator.id}
                  className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => onCreatorClick(creator.id)}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-200 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {creator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-900 truncate">{creator.username}</span>
                            {creator.verified && (
                              <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-slate-500">
                            <span>{creator.specialty}</span>
                            <span>•</span>
                            <span>{(creator.followers / 1000).toFixed(1)}K followers</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Metrics based on mode */}
                    {rankingMode === 'risk-adjusted' ? (
                      <>
                        {/* P&L % (Annualized) */}
                        <div className="col-span-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600">
                              +{creator.pnlAnnualizedPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* P&L % Since Joining */}
                        <div className="col-span-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600">
                              +{creator.pnlSinceJoiningPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Sharpe Ratio */}
                        <div className="col-span-2 text-right">
                          <Badge
                            variant="secondary"
                            className={
                              creator.sharpeRatio >= 2.5 ? 'bg-emerald-100 text-emerald-700' :
                                creator.sharpeRatio >= 2.0 ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                            }
                          >
                            {creator.sharpeRatio.toFixed(2)}
                          </Badge>
                        </div>

                        {/* Max Drawdown */}
                        <div className="col-span-1 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <span className="text-red-600">
                              {creator.avgDrawdownPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* P&L % (Annualized) */}
                        <div className="col-span-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-600">
                              +{creator.pnlAnnualizedPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* P&L ($) */}
                        <div className="col-span-4 text-right">
                          <span className="text-emerald-600">
                            ${creator.pnlAbsoluteDollars.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}