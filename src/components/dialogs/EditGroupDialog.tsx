import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Home, Bot, Coffee, Code, Palette, Megaphone, 
  Heart, Star, ShoppingCart, Music, Camera, 
  Gamepad2, Wallet, ThumbsUp, Play, Circle,
  Square, Triangle, Diamond, Hexagon, Octagon,
  Bookmark, Tag, Flag, Bell, Mail, Phone,
  Calendar, Clock, Map, Compass, Globe, Wifi
} from "lucide-react";

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditGroup: (group: { id: string; name: string; icon: string }) => void;
  onDeleteGroup: (id: string) => void;
  group: { id: string; name: string; icon: string } | null;
}

// 可选择的图标列表
const availableIcons = [
  { name: "Home", icon: Home },
  { name: "Bot", icon: Bot },
  { name: "Coffee", icon: Coffee },
  { name: "Code", icon: Code },
  { name: "Palette", icon: Palette },
  { name: "Megaphone", icon: Megaphone },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Wallet", icon: Wallet },
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "Play", icon: Play },
  { name: "Circle", icon: Circle },
  { name: "Square", icon: Square },
  { name: "Triangle", icon: Triangle },
  { name: "Diamond", icon: Diamond },
  { name: "Hexagon", icon: Hexagon },
  { name: "Octagon", icon: Octagon },
  { name: "Bookmark", icon: Bookmark },
  { name: "Tag", icon: Tag },
  { name: "Flag", icon: Flag },
  { name: "Bell", icon: Bell },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "Calendar", icon: Calendar },
  { name: "Clock", icon: Clock },
  { name: "Map", icon: Map },
  { name: "Compass", icon: Compass },
  { name: "Globe", icon: Globe },
  { name: "Wifi", icon: Wifi },
];

export const EditGroupDialog = ({ open, onOpenChange, onEditGroup, onDeleteGroup, group }: EditGroupDialogProps) => {
  const [selectedIcon, setSelectedIcon] = useState("Home");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    if (group) {
      setSelectedIcon(group.icon);
      setGroupName(group.name);
    }
  }, [group]);

  const handleConfirm = () => {
    if (groupName.trim() && group) {
      onEditGroup({
        id: group.id,
        name: groupName.trim(),
        icon: selectedIcon
      });
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (group) {
      onDeleteGroup(group.id);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (group) {
      setGroupName(group.name);
      setSelectedIcon(group.icon);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium text-gray-800">
            编辑分组
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 图标选择区域 */}
          <div className="space-y-2">
            <div className="text-sm text-gray-600">选择图标</div>
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50/50">
              {availableIcons.map((iconItem) => {
                const IconComponent = iconItem.icon;
                return (
                  <button
                    key={iconItem.name}
                    onClick={() => setSelectedIcon(iconItem.name)}
                    className={cn(
                      "p-2 rounded-lg border-2 transition-all hover:bg-blue-50",
                      selectedIcon === iconItem.name
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <IconComponent className="w-5 h-5 text-gray-700" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 名称输入 */}
          <div className="space-y-2">
            <Input
              placeholder="请输入分组名称"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border-gray-200 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="px-6"
          >
            删除
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!groupName.trim()}
            className="px-6 bg-blue-500 hover:bg-blue-600 text-white"
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};