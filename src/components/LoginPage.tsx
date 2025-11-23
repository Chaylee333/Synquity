import { TrendingUp, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useState } from 'react';

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateToSignUp: () => void;
  onLoginSuccess?: (userId: string) => void;
}

export function LoginPage({ onNavigateHome, onNavigateToSignUp, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic - in production this would call an API
    console.log('Logging in with:', email, password);
    
    // Simulate successful login and use the email as userId (or a known user ID)
    const userId = 'tech-investor-42'; // Default logged in user
    if (onLoginSuccess) {
      onLoginSuccess(userId);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log('Logging in with:', provider);
    // Simulate successful social login
    const userId = 'tech-investor-42';
    if (onLoginSuccess) {
      onLoginSuccess(userId);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80"
              onClick={onNavigateHome}
            >
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h1 className="text-slate-900">StockTalk Forum</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Log In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Log In Button */}
            <Button 
              className="w-full" 
              onClick={handleLogin}
            >
              Log In
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={onNavigateToSignUp}
              >
                Sign Up
              </Button>
            </div>

            <Separator />

            {/* Social Login Options */}
            <div className="space-y-2">
              <p className="text-slate-600 text-center text-sm mb-3">Or continue with</p>
              
              {/* Google */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* X (Twitter) */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => handleSocialLogin('X')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Continue with X
              </Button>

              {/* LinkedIn */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => handleSocialLogin('LinkedIn')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Button>

              {/* Facebook */}
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}