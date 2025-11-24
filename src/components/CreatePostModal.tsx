import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { createPost } from '../lib/api';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [ticker, setTicker] = useState('');
    const [category, setCategory] = useState('DD');
    const [sentiment, setSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
    const [market, setMarket] = useState('Equities');
    const [timeHorizon, setTimeHorizon] = useState('Medium');
    const [riskProfile, setRiskProfile] = useState('Moderate');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await createPost({
                title,
                content,
                ticker: ticker.toUpperCase(),
                category,
                sentiment,
                market,
                time_horizon: timeHorizon,
                risk_profile: riskProfile,
            });

            // Reset form
            setTitle('');
            setContent('');
            setTicker('');
            setCategory('DD');
            setSentiment('neutral');
            setMarket('Equities');
            setTimeHorizon('Medium');
            setRiskProfile('Moderate');

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to create post. Please try again.');
            console.error('Error creating post:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Create New Post</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="ticker">Ticker *</Label>
                            <Input
                                id="ticker"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                                placeholder="e.g., NVDA, TSLA"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="content">Content *</Label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your analysis, insights, or news..."
                                required
                                className="w-full min-h-[200px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DD">Due Diligence</SelectItem>
                                        <SelectItem value="News">News</SelectItem>
                                        <SelectItem value="Discussion">Discussion</SelectItem>
                                        <SelectItem value="Question">Question</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="sentiment">Sentiment</Label>
                                <Select value={sentiment} onValueChange={(v: any) => setSentiment(v)}>
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="market">Market</Label>
                                <Select value={market} onValueChange={setMarket}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Equities">Equities</SelectItem>
                                        <SelectItem value="Crypto">Crypto</SelectItem>
                                        <SelectItem value="Commodities">Commodities</SelectItem>
                                        <SelectItem value="FX">FX</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="timeHorizon">Time Horizon</Label>
                                <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Short">Short</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Long">Long</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="riskProfile">Risk Profile</Label>
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

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Post'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
