import { Button } from "@/components/ui/button";

interface BookmarkItemProps {
  title: string;
  icon: string;
  url: string;
  color: string;
}

export const BookmarkItem = ({ title, icon, url, color }: BookmarkItemProps) => {
  const handleClick = () => {
    if (url.startsWith('chrome://') || url === '#') {
      // For demo purposes, just show an alert for chrome:// URLs and placeholder links
      alert(`This would open: ${url}`);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="col-span-1 group">
      <Button
        variant="none"
        className="w-full h-full p-0 flex flex-col items-center justify-center backdrop-blur-sm rounded-2xl transition-all duration-200 hover:scale-105"
        onClick={handleClick}
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
    </div>
  );
};