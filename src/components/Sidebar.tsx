import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Bot, Coffee, Code, Palette, Megaphone, Plus, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/SettingsDialog";

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

  return (
    <div className="fixed left-0 top-0 h-full w-[60px] bg-slate-800/40 backdrop-blur-sm border-r border-white/10 z-40 flex flex-col">
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
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
          
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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
          
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
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