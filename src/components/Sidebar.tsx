import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Bot, Coffee, Code, Palette, Megaphone, Plus, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "主页", label: "主页", icon: Home },
  { id: "AI", label: "AI", icon: Bot },
  { id: "摸鱼", label: "摸鱼", icon: Coffee },
  { id: "开发", label: "开发", icon: Code },
  { id: "设计", label: "设计", icon: Palette },
  { id: "新媒体", label: "新媒体", icon: Megaphone },
];

export const Sidebar = ({ currentCategory, onCategoryChange }: SidebarProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    position: 'left',
    autoHide: false,
    scrollSwitch: true,
    width: 60,
    opacity: 40
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // 加载侧边栏设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('sidebar_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSidebarSettings(parsed);
      } catch (error) {
        console.error('Failed to parse sidebar settings:', error);
      }
    }

    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      setSidebarSettings(event.detail);
    };

    window.addEventListener('sidebarSettingsChanged', handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener('sidebarSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  // 自动隐藏逻辑
  useEffect(() => {
    if (sidebarSettings.autoHide) {
      setIsVisible(isHovered);
    } else {
      setIsVisible(true);
    }
  }, [sidebarSettings.autoHide, isHovered]);

  // 滚轮切换分组功能
  useEffect(() => {
    if (!sidebarSettings.scrollSwitch) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      // 清除之前的定时器
      clearTimeout(scrollTimeout);
      
      // 设置新的定时器，防止频繁触发
      scrollTimeout = setTimeout(() => {
        const currentIndex = categories.findIndex(cat => cat.id === currentCategory);
        
        if (e.deltaY > 0 && currentIndex < categories.length - 1) {
          // 向下滚动，切换到下一个分组
          onCategoryChange(categories[currentIndex + 1].id);
        } else if (e.deltaY < 0 && currentIndex > 0) {
          // 向上滚动，切换到上一个分组
          onCategoryChange(categories[currentIndex - 1].id);
        }
      }, 150); // 150ms 防抖
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [sidebarSettings.scrollSwitch, currentCategory, onCategoryChange]);

  const sidebarStyle = {
    width: `${sidebarSettings.width}px`,
    backgroundColor: `rgba(30, 41, 59, ${sidebarSettings.opacity / 100})`,
    opacity: sidebarSettings.autoHide && !isVisible ? 
      0 : 
      `${sidebarSettings.opacity / 100}`,
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
  };

  const positionClasses = sidebarSettings.position === 'left' ? 'left-0' : 'right-0';

  return (
    <div 
      className={cn(
        "fixed top-0 h-full backdrop-blur-sm border-white/10 z-40 flex flex-col",
        positionClasses,
        sidebarSettings.position === 'left' ? 'border-r' : 'border-l'
      )}
      style={sidebarStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="p-3 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="text-white text-xs mt-1 text-center">Login</div>
      </div>
      
      {/* Categories */}
      <div className="flex-1 py-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = currentCategory === category.id;
          
          return (
            <div key={category.id} className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full h-12 p-0 flex flex-col items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                  isActive && "text-white bg-white/20"
                )}
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="w-5 h-5 mb-1" />
              </Button>
              
              {/* Category Label */}
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50",
                sidebarSettings.position === 'left' ? 'left-full ml-2' : 'right-full mr-2'
              )}>
                {category.label}
              </div>
            </div>
          );
        })}
        
        {/* Add Category Button */}
        <div className="relative group mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-12 p-0 flex flex-col items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50",
            sidebarSettings.position === 'left' ? 'left-full ml-2' : 'right-full mr-2'
          )}>
            添加分类
          </div>
        </div>
      </div>
      
      {/* Settings */}
      <div className="p-3 border-t border-white/10">
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-10 p-0 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
          
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50",
            sidebarSettings.position === 'left' ? 'left-full ml-2' : 'right-full mr-2'
          )}>
            设置
          </div>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
};