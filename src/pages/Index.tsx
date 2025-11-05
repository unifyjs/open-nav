import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TimeDisplay } from "@/components/TimeDisplay";
import { SearchBar } from "@/components/SearchBar";
import { BookmarkGrid } from "@/components/BookmarkGrid";
import { VideoBackground } from "@/components/VideoBackground";
import { TopBar } from "@/components/TopBar";
import { DailyQuote } from "@/components/DailyQuote";
import { DragHint } from "@/components/DragHint";

interface DateTimeSettings {
  showTime: boolean;
  showSearchBar: boolean;
  showMonthDay: boolean;
  showWeek: boolean;
  showLunar: boolean;
  show24Hour: boolean;
  showSeconds: boolean;
  isBold: boolean;
  fontSize: number;
  fontColor: string;
}

const DATETIME_STORAGE_KEY = "datetime_settings";

const defaultSettings: DateTimeSettings = {
  showTime: true,
  showSearchBar: true,
  showMonthDay: true,
  showWeek: true,
  showLunar: true,
  show24Hour: true,
  showSeconds: false,
  isBold: false,
  fontSize: 70,
  fontColor: "#ffffff"
};

const Index = () => {
  const [currentCategory, setCurrentCategory] = useState("主页");
  const [settings, setSettings] = useState<DateTimeSettings>(defaultSettings);

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem(DATETIME_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse datetime settings:", error);
      }
    }

    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings({ ...defaultSettings, ...event.detail });
    };

    window.addEventListener('dateTimeSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('dateTimeSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

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