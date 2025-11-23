import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePost: (post: NewPost) => void;
}

export interface NewPost {
  title: string;
  ticker: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  market: string;
  timeHorizon: string;
  riskProfile: string;
}

export function CreatePostDialog({ open, onOpenChange, onCreatePost }: CreatePostDialogProps) {
  const [title, setTitle] = useState('');
  const [ticker, setTicker] = useState('');
  const [summary, setSummary] = useState('');
  const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [market, setMarket] = useState('Equities');
  const [timeHorizon, setTimeHorizon] = useState('Medium');
  const [riskProfile, setRiskProfile] = useState('Moderate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !ticker || !summary) {
      alert('Please fill in all required fields');
      return;
    }

    onCreatePost({
      title,
      ticker: ticker.toUpperCase(),
      summary,
      sentiment,
      market,
      timeHorizon,
      riskProfile,
    });

    // Reset form
    setTitle('');
    setTicker('');
    setSummary('');
    setSentiment('bullish');
    setMarket('Equities');
    setTimeHorizon('Medium');
    setRiskProfile('Moderate');
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your investment research and analysis with the community
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Post Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Deep Dive: Why NVDA is Undervalued"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Ticker */}
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker Symbol *</Label>
              <Input
                id="ticker"
                placeholder="e.g., NVDA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                placeholder="Brief summary of your analysis (max 200 characters)"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                maxLength={200}
                required
              />
              <div className="text-sm text-slate-500 text-right">
                {summary.length}/200 characters
              </div>
            </div>

            {/* Row 1: Sentiment and Market */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sentiment">Sentiment *</Label>
                <Select value={sentiment} onValueChange={(value: any) => setSentiment(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullish">Bullish</SelectItem>
                    <SelectItem value="bearish">Bearish</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="market">Market *</Label>
                <Select value={market} onValueChange={setMarket}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equities">Equities</SelectItem>
                    <SelectItem value="Crypto">Crypto</SelectItem>
                    <SelectItem value="Options">Options</SelectItem>
                    <SelectItem value="Commodities">Commodities</SelectItem>
                    <SelectItem value="Fixed Income">Fixed Income</SelectItem>
                    <SelectItem value="FX">FX</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Time Horizon and Risk Profile */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeHorizon">Time Horizon *</Label>
                <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Short">Short (0-6 months)</SelectItem>
                    <SelectItem value="Medium">Medium (6-18 months)</SelectItem>
                    <SelectItem value="Long">Long (18+ months)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskProfile">Risk Profile *</Label>
                <Select value={riskProfile} onValueChange={setRiskProfile}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Publish Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
