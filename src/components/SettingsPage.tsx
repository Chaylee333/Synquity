import { ArrowLeft, Bell, Lock, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface SettingsPageProps {
    onNavigateHome: () => void;
}

export function SettingsPage({ onNavigateHome }: SettingsPageProps) {
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

            <div className="container mx-auto px-4 pb-20 max-w-3xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-600" />
                                <CardTitle>Account Information</CardTitle>
                            </div>
                            <CardDescription>Update your personal details and public profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="johndoe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="john@example.com" disabled />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-emerald-600" />
                                <CardTitle>Notifications</CardTitle>
                            </div>
                            <CardDescription>Manage how you receive updates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-slate-500">Receive daily digests and important updates</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>New Followers</Label>
                                    <p className="text-sm text-slate-500">Notify me when someone follows me</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Post Interactions</Label>
                                    <p className="text-sm text-slate-500">Notify me about likes and comments</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-600" />
                                <CardTitle>Security</CardTitle>
                            </div>
                            <CardDescription>Manage your password and security settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <Button variant="outline">Update Password</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
