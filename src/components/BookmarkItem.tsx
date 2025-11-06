import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { useState, useEffect } from "react";

interface BookmarkItemProps {
  title: string;
  icon: string;
  url: string;
  color: string;
  size?: string;
  isDragging?: boolean;
  openInNewTab?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
}

interface IconSettings {
  iconSize: number;
  iconBorderRadius: number;
  iconSpacing: number;
  showName: boolean;
  nameSize: number;
  maxWidth: number;
}

export const BookmarkItem = ({ title, icon, url, color, size = "1x1", isDragging = false, openInNewTab = true, onDragStart, onDragEnd, onClick }: BookmarkItemProps) => {
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    iconSize: 60,
    iconBorderRadius: 16,
    iconSpacing: 27,
    showName: true,
    nameSize: 12,
    maxWidth: 1388
  });

  // 加载图标设置
  useEffect(() => {
    const loadIconSettings = () => {
      const savedIconSettings = localStorage.getItem('icon_settings');
      if (savedIconSettings) {
        try {
          const parsed = JSON.parse(savedIconSettings);
          setIconSettings(parsed);
        } catch (error) {
          console.error("Failed to parse icon settings:", error);
        }
      }
    };
    
    loadIconSettings();
    
    // 监听图标设置变化
    const handleIconSettingsChange = (event: CustomEvent) => {
      setIconSettings(event.detail);
    };
    
    window.addEventListener('iconSettingsChanged', handleIconSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('iconSettingsChanged', handleIconSettingsChange as EventListener);
    };
  }, []);
  const getGridSpan = (size: string) => {
    switch (size) {
      case "1x1": return "col-span-1 row-span-1";
      case "1x2": return "col-span-1 row-span-2";
      case "2x1": return "col-span-2 row-span-1";
      case "2x2": return "col-span-2 row-span-2";
      case "2x4": return "col-span-2 row-span-4";
      case "4x1": return "col-span-4 row-span-1";
      case "4x2": return "col-span-4 row-span-2";
      case "4x4": return "col-span-4 row-span-2";
      default: return "col-span-1 row-span-1";
    }
  };
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click when dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    // If custom onClick handler is provided, use it
    if (onClick) {
      onClick(e);
      return;
    }
    
    // Default click behavior
    if (url.startsWith('chrome://') || url === '#') {
      // For demo purposes, just show an alert for chrome:// URLs and placeholder links
      alert(`This would open: ${url}`);
    } else {
      // 根据设置决定打开方式
      if (openInNewTab) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  };

  return (
    <div className="relative w-full h-full group">
      <Button
        variant="none"
        className={`w-full h-full p-0 flex flex-col items-center justify-center  rounded-2xl transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
        } cursor-pointer select-none`}
        onClick={handleClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div 
          className="flex items-center justify-center mb-0 overflow-hidden"
          style={{ 
            backgroundColor: color,
            width: `${iconSettings.iconSize}px`,
            height: `${iconSettings.iconSize}px`,
            borderRadius: `${iconSettings.iconBorderRadius}px`
          }}
        >
          <img 
            src={icon} 
            alt={title}
            className="object-contain"
            style={{
              width: `${iconSettings.iconSize * 0.6}px`,
              height: `${iconSettings.iconSize * 0.6}px`
            }}
            onError={(e) => {
              // Fallback to a simple colored square with first letter
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-white font-bold" style="font-size: ${iconSettings.iconSize * 0.3}px">${title.charAt(0)}</span>`;
              }
            }}
          />
        </div>
        {iconSettings.showName && (
          <span 
            className="text-white text-center leading-tight px-1 line-clamp-2"
            style={{ fontSize: `${iconSettings.nameSize}px` }}
          >
            {title}
          </span>
        )}
      </Button>
      
      {/* Drag Handle - visible on hover */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-70 transition-opacity duration-200 pointer-events-none">
        <GripVertical className="w-4 h-4 text-white/80" />
      </div>
    </div>
  );
};