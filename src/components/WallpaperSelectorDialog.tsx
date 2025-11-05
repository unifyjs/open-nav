import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  X, 
  Download, 
  Check,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Globe,
  History,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WallpaperSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWallpaperSelect: (wallpaper: string) => void;
  currentWallpaper: string;
}

interface WallpaperItem {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
}

// 壁纸分类
const wallpaperCategories = [
  { id: "featured", label: "精选壁纸", icon: Sparkles },
  { id: "dynamic", label: "动态壁纸", icon: ImageIcon },
  { id: "solid", label: "纯色壁纸", icon: Palette },
  { id: "bing4k", label: "必应4K", icon: Globe },
  { id: "history", label: "使用历史", icon: History },
  { id: "custom", label: "我的壁纸", icon: User },
];

// 内容分类标签
const contentTags = [
  { id: "all", label: "全部" },
  { id: "healing", label: "治愈" },
  { id: "landscape", label: "风景" },
  { id: "beauty", label: "美女" },
  { id: "anime", label: "动漫" },
  { id: "game", label: "游戏" },
  { id: "other", label: "其他" },
];

// 示例壁纸数据
const wallpaperData: WallpaperItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    title: "山脉风景",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
    title: "森林小径",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
    title: "星空夜景",
    category: "featured",
    tags: ["landscape", "other"]
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
    title: "湖泊倒影",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
    title: "海岸线",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
    title: "山峰云海",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&h=1080&fit=crop",
    title: "城市夜景",
    category: "dynamic",
    tags: ["other", "landscape"]
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    title: "动漫风景",
    category: "dynamic",
    tags: ["anime", "landscape"]
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
    title: "游戏场景",
    category: "dynamic",
    tags: ["game", "other"]
  },
];

// 纯色壁纸数据
const solidColors = [
  { id: "solid-1", color: "#1e40af", name: "深蓝" },
  { id: "solid-2", color: "#7c3aed", name: "紫色" },
  { id: "solid-3", color: "#059669", name: "翠绿" },
  { id: "solid-4", color: "#dc2626", name: "红色" },
  { id: "solid-5", color: "#ea580c", name: "橙色" },
  { id: "solid-6", color: "#0891b2", name: "青色" },
  { id: "solid-7", color: "#4338ca", name: "靛蓝" },
  { id: "solid-8", color: "#be185d", name: "粉红" },
  { id: "solid-9", color: "#374151", name: "灰色" },
];

export const WallpaperSelectorDialog = ({ 
  open, 
  onOpenChange, 
  onWallpaperSelect,
  currentWallpaper 
}: WallpaperSelectorDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("dynamic");
  const [selectedTag, setSelectedTag] = useState("all");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(false);

  // 获取当前分类和标签的壁纸
  const getFilteredWallpapers = () => {
    if (selectedCategory === "solid") {
      return solidColors.map(color => ({
        id: color.id,
        url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="${color.color}"/></svg>`,
        title: color.name,
        category: "solid",
        tags: ["solid"],
        isColor: true,
        color: color.color
      }));
    }

    let filtered = wallpaperData.filter(item => 
      selectedCategory === "featured" || item.category === selectedCategory
    );

    if (selectedTag !== "all") {
      filtered = filtered.filter(item => item.tags.includes(selectedTag));
    }

    return filtered;
  };

  // 下载壁纸
  const downloadWallpaper = async (wallpaperUrl: string, wallpaperTitle: string) => {
    if (wallpaperUrl.startsWith('data:')) {
      // 纯色壁纸，创建一个简单的图片
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const colorMatch = wallpaperUrl.match(/fill="([^"]+)"/);
        const color = colorMatch ? colorMatch[1] : '#000000';
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${wallpaperTitle}_wallpaper.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch(wallpaperUrl);
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!response.body) throw new Error('Response body is null');
      
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        if (total > 0) {
          setDownloadProgress(Math.round((received / total) * 100));
        }
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${wallpaperTitle}_wallpaper.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download wallpaper:", error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // 选择壁纸
  const selectWallpaper = (wallpaper: any) => {
    const wallpaperUrl = wallpaper.isColor ? wallpaper.color : wallpaper.url;
    onWallpaperSelect(wallpaperUrl);
  };

  const filteredWallpapers = getFilteredWallpapers();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl min-h-[80vh] max-h-[80vh] p-0 bg-white border border-gray-200 text-gray-900 fixed">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">壁纸</h2>
        </div>

        <div className="flex h-full">
          {/* 左侧分类导航 */}
          <div className="w-48 border-r border-gray-200 flex flex-col">
            <div className="flex-1 py-2">
              {wallpaperCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors rounded-none",
                      isSelected && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    )}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedTag("all");
                    }}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 flex flex-col">
            {/* 顶部标签栏 */}
            {selectedCategory !== "solid" && (
              <div className="flex items-center gap-1 p-4 border-b border-gray-200">
                {contentTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTag === tag.id ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 px-3 text-sm rounded-full",
                      selectedTag === tag.id 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                    onClick={() => setSelectedTag(tag.id)}
                  >
                    {tag.label}
                  </Button>
                ))}
              </div>
            )}

            {/* 壁纸网格 */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {filteredWallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 group"
                    style={{
                      borderColor: (wallpaper.isColor ? wallpaper.color : wallpaper.url) === currentWallpaper 
                        ? '#3b82f6' 
                        : '#e5e7eb'
                    }}
                    onClick={() => selectWallpaper(wallpaper)}
                  >
                    {wallpaper.isColor ? (
                      <div 
                        className="w-full h-full"
                        style={{ backgroundColor: wallpaper.color }}
                      />
                    ) : (
                      <img
                        src={wallpaper.url}
                        alt={wallpaper.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* 选中状态 */}
                    {(wallpaper.isColor ? wallpaper.color : wallpaper.url) === currentWallpaper && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* 下载按钮 */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadWallpaper(wallpaper.url, wallpaper.title);
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 最右侧功能区域 */}
          <div className="w-32 border-l border-gray-200 p-4 flex flex-col items-center space-y-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              disabled={isDownloading}
            >
              下载壁纸
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <div>{isDownloading ? `${downloadProgress}%` : "0%"}</div>
              <div>0px</div>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <Switch
                checked={autoSwitch}
                onCheckedChange={setAutoSwitch}
              />
              <span className="text-xs text-gray-500 text-center">自动切换</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};