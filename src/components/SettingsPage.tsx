import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserSettings, updateUserSettings, updatePassword } from '../lib/api';
import { toast } from 'sonner';

interface SettingsPageProps {
    onNavigateHome: () => void;
}

export function SettingsPage({ onNavigateHome }: SettingsPageProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Notification settings state
    const [notifications, setNotifications] = useState({
        email_notifications: true,
        new_followers_notifications: true,
        post_interactions_notifications: true,
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const settings = await fetchUserSettings();
            setNotifications({
                email_notifications: settings.email_notifications ?? true,
                new_followers_notifications: settings.new_followers_notifications ?? true,
                post_interactions_notifications: settings.post_interactions_notifications ?? true,
            });
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
        const newNotifications = { ...notifications, [key]: value };
        setNotifications(newNotifications);
        
        setIsSavingNotifications(true);
        try {
            await updateUserSettings({ [key]: value });
            toast.success('Notification settings updated');
        } catch (error: any) {
            console.error('Error updating notification:', error);
            toast.error(error.message || 'Failed to update settings');
            // Revert on error
            setNotifications(notifications);
        } finally {
            setIsSavingNotifications(false);
        }
    };

    const handlePasswordUpdate = async () => {
        // Validation
        if (!passwordData.newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSavingPassword(true);
        try {
            await updatePassword(passwordData.newPassword);
            toast.success('Password updated successfully!');
            // Clear form
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500">Please log in to view settings</p>
            </div>
        );
    }

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

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-emerald-600" />
                                    <CardTitle>Notifications</CardTitle>
                                    {isSavingNotifications && (
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400 ml-2" />
                                    )}
                                </div>
                                <CardDescription>Manage how you receive updates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-slate-500">Receive daily digests and important updates</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.email_notifications}
                                        onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                                        disabled={isSavingNotifications}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>New Followers</Label>
                                        <p className="text-sm text-slate-500">Notify me when someone follows me</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.new_followers_notifications}
                                        onCheckedChange={(checked) => handleNotificationChange('new_followers_notifications', checked)}
                                        disabled={isSavingNotifications}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Post Interactions</Label>
                                        <p className="text-sm text-slate-500">Notify me about likes and comments</p>
                                    </div>
                                    <Switch 
                                        checked={notifications.post_interactions_notifications}
                                        onCheckedChange={(checked) => handleNotificationChange('post_interactions_notifications', checked)}
                                        disabled={isSavingNotifications}
                                    />
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
                                <CardDescription>Update your password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input 
                                            id="new-password" 
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500">Must be at least 6 characters</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input 
                                            id="confirm-password" 
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={handlePasswordUpdate}
                                    disabled={isSavingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                >
                                    {isSavingPassword ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
