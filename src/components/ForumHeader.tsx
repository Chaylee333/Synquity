import { useState, useEffect } from 'react';
import { Search, LogOut, User, Settings, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SynquityLogo } from './SynquityLogo';
import { fetchUserProfile } from '../lib/api';

interface ForumHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onDiscoverClick?: () => void;
  onTrendingClick?: () => void;
  onCreatorsClick?: () => void;
  onMyFeedClick?: () => void;
  currentPage?: 'discover' | 'trending' | 'creators' | 'myfeed';
}

export function ForumHeader({
  searchQuery,
  onSearchChange,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onSettingsClick,
  onDiscoverClick,
  onTrendingClick,
  onCreatorsClick,
  onMyFeedClick,
  currentPage = 'discover'
}: ForumHeaderProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  // Fetch profile to get avatar_url
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id).then(setProfile).catch(console.error);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  // Get the avatar URL from profile or user metadata
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  
  // Get display name for initials
  const displayName = profile?.full_name || user?.user_metadata?.full_name || '';
  
  // Get first initial only
  const getInitial = (name: string) => {
    if (!name) return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Logo with hover effect */}
          <div 
            className="flex items-center cursor-pointer group transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105" 
            onClick={onDiscoverClick}
          >
            <SynquityLogo height={32} />
          </div>

          {/* Center: Navigation Buttons with pill design */}
          <nav className="flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1.5 backdrop-blur-sm">
            <Button
              variant={currentPage === 'discover' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-xl px-5 ${currentPage === 'discover' ? 'shadow-md' : 'hover:bg-white/60'}`}
              onClick={onDiscoverClick}
            >
              Discover
            </Button>
            <Button
              variant={currentPage === 'trending' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-xl px-5 ${currentPage === 'trending' ? 'shadow-md' : 'hover:bg-white/60'}`}
              onClick={onTrendingClick}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Trending
            </Button>
            <Button
              variant={currentPage === 'creators' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-xl px-5 ${currentPage === 'creators' ? 'shadow-md' : 'hover:bg-white/60'}`}
              onClick={onCreatorsClick}
            >
              Creators
            </Button>
          </nav>

          {/* Right: Search + Auth/Profile */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md hidden lg:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                <Input
                  type="text"
                  placeholder="Search discussions, tickers, or creators..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-11 pr-4 h-11 rounded-xl bg-slate-50/80 border-slate-200/60 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                />
              </div>
            </div>

            {user ? (
              <>
                <Button
                  variant={currentPage === 'myfeed' ? 'default' : 'outline'}
                  size="sm"
                  className={`rounded-xl ${currentPage === 'myfeed' ? 'shadow-md' : ''}`}
                  onClick={onMyFeedClick}
                >
                  My Feed
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative">
                      <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-semibold">
                          {getInitial(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 rounded-xl border-slate-200/60 shadow-xl bg-white/95 backdrop-blur-xl p-2"
                  >
                    <DropdownMenuLabel className="text-xs text-slate-500 font-normal px-2">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-100" 
                      onClick={onProfileClick}
                    >
                      <User className="mr-3 h-4 w-4 text-slate-500" />
                      <span className="font-medium">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-100" 
                      onClick={onSettingsClick}
                    >
                      <Settings className="mr-3 h-4 w-4 text-slate-500" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={onLoginClick}>
                  Log In
                </Button>
                <Button size="sm" className="rounded-xl shadow-md" onClick={onSignupClick}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
