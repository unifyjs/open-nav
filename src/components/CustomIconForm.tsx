import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ColorPicker";
import { Link, Type, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomIconFormProps {
  currentGroupId: string;
  onSave: (iconData: CustomIconData) => void;
  onSaveAndContinue: (iconData: CustomIconData) => void;
}

export interface CustomIconData {
  id: string;
  name: string;
  url: string;
  backgroundColor: string;
  iconText: string;
  iconType: 'image' | 'text';
  groupId: string;
  favicon?: string;
}

// 预设颜色
const presetColors = [
  "#ffffff", // 白色
  "#3b82f6", // 蓝色
  "#10b981", // 绿色
  "#f59e0b", // 橙色
  "#ef4444", // 红色
  "#8b5cf6", // 紫色
  "#06b6d4", // 青色
  "#f97316", // 橙红色
];

export const CustomIconForm = ({ currentGroupId, onSave, onSaveAndContinue }: CustomIconFormProps) => {
  const [formData, setFormData] = useState({
    url: "https://",
    name: "",
    backgroundColor: "#3b82f6",
    iconText: "",
    iconType: "image" as "image" | "text"
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isLoadingIcon, setIsLoadingIcon] = useState(false);
  const [favicon, setFavicon] = useState<string>("");
  const [errors, setErrors] = useState<{url?: string; name?: string}>({});

  // 验证表单
  const validateForm = () => {
    const newErrors: {url?: string; name?: string} = {};
    
    if (!formData.url || formData.url === "https://") {
      newErrors.url = "请输入有效的链接";
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = "请输入有效的URL格式";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "请输入名称";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 获取网站图标
  const fetchFavicon = async () => {
    if (!formData.url || formData.url === "https://") return;
    
    setIsLoadingIcon(true);
    try {
      // 尝试多种favicon获取方式
      const domain = new URL(formData.url).hostname;
      const faviconUrls = [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        `https://${domain}/favicon.ico`,
        `https://${domain}/favicon.png`,
        `https://api.faviconkit.com/${domain}/64`,
      ];

      for (const faviconUrl of faviconUrls) {
        try {
          const response = await fetch(faviconUrl);
          if (response.ok) {
            setFavicon(faviconUrl);
            break;
          }
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.error('Failed to fetch favicon:', error);
    } finally {
      setIsLoadingIcon(false);
    }
  };

  // 处理颜色选择
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, backgroundColor: color }));
  };

  // 处理保存
  const handleSave = () => {
    if (!validateForm()) return;

    const iconData: CustomIconData = {
      id: `custom_icon_${Date.now()}`,
      name: formData.name,
      url: formData.url,
      backgroundColor: formData.backgroundColor,
      iconText: formData.iconText,
      iconType: formData.iconType,
      groupId: currentGroupId,
      favicon: favicon || undefined
    };

    onSave(iconData);
  };

  // 处理保存并继续
  const handleSaveAndContinue = () => {
    if (!validateForm()) return;

    const iconData: CustomIconData = {
      id: `custom_icon_${Date.now()}`,
      name: formData.name,
      url: formData.url,
      backgroundColor: formData.backgroundColor,
      iconText: formData.iconText,
      iconType: formData.iconType,
      groupId: currentGroupId,
      favicon: favicon || undefined
    };

    onSaveAndContinue(iconData);
    
    // 重置表单
    setFormData({
      url: "https://",
      name: "",
      backgroundColor: "#3b82f6",
      iconText: "",
      iconType: "image"
    });
    setFavicon("");
    setErrors({});
  };

  return (
    <div className="space-y-6 p-6">
      {/* 链接输入 */}
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium flex items-center gap-1">
          <Link className="w-4 h-4" />
          链接 <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://"
            className={cn("flex-1", errors.url && "border-red-500")}
          />
          <Button
            type="button"
            variant="outline"
            onClick={fetchFavicon}
            disabled={isLoadingIcon}
            className="px-4"
          >
            {isLoadingIcon ? "获取中..." : "获取图标"}
          </Button>
        </div>
        {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
      </div>

      {/* 名称输入 */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
          <Type className="w-4 h-4" />
          名称 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="请输入名称"
          className={cn(errors.name && "border-red-500")}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* 背景颜色选择 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">背景颜色</Label>
        <div className="flex items-center gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all relative",
                formData.backgroundColor === color 
                  ? "border-blue-500 scale-110" 
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            >
              {formData.backgroundColor === color && (
                <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
              )}
            </button>
          ))}
          <button
            type="button"
            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center bg-gray-100"
            onClick={() => setColorPickerOpen(true)}
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 图标文字输入 */}
      <div className="space-y-2">
        <Label htmlFor="iconText" className="text-sm font-medium flex items-center gap-1">
          <Type className="w-4 h-4" />
          图标文字
        </Label>
        <Input
          id="iconText"
          value={formData.iconText}
          onChange={(e) => setFormData(prev => ({ ...prev, iconText: e.target.value }))}
          placeholder="请输入图标文字"
        />
      </div>

      {/* 图标类型选择 */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">图标类型</Label>
        <div className="flex gap-4">
          <button
            type="button"
            className={cn(
              "w-20 h-20 rounded-lg border-2 transition-all relative flex items-center justify-center",
              formData.iconType === "image"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            )}
            onClick={() => setFormData(prev => ({ ...prev, iconType: "image" }))}
          >
            {favicon ? (
              <img src={favicon} alt="favicon" className="w-8 h-8 object-contain" />
            ) : (
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                图
              </div>
            )}
            {formData.iconType === "image" && (
              <Check className="w-4 h-4 text-blue-500 absolute top-1 right-1" />
            )}
          </button>
          
          <button
            type="button"
            className={cn(
              "w-20 h-20 rounded-lg border-2 transition-all relative flex items-center justify-center",
              formData.iconType === "text"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            )}
            onClick={() => setFormData(prev => ({ ...prev, iconType: "text" }))}
          >
            <div 
              className="w-12 h-12 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: formData.backgroundColor }}
            >
              {formData.iconText || "示例"}
            </div>
            {formData.iconType === "text" && (
              <Check className="w-4 h-4 text-blue-500 absolute top-1 right-1" />
            )}
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSave}
          className="flex-1"
        >
          保存
        </Button>
        <Button
          type="button"
          onClick={handleSaveAndContinue}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          保存并继续
        </Button>
      </div>

      {/* 颜色选择器弹窗 */}
      <ColorPicker
        open={colorPickerOpen}
        onOpenChange={setColorPickerOpen}
        onColorSelect={handleColorSelect}
        currentColor={formData.backgroundColor}
      />
    </div>
  );
};