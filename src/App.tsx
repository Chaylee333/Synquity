import { useState } from "react";
import { DiscoverPage } from "./components/DiscoverPage";
import { TrendingPage } from "./components/TrendingPage";
import { CreatorsPage } from "./components/CreatorsPage";
import { AssetClassSeeAllPage } from "./components/AssetClassSeeAllPage";
import { TickerPage } from "./components/TickerPage";
import { CreatorPage } from "./components/CreatorPage";
import { PostDetailPage } from "./components/PostDetailPage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";

type Page =
  | { type: "discover" }
  | { type: "trending" }
  | { type: "creators" }
  | { type: "assetClassSeeAll"; assetClass: string }
  | { type: "ticker"; ticker: string }
  | { type: "creator"; creatorId: string }
  | { type: "post"; postId: number }
  | { type: "login" }
  | { type: "signup" };

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>({
    type: "discover",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] =
    useState<string>("");

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

  const handleLoginSuccess = (userId: string) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    setCurrentPage({ type: "discover" });
  };

  const handleSignupSuccess = (userId: string) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    setCurrentPage({ type: "discover" });
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
        />
      )}
      {currentPage.type === "creators" && (
        <CreatorsPage
          onNavigateHome={navigateToHome}
          onCreatorClick={navigateToCreator}
          onTrendingClick={navigateToTrending}
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
    </div>
  );
}