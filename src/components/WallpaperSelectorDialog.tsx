import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  X, 
  Download, 
  Check,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Globe,
  History,
  User,
  Plus,
  Pipette
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

// 标签颜色配置
const getTagColor = (tagId: string) => {
  const colors: { [key: string]: string } = {
    "all": "bg-blue-600 text-white hover:bg-blue-700",
    "healing": "bg-green-600 text-white hover:bg-green-700",
    "landscape": "bg-purple-600 text-white hover:bg-purple-700",
    "beauty": "bg-pink-600 text-white hover:bg-pink-700",
    "anime": "bg-indigo-600 text-white hover:bg-indigo-700",
    "game": "bg-orange-600 text-white hover:bg-orange-700",
    "other": "bg-gray-600 text-white hover:bg-gray-700",
  };
  return colors[tagId] || "bg-blue-600 text-white hover:bg-blue-700";
};

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

// 预设颜色选择器 - 第一行自定义颜色
const customColors = [
  "#ff4757", "#ff6b81", "#ff9ff3", "#54a0ff", "#5f27cd", 
  "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24", "#0984e3",
  "#a29bfe", "#fd79a8", "#fdcb6e", "#6c5ce7", "#fd79a8"
];

// 预设渐变色选择器 - 第二行渐变色
const presetGradients = [
  { id: "g1", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "紫蓝" },
  { id: "g2", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "粉红" },
  { id: "g3", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", name: "蓝青" },
  { id: "g4", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "绿青" },
  { id: "g5", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", name: "粉黄" },
  { id: "g6", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", name: "薄荷粉" },
  { id: "g7", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", name: "珊瑚粉" },
  { id: "g8", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", name: "桃橙" },
  { id: "g9", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", name: "紫粉" },
  { id: "g10", gradient: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)", name: "暖粉" },
  { id: "g11", gradient: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)", name: "黄橙" },
  { id: "g12", gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)", name: "天空蓝" },
  { id: "g13", gradient: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)", name: "玫瑰金" },
  { id: "g14", gradient: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", name: "深紫" },
  { id: "g15", gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", name: "翡翠" }
];

// 颜色选择器常用颜色
const commonColors = [
  "#ff0000", "#ff4500", "#ffa500", "#ffff00", "#9acd32", "#00ff00",
  "#00ffff", "#0000ff", "#8a2be2", "#ff1493", "#ff69b4", "#ffc0cb",
  "#000000", "#696969", "#808080", "#a9a9a9", "#c0c0c0", "#ffffff"
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
  { id: "solid-10", color: "#000000", name: "纯黑" },
  { id: "solid-11", color: "#ffffff", name: "纯白" },
  { id: "solid-12", color: "#f59e0b", name: "金黄" },
  { id: "solid-13", color: "#10b981", name: "薄荷绿" },
  { id: "solid-14", color: "#8b5cf6", name: "淡紫" },
  { id: "solid-15", color: "#f97316", name: "活力橙" },
  { id: "solid-16", color: "#06b6d4", name: "天蓝" },
  { id: "solid-17", color: "#84cc16", name: "柠檬绿" },
  { id: "solid-18", color: "#ec4899", name: "玫瑰红" },
];

// 渐变色壁纸数据
const gradientColors = [
  { id: "gradient-1", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "紫蓝渐变" },
  { id: "gradient-2", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "粉红渐变" },
  { id: "gradient-3", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", name: "蓝青渐变" },
  { id: "gradient-4", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "绿青渐变" },
  { id: "gradient-5", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", name: "粉黄渐变" },
  { id: "gradient-6", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", name: "薄荷粉渐变" },
  { id: "gradient-7", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", name: "珊瑚粉渐变" },
  { id: "gradient-8", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", name: "桃橙渐变" },
  { id: "gradient-9", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", name: "紫粉渐变" },
  { id: "gradient-10", gradient: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)", name: "暖粉渐变" },
  { id: "gradient-11", gradient: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)", name: "黄橙渐变" },
  { id: "gradient-12", gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)", name: "天空蓝渐变" },
  { id: "gradient-13", gradient: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)", name: "玫瑰金渐变" },
  { id: "gradient-14", gradient: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", name: "深紫渐变" },
  { id: "gradient-15", gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", name: "翡翠渐变" },
  { id: "gradient-16", gradient: "linear-gradient(135deg, #e17055 0%, #f39c12 100%)", name: "夕阳渐变" },
  { id: "gradient-17", gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)", name: "暗灰渐变" },
  { id: "gradient-18", gradient: "linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)", name: "冰蓝渐变" },
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
  const [customColor, setCustomColor] = useState("#3b82f6");
  const [colorType, setColorType] = useState("solid"); // solid or gradient
  const [selectedGradient, setSelectedGradient] = useState(presetGradients[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // 获取相似渐变色
  const getSimilarGradients = (baseGradient: typeof presetGradients[0]) => {
    // 简单的相似度匹配，实际可以根据颜色相似度来匹配
    return gradientColors.filter(g => g.id !== baseGradient.id).slice(0, 12);
  };

  // 获取当前分类和标签的壁纸
  const getFilteredWallpapers = () => {
    if (selectedCategory === "solid") {
      if (colorType === "gradient") {
        // 显示相似渐变色
        const similarGradients = getSimilarGradients(selectedGradient);
        return similarGradients.map(gradient => ({
          id: gradient.id,
          url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="grad-${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${gradient.gradient.match(/#[a-fA-F0-9]{6}/g)?.[0] || '#000'};stop-opacity:1" /><stop offset="100%" style="stop-color:${gradient.gradient.match(/#[a-fA-F0-9]{6}/g)?.[1] || '#fff'};stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad-${gradient.id})"/></svg>`,
          title: gradient.name,
          category: "solid",
          tags: ["gradient"],
          isColor: true,
          color: gradient.gradient,
          type: 'gradient'
        }));
      } else {
        // 显示纯色
        return solidColors.map(color => ({
          id: color.id,
          url: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="100%" height="100%" fill="${color.color}"/></svg>`,
          title: color.name,
          category: "solid",
          tags: ["solid"],
          isColor: true,
          color: color.color,
          type: 'solid'
        }));
      }
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
      <DialogContent className="max-w-6xl min-h-[90vh] max-h-[90vh] p-0 bg-slate-800/60 backdrop-blur-sm border border-white/20 text-white fixed">
        <div className="flex h-full">
          {/* 左侧分类导航 */}
          <div className="w-48 border-r border-white/10 flex flex-col">
            {/* 标题栏 */}
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-white">壁纸库</h2>
            </div>
            <div className="flex-1 py-2">
              {wallpaperCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-none",
                      isSelected && "bg-white/20 text-white border-r-2 border-blue-500"
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
          <div className="flex-1 flex flex-col max-h-[90vh]">
            {/* 免责声明和顶部标签栏 */}
            <div className="border-b border-white/10">
              {/* 免责声明 - 仅在非纯色时显示 */}
              {selectedCategory !== "solid" && (
                <div className="px-4 py-2 text-xs text-white/60 bg-white/5">
                  PS: 此壁纸收集于互联网，如有侵权，请联系作者
                </div>
              )}
              
              {/* 标签栏 */}
              {selectedCategory !== "solid" && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    {contentTags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant={selectedTag === tag.id ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-7 px-3 text-xs rounded-full",
                          selectedTag === tag.id 
                            ? getTagColor(tag.id)
                            : "text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
                        )}
                        onClick={() => setSelectedTag(tag.id)}
                      >
                        {tag.label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* 最新开关 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">最新</span>
                    <Switch
                      checked={autoSwitch}
                      onCheckedChange={setAutoSwitch}
                      className="scale-75"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 壁纸网格 */}
            <div className="flex-1 p-3 overflow-y-auto">
              {/* 纯色壁纸的自定义颜色选择器 */}
              {selectedCategory === "solid" && (
                <div className="mb-6 space-y-4">
                  {/* 第一行：自定义颜色 */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium text-white mb-3">自定义颜色</h3>
                    <div className="flex items-center gap-2">
                      {/* 自定义颜色选择器弹窗 */}
                      <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                        <PopoverTrigger asChild>
                          <button className="w-8 h-8 rounded-full border-2 border-white/30 hover:border-white/50 transition-colors overflow-hidden relative">
                            <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 to-purple-500"></div>
                            <Pipette className="absolute inset-0 w-4 h-4 m-auto text-white drop-shadow-lg" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-slate-800 border-white/20" side="bottom" align="start">
                          <div className="space-y-4">
                            {/* 色相/饱和度选择区域 */}
                            <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-crosshair"
                                 style={{
                                   background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), linear-gradient(to top, black, transparent)`
                                 }}
                                 onClick={(e) => {
                                   const rect = e.currentTarget.getBoundingClientRect();
                                   const x = e.clientX - rect.left;
                                   const y = e.clientY - rect.top;
                                   const newSaturation = Math.round((x / rect.width) * 100);
                                   const newLightness = Math.round(100 - (y / rect.height) * 100);
                                   setSaturation(newSaturation);
                                   setLightness(newLightness);
                                   setCustomColor(`hsl(${hue}, ${newSaturation}%, ${newLightness}%)`);
                                 }}>
                              <div className="absolute w-3 h-3 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                                   style={{
                                     left: `${saturation}%`,
                                     top: `${100 - lightness}%`
                                   }}></div>
                            </div>
                            
                            {/* 色相条 */}
                            <div className="relative w-full h-4 rounded cursor-pointer"
                                 style={{
                                   background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                                 }}
                                 onClick={(e) => {
                                   const rect = e.currentTarget.getBoundingClientRect();
                                   const x = e.clientX - rect.left;
                                   const newHue = Math.round((x / rect.width) * 360);
                                   setHue(newHue);
                                   setCustomColor(`hsl(${newHue}, ${saturation}%, ${lightness}%)`);
                                 }}>
                              <div className="absolute w-3 h-6 border-2 border-white rounded transform -translate-x-1/2 -translate-y-1/2 top-1/2"
                                   style={{ left: `${(hue / 360) * 100}%` }}></div>
                            </div>
                            
                            {/* 常用颜色 */}
                            <div className="grid grid-cols-9 gap-1">
                              {commonColors.map((color, index) => (
                                <button
                                  key={index}
                                  className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  onClick={() => {
                                    setCustomColor(color);
                                    const customWallpaper = {
                                      id: `custom-${Date.now()}`,
                                      isColor: true,
                                      color: color,
                                      type: 'solid'
                                    };
                                    selectWallpaper(customWallpaper);
                                    setShowColorPicker(false);
                                  }}
                                />
                              ))}
                            </div>
                            
                            {/* 颜色输入框 */}
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                className="flex-1 h-8 bg-white/10 border-white/20 text-white text-xs"
                                placeholder="#ffffff"
                              />
                              <Button
                                size="sm"
                                className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                onClick={() => {
                                  const customWallpaper = {
                                    id: `custom-${Date.now()}`,
                                    isColor: true,
                                    color: customColor,
                                    type: 'solid'
                                  };
                                  selectWallpaper(customWallpaper);
                                  setShowColorPicker(false);
                                }}
                              >
                                确定
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      {/* 预设自定义颜色 */}
                      {customColors.map((color, index) => (
                        <button
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white/30 hover:border-white/50 transition-colors hover:scale-110"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const customWallpaper = {
                              id: `custom-${Date.now()}`,
                              isColor: true,
                              color: color,
                              type: 'solid'
                            };
                            selectWallpaper(customWallpaper);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* 第二行：渐变色 */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-sm font-medium text-white mb-3">渐变色</h3>
                    <div className="flex items-center gap-2">
                      {presetGradients.map((gradient, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                            selectedGradient.id === gradient.id 
                              ? "border-blue-400 ring-2 ring-blue-400/50" 
                              : "border-white/30 hover:border-white/50"
                          )}
                          style={{ background: gradient.gradient }}
                          onClick={() => {
                            setSelectedGradient(gradient);
                            setColorType("gradient");
                            const customWallpaper = {
                              id: `custom-${Date.now()}`,
                              isColor: true,
                              color: gradient.gradient,
                              type: 'gradient'
                            };
                            selectWallpaper(customWallpaper);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* 颜色类型选择 */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={colorType === "solid" ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 px-3 text-xs",
                          colorType === "solid" 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setColorType("solid")}
                      >
                        纯色
                      </Button>
                      <Button
                        variant={colorType === "gradient" ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-8 px-3 text-xs",
                          colorType === "gradient" 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setColorType("gradient")}
                      >
                        渐变色
                      </Button>
                    </div>
                    {colorType === "gradient" && (
                      <div className="text-xs text-white/60">
                        当前选择：{selectedGradient.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-6 gap-3">
                {filteredWallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className={cn(
                      "relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 group",
                      selectedCategory === "solid" ? "aspect-square" : "aspect-video"
                    )}
                    style={{
                      borderColor: (wallpaper.isColor ? wallpaper.color : wallpaper.url) === currentWallpaper 
                        ? '#3b82f6' 
                        : '#374151'
                    }}
                    onClick={() => selectWallpaper(wallpaper)}
                  >
                    {wallpaper.isColor ? (
                      <div 
                        className="w-full h-full"
                        style={{ 
                          background: wallpaper.type === 'gradient' ? wallpaper.color : undefined,
                          backgroundColor: wallpaper.type === 'solid' ? wallpaper.color : undefined
                        }}
                      />
                    ) : (
                      <img
                        src={wallpaper.url}
                        alt={wallpaper.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {/* 颜色名称标签 */}
                    {wallpaper.isColor && selectedCategory === "solid" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {wallpaper.title}
                      </div>
                    )}
                    
                    {/* 选中状态 */}
                    {(wallpaper.isColor ? wallpaper.color : wallpaper.url) === currentWallpaper && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}

                    {/* 下载按钮 */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-5 w-5 p-0 bg-black/60 hover:bg-black/80 border-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadWallpaper(wallpaper.url, wallpaper.title);
                        }}
                      >
                        <Download className="h-2.5 w-2.5 text-white" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};