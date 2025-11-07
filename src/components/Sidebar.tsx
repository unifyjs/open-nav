import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, Bot, Coffee, Code, Palette, Megaphone, Plus, Settings,
  Heart, Star, ShoppingCart, Music, Camera, 
  Gamepad2, Wallet, ThumbsUp, Play, Circle,
  Square, Triangle, Diamond, Hexagon, Octagon,
  Bookmark, Tag, Flag, Bell, Mail, Phone,
  Calendar, Clock, Map, Compass, Globe, Wifi
} from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";
import { AddGroupDialog } from "@/components/AddGroupDialog";
import { EditGroupDialog } from "@/components/EditGroupDialog";
import { ContextMenu } from "@/components/ContextMenu";

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

interface SidebarSettings {
  position: 'left' | 'right';
  autoHide: boolean;
  scrollSwitch: boolean;
  width: number;
  opacity: number;
}

// 图标映射
const iconMap = {
  Home, Bot, Coffee, Code, Palette, Megaphone,
  Heart, Star, ShoppingCart, Music, Camera, 
  Gamepad2, Wallet, ThumbsUp, Play, Circle,
  Square, Triangle, Diamond, Hexagon, Octagon,
  Bookmark, Tag, Flag, Bell, Mail, Phone,
  Calendar, Clock, Map, Compass, Globe, Wifi
};

interface Category {
  id: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

const defaultCategories: Category[] = [
  { id: "主页", label: "主页", icon: "Home" },
  { id: "AI", label: "AI", icon: "Bot" },
  { id: "摸鱼", label: "摸鱼", icon: "Coffee" },
  { id: "开发", label: "开发", icon: "Code" },
  { id: "设计", label: "设计", icon: "Palette" },
  { id: "新媒体", label: "新媒体", icon: "Megaphone" },
];

export const Sidebar = ({ currentCategory, onCategoryChange }: SidebarProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addGroupOpen, setAddGroupOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    categoryId: string;
  }>({ visible: false, x: 0, y: 0, categoryId: "" });
  const [editingGroup, setEditingGroup] = useState<Category | null>(null);
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    position: 'left',
    autoHide: false,
    scrollSwitch: true,
    width: 60,
    opacity: 40
  });
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // 加载侧边栏设置和分组数据
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

    // 加载自定义分组
    const savedCategories = localStorage.getItem('custom_categories');
    if (savedCategories) {
      try {
        const parsed = JSON.parse(savedCategories);
        setCategories([...defaultCategories, ...parsed]);
      } catch (error) {
        console.error('Failed to parse custom categories:', error);
      }
    }

    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      setSidebarSettings(event.detail);
      setIsVisible(!(event?.detail?.autoHide) || true);
    };

    window.addEventListener('sidebarSettingsChanged', handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener('sidebarSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  // 保存自定义分组到localStorage
  const saveCustomCategories = (newCategories: Category[]) => {
    const customCategories = newCategories.filter(cat => cat.isCustom);
    localStorage.setItem('custom_categories', JSON.stringify(customCategories));
  };

  // 添加新分组
  const handleAddGroup = (group: { name: string; icon: string }) => {
    const newCategory: Category = {
      id: `custom_${Date.now()}`,
      label: group.name,
      icon: group.icon,
      isCustom: true
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    saveCustomCategories(newCategories);
  };

  // 编辑分组
  const handleEditGroup = (group: { id: string; name: string; icon: string }) => {
    const newCategories = categories.map(cat => 
      cat.id === group.id 
        ? { ...cat, label: group.name, icon: group.icon }
        : cat
    );
    setCategories(newCategories);
    saveCustomCategories(newCategories);
  };

  // 删除分组
  const handleDeleteGroup = (id: string) => {
    const newCategories = categories.filter(cat => cat.id !== id);
    setCategories(newCategories);
    saveCustomCategories(newCategories);
    
    // 如果删除的是当前选中的分组，切换到主页
    if (currentCategory === id) {
      onCategoryChange("主页");
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.isCustom) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        categoryId
      });
    }
  };

  // 打开编辑对话框
  const handleEditClick = () => {
    const category = categories.find(cat => cat.id === contextMenu.categoryId);
    if (category) {
      setEditingGroup(category);
      setEditGroupOpen(true);
    }
  };

  // 自动隐藏逻辑
  useEffect(() => {
    if (sidebarSettings.autoHide) {
      setIsVisible(isHovered);
    } else {
      setIsVisible(true);
    }
  }, [sidebarSettings.autoHide, isHovered]);

  // 滚轮切换分组功能
  // useEffect(() => {
  //   if (!sidebarSettings.scrollSwitch) return;

  //   let scrollTimeout: NodeJS.Timeout;
  //   const handleWheel = (e: WheelEvent) => {
  //     // 清除之前的定时器
  //     clearTimeout(scrollTimeout);
      
  //     // 设置新的定时器，防止频繁触发
  //     scrollTimeout = setTimeout(() => {
  //       const currentIndex = categories.findIndex(cat => cat.id === currentCategory);
        
  //       if (e.deltaY > 0 && currentIndex < categories.length - 1) {
  //         // 向下滚动，切换到下一个分组
  //         onCategoryChange(categories[currentIndex + 1].id);
  //       } else if (e.deltaY < 0 && currentIndex > 0) {
  //         // 向上滚动，切换到上一个分组
  //         onCategoryChange(categories[currentIndex - 1].id);
  //       }
  //     }, 150); // 150ms 防抖
  //   };

  //   window.addEventListener('wheel', handleWheel, { passive: true });
  //   return () => {
  //     window.removeEventListener('wheel', handleWheel);
  //     clearTimeout(scrollTimeout);
  //   };
  // }, [sidebarSettings.scrollSwitch, currentCategory, onCategoryChange]);

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
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
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
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Home;
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
                onContextMenu={(e) => handleContextMenu(e, category.id)}
              >
                <IconComponent className="w-5 h-5 mb-1" />
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
            onClick={() => setAddGroupOpen(true)}
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
      
      {/* Add Group Dialog */}
      <AddGroupDialog
        open={addGroupOpen}
        onOpenChange={setAddGroupOpen}
        onAddGroup={handleAddGroup}
      />
      
      {/* Edit Group Dialog */}
      <EditGroupDialog
        open={editGroupOpen}
        onOpenChange={setEditGroupOpen}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        group={editingGroup}
      />
      
      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onEdit={handleEditClick}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0, categoryId: "" })}
      />
    </div>
  );
};