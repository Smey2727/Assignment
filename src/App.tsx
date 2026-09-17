import { useState } from "react";
import Navbar from "./layout/Navbar";
import BrowserHistoryManager from "./components/BrowserHistoryManager";
import InfiniteImageCarousel from "./components/InfiniteImageCarousel";
import LRUCacheForAPIResponses from "./components/LRUCacheForAPIResponses";
import SocialMediaActivityFeed from "./components/SocialMediaActivityFeed";

type Page = "history" | "carousel" | "cache" | "feed";

function App() {
  const [activePage, setActivePage] = useState<Page>("history");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <div className="p-8">
        {activePage === "history" && <BrowserHistoryManager />}
        {activePage === "carousel" && <InfiniteImageCarousel />}
        {activePage === "cache" && <LRUCacheForAPIResponses />}
        {activePage === "feed" && <SocialMediaActivityFeed />}
      </div>
    </div>
  );
}

export default App;