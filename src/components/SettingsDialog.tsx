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
  RefreshCw,
  Trash2,
  Cloud,
  CloudDownload,
  Upload,
  History,
  RotateCcw
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

interface IconSettings {
  iconSize: number;
  iconBorderRadius: number;
  iconSpacing: number;
  showName: boolean;
  nameSize: number;
  maxWidth: number;
}

interface LayoutSettings {
  minimalistMode: boolean;
  showDailyQuote: boolean;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar: string;
  loginTime: string;
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
const ICON_STORAGE_KEY = "icon_settings";
const LAYOUT_STORAGE_KEY = "layout_settings";
const USER_INFO_STORAGE_KEY = "user_info";

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
  const [iconSettings, setIconSettings] = useState<IconSettings>({
    iconSize: 60,
    iconBorderRadius: 16,
    iconSpacing: 27,
    showName: true,
    nameSize: 12,
    maxWidth: window.innerWidth || 1388
  });
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    minimalistMode: false,
    showDailyQuote: true
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
    
    // 加载图标设置
    const savedIconSettings = localStorage.getItem(ICON_STORAGE_KEY);
    if (savedIconSettings) {
      try {
        const parsed = JSON.parse(savedIconSettings);
        setIconSettings(parsed);
      } catch (error) {
        console.error("Failed to parse icon settings:", error);
      }
    }
    
    // 加载布局设置
    const savedLayoutSettings = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (savedLayoutSettings) {
      try {
        const parsed = JSON.parse(savedLayoutSettings);
        setLayoutSettings(parsed);
      } catch (error) {
        console.error("Failed to parse layout settings:", error);
      }
    }
  }, []);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        setUserInfo(parsed);
      } catch (error) {
        console.error("Failed to parse user info:", error);
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

  // 保存图标设置到 localStorage
  const saveIconSettings = (newSettings: IconSettings) => {
    setIconSettings(newSettings);
    localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('iconSettingsChanged', { detail: newSettings }));
  };

  // 保存布局设置到 localStorage
  const saveLayoutSettings = (newSettings: LayoutSettings) => {
    setLayoutSettings(newSettings);
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(newSettings));
    
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('layoutSettingsChanged', { detail: newSettings }));
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
    // 直接使用选择的颜色或渐变
    const newSettings = { ...settings, backgroundImage: wallpaperUrl };
    saveSettings(newSettings);
    // 不自动关闭弹框，由用户手动关闭
    // setShowAdvancedWallpaperSelector(false);
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
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('sidebarSettingsChanged', { detail: newSettings }));
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

  // 图标设置处理函数
  const updateIconSize = (value: number[]) => {
    const newSettings = { ...iconSettings, iconSize: value[0] };
    saveIconSettings(newSettings);
  };

  const updateIconBorderRadius = (value: number[]) => {
    const newSettings = { ...iconSettings, iconBorderRadius: value[0] };
    saveIconSettings(newSettings);
  };

  const updateIconSpacing = (value: number[]) => {
    const newSettings = { ...iconSettings, iconSpacing: value[0] };
    saveIconSettings(newSettings);
  };

  const toggleShowName = (checked: boolean) => {
    const newSettings = { ...iconSettings, showName: checked };
    saveIconSettings(newSettings);
  };

  const updateNameSize = (value: number[]) => {
    const newSettings = { ...iconSettings, nameSize: value[0] };
    saveIconSettings(newSettings);
  };

  const updateMaxWidth = (value: number[]) => {
    const newSettings = { ...iconSettings, maxWidth: value[0] };
    saveIconSettings(newSettings);
  };

  // 布局设置处理函数
  const toggleMinimalistMode = (checked: boolean) => {
    const newSettings = { ...layoutSettings, minimalistMode: checked };
    saveLayoutSettings(newSettings);
  };

  const toggleShowDailyQuote = (checked: boolean) => {
    const newSettings = { ...layoutSettings, showDailyQuote: checked };
    saveLayoutSettings(newSettings);
  };

  const resetIconLayout = () => {
    const defaultSettings: IconSettings = {
      iconSize: 60,
      iconBorderRadius: 16,
      iconSpacing: 27,
      showName: true,
      nameSize: 12,
      maxWidth: window.innerWidth || 1388
    };
    saveIconSettings(defaultSettings);
  };

  // Mock 登录功能
  const handleMockLogin = () => {
    const mockUser: UserInfo = {
      id: `user_${Date.now()}`,
      username: "演示用户",
      email: "demo@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      loginTime: new Date().toLocaleString()
    };
    
    setUserInfo(mockUser);
    localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(mockUser));
  };

  // 退出登录
  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
  };

  // 删除本地全部数据
  const handleDeleteAllData = () => {
    if (window.confirm("确定要删除所有本地数据吗？此操作不可恢复！")) {
      // 清除所有相关的 localStorage 数据
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(OPEN_METHOD_STORAGE_KEY);
      localStorage.removeItem(DATETIME_STORAGE_KEY);
      localStorage.removeItem(SIDEBAR_STORAGE_KEY);
      localStorage.removeItem(ICON_STORAGE_KEY);
      localStorage.removeItem(USER_INFO_STORAGE_KEY);
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
      
      // 重置所有状态到默认值
      setSettings({
        backgroundImage: defaultWallpapers[0],
        maskOpacity: 0,
        blur: 0,
        showWindmill: true,
        customUrl: ""
      });
      setOpenMethodSettings({ openInNewTab: true });
      setDateTimeSettings({
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
      setSidebarSettings({
        position: 'left',
        autoHide: false,
        scrollSwitch: true,
        width: 60,
        opacity: 75
      });
      setIconSettings({
        iconSize: 60,
        iconBorderRadius: 16,
        iconSpacing: 27,
        showName: true,
        nameSize: 12,
        maxWidth: window.innerWidth || 1388
      });
      setLayoutSettings({
        minimalistMode: false,
        showDailyQuote: true
      });
      setUserInfo(null);
      
      // 触发事件通知其他组件更新
      window.dispatchEvent(new Event('wallpaperSettingsChanged'));
      window.dispatchEvent(new CustomEvent('openMethodSettingsChanged', { detail: { openInNewTab: true } }));
      window.dispatchEvent(new CustomEvent('dateTimeSettingsChanged', { detail: {
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
      } }));
      window.dispatchEvent(new CustomEvent('sidebarSettingsChanged', { detail: {
        position: 'left',
        autoHide: false,
        scrollSwitch: true,
        width: 60,
        opacity: 75
      } }));
      window.dispatchEvent(new CustomEvent('iconSettingsChanged', { detail: {
        iconSize: 60,
        iconBorderRadius: 16,
        iconSpacing: 27,
        showName: true,
        nameSize: 12,
        maxWidth: window.innerWidth || 1388
      } }));
      window.dispatchEvent(new CustomEvent('layoutSettingsChanged', { detail: {
        minimalistMode: false,
        showDailyQuote: true
      } }));
      
      alert("所有本地数据已清除！");
    }
  };

  // 备份恢复功能
  const handleCloudRestore = () => {
    alert("功能开发中");
  };

  const handleImmediateBackup = () => {
    alert("功能开发中");
  };

  const handleManageBackupHistory = () => {
    alert("功能开发中");
  };

  // 导出本地数据
  const handleExportData = () => {
    try {
      const exportData = {
        wallpaperSettings: settings,
        openMethodSettings: openMethodSettings,
        dateTimeSettings: dateTimeSettings,
        sidebarSettings: sidebarSettings,
        iconSettings: iconSettings,
        layoutSettings: layoutSettings,
        userInfo: userInfo,
        exportTime: new Date().toISOString(),
        version: "1.0"
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `open-nav-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      alert("数据导出成功！");
    } catch (error) {
      console.error("导出数据失败:", error);
      alert("导出数据失败，请重试！");
    }
  };

  // 导入备份文件
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target?.result as string);
          
          // 验证数据格式
          if (!importData.version) {
            throw new Error("无效的备份文件格式");
          }
          
          // 导入各项设置
          if (importData.wallpaperSettings) {
            setSettings(importData.wallpaperSettings);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.wallpaperSettings));
          }
          
          if (importData.openMethodSettings) {
            setOpenMethodSettings(importData.openMethodSettings);
            localStorage.setItem(OPEN_METHOD_STORAGE_KEY, JSON.stringify(importData.openMethodSettings));
          }
          
          if (importData.dateTimeSettings) {
            setDateTimeSettings(importData.dateTimeSettings);
            localStorage.setItem(DATETIME_STORAGE_KEY, JSON.stringify(importData.dateTimeSettings));
          }
          
          if (importData.sidebarSettings) {
            setSidebarSettings(importData.sidebarSettings);
            localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(importData.sidebarSettings));
          }
          
          if (importData.iconSettings) {
            setIconSettings(importData.iconSettings);
            localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(importData.iconSettings));
          }
          
          if (importData.layoutSettings) {
            setLayoutSettings(importData.layoutSettings);
            localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(importData.layoutSettings));
          }
          
          if (importData.userInfo) {
            setUserInfo(importData.userInfo);
            localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(importData.userInfo));
          }
          
          // 触发事件通知其他组件更新
          window.dispatchEvent(new Event('wallpaperSettingsChanged'));
          window.dispatchEvent(new CustomEvent('openMethodSettingsChanged', { detail: importData.openMethodSettings }));
          window.dispatchEvent(new CustomEvent('dateTimeSettingsChanged', { detail: importData.dateTimeSettings }));
          window.dispatchEvent(new CustomEvent('sidebarSettingsChanged', { detail: importData.sidebarSettings }));
          window.dispatchEvent(new CustomEvent('iconSettingsChanged', { detail: importData.iconSettings }));
          window.dispatchEvent(new CustomEvent('layoutSettingsChanged', { detail: importData.layoutSettings }));
          
          alert("数据导入成功！");
        } catch (error) {
          console.error("导入数据失败:", error);
          alert("导入数据失败，请检查文件格式！");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // 恢复默认分组
  const handleRestoreDefaultCategories = () => {
    if (window.confirm("确定要恢复所有默认分组吗？这将恢复所有被编辑或隐藏的默认分组。")) {
      // 发送事件通知Sidebar组件恢复默认分组
      window.dispatchEvent(new CustomEvent('restoreDefaultCategories'));
      
      // 显示成功消息
      alert('默认分组已恢复！');
    }
  };

  // 重置其他设置
  const handleResetOtherSettings = () => {
    if (window.confirm("确定要重置除图标设置外的其他设置吗？此操作不可恢复！")) {
      // 重置除图标设置外的其他设置
      const defaultWallpaperSettings = {
        backgroundImage: defaultWallpapers[0],
        maskOpacity: 0,
        blur: 0,
        showWindmill: true,
        customUrl: ""
      };
      const defaultOpenMethodSettings = { openInNewTab: true };
      const defaultDateTimeSettings = {
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
      };
      const defaultSidebarSettings = {
        position: 'left' as const,
        autoHide: false,
        scrollSwitch: true,
        width: 60,
        opacity: 75
      };
      
      setSettings(defaultWallpaperSettings);
      setOpenMethodSettings(defaultOpenMethodSettings);
      setDateTimeSettings(defaultDateTimeSettings);
      setSidebarSettings(defaultSidebarSettings);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWallpaperSettings));
      localStorage.setItem(OPEN_METHOD_STORAGE_KEY, JSON.stringify(defaultOpenMethodSettings));
      localStorage.setItem(DATETIME_STORAGE_KEY, JSON.stringify(defaultDateTimeSettings));
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(defaultSidebarSettings));
      
      const defaultLayoutSettings = {
        minimalistMode: false,
        showDailyQuote: true
      };
      setLayoutSettings(defaultLayoutSettings);
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(defaultLayoutSettings));
      
      // 触发事件通知其他组件更新
      window.dispatchEvent(new Event('wallpaperSettingsChanged'));
      window.dispatchEvent(new CustomEvent('openMethodSettingsChanged', { detail: defaultOpenMethodSettings }));
      window.dispatchEvent(new CustomEvent('dateTimeSettingsChanged', { detail: defaultDateTimeSettings }));
      window.dispatchEvent(new CustomEvent('sidebarSettingsChanged', { detail: defaultSidebarSettings }));
      window.dispatchEvent(new CustomEvent('layoutSettingsChanged', { detail: defaultLayoutSettings }));
      
      alert("其他设置已重置！");
    }
  };

  // 重置图标设置
  const handleResetIconSettings = () => {
    if (window.confirm("确定要重置图标设置吗？此操作不可恢复！")) {
      resetIconLayout();
      alert("图标设置已重置！");
    }
  };

  const renderWallpaperSettings = () => (
    <div className="p-6 space-y-6">
      {/* 当前壁纸预览 */}
      <div className="space-y-3">
      <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-white/20 relative">
          {/* 根据壁纸类型显示不同内容 */}
          {settings.backgroundImage.startsWith('#') || settings.backgroundImage.startsWith('linear-gradient') ? (
            <div 
              className="w-full h-full"
              style={{ 
                background: settings.backgroundImage.startsWith('#') 
                  ? settings.backgroundImage 
                  : settings.backgroundImage
              }}
            />
          ) : (
            <img
              src={settings.backgroundImage}
              alt="当前壁纸"
              className="w-full h-full object-cover"
            />
          )}
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
    <div className="p-6 space-y-6">
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

  const renderLayoutSettings = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">布局设置</h3>
          <p className="text-sm text-white/60">配置页面的显示模式和组件显示选项</p>
        </div>
        
        <div className="space-y-4">
          {/* 极简模式设置 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">极简模式</Label>
              <p className="text-xs text-white/60">开启后只显示时间和搜索框，隐藏其他所有组件</p>
            </div>
            <Switch
              checked={layoutSettings.minimalistMode}
              onCheckedChange={toggleMinimalistMode}
            />
          </div>
          
          {/* 底部显示一言设置 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">底部显示一言</Label>
              <p className="text-xs text-white/60">控制页面底部一言组件的显示和隐藏</p>
            </div>
            <Switch
              checked={layoutSettings.showDailyQuote}
              onCheckedChange={toggleShowDailyQuote}
            />
          </div>
          
          {/* 当前设置状态显示 */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Layout className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">当前布局状态</span>
              </div>
              <div className="text-xs text-blue-300 space-y-1">
                <p>极简模式：{layoutSettings.minimalistMode ? '已开启' : '已关闭'}</p>
                <p>底部一言：{layoutSettings.showDailyQuote ? '已显示' : '已隐藏'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDateTimeSettings = () => (
    <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
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

  const renderIconSettings = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">图标设置</h3>
          <p className="text-sm text-white/60">配置首页图标的大小、间距和显示选项</p>
        </div>
        
        <div className="space-y-6">
          {/* 图标大小 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              图标大小: {iconSettings.iconSize}px
            </Label>
            <Slider
              value={[iconSettings.iconSize]}
              onValueChange={updateIconSize}
              max={100}
              min={50}
              step={1}
              className="w-full"
            />
          </div>

          {/* 图标圆角 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              图标圆角: {iconSettings.iconBorderRadius}px
            </Label>
            <Slider
              value={[iconSettings.iconBorderRadius]}
              onValueChange={updateIconBorderRadius}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* 图标间距 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              图标间距: {iconSettings.iconSpacing}px
            </Label>
            <Slider
              value={[iconSettings.iconSpacing]}
              onValueChange={updateIconSpacing}
              max={50}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* 显示名称开关 */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-white">显示名称</Label>
              <p className="text-xs text-white/60">控制图标下方名称的显示和隐藏</p>
            </div>
            <Switch
              checked={iconSettings.showName}
              onCheckedChange={toggleShowName}
            />
          </div>

          {/* 名称大小 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              名称大小: {iconSettings.nameSize}px
            </Label>
            <Slider
              value={[iconSettings.nameSize]}
              onValueChange={updateNameSize}
              max={20}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          {/* 最大宽度 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              最大宽度: {iconSettings.maxWidth}px
            </Label>
            <Slider
              value={[iconSettings.maxWidth]}
              onValueChange={updateMaxWidth}
              max={2600}
              min={800}
              step={10}
              className="w-full"
            />
          </div>

          {/* 重置按钮 */}
          <div className="pt-4">
            <Button
              onClick={resetIconLayout}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重置图标布局
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">备份恢复</h3>
          <p className="text-sm text-white/60">管理您的数据备份和恢复选项</p>
        </div>
        
        <div className="space-y-4">
          {/* 云端操作 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">云端操作</Label>
            
            {/* 从云端恢复数据 */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={handleCloudRestore}
            >
              <div className="flex items-center space-x-3">
                <CloudDownload className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white text-sm font-medium">从云端恢复数据</p>
                  <p className="text-white/60 text-xs">从云端服务器恢复您的设置和数据</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* 立即备份 */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={handleImmediateBackup}
            >
              <div className="flex items-center space-x-3">
                <Cloud className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white text-sm font-medium">立即备份</p>
                  <p className="text-white/60 text-xs">将当前设置备份到云端服务器</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* 管理历史备份节点 */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={handleManageBackupHistory}
            >
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white text-sm font-medium">管理历史备份节点</p>
                  <p className="text-white/60 text-xs">查看和管理历史备份记录</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* 本地数据操作 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">本地数据操作</Label>
            
            {/* 导出本地数据 */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={handleExportData}
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white text-sm font-medium">导出本地数据</p>
                  <p className="text-white/60 text-xs">将当前设置导出为JSON文件</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* 导入备份文件 */}
            <div 
              className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={handleImportData}
            >
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white text-sm font-medium">导入备份文件</p>
                  <p className="text-white/60 text-xs">从本地JSON文件恢复设置</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          {/* 重置设置 */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">重置设置</Label>
            
            <div className="grid grid-cols-1 gap-3">
              {/* 恢复默认分组 */}
              <Button
                onClick={handleRestoreDefaultCategories}
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-400 flex items-center justify-center gap-2 p-4 h-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">恢复默认分组</p>
                  <p className="text-xs opacity-80">恢复所有被编辑或隐藏的默认分组</p>
                </div>
              </Button>
              
              {/* 重置其他设置 */}
              <Button
                onClick={handleResetOtherSettings}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 flex items-center justify-center gap-2 p-4 h-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">重置其他设置</p>
                  <p className="text-xs opacity-80">重置除图标设置外的其他配置</p>
                </div>
              </Button>
              
              {/* 重置图标设置 */}
              <Button
                onClick={handleResetIconSettings}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 flex items-center justify-center gap-2 p-4 h-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <div className="text-left">
                  <p className="text-sm font-medium">重置图标设置</p>
                  <p className="text-xs opacity-80">将图标相关设置恢复到默认状态</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalSettings = () => (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        {/* Logo */}
        
        {userInfo?(
          <></>
        ):(

          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-bold">B</span>
        </div>
        )}

        {!userInfo ? (
          // 未登录状态
          <>
            <div className="text-center space-y-4">
              <p className="text-white/80 text-sm">
                登录后可享受数据同步、备份等功能
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={handleMockLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                >
                  立即登录
                </Button>
                
                <Button
                  onClick={handleDeleteAllData}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-8 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除本地全部数据
                </Button>
              </div>
            </div>
          </>
        ) : (
          // 已登录状态
          <>
            <div className="text-center space-y-4 w-full">
              {/* 用户头像 */}
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-white/20">
                <img
                  src={userInfo.avatar}
                  alt="用户头像"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 用户信息 */}
              <div className="space-y-2">
                <h3 className="text-white text-lg font-medium">{userInfo.username}</h3>
                <p className="text-white/60 text-sm">{userInfo.email}</p>
                <p className="text-white/40 text-xs">登录时间：{userInfo.loginTime}</p>
              </div>
              
              {/* 功能卡片 */}
              <div className="space-y-3 w-full">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">数据同步</p>
                      <p className="text-white/60 text-xs">已启用云端同步</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">自动备份</p>
                      <p className="text-white/60 text-xs">每日自动备份设置</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">多设备同步</p>
                      <p className="text-white/60 text-xs">已连接 2 台设备</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex flex-col gap-3 w-full pt-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-2"
                >
                  退出登录
                </Button>
                
                <Button
                  onClick={handleDeleteAllData}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 px-8 py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除本地全部数据
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* 欢迎加入微信内测福利群 */}
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-white">欢迎加入微信内测福利群</h3>
          
          {/* 微信群二维码卡片 */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-center space-y-3">
              <div className="w-64 h-64 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden">
                <img 
                  src="./images/wechat_qr_code_20251106_012217.png" 
                  alt="OpenNav标签页-内测群"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-white font-medium">OpenNav标签页-内测群</p>
                <p className="text-xs text-white/60">二维码7天内有效，过期后请重新获取</p>
              </div>
            </div>
          </div>
        </div>

        {/* 功能入口 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">更新日志</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">用户反馈</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">常见问题</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 官方链接 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">应用官网</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">隐私政策</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-white text-sm">免责声明</span>
            <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 备案信息 */}
        <div className="text-center pt-4">
          <p className="text-xs text-white/40">xxxxxxxxx-x</p>
        </div>
      </div>
    </div>
  );

  const renderSettingContent = () => {
    switch (selectedOption) {
      case "personal":
        return renderPersonalSettings();
      case "wallpaper":
        return renderWallpaperSettings();
      case "openMethod":
        return renderOpenMethodSettings();
      case "layout":
        return renderLayoutSettings();
      case "datetime":
        return renderDateTimeSettings();
      case "sidebar":
        return renderSidebarSettings();
      case "icons":
        return renderIconSettings();
      case "backup":
        return renderBackupSettings();
      case "about":
        return renderAboutSettings();
      default:
        return (
          <div className="p-6 flex items-center justify-center">
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
      <div className="flex h-full max-h-[90vh]">
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
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {renderSettingContent()}
          </div>
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