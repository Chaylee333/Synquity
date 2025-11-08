import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { TickerPage } from "./components/TickerPage";
import { CreatorPage } from "./components/CreatorPage";
import { PostDetailPage } from "./components/PostDetailPage";

type Page =
  | { type: "landing" }
  | { type: "ticker"; ticker: string }
  | { type: "creator"; creatorId: string }
  | { type: "post"; postId: number };

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>({
    type: "landing",
  });

  const navigateToTicker = (ticker: string) => {
    setCurrentPage({ type: "ticker", ticker });
  };

  const navigateToCreator = (creatorId: string) => {
    setCurrentPage({ type: "creator", creatorId });
  };

  const navigateToHome = () => {
    setCurrentPage({ type: "landing" });
  };

  const navigateToPost = (postId: number) => {
    setCurrentPage({ type: "post", postId });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage.type === "landing" && (
        <LandingPage
          onTickerClick={navigateToTicker}
          onCreatorClick={navigateToCreator}
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
    </div>
  );
}