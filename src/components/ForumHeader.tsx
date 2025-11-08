import { Search, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface ForumHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ForumHeader({ searchQuery, onSearchChange }: ForumHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <h1 className="text-slate-900">StockTalk Forum</h1>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button>New Discussion</Button>
        </div>
      </div>
    </header>
  );
}
