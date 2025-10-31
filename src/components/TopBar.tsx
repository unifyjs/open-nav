import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, FileText, Settings, Image, Plus, MessageSquare, Globe } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Login Button */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <Monitor className="w-4 h-4 mr-2" />
        登录
      </Button>
      
      {/* Settings Button */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <Settings className="w-4 h-4" />
      </Button>
      
      {/* Wallpaper Button */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <Image className="w-4 h-4" />
      </Button>
      
      {/* Add Icon Button */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <Plus className="w-4 h-4" />
      </Button>
      
      {/* Feedback Button */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <MessageSquare className="w-4 h-4" />
      </Button>
      
      {/* Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Globe className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <span className="mr-2">🇨🇳</span>
            简体中文
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="mr-2">🇺🇸</span>
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Extension Download */}
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
        <FileText className="w-4 h-4" />
      </Button>
    </div>
  );
};