import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeDisplay } from "@/components/TimeDisplay";
import { SearchBar } from "@/components/SearchBar";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { VideoBackground } from "@/components/VideoBackground";
import { TopBar } from "@/components/TopBar";
import { DailyQuote } from "@/components/DailyQuote";
import { DragHint } from "@/components/DragHint";

const Index = () => {
  const [currentCategory, setCurrentCategory] = useState("主页");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <VideoBackground />
      
      {/* Top Bar */}
      <TopBar />
      
      {/* Sidebar */}
      <Sidebar 
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />
      
      {/* Main Content */}
      <div className="ml-[60px] min-h-screen flex flex-col">
        {/* Time Display */}
        <TimeDisplay />
        
        {/* Search Bar */}
        <SearchBar />
        
        {/* Daily Quote */}
        <DailyQuote />
        
        {/* Bookmark Grid */}
        <BookmarkGrid category={currentCategory} />
      </div>
      
      {/* Drag Hint */}
      <DragHint />
    </div>
  );
};

export default Index;