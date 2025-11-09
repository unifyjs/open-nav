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
  // 精选壁纸 - 增加到20个
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
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop",
    title: "薰衣草田",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&h=1080&fit=crop",
    title: "森林阳光",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop",
    title: "湖光山色",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&h=1080&fit=crop",
    title: "海边日落",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&h=1080&fit=crop",
    title: "沙漠风光",
    category: "featured",
    tags: ["landscape", "other"]
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1920&h=1080&fit=crop",
    title: "雪山美景",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1587491618720-c79922211e02?w=1920&h=1080&fit=crop",
    title: "森林瀑布",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1590252497717-dc039b62f57e?w=1920&h=1080&fit=crop",
    title: "高山草甸",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1759242521221-addf4bffe229?w=1920&h=1080&fit=crop",
    title: "田园风光",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "16",
    url: "https://images.unsplash.com/photo-1653296596155-28a84c0964c3?w=1920&h=1080&fit=crop",
    title: "樱花盛开",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "17",
    url: "https://images.unsplash.com/photo-1565178117145-41db4d572950?w=1920&h=1080&fit=crop",
    title: "竹林幽径",
    category: "featured",
    tags: ["landscape", "healing"]
  },
  {
    id: "18",
    url: "https://images.unsplash.com/photo-1655832637772-aea7be2eeb66?w=1920&h=1080&fit=crop",
    title: "银河星空",
    category: "featured",
    tags: ["landscape", "other"]
  },
  // 动态壁纸 - 增加到15个
  {
    id: "21",
    url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&h=1080&fit=crop",
    title: "城市夜景",
    category: "dynamic",
    tags: ["other", "landscape"]
  },
  {
    id: "22",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    title: "动漫风景",
    category: "dynamic",
    tags: ["anime", "landscape"]
  },
  {
    id: "23",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
    title: "游戏场景",
    category: "dynamic",
    tags: ["game", "other"]
  },
  {
    id: "24",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
    title: "科幻城市",
    category: "dynamic",
    tags: ["other", "game"]
  },
  {
    id: "25",
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
    title: "赛博朋克",
    category: "dynamic",
    tags: ["other", "game"]
  },
  {
    id: "26",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
    title: "动漫少女",
    category: "dynamic",
    tags: ["anime", "beauty"]
  },
  {
    id: "27",
    url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
    title: "魔法世界",
    category: "dynamic",
    tags: ["anime", "game"]
  },
  {
    id: "28",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    title: "机甲战士",
    category: "dynamic",
    tags: ["game", "other"]
  },
  {
    id: "29",
    url: "https://images.unsplash.com/photo-1760828142299-e64456115aa2?w=1920&h=1080&fit=crop",
    title: "未来都市",
    category: "dynamic",
    tags: ["other", "game"]
  },
  {
    id: "30",
    url: "https://images.unsplash.com/photo-1713173642147-30cbbdb176d5?w=1920&h=1080&fit=crop",
    title: "动漫风景",
    category: "dynamic",
    tags: ["anime", "landscape"]
  },
  {
    id: "31",
    url: "https://images.unsplash.com/photo-1723962807917-ffab0600929c?w=1920&h=1080&fit=crop",
    title: "电竞主题",
    category: "dynamic",
    tags: ["game", "other"]
  },
  {
    id: "32",
    url: "https://images.unsplash.com/photo-1699294648710-32f8c4dc5dd6?w=1920&h=1080&fit=crop",
    title: "霓虹灯光",
    category: "dynamic",
    tags: ["other", "landscape"]
  },
  {
    id: "33",
    url: "https://images.unsplash.com/photo-1516865131505-4dabf2efc692?w=1920&h=1080&fit=crop",
    title: "动漫角色",
    category: "dynamic",
    tags: ["anime", "beauty"]
  },
  {
    id: "34",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    title: "游戏CG",
    category: "dynamic",
    tags: ["game", "other"]
  },
  {
    id: "35",
    url: "https://images.unsplash.com/photo-1500674425229-f692875b0ab7?w=1920&h=1080&fit=crop",
    title: "科技感",
    category: "dynamic",
    tags: ["other", "game"]
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
  { id: "g1", gradient: "linear-gradient(135deg, rgb(250, 112, 154) 0%, rgb(254, 225, 64) 100%)", name: "紫蓝" },
  { id: "g2", gradient: "linear-gradient(0deg, rgb(161, 140, 209) 0%, rgb(251, 194, 235) 100%)", name: "粉红" },
  { id: "g3", gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)", name: "蓝青" },
  { id: "g4", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "绿青" },
  { id: "g5", gradient: "linear-gradient(135deg, #667eea 0%, #7b4397 100%)", name: "蓝紫" },
  { id: "g6", gradient: "linear-gradient(0deg, #cfd9e0 0%, #e2ebf0 100%)", name: "浅灰" }
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
  { id: "gradient-1", gid:"g1", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "紫蓝渐变" },
  { id: "gradient-2", gid:"g1", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "粉红渐变" },
  { id: "gradient-3", gid:"g1", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", name: "蓝青渐变" },
  { id: "gradient-4", gid:"g1", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "绿青渐变" },
  { id: "gradient-5", gid:"g1", gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", name: "粉黄渐变" },
  { id: "gradient-6", gid:"g1", gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", name: "薄荷粉渐变" },
  { id: "gradient-7", gid:"g1", gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", name: "珊瑚粉渐变" },
  { id: "gradient-8", gid:"g1", gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", name: "桃橙渐变" },
  { id: "gradient-9", gid:"g1", gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", name: "紫粉渐变" },
  { id: "gradient-10",gid:"g1",  gradient: "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)", name: "暖粉渐变" },
  { id: "gradient-11",gid:"g1",  gradient: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)", name: "黄橙渐变" },
  { id: "gradient-12",gid:"g1",  gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)", name: "天空蓝渐变" },
  { id: "gradient-13",gid:"g1",  gradient: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)", name: "玫瑰金渐变" },
  { id: "gradient-14",gid:"g1",  gradient: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)", name: "深紫渐变" },
  { id: "gradient-15",gid:"g1",  gradient: "linear-gradient(135deg, #00b894 0%, #00cec9 100%)", name: "翡翠渐变" },
  { id: "gradient-16",gid:"g1",  gradient: "linear-gradient(135deg, #e17055 0%, #f39c12 100%)", name: "夕阳渐变" },
  { id: "gradient-17",gid:"g1",  gradient: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)", name: "暗灰渐变" },
  { id: "gradient-18",gid:"g1",  gradient: "linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)", name: "冰蓝渐变" },
  { id: "gradient-19", gid: "g2", gradient: "linear-gradient(0deg, rgb(161, 140, 209) 0%, rgb(251, 194, 235) 100%)", name: "紫粉渐变" },
  { id: "gradient-20", gid: "g2", gradient: "linear-gradient(0deg, rgb(255, 154, 158) 0%, rgb(254, 207, 239) 99%, rgb(254, 207, 239) 100%)", name: "粉橙渐变" },
  { id: "gradient-21", gid: "g2", gradient: "linear-gradient(0deg, rgb(251, 194, 235) 0%, rgb(166, 193, 238) 100%)", name: "粉蓝渐变" },
  { id: "gradient-22", gid: "g2", gradient: "linear-gradient(0deg, rgb(253, 203, 241) 0%, rgb(253, 203, 241) 1%, rgb(230, 222, 233) 100%)", name: "淡粉渐变" },
  { id: "gradient-23", gid: "g2", gradient: "linear-gradient(120deg, rgb(166, 192, 254) 0%, rgb(246, 128, 132) 100%)", name: "蓝红渐变" },
  { id: "gradient-24", gid: "g2", gradient: "linear-gradient(120deg, rgb(224, 195, 252) 0%, rgb(142, 197, 252) 100%)", name: "紫蓝渐变" },
  { id: "gradient-25", gid: "g2", gradient: "linear-gradient(120deg, rgb(240, 147, 251) 0%, rgb(245, 87, 108) 100%)", name: "紫红渐变" },
  { id: "gradient-26", gid: "g2", gradient: "linear-gradient(0deg, rgb(168, 237, 234) 0%, rgb(254, 214, 227) 100%)", name: "青粉渐变" },
  { id: "gradient-27", gid: "g2", gradient: "linear-gradient(0deg, rgb(210, 153, 194) 0%, rgb(254, 249, 215) 100%)", name: "紫黄渐变" },
  { id: "gradient-28", gid: "g2", gradient: "linear-gradient(0deg, rgb(184, 203, 184) 0%, rgb(184, 203, 184) 0%, rgb(180, 101, 218) 0%, rgb(207, 108, 201) 33%, rgb(238, 96, 156) 66%, rgb(238, 96, 156) 100%)", name: "绿紫粉渐变" },
  { id: "gradient-29", gid: "g2", gradient: "linear-gradient(0deg, rgb(196, 113, 245) 0%, rgb(250, 113, 205) 100%)", name: "深紫粉渐变" },
  { id: "gradient-30", gid: "g2", gradient: "linear-gradient(0deg, rgb(219, 220, 215) 0%, rgb(221, 220, 215) 24%, rgb(226, 201, 204) 30%, rgb(231, 98, 125) 46%, rgb(184, 35, 90) 59%, rgb(128, 19, 87) 71%, rgb(61, 22, 53) 84%, rgb(28, 26, 39) 100%)", name: "复古深紫渐变" },
  { id: "gradient-31", gid: "g2", gradient: "linear-gradient(0deg, rgb(244, 59, 71) 0%, rgb(69, 58, 148) 100%)", name: "红紫渐变" },
  { id: "gradient-32", gid: "g2", gradient: "linear-gradient(0deg, rgb(2, 80, 197) 0%, rgb(212, 63, 141) 100%)", name: "蓝粉渐变" },
  { id: "gradient-33", gid: "g2", gradient: "linear-gradient(0deg, rgb(217, 175, 217) 0%, rgb(151, 217, 225) 100%)", name: "紫青渐变" },
  { id: "gradient-34", gid: "g2", gradient: "linear-gradient(0deg, rgb(112, 40, 228) 0%, rgb(229, 178, 202) 100%)", name: "深紫浅粉渐变" },
  { id: "gradient-35", gid: "g2", gradient: "linear-gradient(-20deg, rgb(213, 88, 200) 0%, rgb(36, 210, 146) 100%)", name: "紫红青渐变" },
  { id: "gradient-36", gid: "g2", gradient: "linear-gradient(0deg, rgb(199, 29, 111) 0%, rgb(208, 150, 147) 100%)", name: "红棕渐变" },
  { id: "gradient-37", gid: "g2", gradient: "linear-gradient(0deg, rgb(247, 112, 98) 0%, rgb(254, 81, 150) 100%)", name: "橙粉渐变" },
  { id: "gradient-38", gid: "g2", gradient: "linear-gradient(0deg, rgb(232, 25, 139) 0%, rgb(199, 234, 253) 100%)", name: "红蓝渐变" },
  { id: "gradient-39", gid: "g2", gradient: "linear-gradient(0deg, rgb(223, 137, 181) 0%, rgb(191, 217, 254) 100%)", name: "粉蓝渐变" },
  { id: "gradient-40", gid: "g2", gradient: "linear-gradient(0deg, rgb(236, 119, 171) 0%, rgb(120, 115, 245) 100%)", name: "粉紫渐变" },
  { id: "gradient-41", gid: "g2", gradient: "linear-gradient(-225deg, rgb(182, 206, 232) 0%, rgb(245, 120, 220) 100%)", name: "蓝粉渐变" },
  { id: "gradient-42", gid: "g2", gradient: "linear-gradient(-225deg, rgb(164, 69, 178) 0%, rgb(212, 24, 114) 52%, rgb(255, 0, 102) 100%)", name: "紫粉红渐变" },
  { id: "gradient-43", gid: "g2", gradient: "linear-gradient(-225deg, rgb(119, 66, 178) 0%, rgb(241, 128, 255) 52%, rgb(253, 139, 217) 100%)", name: "紫粉渐变" },
  { id: "gradient-44", gid: "g2", gradient: "linear-gradient(-225deg, rgb(255, 60, 172) 0%, rgb(86, 43, 124) 52%, rgb(43, 134, 197) 100%)", name: "粉紫蓝渐变" },
  { id: "gradient-45", gid: "g2", gradient: "linear-gradient(-225deg, rgb(255, 5, 124) 0%, rgb(124, 100, 213) 48%, rgb(76, 195, 255) 100%)", name: "红紫蓝渐变" },
  { id: "gradient-46", gid: "g3", gradient: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)", name: "浅蓝渐变" },
  { id: "gradient-47", gid: "g3", gradient: "linear-gradient(120deg, #84faa6 0%, #8fd3f4 100%)", name: "青绿渐变" },
  { id: "gradient-48", gid: "g3", gradient: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", name: "紫蓝渐变" },
  { id: "gradient-49", gid: "g3", gradient: "linear-gradient(0deg, #4facfe 0%, #00f2fe 100%)", name: "深海冰蓝渐变" },
  { id: "gradient-50", gid: "g3", gradient: "linear-gradient(0deg, #16d9e3 0%, #30c7ec 47%, #46aef7 100%)", name: "递进天蓝渐变" },
  { id: "gradient-51", gid: "g3", gradient: "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)", name: "清透蓝渐变" },
  { id: "gradient-52", gid: "g3", gradient: "linear-gradient(#2af598 0%, #009efd 100%)", name: "绿蓝渐变" },
  { id: "gradient-53", gid: "g3", gradient: "linear-gradient(0deg, #fff1eb 0%, #acc4f9 100%)", name: "暖白蓝渐变" },
  { id: "gradient-54", gid: "g3", gradient: "linear-gradient(0deg, #48c6ef 0%, #6f86d6 100%)", name: "冷调蓝紫渐变" },
  { id: "gradient-55", gid: "g3", gradient: "linear-gradient(0deg, #accbfe 0%, #e7f0fd 100%)", name: "柔蓝渐变" },
  { id: "gradient-56", gid: "g3", gradient: "linear-gradient(0deg, #00c6fb 0%, #005bea 100%)", name: "科技蓝渐变" },
  { id: "gradient-57", gid: "g3", gradient: "linear-gradient(0deg, #6a85b6 0%, #bac8e0 100%)", name: "灰蓝渐变" },
  { id: "gradient-58", gid: "g3", gradient: "linear-gradient(0deg, #a3bded 0%, #6991c7 100%)", name: "沉稳蓝渐变" },
  { id: "gradient-59", gid: "g3", gradient: "linear-gradient(0deg, #f43b47 0%, #453a94 100%)", name: "红紫渐变" },
  { id: "gradient-60", gid: "g3", gradient: "linear-gradient(0deg, #0250c5 0%, #d43f8d 100%)", name: "蓝粉渐变" },
  { id: "gradient-61", gid: "g3", gradient: "linear-gradient(0deg, #d9afaf 0%, #97d9e1 100%)", name: "粉青渐变" },
  { id: "gradient-62", gid: "g3", gradient: "linear-gradient(45deg, #93a5cf 0%, #e4eff3 100%)", name: "灰绿渐变" },
  { id: "gradient-63", gid: "g3", gradient: "linear-gradient(0deg, #0c3483 0%, #a2b6df 100%, #6b8cdc 100%)", name: "深蓝浅蓝渐变" },
  { id: "gradient-64", gid: "g3", gradient: "linear-gradient(0deg, #92fe9d 0%, #00c9ff 100%)", name: "浅绿冰蓝渐变" },
  { id: "gradient-65", gid: "g3", gradient: "linear-gradient(-20deg, #b721ff 0%, #21d4fd 100%)", name: "紫青渐变" },
  { id: "gradient-66", gid: "g3", gradient: "linear-gradient(0deg, #09203f 0%, #537895 100%)", name: "暗黑蓝渐变" },
  { id: "gradient-67", gid: "g3", gradient: "linear-gradient(0deg, #4481eb 0%, #04befd 100%)", name: "亮蓝渐变" },
  { id: "gradient-68", gid: "g3", gradient: "linear-gradient(0deg, #4481eb 0%, #04befd 100%)", name: "亮蓝渐变" },
  { id: "gradient-69", gid: "g3", gradient: "linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)", name: "蓝绿渐变" },
  { id: "gradient-70", gid: "g3", gradient: "linear-gradient(0deg, #209cff 0%, #68e0cf 100%)", name: "蓝青渐变" },
  { id: "gradient-71", gid: "g3", gradient: "linear-gradient(0deg, #1e3c72 0%, #1e3c72 1%, #2a5298 100%)", name: "深蓝渐变" },
  { id: "gradient-72", gid: "g3", gradient: "linear-gradient(0deg, #243949 0%, #517fa4 100%)", name: "深灰蓝渐变" },
  { id: "gradient-73", gid: "g3", gradient: "linear-gradient(0deg, #00dbde 0%, #fc00ff 100%)", name: "冰蓝粉紫渐变" },
  { id: "gradient-74", gid: "g3", gradient: "linear-gradient(0deg, #0af7fe 0%, #495aff 100%)", name: "浅蓝深蓝渐变" },
  { id: "gradient-75", gid: "g3", gradient: "linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cabc2 65%, #35eb93 100%)", name: "多色递进渐变" },
  { id: "gradient-76", gid: "g3", gradient: "linear-gradient(0deg, #007ade 0%, #00ecd0 100%)", name: "海蓝青绿渐变" },
  { id: "gradient-77", gid: "g3", gradient: "linear-gradient(-225deg, #2cd8d5 0%, #c5c1ff 56%, #ffbac3 100%)", name: "青紫粉渐变" },
  { id: "gradient-78", gid: "g3", gradient: "linear-gradient(-225deg, #5d9eff 0%, #87adff 48%, #6ba8ff 100%)", name: "多层蓝渐变" },
  { id: "gradient-79", gid: "g3", gradient: "linear-gradient(-225deg, #22e1ff 0%, #1d8fe1 48%, #625ed1 100%)", name: "蓝紫渐变" },
  { id: "gradient-80", gid: "g3", gradient: "linear-gradient(-225deg, #7de2fe 0%, #b5d8ff 100%)", name: "浅青蓝渐变" },
  { id: "gradient-81", gid: "g3", gradient: "linear-gradient(-225deg, #cbbdb1 0%, #2580b3 100%)", name: "棕蓝渐变" },
  { id: "gradient-82", gid: "g3", gradient: "linear-gradient(-225deg, #7085b6 0%, #8795c4 50%, #e2f1f8 100%)", name: "蓝白渐变" },
  { id: "gradient-83", gid: "g3", gradient: "linear-gradient(-225deg, #77ffd2 0%, #6291c8 48%, #1ec6ff 100%)", name: "青绿蓝渐变" },
  { id: "gradient-84", gid: "g3", gradient: "linear-gradient(-225deg, #d4ffec 0%, #57f2cc 48%, #4596d9 100%)", name: "浅绿蓝渐变" },
  { id: "gradient-85", gid: "g3", gradient: "linear-gradient(-225deg, #9efbd3 0%, #57e3c9 48%, #45d4f7 100%)", name: "青绿渐变" },
  { id: "gradient-86", gid: "g3", gradient: "linear-gradient(-225deg, #ff3cac 0%, #562b7c 52%, #2b86c5 100%)", name: "粉紫蓝渐变" },
  { id: "gradient-87", gid: "g3", gradient: "linear-gradient(-225deg, #ff057c 0%, #7c64d5 48%, #4ab0ff 100%)", name: "粉蓝渐变" },
  { id: "gradient-88", gid: "g3", gradient: "linear-gradient(-225deg, #3d4e81 0%, #5753c9 48%, #6e7ff3 100%)", name: "深紫蓝渐变" },
  { id: "gradient-89", gid: "g4", gradient: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", name: "浅黄绿渐变" },
  { id: "gradient-90", gid: "g4", gradient: "linear-gradient(120deg, #84faa6 0%, #8fd3f4 100%)", name: "青绿渐变" },
  { id: "gradient-91", gid: "g4", gradient: "linear-gradient(0deg, #43e97b 0%, #38f9d7 100%)", name: "鲜绿渐变" },
  { id: "gradient-92", gid: "g4", gradient: "linear-gradient(0deg, #30cfd0 0%, #330867 100%)", name: "青绿紫渐变" },
  { id: "gradient-93", gid: "g4", gradient: "linear-gradient(0deg, #5ee7d6 0%, #b490cc 100%)", name: "青紫渐变" },
  { id: "gradient-94", gid: "g4", gradient: "linear-gradient(0deg, #9890e3 0%, #b1f4cf 100%)", name: "紫绿渐变" },
  { id: "gradient-95", gid: "g4", gradient: "linear-gradient(#2af598 0%, #009efd 100%)", name: "绿蓝渐变" },
  { id: "gradient-96", gid: "g4", gradient: "linear-gradient(0deg, #37eccb 0%, #72afc9 100%)", name: "浅绿蓝渐变" },
  { id: "gradient-97", gid: "g4", gradient: "linear-gradient(0deg, #c1dfc4 0%, #def0e5 100%)", name: "淡绿渐变" },
  { id: "gradient-98", gid: "g4", gradient: "linear-gradient(0deg, #0b9ca0 0%, #3cbab0 100%)", name: "深绿渐变" },
  { id: "gradient-99", gid: "g4", gradient: "linear-gradient(0deg, #74ebd5 0%, #a3acdf 100%)", name: "青绿蓝渐变" },
  { id: "gradient-100", gid: "g4", gradient: "linear-gradient(0deg, #4fb576 0%, #44c489 30%, #28a9ae 46%, #28a0b3 59%, #4c7788 71%, #6c4f63 80%, #432c3e 100%)", name: "多色绿系渐变" },
  { id: "gradient-101", gid: "g4", gradient: "linear-gradient(0deg, #88d3ce 0%, #6e45e2 100%)", name: "青绿紫渐变" },
  { id: "gradient-102", gid: "g4", gradient: "linear-gradient(15deg, #13547a 0%, #80d0c9 100%)", name: "深蓝绿渐变" },
  { id: "gradient-103", gid: "g4", gradient: "linear-gradient(0deg, #92fe9d 0%, #00c9ff 100%)", name: "浅绿冰蓝渐变" },
  { id: "gradient-104", gid: "g4", gradient: "linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%)", name: "紫青绿渐变" },
  { id: "gradient-105", gid: "g4", gradient: "linear-gradient(-20deg, #d558c8 0%, #24d292 100%)", name: "粉绿渐变" },
  { id: "gradient-106", gid: "g4", gradient: "linear-gradient(60deg, #abecd6 0%, #f9f59a 100%)", name: "浅绿黄渐变" },
  { id: "gradient-107", gid: "g4", gradient: "linear-gradient(60deg, #96ded2 0%, #50c9c3 100%)", name: "深青绿渐变" },
  { id: "gradient-108", gid: "g4", gradient: "linear-gradient(-60deg, #16a085 0%, #f9d423 100%)", name: "深绿黄渐变" },
  { id: "gradient-109", gid: "g4", gradient: "linear-gradient(-20deg, #00cdac 0%, #8ddada 100%)", name: "深青绿渐变" },
  { id: "gradient-110", gid: "g4", gradient: "linear-gradient(60deg, #64b3f4 0%, #c2e59c 100%)", name: "蓝绿渐变" },
  { id: "gradient-111", gid: "g4", gradient: "linear-gradient(0deg, #0fda50 0%, #f9f047 100%)", name: "绿黄渐变" },
  { id: "gradient-112", gid: "g4", gradient: "linear-gradient(0deg, #3abca7 0%, #3d99b0 31%, #56317a 100%)", name: "青绿紫渐变" },
  { id: "gradient-113", gid: "g4", gradient: "linear-gradient(0deg, #209cff 0%, #68e0cf 100%)", name: "蓝青渐变" },
  { id: "gradient-114", gid: "g4", gradient: "linear-gradient(0deg, #9be15d 0%, #00e3ae 100%)", name: "黄绿青渐变" },
  { id: "gradient-115", gid: "g4", gradient: "linear-gradient(0deg, #b3ffaa 0%, #12fff7 100%)", name: "浅绿蓝渐变" },
  { id: "gradient-116", gid: "g4", gradient: "linear-gradient(0deg, #50cc83 0%, #f5d100 100%)", name: "绿黄渐变" },
  { id: "gradient-117", gid: "g4", gradient: "linear-gradient(0deg, #ed6e64 0%, #ec8c69 100%)", name: "粉橙渐变" },
  { id: "gradient-118", gid: "g4", gradient: "linear-gradient(0deg, #c1c161 0%, #c1c1b1 100%)", name: "淡黄渐变" },
  { id: "gradient-119", gid: "g4", gradient: "linear-gradient(0deg, #007ade 0%, #00ecd0 100%)", name: "海蓝青绿渐变" },
  { id: "gradient-120", gid: "g4", gradient: "linear-gradient(-225deg, #20e2d7 0%, #f9f479 100%)", name: "青绿黄渐变" },
  { id: "gradient-121", gid: "g4", gradient: "linear-gradient(-225deg, #2cd8d5 0%, #6b8ce4 48%, #8e37d7 100%)", name: "青绿紫渐变" },
  { id: "gradient-122", gid: "g4", gradient: "linear-gradient(-225deg, #dffbcb 0%, #90f9c4 48%, #39f396 100%)", name: "浅绿渐变" },
  { id: "gradient-123", gid: "g4", gradient: "linear-gradient(-225deg, #b7f4df 0%, #50a7c2 100%)", name: "浅绿蓝渐变" },
  { id: "gradient-124", gid: "g4", gradient: "linear-gradient(-225deg, #77ffd2 0%, #6297db 48%, #1ec4ff 100%)", name: "青绿蓝渐变" },
  { id: "gradient-125", gid: "g4", gradient: "linear-gradient(-225deg, #d4ffec 0%, #57f2cc 48%, #4596d1 100%)", name: "浅绿蓝渐变" },
  { id: "gradient-126", gid: "g4", gradient: "linear-gradient(-225deg, #9efbd3 0%, #57e9e1 48%, #45d2f1 100%)", name: "青绿蓝渐变" },
  { id: "gradient-127", gid: "g4", gradient: "linear-gradient(-225deg, #473b7b 0%, #3584a7 51%, #30d2be 100%)", name: "紫蓝绿渐变" },
  { id: "gradient-128", gid: "g4", gradient: "linear-gradient(-225deg, #69eab8 0%, #e0c3fc 48%, #6662e4 100%)", name: "绿紫渐变" },
  { id: "gradient-129", gid: "g5", gradient: "linear-gradient(0deg, #a18cd1 0%, #fbcae1 100%)", name: "紫粉渐变" },
  { id: "gradient-130", gid: "g5", gradient: "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)", name: "蓝粉渐变" },
  { id: "gradient-131", gid: "g5", gradient: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)", name: "紫蓝渐变" },
  { id: "gradient-132", gid: "g5", gradient: "linear-gradient(0deg, #5ee7d6 0%, #b490cc 100%)", name: "青紫渐变" },
  { id: "gradient-133", gid: "g5", gradient: "linear-gradient(135deg, #667eea 0%, #7b4397 100%)", name: "蓝紫渐变" },
  { id: "gradient-134", gid: "g5", gradient: "linear-gradient(0deg, #9890e3 0%, #b1f4cf 100%)", name: "紫绿渐变" },
  { id: "gradient-135", gid: "g5", gradient: "linear-gradient(0deg, #ebc4fc 0%, #d9d4e0 100%)", name: "淡紫渐变" },
  { id: "gradient-136", gid: "g5", gradient: "linear-gradient(0deg, #cd9cf2 0%, #f6f3ff 100%)", name: "紫白渐变" },
  { id: "gradient-137", gid: "g5", gradient: "linear-gradient(0deg, #b8cb84 0%, #b8cb84 0%, #b465da 0%, #cf6bcb 33%, #ee609c 66%, #ee609c 100%)", name: "多色粉紫渐变" },
  { id: "gradient-138", gid: "g5", gradient: "linear-gradient(0deg, #6a11cb 0%, #2575fc 100%)", name: "深紫蓝渐变" },
  { id: "gradient-139", gid: "g5", gradient: "linear-gradient(0deg, #eea2a2 0%, #bbc1c1 19%, #57c5e5 42%)", name: "粉白蓝渐变" },
  { id: "gradient-140", gid: "g5", gradient: "linear-gradient(0deg, #9795f0 0%, #fbc8d4 100%)", name: "紫粉渐变" },
  { id: "gradient-141", gid: "g5", gradient: "linear-gradient(0deg, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)", name: "灰紫渐变" },
  { id: "gradient-142", gid: "g5", gradient: "linear-gradient(0deg, #88d3ce 0%, #6e45e2 100%)", name: "青绿紫渐变" },
  { id: "gradient-143", gid: "g5", gradient: "linear-gradient(0deg, #7028e4 0%, #e3b1d7 100%)", name: "深紫粉渐变" },
  { id: "gradient-144", gid: "g5", gradient: "linear-gradient(0deg, #505285 0%, #585e92 12%, #60649b 25%)", name: "深灰蓝渐变" },
  { id: "gradient-145", gid: "g5", gradient: "linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%)", name: "紫青绿渐变" },
  { id: "gradient-146", gid: "g5", gradient: "linear-gradient(0deg, #5f72bd 0%, #9b23ea 100%)", name: "蓝紫渐变" },
  { id: "gradient-147", gid: "g5", gradient: "linear-gradient(-20deg, #dce4e0 0%, #99c999 100%)", name: "粉绿渐变" },
  { id: "gradient-148", gid: "g5", gradient: "linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)", name: "蓝紫渐变" },
  { id: "gradient-149", gid: "g5", gradient: "linear-gradient(0deg, #3abca7 0%, #3d99b0 31%, #56317a 100%)", name: "青绿紫渐变" },
  { id: "gradient-150", gid: "g5", gradient: "linear-gradient(0deg, #b3b9cc 0%, #b3b9cc 1%, #e6dee9 100%)", name: "灰紫渐变" },
  { id: "gradient-151", gid: "g5", gradient: "linear-gradient(0deg, #cc208e 0%, #6713d2 100%)", name: "粉紫渐变" },
  { id: "gradient-152", gid: "g5", gradient: "linear-gradient(0deg, #00dbde 0%, #fc00ff 100%)", name: "冰蓝粉紫渐变" },
  { id: "gradient-153", gid: "g5", gradient: "linear-gradient(0deg, #b224ef 0%, #7579ff 100%)", name: "紫蓝渐变" },
  { id: "gradient-154", gid: "g5", gradient: "linear-gradient(0deg, #ec77ab 0%, #7472fe 100%)", name: "粉蓝渐变" },
  { id: "gradient-155", gid: "g5", gradient: "linear-gradient(-225deg, #2cd8d5 0%, #c5c1ff 56%, #ffbac3 100%)", name: "青紫粉渐变" },
  { id: "gradient-156", gid: "g5", gradient: "linear-gradient(-225deg, #2cd8d5 0%, #6b8ce4 48%, #8e2dd7 100%)", name: "青绿紫渐变" },
  { id: "gradient-157", gid: "g5", gradient: "linear-gradient(-225deg, #a892ff 0%, #8856a7 100%)", name: "紫粉渐变" },
  { id: "gradient-158", gid: "g5", gradient: "linear-gradient(-225deg, #5271c4 0%, #b993e6 48%, #ec8cbf 100%)", name: "蓝紫粉渐变" },
  { id: "gradient-159", gid: "g5", gradient: "linear-gradient(-225deg, #ac32e4 0%, #7918f2 48%, #4801ff 100%)", name: "深紫渐变" },
  { id: "gradient-160", gid: "g5", gradient: "linear-gradient(-225deg, #654ea3 0%, #eaafc8 53%, #654ea3 100%)", name: "紫粉紫渐变" },
  { id: "gradient-161", gid: "g5", gradient: "linear-gradient(-225deg, #ff3cac 0%, #562b7c 52%, #2b86c5 100%)", name: "粉紫蓝渐变" },
  { id: "gradient-162", gid: "g5", gradient: "linear-gradient(-225deg, #ff057c 0%, #7c0177 50%, #31025c 100%)", name: "深粉紫渐变" },
  { id: "gradient-163", gid: "g5", gradient: "linear-gradient(-225deg, #69eab8 0%, #e0c3fc 48%, #6662e4 100%)", name: "绿紫渐变" },
  { id: "gradient-164", gid: "g5", gradient: "linear-gradient(-225deg, #3d4e81 0%, #5753c9 48%, #6e7ff3 100%)", name: "深紫蓝渐变" },
  { id: "gradient-165", gid: "g6", gradient: "linear-gradient(0deg, #cfd9e0 0%, #e2ebf0 100%)", name: "浅灰渐变" },
  { id: "gradient-166", gid: "g6", gradient: "linear-gradient(120deg, #fdfbfa 0%, #ebedee 100%)", name: "米白渐变" },
  { id: "gradient-167", gid: "g6", gradient: "linear-gradient(0deg, #a8edea 0%, #fee1eb 100%)", name: "青绿粉渐变" },
  { id: "gradient-168", gid: "g6", gradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", name: "灰白蓝渐变" },
  { id: "gradient-169", gid: "g6", gradient: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)", name: "米黄渐变" },
  { id: "gradient-170", gid: "g6", gradient: "linear-gradient(0deg, #fff1eb 0%, #acccf9 100%)", name: "粉蓝渐变" },
  { id: "gradient-171", gid: "g6", gradient: "linear-gradient(0deg, #e6e9f0 0%, #eef1f5 100%)", name: "淡蓝灰渐变" },
  { id: "gradient-172", gid: "g6", gradient: "linear-gradient(0deg, #acc6ee 0%, #e7efff 100%)", name: "蓝白渐变" },
  { id: "gradient-173", gid: "g6", gradient: "linear-gradient(-20deg, #e9d5ff 0%, #fef7fb 100%)", name: "淡紫黄渐变" },
  { id: "gradient-174", gid: "g6", gradient: "linear-gradient(0deg, #6a85b6 0%, #bac8e0 100%)", name: "深蓝灰渐变" },
  { id: "gradient-175", gid: "g6", gradient: "linear-gradient(0deg, #dbdcd7 0%, #dbdcd7 24%, #e2c9ce 30%, #e7627d 46%, #b8235a 59%, #801357 71%, #3d123a 84%, #1c1a27 100%)", name: "多色红棕渐变" },
  { id: "gradient-176", gid: "g6", gradient: "linear-gradient(0deg, #bdbbb9 0%, #9d9e99 100%)", name: "深灰渐变" },
  { id: "gradient-177", gid: "g6", gradient: "linear-gradient(45deg, #93a5c9 0%, #e4efea 100%)", name: "蓝绿白渐变" },
  { id: "gradient-178", gid: "g6", gradient: "linear-gradient(45deg, #93a5c9 0%, #e4efea 100%)", name: "蓝绿白渐变" },
  { id: "gradient-179", gid: "g6", gradient: "linear-gradient(0deg, #868f96 0%, #596164 100%)", name: "深灰黑渐变" },
  { id: "gradient-180", gid: "g6", gradient: "linear-gradient(45deg, #8baaa9 0%, #ae8ba4 100%)", name: "青绿粉紫渐变" },
  { id: "gradient-181", gid: "g6", gradient: "linear-gradient(0deg, #d5d4d0 0%, #d5d4d0 1%, #eeeede 31%)", name: "米灰渐变" },
  { id: "gradient-182", gid: "g6", gradient: "linear-gradient(0deg, #f3e7e9 0%, #e3eefd 99%, #e3eefd 100%)", name: "粉蓝渐变" },
  { id: "gradient-183", gid: "g6", gradient: "linear-gradient(0deg, #f77062 0%, #fe5196 100%)", name: "橙粉渐变" },
  { id: "gradient-184", gid: "g6", gradient: "linear-gradient(0deg, #c4c5c7 0%, #dce0e2 52%, #ebebeb 100%)", name: "浅灰渐变" },
  { id: "gradient-185", gid: "g6", gradient: "linear-gradient(0deg, #a8cab9 0%, #5d4157 100%)", name: "绿紫渐变" },
  { id: "gradient-186", gid: "g6", gradient: "linear-gradient(60deg, #29323c 0%, #485563 100%)", name: "深灰蓝渐变" },
  { id: "gradient-187", gid: "g6", gradient: "linear-gradient(-180deg, #bcc5d0 0%, #929eae 98%)", name: "灰蓝渐变" },
  { id: "gradient-188", gid: "g6", gradient: "linear-gradient(0deg, #4481eb 0%, #04befe 100%)", name: "蓝渐变" },
  { id: "gradient-189", gid: "g6", gradient: "linear-gradient(0deg, #dad4ec 0%, #dad4ec 1%, #f3e7e9 100%)", name: "淡紫粉渐变" },
  { id: "gradient-190", gid: "g6", gradient: "linear-gradient(0deg, #eae6e3 59%, #eceae7 100%)", name: "米白渐变" },
  { id: "gradient-191", gid: "g6", gradient: "linear-gradient(0deg, #d3d3d3 0%, #d3d3d3 1%, #e0e0e0 26%)", name: "灰白渐变" },
  { id: "gradient-192", gid: "g6", gradient: "linear-gradient(0deg, #d5dce3 0%, #e8ebf2 50%, #e2e7ed 100%)", name: "蓝灰渐变" },
  { id: "gradient-193", gid: "g6", gradient: "linear-gradient(0deg, #dfebf3 0%, #ffffff 100%)", name: "浅蓝白渐变" },
  { id: "gradient-194", gid: "g6", gradient: "linear-gradient(-20deg, #616161 0%, #9fc7c5 100%)", name: "灰青绿渐变" },
  { id: "gradient-195", gid: "g6", gradient: "linear-gradient(0deg, #d7d2cc 0%, #304352 100%)", name: "米深灰渐变" },
  { id: "gradient-196", gid: "g6", gradient: "linear-gradient(-225deg, #ffffff 0%, #d7ffff 100%)", name: "白青绿渐变" },
  { id: "gradient-197", gid: "g6", gradient: "linear-gradient(-225deg, #e3fdf5 0%, #ffe6fa 100%)", name: "青绿粉渐变" },
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
  const [selectedGradient, setSelectedGradient] = useState(presetGradients[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // 获取相似渐变色
  const getSimilarGradients = (baseGradient: typeof presetGradients[0]) => {
    // 简单的相似度匹配，实际可以根据颜色相似度来匹配
    return gradientColors.filter(g => g.gid == baseGradient.id);
  };

  // 获取当前分类和标签的壁纸
  const getFilteredWallpapers = () => {
    debugger
    if (selectedCategory === "solid") {
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
                <div className="mb-6">
                  {/* 第一行：自定义颜色 */}
                  <div className="flex items-center p-1">
                    <h3 className="text-sm font-medium text-white mr-2">自定义颜色</h3>
                    <div className="flex items-center gap-2">
                      {/* 自定义颜色选择器弹窗 */}
                      <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
                        <PopoverTrigger asChild>
                          <button className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-white/50 transition-colors overflow-hidden relative">
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
                          className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-white/50 transition-colors hover:scale-110"
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
                  <div className="flex items-center p-1 mt-1">
                    <h3 className="text-sm font-medium text-white mr-9">渐变色</h3>
                    <div className="flex items-center gap-2">
                      {presetGradients.map((gradient, index) => (
                        <button
                          key={index}
                          className={cn(
                            "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                            selectedGradient.id === gradient.gid 
                              ? "border-blue-400 ring-2 ring-blue-400/50" 
                              : "border-white/30 hover:border-white/50"
                          )}
                          style={{ background: gradient.gradient }}
                          onClick={() => {
                            setSelectedGradient(gradient);
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
                </div>
              )}
              
              <div className="grid grid-cols-4 gap-4">
                {filteredWallpapers.map((wallpaper) => (
                  <div
                    key={wallpaper.id}
                    className={cn(
                      "relative rounded-lg overflow-hidden cursor-pointer border-1 transition-all hover:scale-105 group",
                      "h-[120px]"
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