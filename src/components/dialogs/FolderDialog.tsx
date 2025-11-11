import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookmarkItem } from "../BookmarkItem";
import { X, ArrowLeft } from "lucide-react";

interface GridItem {
  type: "widget" | "bookmark" | "folder";
  id: string;
  title: string;
  size?: string;
  icon?: string;
  url?: string;
  color?: string;
  order?: number;
  children?: GridItem[];
}

interface FolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: GridItem | null;
  onUpdateFolder: (folderId: string, children: GridItem[]) => void;
  onMoveToDesktop: (item: GridItem) => void;
}

export const FolderDialog = ({ 
  open, 
  onOpenChange, 
  folder, 
  onUpdateFolder, 
  onMoveToDesktop 
}: FolderDialogProps) => {
  const [folderItems, setFolderItems] = useState<GridItem[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    item: GridItem | null;
  }>({ show: false, x: 0, y: 0, item: null });

  useEffect(() => {
    if (folder && folder.children) {
      setFolderItems([...folder.children]);
    }
  }, [folder]);

  const handleItemClick = (item: GridItem, e: React.MouseEvent) => {
    if (item.url && item.url !== '#') {
      window.open(item.url, '_blank');
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: GridItem) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const handleMoveToDesktop = (item: GridItem) => {
    if (!folder) return;
    
    // 从文件夹中移除
    const updatedItems = folderItems.filter(i => i.id !== item.id);
    setFolderItems(updatedItems);
    onUpdateFolder(folder.id, updatedItems);
    
    // 移动到桌面
    onMoveToDesktop(item);
    
    // 关闭右键菜单
    setContextMenu({ show: false, x: 0, y: 0, item: null });
    
    // 如果文件夹为空，关闭对话框
    if (updatedItems.length === 0) {
      onOpenChange(false);
    }
  };

  const handleDeleteItem = (item: GridItem) => {
    if (!folder) return;
    
    const updatedItems = folderItems.filter(i => i.id !== item.id);
    setFolderItems(updatedItems);
    onUpdateFolder(folder.id, updatedItems);
    
    setContextMenu({ show: false, x: 0, y: 0, item: null });
    
    if (updatedItems.length === 0) {
      onOpenChange(false);
    }
  };

  // 关闭右键菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, item: null });
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

  if (!folder) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-black/80 backdrop-blur-md border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: folder.color }}
              >
                {folder.icon ? (
                  <img src={folder.icon} alt={folder.title} className="w-6 h-6" />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {folder.title.charAt(0)}
                  </span>
                )}
              </div>
              {folder.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-6 gap-4 p-4 min-h-[200px]">
            {folderItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <BookmarkItem
                  title={item.title}
                  icon={item.icon || ""}
                  url={item.url || ""}
                  color={item.color || "#ffffff"}
                  size="1x1"
                  onClick={(e) => handleItemClick(item, e)}
                />
              </div>
            ))}
          </div>
          
          {folderItems.length === 0 && (
            <div className="text-center py-8 text-white/60">
              文件夹为空
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 右键菜单 */}
      {contextMenu.show && contextMenu.item && (
        <div
          className="fixed z-[9999] bg-black/90 backdrop-blur-md rounded-lg border border-white/20 py-2 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            onClick={() => {
              if (contextMenu.item?.url && contextMenu.item.url !== '#') {
                window.open(contextMenu.item.url, '_blank');
              }
              setContextMenu({ show: false, x: 0, y: 0, item: null });
            }}
          >
            在新标签页打开
          </button>
          <button
            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            onClick={() => handleMoveToDesktop(contextMenu.item!)}
          >
            移动到桌面
          </button>
          <button
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 transition-colors"
            onClick={() => handleDeleteItem(contextMenu.item!)}
          >
            删除
          </button>
        </div>
      )}
    </>
  );
};