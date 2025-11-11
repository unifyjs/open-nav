import { useState, useEffect, useRef } from "react";
import { BookmarkItem } from "./BookmarkItem";
import { WidgetItem } from "./widgets";
import { SizeSelector } from "./SizeSelector";
import { AddComponentDialog, CaseConverterDialog, Base64Dialog, MD5Dialog, AESDialog } from "./dialogs";
import { useMediaQuery } from "@/hooks/use-mobile";

interface BookmarkGridProps {
  category: string;
  onCategoryChange?: (category: string) => void;
  categories?: Array<{ id: string; label: string; icon: string; isCustom?: boolean; isEdited?: boolean }>;
}

interface GridItem {
  type: "widget" | "bookmark";
  id: string;
  title: string;
  size?: string;
  icon?: string;
  url?: string;
  color?: string;
  order?: number;
}

interface IconSettings {
  iconSize: number;
  iconBorderRadius: number;
  iconSpacing: number;
  showName: boolean;
  nameSize: number;
  maxWidth: number;
}

// 从配置文件加载书签数据
const loadBookmarkData = async (): Promise<Record<string, GridItem[]>> => {
  try {
    const response = await fetch('/data/bookmark-data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load bookmark data:', error);
    // 返回空对象作为后备
    return {};
  }
};

export const BookmarkGrid = ({ category, onCategoryChange, categories = [] }: BookmarkGridProps) => {
  const [items, setItems] = useState<GridItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<GridItem | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCaseConverterDialog, setShowCaseConverterDialog] = useState(false);
  const [showBase64Dialog, setShowBase64Dialog] = useState(false);
  const [showMD5Dialog, setShowMD5Dialog] = useState(false);
  const [showAESDialog, setShowAESDialog] = useState(false);
  const [openInNewTab, setOpenInNewTab] = useState(true); // 默认在新标签页打开
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    iconSize: 60,
    iconBorderRadius: 16,
    iconSpacing: 27,
    showName: true,
    nameSize: 12,
    maxWidth: window.innerWidth || 1388
  });
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    item: GridItem | null;
  }>({ show: false, x: 0, y: 0, item: null });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarSettings, setSidebarSettings] = useState<{ scrollSwitch: boolean }>({ scrollSwitch: true });
  const [isScrolling, setIsScrolling] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'from-top' | 'from-bottom' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 响应式断点检测
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  
  // 动态计算桌面端网格列数
  const calculateDesktopColumns = () => {
    if (!isDesktop) return 12; // 非桌面端返回默认值
    
    // 获取容器的实际可用宽度
    const containerPadding = 64; // 左右padding总和 (px-8 = 32px * 2)
    const maxContainerWidth = Math.min(windowWidth - containerPadding, iconSettings.maxWidth);
    
    // 计算单个图标占用的宽度（图标大小 + 间距）
    const iconTotalWidth = iconSettings.iconSize + iconSettings.iconSpacing;
    
    // 计算能容纳的列数
    const calculatedColumns = Math.floor(maxContainerWidth / iconTotalWidth);
    
    // 设置合理的列数范围：最少8列，最多24列
    return Math.max(8, Math.min(24, calculatedColumns));
  };
  
  // 根据屏幕尺寸动态计算网格列数
  const getGridColumns = () => {
    if (isMobile) return 4; // 手机端4列
    if (isTablet) return 8; // 平板端8列
    return calculateDesktopColumns(); // 桌面端动态计算
  };
  
  const gridColumns = getGridColumns();
  
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load items from localStorage or use default data
  useEffect(() => {
    const loadData = async () => {
      const savedData = localStorage.getItem(`opennav-grid-${category}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setItems(parsedData.sort((a: GridItem, b: GridItem) => (a.order || 0) - (b.order || 0)));
        } catch (error) {
          console.error("Failed to parse saved grid data:", error);
          const bookmarkData = await loadBookmarkData();
          const defaultItems = bookmarkData[category] || [];
          setItems(defaultItems);
        }
      } else {
        const bookmarkData = await loadBookmarkData();
        const defaultItems = bookmarkData[category] || [];
        // 如果是新分组且没有默认数据，添加默认的“添加图标”项
        if (defaultItems.length === 0) {
          const addItem: GridItem = {
            type: "bookmark",
            id: "add",
            title: "添加图标",
            icon: "https://oss.nbtab.com/public/admin/website/7319643153289458-0.svg",
            url: "#",
            color: "#ffffff",
            size: "1x1",
            order: 0
          };
          setItems([addItem]);
        } else {
          setItems(defaultItems);
        }
      }
    };
    
    loadData();
    
    // 加载打开方式设置
    const loadOpenMethodSettings = () => {
      const savedOpenMethodSettings = localStorage.getItem('open_method_settings');
      if (savedOpenMethodSettings) {
        try {
          const parsed = JSON.parse(savedOpenMethodSettings);
          setOpenInNewTab(parsed.openInNewTab ?? true);
        } catch (error) {
          console.error("Failed to parse open method settings:", error);
        }
      }
    };
    
    loadOpenMethodSettings();
    
    // 加载图标设置
    const loadIconSettings = () => {
      const savedIconSettings = localStorage.getItem('icon_settings');
      if (savedIconSettings) {
        try {
          const parsed = JSON.parse(savedIconSettings);
          setIconSettings(parsed);
        } catch (error) {
          console.error("Failed to parse icon settings:", error);
        }
      }
    };
    
    loadIconSettings();
    
    // 监听打开方式设置变化
    const handleOpenMethodSettingsChange = (event: CustomEvent) => {
      setOpenInNewTab(event.detail.openInNewTab ?? true);
    };
    
    // 监听图标设置变化
    const handleIconSettingsChange = (event: CustomEvent) => {
      setIconSettings(event.detail);
    };
    
    window.addEventListener('openMethodSettingsChanged', handleOpenMethodSettingsChange as EventListener);
    window.addEventListener('iconSettingsChanged', handleIconSettingsChange as EventListener);
    // window.addEventListener('sidebarSettingsChanged', handleSidebarSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('openMethodSettingsChanged', handleOpenMethodSettingsChange as EventListener);
      window.removeEventListener('iconSettingsChanged', handleIconSettingsChange as EventListener);
      // window.removeEventListener('sidebarSettingsChanged', handleSidebarSettingsChange as EventListener);
    };
}, [category]);

  // 监听图标设置和窗口大小变化，重新计算网格列数
  useEffect(() => {
    // 当图标设置或窗口大小变化时，触发重新渲染
    // 这里不需要额外的逼辑，只需要依赖项变化即可触发组件重新渲染
  }, [iconSettings.iconSize, iconSettings.iconSpacing, iconSettings.maxWidth, windowWidth, isMobile, isTablet, isDesktop]);

  // Save items to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(`opennav-grid-${category}`, JSON.stringify(items));
    }
  }, [items, category]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: GridItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };
  
  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedItem(null);
    setDraggedOverIndex(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDraggedOverIndex(index);
  };
  
  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the grid entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOverIndex(null);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const dragIndex = items.findIndex(item => item.id === draggedItem.id);
    if (dragIndex === -1 || dragIndex === dropIndex) {
      setDraggedItem(null);
      setDraggedOverIndex(null);
      return;
    }

    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);

    // Update order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));

    setItems(updatedItems);
    setDraggedItem(null);
    setDraggedOverIndex(null);
    
    // Show success feedback
    console.log(`Moved "${draggedItem.title}" from position ${dragIndex} to ${dropIndex}`);
  };

  // Handle right click
  const handleContextMenu = (e: React.MouseEvent, item: GridItem) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  // Handle size change
  const handleSizeChange = (itemId: string, newSize: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, size: newSize } : item
    ));
    setContextMenu({ show: false, x: 0, y: 0, item: null });
  };

  // Handle adding new component
  const handleAddComponent = (component: any) => {
    const newItem: GridItem = {
      type: "bookmark",
      id: component.id,
      title: component.title,
      icon: component.icon,
      url: component.url,
      color: component.color,
      size: "1x1",
      order: items.length
    };
    
    setItems(prev => [...prev, newItem]);
    setShowAddDialog(false);
  };

  // Handle bookmark item click
  const handleBookmarkClick = (item: GridItem, e: React.MouseEvent) => {
    // Prevent click when dragging
    if (draggedItem) {
      e.preventDefault();
      return;
    }
    
    // Check if this is the "add" button
    if (item.id === "add" || item.title === "添加图标") {
      e.preventDefault();
      setShowAddDialog(true);
      return;
    }
    
    // Check if this is the case converter component
    if (item.id === "case-converter" || item.url === "#case-converter") {
      e.preventDefault();
      setShowCaseConverterDialog(true);
      return;
    }
    
    // Check if this is the base64 converter component
    if (item.id === "base64-converter" || item.url === "#base64-converter") {
      e.preventDefault();
      setShowBase64Dialog(true);
      return;
    }
    
    // Check if this is the md5 converter component
    if (item.id === "md5-converter" || item.url === "#md5-converter") {
      e.preventDefault();
      setShowMD5Dialog(true);
      return;
    }
    
    // Check if this is the aes converter component
    if (item.id === "aes-converter" || item.url === "#aes-converter") {
      e.preventDefault();
      setShowAESDialog(true);
      return;
    }
    
    // Handle normal bookmark clicks
    if (item.url && item.url.startsWith('chrome://') || item.url === '#') {
      // For demo purposes, just show an alert for chrome:// URLs and placeholder links
      alert(`This would open: ${item.url}`);
    } else if (item.url) {
      // 根据设置决定打开方式
      if (openInNewTab) {
        window.open(item.url, '_blank');
      } else {
        window.location.href = item.url;
      }
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, item: null });
    };

    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.show]);

  // 滚动边界检测和分组切换
  useEffect(() => {
    if (!sidebarSettings.scrollSwitch || !onCategoryChange || categories.length === 0) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isScrolling || isAnimating) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      
      // 只在滚动到边界时处理
      if (!isAtTop && !isAtBottom) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentIndex = categories.findIndex(cat => cat.id === category);
        if (currentIndex === -1) return;
        
        let targetIndex = -1;
        let direction: 'from-top' | 'from-bottom' | null = null;
        
        if (isAtTop && currentIndex > 0) {
          // 在顶部，切换到上一个分组，下一组从上方进入
          targetIndex = currentIndex - 1;
          direction = 'from-top';
        } else if (isAtBottom && currentIndex < categories.length - 1) {
          // 在底部，切换到下一个分组，下一组从底部进入
          targetIndex = currentIndex + 1;
          direction = 'from-bottom';
        }
        
        if (targetIndex >= 0 && targetIndex < categories.length && direction) {
          setIsScrolling(true);
          setIsAnimating(true);
          setAnimationDirection(direction);
          
          // 切换分组
          onCategoryChange(categories[targetIndex].id);
          
          // 动画结束后清理状态
          setTimeout(() => {
            setIsAnimating(false);
            setAnimationDirection(null);
            setIsScrolling(false);
          }, 500); // 动画持续时间
        }
      }, 100); // 100ms 防抖
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || isAnimating) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop === 0;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
      
      // 只在滚动到边界时处理滚轮事件
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const currentIndex = categories.findIndex(cat => cat.id === category);
          if (currentIndex === -1) return;
          
          let targetIndex = -1;
          let direction: 'from-top' | 'from-bottom' | null = null;
          
          if (isAtTop && e.deltaY < 0 && currentIndex > 0) {
            // 在顶部向上滚动，切换到上一个分组，下一组从上方进入
            targetIndex = currentIndex - 1;
            direction = 'from-top';
          } else if (isAtBottom && e.deltaY > 0 && currentIndex < categories.length - 1) {
            // 在底部向下滚动，切换到下一个分组，下一组从底部进入
            targetIndex = currentIndex + 1;
            direction = 'from-bottom';
          }
          
          if (targetIndex >= 0 && targetIndex < categories.length && direction) {
            setIsScrolling(true);
            setIsAnimating(true);
            setAnimationDirection(direction);
            
            // 切换分组
            onCategoryChange(categories[targetIndex].id);
            
            // 动画结束后清理状态
            setTimeout(() => {
              setIsAnimating(false);
              setAnimationDirection(null);
              setIsScrolling(false);
            }, 100); // 动画持续时间
          }
        }, 100);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [sidebarSettings.scrollSwitch, onCategoryChange, categories, category, isScrolling, isAnimating]);

// 响应式网格占位计算
  const getGridSpan = (size: string) => {
    const maxCols = gridColumns;
    
    // 解析尺寸字符串，获取列数和行数
    const [colSpan, rowSpan] = size.split('x').map(Number);
    
    // 根据屏幕类型调整列数
    let adjustedColSpan = colSpan;
    
    if (isMobile) {
      // 手机端：最大4列，超过的被限制为4列
      adjustedColSpan = Math.min(colSpan, 4);
    } else if (isTablet) {
      // 平板端：最大8列，超过的被限制为8列
      adjustedColSpan = Math.min(colSpan, 8);
    } else {
      // 桌面端：根据动态计算的列数限制
      adjustedColSpan = Math.min(colSpan, maxCols);
    }
    
    // 返回动态生成的CSS类
    return `col-span-${adjustedColSpan} row-span-${rowSpan}`;
  };

return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 pb-8 max-h-[90vh] overflow-y-auto hide-scrollbar" 
      style={{ maxWidth: `${iconSettings.maxWidth}px`, margin: '0 auto' }}
    >
      <div 
        ref={gridRef} 
        className={`grid relative transition-all duration-500 ease-out ${
          animationDirection === 'from-top' ? 'animate-slide-in-from-top' : 
          animationDirection === 'from-bottom' ? 'animate-slide-in-from-bottom' : ''
        }`}
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
          gap: `${Math.max(iconSettings.iconSpacing * (isMobile ? 0.5 : isTablet ? 0.75 : 1), 8)}px` 
        }}
      >
        {items.map((item, index) => {
          const isDraggedOver = draggedOverIndex === index;
          const isDragging = draggedItem?.id === item.id;
          
          return (
            <div
              key={`${item.id}-${index}`}
              className={`
                grid-item drag-item
                ${getGridSpan(item.size || "1x1")} 
                ${isDraggedOver ? 'drop-zone ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : ''}
                ${isDragging ? 'dragging opacity-30 scale-95' : ''}
                transition-all duration-200 ease-in-out
                cursor-move hover:z-10 relative
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {item.type === "widget" ? (
                <WidgetItem
                  id={item.id}
                  title={item.title}
                  size={item.size || "1x1"}
                />
              ) : (
                <BookmarkItem
                  title={item.title}
                  icon={item.icon || ""}
                  url={item.url || ""}
                  color={item.color || "#ffffff"}
                  size={item.size || "1x1"}
                  isDragging={isDragging}
                  openInNewTab={openInNewTab}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => handleBookmarkClick(item, e)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu.show && contextMenu.item && (
        <SizeSelector
          x={contextMenu.x}
          y={contextMenu.y}
          currentSize={contextMenu.item.size || "1x1"}
          onSizeChange={(size) => handleSizeChange(contextMenu.item!.id, size)}
          onClose={() => setContextMenu({ show: false, x: 0, y: 0, item: null })}
        />
      )}
      
      {/* Add Component Dialog */}
      <AddComponentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddComponent={handleAddComponent}
        currentGroupId={category}
      />
      
      {/* Case Converter Dialog */}
      <CaseConverterDialog
        open={showCaseConverterDialog}
        onOpenChange={setShowCaseConverterDialog}
      />
      
      {/* Base64 Dialog */}
      <Base64Dialog
        open={showBase64Dialog}
        onOpenChange={setShowBase64Dialog}
      />
      
      {/* MD5 Dialog */}
      <MD5Dialog
        open={showMD5Dialog}
        onOpenChange={setShowMD5Dialog}
      />
      
      {/* AES Dialog */}
      <AESDialog
        open={showAESDialog}
        onOpenChange={setShowAESDialog}
      />
    </div>
  );
};