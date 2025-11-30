import { TrendingUp, Search, Filter, BadgeCheck, TrendingDown, Target, Award, Building2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useState, useEffect, useRef } from 'react';
import { fetchCompanies, fetchPosts, searchTickers } from '../lib/api';
import { CreatePostModal } from './CreatePostModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ForumHeader } from './ForumHeader';

interface DiscoverPageProps {
  onTickerClick: (ticker: string) => void;
  onCreatorClick: (creatorId: string) => void;
  onPostClick: (postId: number) => void;
  onTrendingClick: () => void;
  onCreatorsClick: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onMyFeedClick: () => void;
}

type MasterCategory = 'Companies' | 'Investment Research' | 'Creators';

const companies = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    industry: 'Technology',
    marketCap: 'Large',
    price: 875.28,
    change: 2.34,
    changePercent: 8.5,
    description: 'Leading AI chip manufacturer dominating the data center GPU market',
    employees: 29600,
    founded: 1993,
    posts: 234,
  },
  {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    industry: 'Automotive',
    marketCap: 'Large',
    price: 242.84,
    change: 5.67,
    changePercent: 12.3,
    description: 'Electric vehicle and clean energy company',
    employees: 127855,
    founded: 2003,
    posts: 456,
  },
  {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    industry: 'Technology',
    marketCap: 'Large',
    price: 478.42,
    change: 12.45,
    changePercent: 15.7,
    description: 'Social media and metaverse technology company',
    employees: 67317,
    founded: 2004,
    posts: 312,
  },
  {
    ticker: 'COIN',
    name: 'Coinbase Global, Inc.',
    industry: 'Financial Services',
    marketCap: 'Mid',
    price: 168.92,
    change: -8.23,
    changePercent: -8.2,
    description: 'Cryptocurrency exchange platform',
    employees: 3730,
    founded: 2012,
    posts: 189,
  },
  {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    industry: 'Technology',
    marketCap: 'Large',
    price: 164.52,
    change: 3.84,
    changePercent: 5.8,
    description: 'Semiconductor company producing CPUs and GPUs',
    employees: 26000,
    founded: 1969,
    posts: 298,
  },
  {
    ticker: 'SQ',
    name: 'Block, Inc.',
    industry: 'Financial Services',
    marketCap: 'Mid',
    price: 78.34,
    change: 2.12,
    changePercent: 4.2,
    description: 'Financial services and digital payments company',
    employees: 13000,
    founded: 2009,
    posts: 156,
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    industry: 'Technology',
    marketCap: 'Mid',
    price: 28.45,
    change: 1.23,
    changePercent: 6.8,
    description: 'Big data analytics and AI software company',
    employees: 3838,
    founded: 2003,
    posts: 223,
  },
  {
    ticker: 'NIO',
    name: 'NIO Inc.',
    industry: 'Automotive',
    marketCap: 'Small',
    price: 8.92,
    change: -0.34,
    changePercent: -2.1,
    description: 'Chinese electric vehicle manufacturer',
    employees: 11863,
    founded: 2014,
    posts: 178,
  },
];

const creators = [
  {
    id: 'macro-bull',
    username: 'MacroBull',
    avatar: 'MB',
    verified: true,
    followers: 28900,
    posts: 178,
    specialty: 'Macro Trading',
    pnlAnnualizedPercent: 42.3,
    pnlSinceJoiningPercent: 156.7,
    sharpeRatio: 2.8,
    credibilityScore: 94,
    winRate: 82,
    bio: 'Global macro trader focused on central bank policies and currency movements',
  },
  {
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
    credibilityScore: 89,
    winRate: 76,
    bio: 'Early Bitcoin investor, specializing in crypto market cycles and on-chain analysis',
  },
  {
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
    credibilityScore: 91,
    winRate: 85,
    bio: 'Value investor with deep fundamental analysis expertise',
  },
  {
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
    credibilityScore: 93,
    winRate: 88,
    bio: 'Former Fed economist tracking monetary policy and its market implications',
  },
  {
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
    credibilityScore: 87,
    winRate: 78,
    bio: 'Technology sector specialist focusing on AI and semiconductor companies',
  },
  {
    id: 'value-hunter',
    username: 'ValueHunter',
    avatar: 'VH',
    verified: true,
    followers: 22400,
    posts: 289,
    specialty: 'Value Investing',
    pnlAnnualizedPercent: 35.8,
    pnlSinceJoiningPercent: 145.2,
    sharpeRatio: 2.7,
    credibilityScore: 91,
    winRate: 85,
    bio: 'Deep value investor finding hidden gems in undervalued markets',
  },
];

const ddPosts = [
  {
    id: 1,
    title: 'Deep Dive: NVDA\'s AI Dominance and Path to $1T Revenue',
    ticker: 'NVDA',
    author: 'TechInvestor42',
    authorId: 'tech-investor-42',
    avatar: 'TI',
    verified: true,
    credibilityScore: 87,
    summary: 'Comprehensive analysis of NVIDIA\'s AI chip ecosystem moat, data center revenue trajectory, and competitive positioning against AMD and Intel.',
    sixMonthReturn: 34.5,
    winRate: 78,
    sharpeRatio: 2.3,
    followers: 15600,
    timestamp: '2h ago',
    market: 'Equities',
    timeHorizon: 'Long',
    riskProfile: 'Moderate',
    hasChart: true,
    sentiment: 'bullish',
    stockPerformance: 8.5,
    likes: 892,
    comments: 124,
    industry: 'Technology',
    marketCap: 'Large',
  },
  {
    id: 8,
    title: 'TSLA: The Energy Company Disguised as a Car Maker',
    ticker: 'TSLA',
    author: 'GreenPortfolio',
    authorId: 'green-portfolio',
    avatar: 'GP',
    verified: false,
    credibilityScore: 82,
    summary: 'Analysis of Tesla\'s energy storage business, solar integration, and how the energy segment could surpass automotive revenue by 2028.',
    sixMonthReturn: 28.3,
    winRate: 72,
    sharpeRatio: 1.9,
    followers: 11200,
    timestamp: '5h ago',
    market: 'Equities',
    timeHorizon: 'Long',
    riskProfile: 'High',
    hasChart: true,
    sentiment: 'bullish',
    stockPerformance: 12.3,
    likes: 654,
    comments: 89,
    industry: 'Automotive',
    marketCap: 'Large',
  },
  {
    id: 2,
    title: 'Why META is Undervalued: The Reality Labs Turnaround',
    ticker: 'META',
    author: 'ValueHunter',
    authorId: 'value-hunter',
    avatar: 'VH',
    verified: true,
    credibilityScore: 91,
    summary: 'Deep dive into Meta\'s Reality Labs division showing path to profitability, AR/VR market positioning, and why current P/E doesn\'t reflect true value.',
    sixMonthReturn: 41.2,
    winRate: 85,
    sharpeRatio: 2.8,
    followers: 22400,
    timestamp: '1d ago',
    market: 'Equities',
    timeHorizon: 'Medium',
    riskProfile: 'Moderate',
    hasChart: true,
    sentiment: 'bullish',
    stockPerformance: 15.7,
    likes: 1243,
    comments: 201,
    industry: 'Technology',
    marketCap: 'Large',
  },
  {
    id: 3,
    title: 'Bearish on COIN: Regulatory Headwinds and Declining Volume',
    ticker: 'COIN',
    author: 'CryptoSkeptic',
    authorId: 'crypto-skeptic',
    avatar: 'CS',
    verified: false,
    credibilityScore: 76,
    summary: 'Analysis of Coinbase\'s regulatory challenges, declining trading volumes, and competition from decentralized exchanges.',
    sixMonthReturn: -12.8,
    winRate: 58,
    sharpeRatio: 1.2,
    followers: 8900,
    timestamp: '6h ago',
    market: 'Crypto',
    timeHorizon: 'Short',
    riskProfile: 'High',
    hasChart: false,
    sentiment: 'bearish',
    stockPerformance: -8.2,
    likes: 432,
    comments: 156,
    industry: 'Financial Services',
    marketCap: 'Mid',
  },
  {
    id: 4,
    title: 'Gold Mining Stocks: The Inflation Hedge Play for 2024',
    ticker: 'GDX',
    author: 'CommodityKing',
    authorId: 'commodity-king',
    avatar: 'CK',
    verified: true,
    credibilityScore: 88,
    summary: 'Comprehensive analysis of gold mining ETF GDX, covering cost curves, production growth, and correlation with real yields.',
    sixMonthReturn: 19.6,
    winRate: 71,
    sharpeRatio: 1.8,
    followers: 13500,
    timestamp: '12h ago',
    market: 'Commodities',
    timeHorizon: 'Medium',
    riskProfile: 'Moderate',
    hasChart: true,
    sentiment: 'bullish',
    stockPerformance: 6.4,
    likes: 567,
    comments: 78,
    industry: 'Materials',
    marketCap: 'Small',
  },
  {
    id: 5,
    title: 'Treasury Bonds: Why I\'m Loading Up on Long-Duration',
    ticker: 'TLT',
    author: 'BondTrader',
    authorId: 'bond-trader',
    avatar: 'BT',
    verified: true,
    credibilityScore: 93,
    summary: 'Analysis of the yield curve, Fed policy trajectory, and why 20+ year treasury bonds offer asymmetric risk/reward.',
    sixMonthReturn: 8.4,
    winRate: 68,
    sharpeRatio: 2.1,
    followers: 18700,
    timestamp: '8h ago',
    market: 'Fixed Income',
    timeHorizon: 'Long',
    riskProfile: 'Low',
    hasChart: true,
    sentiment: 'bullish',
    stockPerformance: 3.2,
    likes: 789,
    comments: 134,
    industry: 'Financial Services',
    marketCap: 'Large',
  },
  {
    id: 6,
    title: 'AMD vs NVDA: The GPU War Nobody\'s Talking About',
    ticker: 'AMD',
    author: 'ChipAnalyst',
    authorId: 'chip-analyst',
    avatar: 'CA',
    verified: false,
    credibilityScore: 79,
    summary: 'Comparative analysis of AMD\'s MI300 against NVIDIA\'s H100, market share trends, and datacenter design win pipeline.',
    sixMonthReturn: 22.1,
    winRate: 74,
    sharpeRatio: 2.0,
    followers: 9800,
    timestamp: '3h ago',
    market: 'Equities',
    timeHorizon: 'Medium',
    riskProfile: 'Moderate',
    hasChart: true,
    sentiment: 'neutral',
    stockPerformance: 5.8,
    likes: 621,
    comments: 98,
    industry: 'Technology',
    marketCap: 'Large',
  },
  {
    id: 7,
    title: 'Real Estate Crash Incoming: Short Commercial REITs',
    ticker: 'VNQ',
    author: 'REITWatcher',
    authorId: 'reit-watcher',
    avatar: 'RW',
    verified: true,
    credibilityScore: 84,
    summary: 'Analysis of commercial real estate fundamentals, office vacancy rates, and why REITs are overvalued relative to NAV.',
    sixMonthReturn: -5.3,
    winRate: 62,
    sharpeRatio: 1.4,
    followers: 12100,
    timestamp: '1d ago',
    market: 'Real Estate',
    timeHorizon: 'Medium',
    riskProfile: 'Moderate',
    hasChart: false,
    sentiment: 'bearish',
    stockPerformance: -4.1,
    likes: 534,
    comments: 167,
    industry: 'Real Estate',
    marketCap: 'Mid',
  },
];

export function DiscoverPage({
  onTickerClick,
  onCreatorClick,
  onPostClick,
  onTrendingClick,
  onCreatorsClick,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onSettingsClick,
  onMyFeedClick
}: DiscoverPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [masterCategory, setMasterCategory] = useState<MasterCategory>('Investment Research');

  // API data state
  const [apiCompanies, setApiCompanies] = useState<any[]>([]);
  const [apiPosts, setApiPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create Post Modal state
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // Ticker search state
  const [tickerSearchResults, setTickerSearchResults] = useState<any[]>([]);
  const [showTickerDropdown, setShowTickerDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch companies and posts from API
  const loadData = async () => {
    setIsLoading(true);
    const [companiesData, postsData] = await Promise.all([
      fetchCompanies(),
      fetchPosts({ limit: 50 })
    ]);
    console.log('Fetched companies from Supabase:', companiesData);
    console.log('Fetched posts from Supabase:', postsData);
    setApiCompanies(companiesData);
    setApiPosts(postsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced ticker search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setTickerSearchResults([]);
      setShowTickerDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchTickers(searchQuery, 10);
      setTickerSearchResults(results);
      setShowTickerDropdown(results.length > 0);
      setIsSearching(false);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowTickerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle ticker click from dropdown
  const handleTickerSelect = (ticker: string) => {
    setSearchQuery('');
    setShowTickerDropdown(false);
    onTickerClick(ticker);
  };

  // Companies filters
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedMarketCap, setSelectedMarketCap] = useState<string>('all');

  // Investment Research filters
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('all');
  const [selectedRiskProfile, setSelectedRiskProfile] = useState<string>('all');

  // Creators filters
  const [creatorSortBy, setCreatorSortBy] = useState<string>('risk-adjusted');

  // Filter companies from API data
  const filteredCompanies = apiCompanies
    .filter(company => {
      const industry = company.industry || '';
      const marketCap = company.company_metrics?.[0]?.market_cap || '';

      if (selectedIndustry !== 'all' && industry !== selectedIndustry) return false;
      // For now, skip market cap filtering since the data format is different
      return true;
    })
    .map(company => ({
      ticker: company.ticker,
      name: company.name,
      industry: company.industry || 'N/A',
      marketCap: company.company_metrics?.[0]?.market_cap || 'N/A',
      price: company.company_metrics?.[0]?.price || 0,
      change: company.company_metrics?.[0]?.change || 0,
      changePercent: company.company_metrics?.[0]?.change_percent || 0,
      description: company.description || '',
      employees: company.employees || 0,
      founded: company.founded || 0,
      posts: 0, // This would need to be calculated from posts table
    }));

  // Filter posts from API data
  const filteredPosts = apiPosts
    .filter(post => {
      if (selectedMarket !== 'all' && post.market !== selectedMarket) return false;
      if (selectedTimeHorizon !== 'all' && post.time_horizon !== selectedTimeHorizon) return false;
      if (selectedRiskProfile !== 'all' && post.risk_profile !== selectedRiskProfile) return false;
      return true;
    })
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.profiles?.username || post.profiles?.full_name || 'Anonymous',
      authorId: post.author_id, // Add authorId
      authorAvatar: post.profiles?.avatar_url || '',
      avatar: post.profiles?.avatar_url || '', // Add avatar (duplicate for compatibility)
      verified: post.profiles?.is_verified || false,
      ticker: post.ticker,
      summary: post.content.substring(0, 200) + '...', // First 200 chars as summary
      sentiment: post.sentiment || 'neutral',
      market: post.market || 'Equities',
      timeHorizon: post.time_horizon || 'Medium',
      riskProfile: post.risk_profile || 'Moderate',
      readTime: post.read_time || '5 min',
      likes: post.post_likes?.[0]?.count || 0,
      comments: post.comments?.[0]?.count || 0,
      stockPerformance: post.post_performance_tracking?.[0]?.stock_performance || 0,
      credibilityScore: 85, // Would need to calculate from author's performance
      winRate: 75, // Would need to calculate from author's performance
      createdAt: post.created_at,
      timestamp: post.created_at, // Add timestamp (duplicate for compatibility)
      followers: 0, // Would need to fetch from follows table
    }));

  // Sort creators
  const sortedCreators = [...creators].sort((a, b) => {
    if (creatorSortBy === 'risk-adjusted') {
      return b.sharpeRatio - a.sharpeRatio;
    } else if (creatorSortBy === 'absolute') {
      return b.pnlAnnualizedPercent - a.pnlAnnualizedPercent;
    } else if (creatorSortBy === 'trending') {
      return b.followers - a.followers;
    }
    return 0;
  });

  const industries = ['Technology', 'Financial Services', 'Healthcare', 'Consumer', 'Industrial', 'Materials', 'Energy', 'Real Estate', 'Automotive'];
  const marketCaps = ['Large', 'Mid', 'Small', 'Micro'];
  const markets = ['Equities', 'Crypto', 'Commodities', 'Fixed Income', 'Real Estate', 'FX'];
  const timeHorizons = ['Short', 'Medium', 'Long'];
  const riskProfiles = ['Low', 'Moderate', 'High'];

  const getTitle = () => {
    if (masterCategory === 'Companies') return 'Companies';
    if (masterCategory === 'Investment Research') return 'Investment Research Posts';
    if (masterCategory === 'Creators') return 'Content Creators';
    return '';
  };

  const getResultCount = () => {
    if (masterCategory === 'Companies') return filteredCompanies.length;
    if (masterCategory === 'Investment Research') return filteredPosts.length;
    if (masterCategory === 'Creators') return sortedCreators.length;
    return 0;
  };

  return (
    <>
      <ForumHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onDiscoverClick={() => { }} // Already on discover
        onTrendingClick={onTrendingClick}
        onCreatorsClick={onCreatorsClick}
        onMyFeedClick={onMyFeedClick}
        currentPage="discover"
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onSuccess={() => loadData()}
      />

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="relative max-w-4xl mx-auto mb-6" ref={searchContainerRef}>
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
            <Input
              type="text"
              placeholder="Discover your next alpha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-6 py-8 text-xl rounded-2xl shadow-sm border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />

            {/* Ticker Search Dropdown */}
            {showTickerDropdown && tickerSearchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {tickerSearchResults.map((company) => (
                  <button
                    key={company.ticker}
                    onClick={() => handleTickerSelect(company.ticker)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {company.ticker.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{company.ticker}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-600 truncate">{company.name}</span>
                      </div>
                      {company.industry && (
                        <div className="text-sm text-slate-500">{company.industry}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isSearching && searchQuery.trim().length > 0 && (
              <div className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-6 py-4 text-center text-slate-500">
                Searching...
              </div>
            )}

            {/* No results indicator */}
            {!isSearching && searchQuery.trim().length > 0 && tickerSearchResults.length === 0 && (
              <div className="absolute w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-6 py-4 text-center text-slate-500">
                No tickers found
              </div>
            )}
          </div>

          {/* Horizontal Filters */}
          <div className="max-w-4xl mx-auto">
            {/* Master Category Buttons */}
            <div className="flex gap-3 mb-4">
              <Button
                variant={masterCategory === 'Companies' ? 'default' : 'outline'}
                onClick={() => setMasterCategory('Companies')}
              >
                Companies
              </Button>
              <Button
                variant={masterCategory === 'Investment Research' ? 'default' : 'outline'}
                onClick={() => setMasterCategory('Investment Research')}
              >
                Investment Research
              </Button>
              <Button
                variant={masterCategory === 'Creators' ? 'default' : 'outline'}
                onClick={() => setMasterCategory('Creators')}
              >
                Creators
              </Button>
            </div>

            {/* Dynamic Additional Filters */}
            <div className="flex gap-3 flex-wrap">
              {masterCategory === 'Companies' && (
                <>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMarketCap} onValueChange={setSelectedMarketCap}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Market Capitalization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Market Caps</SelectItem>
                      {marketCaps.map(cap => (
                        <SelectItem key={cap} value={cap}>{cap} Cap</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {masterCategory === 'Investment Research' && (
                <>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Markets</SelectItem>
                      {markets.map(market => (
                        <SelectItem key={market} value={market}>{market}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTimeHorizon} onValueChange={setSelectedTimeHorizon}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Time Horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time Horizons</SelectItem>
                      {timeHorizons.map(horizon => (
                        <SelectItem key={horizon} value={horizon}>{horizon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedRiskProfile} onValueChange={setSelectedRiskProfile}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Risk Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Profiles</SelectItem>
                      {riskProfiles.map(profile => (
                        <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {masterCategory === 'Creators' && (
                <Select value={creatorSortBy} onValueChange={setCreatorSortBy}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk-adjusted">Sorted by Risk-Adjusted P&L</SelectItem>
                    <SelectItem value="absolute">Sorted by Absolute P&L</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-slate-900 mb-1">{getTitle()}</h2>
            <p className="text-slate-600">
              {getResultCount()} {getResultCount() === 1 ? 'result' : 'results'} found
            </p>
          </div>

          <div className="space-y-4">
            {/* Companies View */}
            {masterCategory === 'Companies' && filteredCompanies.map(company => (
              <Card
                key={company.ticker}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onTickerClick(company.ticker)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Company Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>

                    {/* Company Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-900">{company.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Badge variant="secondary">${company.ticker}</Badge>
                            <span>•</span>
                            <span>{company.industry}</span>
                            <span>•</span>
                            <span>{company.marketCap} Cap</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-900">${company.price.toFixed(2)}</div>
                          <div className={`flex items-center gap-1 justify-end ${company.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {company.changePercent >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span>{company.changePercent >= 0 ? '+' : ''}{company.changePercent}%</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-3">
                        {company.description}
                      </p>

                      <div className="flex items-center gap-4 text-slate-500">
                        <span>Founded {company.founded}</span>
                        <span>•</span>
                        <span>{company.employees.toLocaleString()} employees</span>
                        <span>•</span>
                        <span>{company.posts} posts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Investment Research View */}
            {masterCategory === 'Investment Research' && filteredPosts.map(post => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPostClick(post.id)}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Creator Info */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-12 h-12 cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        onCreatorClick(post.authorId);
                      }}>
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-slate-900 hover:text-emerald-600 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreatorClick(post.authorId);
                            }}
                          >
                            {post.author}
                          </span>
                          {post.verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-500">{post.timestamp}</span>
                        </div>
                      </div>

                      <h3
                        className="text-slate-900 mb-2 hover:text-emerald-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostClick(post.id);
                        }}
                      >
                        {post.title}
                      </h3>

                      <p className="text-slate-600 mb-3 line-clamp-2">
                        {post.summary}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-emerald-100"
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
                                : 'border-slate-200 text-slate-700 bg-slate-50'
                          }
                        >
                          {post.sentiment.charAt(0).toUpperCase() + post.sentiment.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1 text-slate-600">
                          {post.stockPerformance >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={post.stockPerformance >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                            {post.stockPerformance >= 0 ? '+' : ''}{post.stockPerformance}%
                          </span>
                          <span className="text-slate-500 ml-1">since post</span>
                        </div>
                      </div>

                      {/* Creator Stats */}
                      <div className="flex items-center gap-4 text-slate-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{post.credibilityScore}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{post.winRate}% Win Rate</span>
                        </div>
                        <span>•</span>
                        <span>{post.followers.toLocaleString()} followers</span>
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center gap-4 text-slate-500">
                        <button className="hover:text-emerald-600 transition-colors">
                          👍 {post.likes}
                        </button>
                        <button className="hover:text-emerald-600 transition-colors">
                          💬 {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Creators View */}
            {masterCategory === 'Creators' && sortedCreators.map((creator, index) => (
              <Card
                key={creator.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onCreatorClick(creator.id)}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Creator Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                          {creator.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Creator Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-slate-900">{creator.username}</h3>
                            {creator.verified && (
                              <BadgeCheck className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-slate-600 mb-2">
                            <span>{creator.specialty}</span>
                            <span>•</span>
                            <span>{(creator.followers / 1000).toFixed(1)}K followers</span>
                            <span>•</span>
                            <span>{creator.posts} posts</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? 'bg-amber-100 text-amber-700' :
                            index === 1 ? 'bg-slate-200 text-slate-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-600 mb-3">
                        {creator.bio}
                      </p>

                      {/* Performance Metrics */}
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">+{creator.pnlAnnualizedPercent}% P&L</span>
                        </div>
                        <div>
                          <Badge
                            variant="secondary"
                            className={
                              creator.sharpeRatio >= 2.5 ? 'bg-emerald-100 text-emerald-700' :
                                creator.sharpeRatio >= 2.0 ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                            }
                          >
                            Sharpe {creator.sharpeRatio.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
