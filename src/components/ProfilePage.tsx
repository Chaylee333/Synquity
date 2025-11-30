import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Calendar, Loader2, Camera, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, fetchUserProfile, uploadAvatar } from '../lib/api';
import { toast } from 'sonner';

interface ProfilePageProps {
    onNavigateHome: () => void;
}

export function ProfilePage({ onNavigateHome }: ProfilePageProps) {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        bio: '',
        website: '',
        location: '',
    });

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const profileData = await fetchUserProfile(user.id);
            if (profileData) {
                setProfile(profileData);
                setFormData({
                    username: profileData.username || user.user_metadata?.username || '',
                    full_name: profileData.full_name || user.user_metadata?.full_name || '',
                    bio: profileData.bio || '',
                    website: profileData.website || '',
                    location: profileData.location || '',
                });
                setAvatarPreview(profileData.avatar_url || user.user_metadata?.avatar_url || null);
            } else {
                // Use auth metadata as fallback
                setFormData({
                    username: user.user_metadata?.username || '',
                    full_name: user.user_metadata?.full_name || '',
                    bio: '',
                    website: '',
                    location: '',
                });
                setAvatarPreview(user.user_metadata?.avatar_url || null);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload the file
        setIsUploadingAvatar(true);
        try {
            const newAvatarUrl = await uploadAvatar(file);
            setAvatarPreview(newAvatarUrl);
            toast.success('Profile picture updated!');
            await loadProfile(); // Reload to get updated data
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast.error(error.message || 'Failed to upload profile picture');
            // Revert preview on error
            setAvatarPreview(profile?.avatar_url || user?.user_metadata?.avatar_url || null);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!formData.username.trim()) {
            toast.error('Username is required');
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                username: formData.username.trim(),
                full_name: formData.full_name.trim(),
                bio: formData.bio.trim(),
                website: formData.website.trim(),
                location: formData.location.trim(),
            });
            
            toast.success('Profile updated successfully!');
            setIsEditModalOpen(false);
            await loadProfile(); // Reload profile data
        } catch (error: any) {
            console.error('Error saving profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    const displayName = profile?.full_name || user.user_metadata?.full_name || 'User';
    const displayUsername = profile?.username || user.user_metadata?.username || 'user';
    const currentAvatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;

    // Get initials for fallback
    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

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
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                        <AvatarImage src={currentAvatarUrl} />
                                        <AvatarFallback className="text-2xl bg-emerald-500 text-white">
                                            {getInitials(displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <h1 className="text-2xl font-bold text-slate-900">
                                            {displayName}
                                        </h1>
                                        <p className="text-slate-500 font-medium">@{displayUsername}</p>
                                        
                                        {profile?.bio && (
                                            <p className="text-slate-600 mt-2">{profile.bio}</p>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Joined {joinDate}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </div>
                                            {profile?.location && (
                                                <div className="flex items-center gap-1">
                                                    📍 {profile.location}
                                                </div>
                                            )}
                                            {profile?.website && (
                                                <a 
                                                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-emerald-600 hover:underline"
                                                >
                                                    🔗 {profile.website}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <Button onClick={() => setIsEditModalOpen(true)}>
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <Avatar className="w-24 h-24 border-4 border-slate-200">
                                    <AvatarImage src={avatarPreview || currentAvatarUrl} />
                                    <AvatarFallback className="text-2xl bg-emerald-500 text-white">
                                        {getInitials(formData.full_name || displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-0 right-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAvatarClick}
                                disabled={isUploadingAvatar}
                                className="gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                            </Button>
                            <p className="text-xs text-slate-500">JPG, PNG or GIF. Max 5MB.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="your_username"
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={3}
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="New York, NY"
                            />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
