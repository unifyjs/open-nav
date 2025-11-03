import { useState, useEffect } from "react";
import { GripVertical, X } from "lucide-react";

export const DragHint = () => {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('nbtab-drag-hint-seen');
    if (!hasSeenHint) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem('nbtab-drag-hint-seen', 'true');
  };

  if (!showHint) return null;

  return (
    <div className="fixed top-20 right-8 z-50 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl border border-white/20 max-w-sm animate-in slide-in-from-right-5 duration-500">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <GripVertical className="w-5 h-5 text-white/70" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">拖动排序</h3>
          <p className="text-xs text-white/80 leading-relaxed">
            您可以拖动书签和小组件来重新排序，排序结果会自动保存。右键点击可以调整大小。
          </p>
        </div>
        <button
          onClick={dismissHint}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};