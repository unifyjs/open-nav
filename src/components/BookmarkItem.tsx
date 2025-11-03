import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface BookmarkItemProps {
  title: string;
  icon: string;
  url: string;
  color: string;
  size?: string;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const BookmarkItem = ({ title, icon, url, color, size = "1x1", isDragging = false, onDragStart, onDragEnd }: BookmarkItemProps) => {
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
    
    if (url.startsWith('chrome://') || url === '#') {
      // For demo purposes, just show an alert for chrome:// URLs and placeholder links
      alert(`This would open: ${url}`);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="relative w-full h-full group">
      <Button
        variant="none"
        className={`w-full h-full p-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
        } cursor-pointer select-none`}
        onClick={handleClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-0 overflow-hidden"
          style={{ backgroundColor: color }}
        >
          <img 
            src={icon} 
            alt={title}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              // Fallback to a simple colored square with first letter
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-white font-bold text-lg">${title.charAt(0)}</span>`;
              }
            }}
          />
        </div>
        <span className="text-white text-xs text-center leading-tight px-1 line-clamp-2">
          {title}
        </span>
      </Button>
      
      {/* Drag Handle - visible on hover */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-70 transition-opacity duration-200 pointer-events-none">
        <GripVertical className="w-4 h-4 text-white/80" />
      </div>
    </div>
  );
};