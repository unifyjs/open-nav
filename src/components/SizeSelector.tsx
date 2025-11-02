import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, FolderOpen } from "lucide-react";

interface SizeSelectorProps {
  x: number;
  y: number;
  currentSize: string;
  onSizeChange: (size: string) => void;
  onClose: () => void;
}

const sizeOptions = [
  { value: "1x1", label: "1x1" },
  { value: "1x2", label: "1x2" },
  { value: "2x1", label: "2x1" },
  { value: "2x2", label: "2x2" },
  { value: "2x4", label: "2x4" },
  { value: "4x1", label: "4x1" },
  { value: "4x2", label: "4x2" },
  { value: "4x4", label: "4x4" },
];

export const SizeSelector = ({ x, y, currentSize, onSizeChange, onClose }: SizeSelectorProps) => {
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sizeMenuRef = useRef<HTMLDivElement>(null);

  // Position the menu to stay within viewport
  const getMenuPosition = () => {
    const menuWidth = 200;
    const menuHeight = 120;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }

    // Adjust vertical position
    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const getSizeMenuPosition = () => {
    if (!menuRef.current) return { x: 0, y: 0 };
    
    const menuRect = menuRef.current.getBoundingClientRect();
    const sizeMenuWidth = 120;
    const sizeMenuHeight = 200;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = menuRect.right + 5;
    let adjustedY = menuRect.top;

    // Adjust horizontal position
    if (adjustedX + sizeMenuWidth > viewportWidth) {
      adjustedX = menuRect.left - sizeMenuWidth - 5;
    }

    // Adjust vertical position
    if (adjustedY + sizeMenuHeight > viewportHeight) {
      adjustedY = viewportHeight - sizeMenuHeight - 10;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const position = getMenuPosition();
  const sizeMenuPosition = getSizeMenuPosition();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        sizeMenuRef.current &&
        !sizeMenuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* Main Context Menu */}
      <div
        ref={menuRef}
        className="fixed z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 py-2 min-w-[180px]"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onMouseEnter={() => setShowSizeMenu(true)}
          onMouseLeave={() => setShowSizeMenu(false)}
        >
          <span>图标尺寸</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span>移动到分类</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <div className="border-t border-gray-200 my-1" />
        
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          onClick={onClose}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          删除
        </Button>
      </div>

      {/* Size Selection Submenu */}
      {showSizeMenu && (
        <div
          ref={sizeMenuRef}
          className="fixed z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 py-2 min-w-[100px]"
          style={{
            left: sizeMenuPosition.x,
            top: sizeMenuPosition.y,
          }}
          onMouseEnter={() => setShowSizeMenu(true)}
          onMouseLeave={() => setShowSizeMenu(false)}
        >
          {sizeOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className={`w-full justify-start px-4 py-2 text-sm hover:bg-gray-100 ${
                currentSize === option.value 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-700'
              }`}
              onClick={() => onSizeChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </>
  );
};