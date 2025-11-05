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

interface SidebarSettings {
  position: 'left' | 'right';
  autoHide: boolean;
  scrollSwitch: boolean;
  width: number;
  opacity: number;
}

const DATETIME_STORAGE_KEY = "datetime_settings";
const SIDEBAR_STORAGE_KEY = "sidebar_settings";

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
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    position: 'left',
    autoHide: false,
    scrollSwitch: true,
    width: 60,
    opacity: 40
  });

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

    // 加载侧边栏设置
    const savedSidebarSettings = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedSidebarSettings) {
      try {
        const parsed = JSON.parse(savedSidebarSettings);
        setSidebarSettings(parsed);
      } catch (error) {
        console.error('Failed to parse sidebar settings:', error);
      }
    }

    // 监听侧边栏设置变化
    const handleSidebarSettingsChange = (event: CustomEvent) => {
      setSidebarSettings(event.detail);
    };

    window.addEventListener('sidebarSettingsChanged', handleSidebarSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('dateTimeSettingsChanged', handleSettingsChange as EventListener);
      window.removeEventListener('sidebarSettingsChanged', handleSidebarSettingsChange as EventListener);
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
      <div 
        className="min-h-screen flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarSettings.position === 'left' ? `${sidebarSettings.width}px` : '0',
          marginRight: sidebarSettings.position === 'right' ? `${sidebarSettings.width}px` : '0'
        }}
      >
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