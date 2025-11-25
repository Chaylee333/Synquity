import { useState, useEffect } from "react";
import { DiscoverPage } from "./components/DiscoverPage";
import { TrendingPage } from "./components/TrendingPage";
import { CreatorsPage } from "./components/CreatorsPage";
import { AssetClassSeeAllPage } from "./components/AssetClassSeeAllPage";
import { TickerPage } from "./components/TickerPage";
import { CreatorPage } from "./components/CreatorPage";
import { PostDetailPage } from "./components/PostDetailPage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { MyFeedPage } from "./components/MyFeedPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from 'sonner';

type Page =
  | { type: "discover" }
  | { type: "trending" }
  | { type: "creators" }
  | { type: "assetClassSeeAll"; assetClass: string }
  | { type: "ticker"; ticker: string }
  | { type: "creator"; creatorId: string }
  | { type: "post"; postId: number }
  | { type: "login" }
  | { type: "signup" }
  | { type: "profile" }
  | { type: "settings" }
  | { type: "myfeed" };

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>({
    type: "discover",
  });

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const currentUserId = user?.id || "";

  // Redirect to discover page if logged in while on login/signup page
  useEffect(() => {
    if (isLoggedIn && (currentPage.type === "login" || currentPage.type === "signup")) {
      setCurrentPage({ type: "discover" });
    }
  }, [isLoggedIn, currentPage.type]);

  const navigateToTicker = (ticker: string) => {
    setCurrentPage({ type: "ticker", ticker });
  };

  const navigateToCreator = (creatorId: string) => {
    setCurrentPage({ type: "creator", creatorId });
  };

  const navigateToHome = () => {
    setCurrentPage({ type: "discover" });
  };

  const navigateToCreators = () => {
    setCurrentPage({ type: "creators" });
  };

  const navigateToAssetClassSeeAll = (assetClass: string) => {
    setCurrentPage({ type: "assetClassSeeAll", assetClass });
  };

  const navigateToPost = (postId: number) => {
    setCurrentPage({ type: "post", postId });
  };

  const navigateToLogin = () => {
    setCurrentPage({ type: "login" });
  };

  const navigateToSignup = () => {
    setCurrentPage({ type: "signup" });
  };

  const navigateToTrending = () => {
    setCurrentPage({ type: "trending" });
  };

  const navigateToProfile = () => {
    setCurrentPage({ type: "profile" });
  };

  const navigateToSettings = () => {
    setCurrentPage({ type: "settings" });
  };

  const navigateToMyFeed = () => {
    if (isLoggedIn) {
      setCurrentPage({ type: "myfeed" });
    }
  };

  const handleLoginSuccess = (userId: string) => {
    // State update handled by AuthContext, useEffect will redirect
  };

  const handleSignupSuccess = (userId: string) => {
    // State update handled by AuthContext, useEffect will redirect
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage.type === "discover" && (
        <DiscoverPage
          onTickerClick={navigateToTicker}
          onCreatorClick={navigateToCreator}
          onPostClick={navigateToPost}
          onCreatorsClick={navigateToCreators}
          onLoginClick={navigateToLogin}
          onSignupClick={navigateToSignup}
          onTrendingClick={navigateToTrending}
          onProfileClick={navigateToProfile}
          onSettingsClick={navigateToSettings}
          onMyFeedClick={navigateToMyFeed}
        />
      )}
      {currentPage.type === "trending" && (
        <TrendingPage
          onNavigateHome={navigateToHome}
          onTickerClick={navigateToTicker}
          onCreatorClick={navigateToCreator}
          onPostClick={navigateToPost}
          onCreatorsClick={navigateToCreators}
          onLoginClick={navigateToLogin}
          onSignupClick={navigateToSignup}
          onProfileClick={navigateToProfile}
          onSettingsClick={navigateToSettings}
          onMyFeedClick={navigateToMyFeed}
        />
      )}
      {currentPage.type === "creators" && (
        <CreatorsPage
          onNavigateHome={navigateToHome}
          onCreatorClick={navigateToCreator}
          onTrendingClick={navigateToTrending}
          onLoginClick={navigateToLogin}
          onSignupClick={navigateToSignup}
          onProfileClick={navigateToProfile}
          onSettingsClick={navigateToSettings}
          onMyFeedClick={navigateToMyFeed}
        />
      )}
      {currentPage.type === "assetClassSeeAll" && (
        <AssetClassSeeAllPage
          assetClass={currentPage.assetClass}
          onNavigateHome={navigateToHome}
          onCreatorsClick={navigateToCreators}
          onCreatorClick={navigateToCreator}
          onTrendingClick={navigateToTrending}
        />
      )}
      {currentPage.type === "ticker" && (
        <TickerPage
          ticker={currentPage.ticker}
          onNavigateHome={navigateToHome}
          onCreatorClick={navigateToCreator}
          onPostClick={navigateToPost}
        />
      )}
      {currentPage.type === "creator" && (
        <CreatorPage
          creatorId={currentPage.creatorId}
          onNavigateHome={navigateToHome}
          onTickerClick={navigateToTicker}
          onPostClick={navigateToPost}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />
      )}
      {currentPage.type === "post" && (
        <PostDetailPage
          postId={currentPage.postId}
          onNavigateHome={navigateToHome}
          onTickerClick={navigateToTicker}
          onCreatorClick={navigateToCreator}
        />
      )}
      {currentPage.type === "login" && (
        <LoginPage
          onNavigateHome={navigateToHome}
          onNavigateToSignUp={navigateToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentPage.type === "signup" && (
        <SignUpPage
          onNavigateHome={navigateToHome}
          onNavigateToLogin={navigateToLogin}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
      {currentPage.type === "profile" && (
        <ProfilePage onNavigateHome={navigateToHome} />
      )}
      {currentPage.type === "settings" && (
        <SettingsPage onNavigateHome={navigateToHome} />
      )}
      {currentPage.type === "myfeed" && (
        <MyFeedPage
          onNavigateHome={navigateToHome}
          onTickerClick={navigateToTicker}
          onPostClick={navigateToPost}
          onCreatorClick={navigateToCreator}
          onTrendingClick={navigateToTrending}
          onCreatorsClick={navigateToCreators}
          onLoginClick={navigateToLogin}
          onSignupClick={navigateToSignup}
          onProfileClick={navigateToProfile}
          onSettingsClick={navigateToSettings}
        />
      )}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}