import { MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

interface Discussion {
  id: number;
  title: string;
  author: string;
  avatar: string;
  timestamp: string;
  category: string;
  ticker: string;
  content: string;
  upvotes: number;
  comments: number;
  tags: string[];
}

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 pt-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-100">
              <TrendingUp className="w-4 h-4 text-slate-600" />
            </Button>
            <span className="text-slate-700">{discussion.upvotes}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100">
              <TrendingDown className="w-4 h-4 text-slate-600" />
            </Button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                ${discussion.ticker}
              </Badge>
              {discussion.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h3 className="text-slate-900 mb-2 cursor-pointer hover:text-emerald-600 transition-colors">
              {discussion.title}
            </h3>

            <p className="text-slate-600 line-clamp-2 mb-3">
              {discussion.content}
            </p>

            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">{discussion.avatar}</AvatarFallback>
                </Avatar>
                <span>{discussion.author}</span>
              </div>
              <span>•</span>
              <span>{discussion.timestamp}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{discussion.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
