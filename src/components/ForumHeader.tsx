import { Search, TrendingUp, LogOut, User, Settings } from 'lucide-react';
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
  onNewPostClick?: () => void;
  currentPage?: 'discover' | 'trending' | 'creators';
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
  onNewPostClick,
  currentPage = 'discover'
}: ForumHeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <h1 className="text-slate-900 font-bold text-xl">Synquity</h1>
          </div>

          {/* Center: Navigation Buttons */}
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === 'discover' ? 'default' : 'ghost'}
              onClick={onDiscoverClick}
            >
              Discover
            </Button>
            <Button
              variant={currentPage === 'trending' ? 'default' : 'ghost'}
              onClick={onTrendingClick}
            >
              Trending
            </Button>
            <Button
              variant={currentPage === 'creators' ? 'default' : 'ghost'}
              onClick={onCreatorsClick}
            >
              Creators
            </Button>
          </nav>

          {/* Right: Search + Auth/Profile */}
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-md hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search discussions, tickers, or creators..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {user ? (
              <>
                <Button
                  variant="default"
                  className="flex"
                  onClick={onNewPostClick}
                >
                  New Post
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={user.user_metadata.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata.full_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={onProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={onSettingsClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onLoginClick}>Log In</Button>
                <Button onClick={onSignupClick}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
