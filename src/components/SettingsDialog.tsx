import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Download, 
  Image as ImageIcon,
  User,
  Layout,
  Clock,
  Sidebar as SidebarIcon,
  Grid3X3,
  Info,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WallpaperSelectorDialog } from "./WallpaperSelectorDialog";
import { ColorPicker } from "./ColorPicker";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WallpaperSettings {
  backgroundImage: string;
  maskOpacity: number;
  blur: number;
  showWindmill: boolean;
  customUrl: string;
}

interface OpenMethodSettings {
  openInNewTab: boolean;
}

interface DateTimeSettings {
  showTime: boolean;
  showSearchBar: boolean;
  showMonthDay: boolean;
  showWeek: boolean;
  showLunar: boolean;
  show24Hour: boolean;
  showSeconds: boolean;
  isBold: boolean;
  fontSize: number;
  fontColor: string;
}

interface SidebarSettings {
  position: 'left' | 'right';
  autoHide: boolean;
  scrollSwitch: boolean;
  width: number;
  opacity: number;
}

const settingsOptions = [
  { id: "personal", label: "个人信息", icon: User },
  { id: "wallpaper", label: "壁纸", icon: ImageIcon },
  { id: "openMethod", label: "打开方式", icon: ExternalLink },
  { id: "layout", label: "布局", icon: Layout },
  { id: "datetime", label: "时间日期", icon: Clock },
  { id: "sidebar", label: "侧边栏", icon: SidebarIcon },
  { id: "icons", label: "图标", icon: Grid3X3 },
  { id: "backup", label: "备份恢复", icon: Download },
  { id: "about", label: "关于我们", icon: Info },
];

const defaultWallpapers = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
];

const STORAGE_KEY = "wallpaper_settings";
const OPEN_METHOD_STORAGE_KEY = "open_method_settings";
const DATETIME_STORAGE_KEY = "datetime_settings";
const SIDEBAR_STORAGE_KEY = "sidebar_settings";

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [selectedOption, setSelectedOption] = useState("wallpaper");
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [showAdvancedWallpaperSelector, setShowAdvancedWallpaperSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [settings, setSettings] = useState<WallpaperSettings>({
    backgroundImage: defaultWallpapers[0],
    maskOpacity: 0,
    blur: 0,
    showWindmill: true,
    customUrl: ""
  });
  const [openMethodSettings, setOpenMethodSettings] = useState<OpenMethodSettings>({
    openInNewTab: true
  });
  const [dateTimeSettings, setDateTimeSettings] = useState<DateTimeSettings>({
    showTime: true,
    showSearchBar: true,
    showMonthDay: true,
    showWeek: true,
    showLunar: true,
    show24Hour: true,
    showSeconds: false,
    isBold: false,
    fontSize: 70,
    fontColor: "#ffffff"
  });
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>({
    position: 'left',
    autoHide: false,
    scrollSwitch: true,
    width: 60,
    opacity: 75
  });

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error("Failed to parse wallpaper settings:", error);
      }
    }
    
    // 加载打开方式设置
    const savedOpenMethodSettings = localStorage.getItem(OPEN_METHOD_STORAGE_KEY);
    if (savedOpenMethodSettings) {
      try {
        const parsed = JSON.parse(savedOpenMethodSettings);
        setOpenMethodSettings(parsed);
      } catch (error) {
        console.error("Failed to parse open method settings:", error);
      }
    }
    
    // 加载时间日期设置
    const savedDateTimeSettings = localStorage.getItem(DATETIME_STORAGE_KEY);
    if (savedDateTimeSettings) {
      try {
        const parsed = JSON.parse(savedDateTimeSettings);
        setDateTimeSettings(parsed);
      } catch (error) {
        console.error("Failed to parse datetime settings:", error);
      }
    }
    
    // 加载侧边栏设置
    const savedSidebarSettings = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedSidebarSettings) {
      try {
        const parsed = JSON.parse(savedSidebarSettings);
        setSidebarSettings(parsed);
      } catch (error) {
        console.error("Failed to parse sidebar settings:", error);
      }
    }
  }, []);

  // 保存设置到 localStorage
  const saveSettings = (newSettings: WallpaperSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知 VideoBackground 组件更新
    window.dispatchEvent(new Event('wallpaperSettingsChanged'));
  };

  // 保存打开方式设置到 localStorage
  const saveOpenMethodSettings = (newSettings: OpenMethodSettings) => {
    setOpenMethodSettings(newSettings);
    localStorage.setItem(OPEN_METHOD_STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('openMethodSettingsChanged', { detail: newSettings }));
  };

  // 保存时间日期设置到 localStorage
  const saveDateTimeSettings = (newSettings: DateTimeSettings) => {
    setDateTimeSettings(newSettings);
    localStorage.setItem(DATETIME_STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('dateTimeSettingsChanged', { detail: newSettings }));
  };

  // 保存侧边栏设置到 localStorage
  const saveSidebarSettings = (newSettings: SidebarSettings) => {
    setSidebarSettings(newSettings);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('sidebarSettingsChanged', { detail: newSettings }));
  };

  // 切换新标签页打开设置
  const toggleOpenInNewTab = (checked: boolean) => {
    const newSettings = { ...openMethodSettings, openInNewTab: checked };
    saveOpenMethodSettings(newSettings);
  };

  // 选择预设壁纸
  const selectWallpaper = (imageUrl: string) => {
    const newSettings = { ...settings, backgroundImage: imageUrl };
    saveSettings(newSettings);
    setShowWallpaperSelector(false);
  };

  // 从高级壁纸选择器选择壁纸
  const selectAdvancedWallpaper = (wallpaperUrl: string) => {
    // 如果是纯色，创建渐变背景
    let backgroundImage = wallpaperUrl;
    if (wallpaperUrl.startsWith('#')) {
      backgroundImage = `linear-gradient(135deg, ${wallpaperUrl}, ${wallpaperUrl})`;
    }
    
    const newSettings = { ...settings, backgroundImage };
    saveSettings(newSettings);
    setShowAdvancedWallpaperSelector(false);
  };

  // 下载当前壁纸
  const downloadWallpaper = async () => {
    try {
      const response = await fetch(settings.backgroundImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallpaper_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download wallpaper:", error);
    }
  };

  // 更新遮罩浓度
  const updateMaskOpacity = (value: number[]) => {
    const newSettings = { ...settings, maskOpacity: value[0] };
    saveSettings(newSettings);
  };

  // 更新模糊度
  const updateBlur = (value: number[]) => {
    const newSettings = { ...settings, blur: value[0] };
    saveSettings(newSettings);
  };

  // 切换小风车显示
  const toggleWindmill = (checked: boolean) => {
    const newSettings = { ...settings, showWindmill: checked };
    saveSettings(newSettings);
  };

  // 时间日期设置处理函数
  const toggleShowTime = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showTime: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShowSearchBar = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showSearchBar: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShowMonthDay = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showMonthDay: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShowWeek = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showWeek: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShowLunar = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showLunar: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShow24Hour = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, show24Hour: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleShowSeconds = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, showSeconds: checked };
    saveDateTimeSettings(newSettings);
  };

  const toggleIsBold = (checked: boolean) => {
    const newSettings = { ...dateTimeSettings, isBold: checked };
    saveDateTimeSettings(newSettings);
  };

  const updateFontSize = (value: number[]) => {
    const newSettings = { ...dateTimeSettings, fontSize: value[0] };
    saveDateTimeSettings(newSettings);
  };

  const selectFontColor = (color: string) => {
    const newSettings = { ...dateTimeSettings, fontColor: color };
    saveDateTimeSettings(newSettings);
  };

  // 侧边栏设置处理函数
  const toggleSidebarPosition = (position: 'left' | 'right') => {
    const newSettings = { ...sidebarSettings, position };
    saveSidebarSettings(newSettings);
  };

  const toggleAutoHide = (checked: boolean) => {
    const newSettings = { ...sidebarSettings, autoHide: checked };
    saveSidebarSettings(newSettings);
  };

  const toggleScrollSwitch = (checked: boolean) => {
    const newSettings = { ...sidebarSettings, scrollSwitch: checked };
    saveSidebarSettings(newSettings);
  };

  const updateSidebarWidth = (value: number[]) => {
    const newSettings = { ...sidebarSettings, width: value[0] };
    saveSidebarSettings(newSettings);
  };

  const updateSidebarOpacity = (value: number[]) => {
    const newSettings = { ...sidebarSettings, opacity: value[0] };
    saveSidebarSettings(newSettings);
  };

  const renderWallpaperSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      {/* 当前壁纸预览 */}
      <div className="space-y-3">
      <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-white/20 relative">
          <img
            src={settings.backgroundImage}
            alt="当前壁纸"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: settings.maskOpacity / 100 }}
          />
          {settings.blur > 0 && (
            <div 
              className="absolute inset-0 backdrop-blur-sm"
              style={{ backdropFilter: `blur(${settings.blur}px)` }}
            />
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAdvancedWallpaperSelector(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            更换壁纸
          </Button>
          <Button
            onClick={downloadWallpaper}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            下载壁纸
          </Button>
        </div>
      </div>

      {/* 壁纸选择器 */}
      {showWallpaperSelector && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-white">选择壁纸</Label>
          <div className="grid grid-cols-3 gap-2">
            {defaultWallpapers.map((wallpaper, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all hover:scale-105",
                  settings.backgroundImage === wallpaper 
                    ? "border-blue-500 ring-1 ring-blue-500/50" 
                    : "border-white/20 hover:border-white/40"
                )}
                onClick={() => selectWallpaper(wallpaper)}
              >
                <img
                  src={wallpaper}
                  alt={`壁纸 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {settings.backgroundImage === wallpaper && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 遮罩浓度 */}
      <div className="space-y-3">
      <Label className="text-sm font-medium text-white">
        遮罩浓度: {settings.maskOpacity}%
        </Label>
        <Slider
          value={[settings.maskOpacity]}
          onValueChange={updateMaskOpacity}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      {/* 模糊度 */}
      <div className="space-y-3">
      <Label className="text-sm font-medium text-white">
        模糊度: {settings.blur}%
        </Label>
        <Slider
          value={[settings.blur]}
          onValueChange={updateBlur}
          max={20}
          min={0}
          step={1}
          className="w-full"
        />
      </div>

      {/* 显示切换壁纸小风车 */}
      <div className="flex items-center justify-between">
      <Label className="text-sm font-medium text-white">显示切换壁纸小风车</Label>
      <Switch
          checked={settings.showWindmill}
          onCheckedChange={toggleWindmill}
        />
      </div>
    </div>
  );

  const renderOpenMethodSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">打开方式设置</h3>
          <p className="text-sm text-white/60">配置点击书签图标时的打开行为</p>
        </div>
        
        <div className="space-y-4">
          {/* 新标签页打开设置 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">在新标签页中打开</Label>
              <p className="text-xs text-white/60">启用后，点击书签图标将在新标签页中打开链接</p>
            </div>
            <Switch
              checked={openMethodSettings.openInNewTab}
              onCheckedChange={toggleOpenInNewTab}
            />
          </div>
          
          {/* 当前设置状态显示 */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">
                当前设置：{openMethodSettings.openInNewTab ? '新标签页打开' : '当前页面打开'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDateTimeSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">时间日期设置</h3>
          <p className="text-sm text-white/60">配置时间显示和搜索栏的显示选项</p>
        </div>
        
        <div className="space-y-4">
          {/* 显示时间开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">显示时间</Label>
              <p className="text-xs text-white/60">控制页面上时间的显示和隐藏</p>
            </div>
            <Switch
              checked={dateTimeSettings.showTime}
              onCheckedChange={toggleShowTime}
            />
          </div>
          
          {/* 显示搜索栏开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">显示搜索栏</Label>
              <p className="text-xs text-white/60">控制页面上搜索栏的显示和隐藏</p>
            </div>
            <Switch
              checked={dateTimeSettings.showSearchBar}
              onCheckedChange={toggleShowSearchBar}
            />
          </div>
          
          {/* 时间显示项目 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">时间显示项目</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={dateTimeSettings.showMonthDay ? "default" : "outline"}
                size="sm"
                onClick={() => toggleShowMonthDay(!dateTimeSettings.showMonthDay)}
                className={dateTimeSettings.showMonthDay ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                月日
              </Button>
              <Button
                variant={dateTimeSettings.showWeek ? "default" : "outline"}
                size="sm"
                onClick={() => toggleShowWeek(!dateTimeSettings.showWeek)}
                className={dateTimeSettings.showWeek ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                周
              </Button>
              <Button
                variant={dateTimeSettings.showLunar ? "default" : "outline"}
                size="sm"
                onClick={() => toggleShowLunar(!dateTimeSettings.showLunar)}
                className={dateTimeSettings.showLunar ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                农历
              </Button>
              <Button
                variant={dateTimeSettings.show24Hour ? "default" : "outline"}
                size="sm"
                onClick={() => toggleShow24Hour(!dateTimeSettings.show24Hour)}
                className={dateTimeSettings.show24Hour ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                24
              </Button>
              <Button
                variant={dateTimeSettings.showSeconds ? "default" : "outline"}
                size="sm"
                onClick={() => toggleShowSeconds(!dateTimeSettings.showSeconds)}
                className={dateTimeSettings.showSeconds ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                秒
              </Button>
              <Button
                variant={dateTimeSettings.isBold ? "default" : "outline"}
                size="sm"
                onClick={() => toggleIsBold(!dateTimeSettings.isBold)}
                className={dateTimeSettings.isBold ? "bg-blue-600 hover:bg-blue-700" : "border-white/20 text-white hover:bg-white/10"}
              >
                粗体
              </Button>
            </div>
          </div>
          
          {/* 字体大小 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              大小: {dateTimeSettings.fontSize}px
            </Label>
            <Slider
              value={[dateTimeSettings.fontSize]}
              onValueChange={updateFontSize}
              max={120}
              min={20}
              step={1}
              className="w-full"
            />
          </div>
          
          {/* 颜色选择 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">颜色</Label>
            <div className="flex items-center gap-3">
              {/* 预设颜色 */}
              <div className="flex gap-2">
                {["#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 transition-colors ${
                      dateTimeSettings.fontColor === color 
                        ? "border-white" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => selectFontColor(color)}
                  />
                ))}
                {/* 自定义颜色按钮 */}
                <button
                  className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 bg-white/10 flex items-center justify-center text-white text-xs transition-colors"
                  onClick={() => setShowColorPicker(true)}
                >
                  +
                </button>
              </div>
              {/* 当前颜色显示 */}
              <div
                className="w-8 h-8 rounded border border-white/20"
                style={{ backgroundColor: dateTimeSettings.fontColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSidebarSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">侧边栏设置</h3>
          <p className="text-sm text-white/60">配置侧边栏的位置、显示和行为选项</p>
        </div>
        
        <div className="space-y-6">
          {/* 位置选择 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">位置</Label>
            <div className="grid grid-cols-2 gap-4">
              {/* 左侧选项 */}
              <div
                className={cn(
                  "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                  sidebarSettings.position === 'left'
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/20 hover:border-white/40"
                )}
                onClick={() => toggleSidebarPosition('left')}
              >
                <div className="aspect-video bg-white/5 rounded border border-white/10 relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-3 h-full bg-white/30"></div>
                  <div className="absolute right-2 top-2 w-8 h-1 bg-white/20 rounded"></div>
                  <div className="absolute right-2 top-4 w-6 h-1 bg-white/20 rounded"></div>
                </div>
                <div className="mt-2 text-center">
                  <Button
                    size="sm"
                    className={cn(
                      "text-xs",
                      sidebarSettings.position === 'left'
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white/70"
                    )}
                  >
                    左侧
                  </Button>
                </div>
              </div>
              
              {/* 右侧选项 */}
              <div
                className={cn(
                  "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105",
                  sidebarSettings.position === 'right'
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/20 hover:border-white/40"
                )}
                onClick={() => toggleSidebarPosition('right')}
              >
                <div className="aspect-video bg-white/5 rounded border border-white/10 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-3 h-full bg-white/30"></div>
                  <div className="absolute left-2 top-2 w-8 h-1 bg-white/20 rounded"></div>
                  <div className="absolute left-2 top-4 w-6 h-1 bg-white/20 rounded"></div>
                </div>
                <div className="mt-2 text-center">
                  <Button
                    size="sm"
                    className={cn(
                      "text-xs",
                      sidebarSettings.position === 'right'
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white/70"
                    )}
                  >
                    右侧
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 自动隐藏开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">自动隐藏</Label>
              <p className="text-xs text-white/60">鼠标移入时显示，移出时自动隐藏侧边栏</p>
            </div>
            <Switch
              checked={sidebarSettings.autoHide}
              onCheckedChange={toggleAutoHide}
            />
          </div>

          {/* 鼠标滚轮切换分组开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">鼠标滚轮切换分组</Label>
              <p className="text-xs text-white/60">页面滚动时自动切换到下一个分组</p>
            </div>
            <Switch
              checked={sidebarSettings.scrollSwitch}
              onCheckedChange={toggleScrollSwitch}
            />
          </div>

          {/* 宽度调整 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              宽度: {sidebarSettings.width}px
            </Label>
            <Slider
              value={[sidebarSettings.width]}
              onValueChange={updateSidebarWidth}
              max={120}
              min={40}
              step={5}
              className="w-full"
            />
          </div>

          {/* 透明度调整 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              透明度: {sidebarSettings.opacity}%
            </Label>
            <Slider
              value={[sidebarSettings.opacity]}
              onValueChange={updateSidebarOpacity}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettingContent = () => {
    switch (selectedOption) {
      case "wallpaper":
        return renderWallpaperSettings();
      case "openMethod":
        return renderOpenMethodSettings();
      case "datetime":
        return renderDateTimeSettings();
      case "sidebar":
        return renderSidebarSettings();
      default:
        return (
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="text-lg mb-2">功能开发中</div>
              <div className="text-sm">该功能正在开发中，敬请期待</div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[90vh] max-h-[90vh] p-0 bg-slate-800/60 backdrop-blur-sm border border-white/20 text-white fixed">
      <div className="flex h-full">
          {/* 左侧设置选项 */}
          <div className="w-48 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-medium">设置</h2>
            </div>
            
            <div className="flex-1 py-2">
              {settingsOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption === option.id;
                
                return (
                  <Button
                    key={option.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-none",
                      isSelected && "bg-white/20 text-white"
                    )}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 右侧设置内容 */}
          {renderSettingContent()}
        </div>
      </DialogContent>
      
      {/* 高级壁纸选择弹框 */}
      <WallpaperSelectorDialog
        open={showAdvancedWallpaperSelector}
        onOpenChange={setShowAdvancedWallpaperSelector}
        onWallpaperSelect={selectAdvancedWallpaper}
        currentWallpaper={settings.backgroundImage}
      />
      
      {/* 颜色选择器 */}
      <ColorPicker
        open={showColorPicker}
        onOpenChange={setShowColorPicker}
        onColorSelect={selectFontColor}
        currentColor={dateTimeSettings.fontColor}
      />
    </Dialog>
  );
};