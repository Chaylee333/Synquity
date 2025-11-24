import { ArrowLeft, User, Mail, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
    onNavigateHome: () => void;
}

export function ProfilePage({ onNavigateHome }: ProfilePageProps) {
    const { user } = useAuth();

    if (!user) return null;

    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="container mx-auto px-4 py-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNavigateHome}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Button>
            </div>

            <div className="container mx-auto px-4 pb-20 max-w-4xl">
                <div className="grid gap-6">
                    {/* Profile Header */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.user_metadata.avatar_url} />
                                    <AvatarFallback className="text-2xl">
                                        {user.user_metadata.full_name?.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <h1 className="text-2xl font-bold text-slate-900">
                                        {user.user_metadata.full_name}
                                    </h1>
                                    <p className="text-slate-500 font-medium">@{user.user_metadata.username}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {joinDate}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <Button>Edit Profile</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Sidebar Stats */}
                        <Card className="md:col-span-1 h-fit">
                            <CardHeader>
                                <CardTitle>Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Posts</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Followers</span>
                                    <span className="font-semibold">0</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Following</span>
                                    <span className="font-semibold">0</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Main Content Area */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">
                                        No bio added yet.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your latest posts and comments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-slate-500">
                                        No activity yet. Start engaging with the community!
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
