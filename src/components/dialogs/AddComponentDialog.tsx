import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomIconForm, CustomIconData } from "@/components/CustomIconForm";
import { toast } from "@/hooks/use-toast";
import { CustomIconStorage } from "@/lib/customIconStorage";

interface AddComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComponent: (component: ComponentItem) => void;
  currentGroupId?: string;
  existingItems?: ComponentItem[]; // 新增：当前分组中已存在的项目
}

interface ComponentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  category: string;
  type: "bookmark" | "widget";
}

const componentCategories = [
  { id: "all", label: "全部" },
  { id: "explore", label: "探索" },
  { id: "efficiency", label: "效率" },
  { id: "tools", label: "工具" },
  { id: "development", label: "研发" },
  { id: "design", label: "设计" },
  { id: "creative", label: "创意" },
  { id: "entertainment", label: "娱乐" },
  { id: "other", label: "其他" },
];

const availableComponents: ComponentItem[] = [
  {
    id: "number-converter",
    title: "数字转换",
    description: "金额数字大写转换",
    icon: "8捌",
    color: "#10B981",
    url: "https://www.bejson.com/convert/number2chinese/",
    category: "tools",
    type: "bookmark"
  },
  {
    id: "text-converter",
    title: "简繁体转换",
    description: "中文简体繁体转换器",
    icon: "简繁",
    color: "#3B82F6",
    url: "https://www.aies.cn/",
    category: "tools",
    type: "bookmark"
  },
  {
    id: "gobang",
    title: "五子棋",
    description: "五子棋人机对战",
    icon: "●○",
    color: "#8B5CF6",
    url: "https://gobang.light7.cn/",
    category: "entertainment",
    type: "bookmark"
  },
  {
    id: "pacman",
    title: "吃豆人",
    description: "吃豆人小游戏",
    icon: "◐",
    color: "#F59E0B",
    url: "https://www.google.com/search?q=pacman",
    category: "entertainment",
    type: "bookmark"
  },
  {
    id: "color-picker",
    title: "颜色选择器",
    description: "在线颜色选择和转换工具",
    icon: "🎨",
    color: "#EC4899",
    url: "https://www.colorpicker.com/",
    category: "design",
    type: "bookmark"
  },
  {
    id: "json-formatter",
    title: "JSON格式化",
    description: "JSON数据格式化和验证",
    icon: "{ }",
    color: "#06B6D4",
    url: "https://www.json.cn/",
    category: "development",
    type: "bookmark"
  },
  {
    id: "qr-generator",
    title: "二维码生成",
    description: "在线二维码生成器",
    icon: "⊞",
    color: "#84CC16",
    url: "https://cli.im/",
    category: "tools",
    type: "bookmark"
  },
  {
    id: "password-generator",
    title: "密码生成器",
    description: "安全密码生成工具",
    icon: "🔐",
    color: "#EF4444",
    url: "https://passwordsgenerator.net/",
    category: "tools",
    type: "bookmark"
  },
  {
    id: "unit-converter",
    title: "单位转换",
    description: "长度重量温度等单位转换",
    icon: "⇄",
    color: "#F97316",
    url: "https://www.unitconverters.net/",
    category: "tools",
    type: "bookmark"
  },
  {
    id: "markdown-editor",
    title: "Markdown编辑器",
    description: "在线Markdown编辑和预览",
    icon: "Md",
    color: "#6366F1",
    url: "https://markdown.com.cn/editor/",
    category: "development",
    type: "bookmark"
  },
  {
    id: "image-compressor",
    title: "图片压缩",
    description: "在线图片压缩优化工具",
    icon: "📷",
    color: "#14B8A6",
    url: "https://tinypng.com/",
    category: "design",
    type: "bookmark"
  },
  {
    id: "regex-tester",
    title: "正则表达式",
    description: "正则表达式测试和学习",
    icon: ".*",
    color: "#A855F7",
    url: "https://regex101.com/",
    category: "development",
    type: "bookmark"
  },
  {
    id: "case-converter",
    title: "字母大小写转换",
    description: "英文字母大小写格式转换",
    icon: "Aa",
    color: "#8B5CF6",
    url: "#case-converter",
    category: "tools",
    type: "widget"
  },
  {
    id: "base64-converter",
    title: "Base64编码解码工具",
    description: "Base64编码和解码转换工具",
    icon: "64",
    color: "#10B981",
    url: "#base64-converter",
    category: "tools",
    type: "widget"
  },
  {
    id: "md5-converter",
    title: "MD5加密工具",
    description: "MD5哈希加密和验证工具",
    icon: "#",
    color: "#EF4444",
    url: "#md5-converter",
    category: "tools",
    type: "widget"
  }
];

interface WebsiteData {
  categories: { id: string; label: string }[];
  websites: {
    id: string;
    title: string;
    description: string;
    icon: string;
    url: string;
    color: string;
    category: string;
  }[];
}

export const AddComponentDialog = ({ open, onOpenChange, onAddComponent, currentGroupId = "主页", existingItems = [] }: AddComponentDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("components");
  const [searchQuery, setSearchQuery] = useState("");
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [selectedWebsiteCategory, setSelectedWebsiteCategory] = useState("hot");

  // Load website data from JSON file
  useEffect(() => {
    const loadWebsiteData = async () => {
      try {
        const response = await fetch('/data/websites.json');
        const data = await response.json();
        setWebsiteData(data);
      } catch (error) {
        console.error('Failed to load website data:', error);
      }
    };
    
    if (open) {
      loadWebsiteData();
    }
  }, [open]);

  const filteredComponents = selectedCategory === "all" 
    ? availableComponents 
    : availableComponents.filter(comp => comp.category === selectedCategory);

  // Filter websites based on category and search query
  const filteredWebsites = websiteData ? websiteData.websites.filter(website => {
    const matchesCategory = selectedWebsiteCategory === "hot" || website.category === selectedWebsiteCategory;
    const matchesSearch = searchQuery === "" || 
      website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) : [];

  // 检查是否重复的函数
  const isComponentDuplicate = (component: ComponentItem) => {
    return existingItems.some(item => 
      item.id === component.id || 
      (item.title === component.title && item.url === component.url)
    );
  };

  const handleAddComponent = (component: ComponentItem) => {
    if (isComponentDuplicate(component)) {
      toast({
        title: "无法添加",
        description: `图标 "${component.title}" 已存在于当前分组中，无法重复添加！`,
        variant: "destructive",
      });
      return;
    }
    onAddComponent(component);
  };

  const handleAddWebsite = (website: any) => {
    const componentItem: ComponentItem = {
      id: website.id,
      title: website.title,
      description: website.description,
      icon: website.icon,
      color: website.color,
      url: website.url,
      category: website.category,
      type: "bookmark"
    };
    
    if (isComponentDuplicate(componentItem)) {
      toast({
        title: "无法添加",
        description: `网站 "${website.title}" 已存在于当前分组中，无法重复添加！`,
        variant: "destructive",
      });
      return;
    }
    
    onAddComponent(componentItem);
  };

  // 保存自定义图标到localStorage
  const saveCustomIconToStorage = (iconData: CustomIconData) => {
    try {
      CustomIconStorage.saveIcon(iconData);
    } catch (error) {
      console.error('Failed to save custom icon:', error);
      toast({
        title: "保存失败",
        description: "保存自定义图标失败，请重试",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 处理自定义图标保存
  const handleCustomIconSave = (iconData: CustomIconData) => {
    // 保存到localStorage
    saveCustomIconToStorage(iconData);
    
    // 转换为ComponentItem格式并添加到组件
    const componentItem: ComponentItem = {
      id: iconData.id,
      title: iconData.name,
      description: `自定义图标 - ${iconData.name}`,
      icon: iconData.iconType === 'text' ? iconData.iconText : (iconData.favicon || iconData.name.charAt(0)),
      color: iconData.backgroundColor,
      url: iconData.url,
      category: iconData.groupId,
      type: "bookmark"
    };
    
    if (isComponentDuplicate(componentItem)) {
      toast({
        title: "无法添加",
        description: `自定义图标 "${iconData.name}" 已存在于当前分组中，无法重复添加！`,
        variant: "destructive",
      });
      return;
    }
    
    onAddComponent(componentItem);
    onOpenChange(false);
    
    toast({
      title: "保存成功",
      description: `自定义图标 "${iconData.name}" 已添加到 "${iconData.groupId}" 分组`,
    });
  };

  // 处理自定义图标保存并继续
  const handleCustomIconSaveAndContinue = (iconData: CustomIconData) => {
    // 保存到localStorage
    saveCustomIconToStorage(iconData);
    
    // 转换为ComponentItem格式并添加到组件
    const componentItem: ComponentItem = {
      id: iconData.id,
      title: iconData.name,
      description: `自定义图标 - ${iconData.name}`,
      icon: iconData.iconType === 'text' ? iconData.iconText : (iconData.favicon || iconData.name.charAt(0)),
      color: iconData.backgroundColor,
      url: iconData.url,
      category: iconData.groupId,
      type: "bookmark"
    };
    
    if (isComponentDuplicate(componentItem)) {
      toast({
        title: "无法添加",
        description: `自定义图标 "${iconData.name}" 已存在于当前分组中，无法重复添加！`,
        variant: "destructive",
      });
      return;
    }
    
    onAddComponent(componentItem);
    
    toast({
      title: "保存成功",
      description: `自定义图标 "${iconData.name}" 已添加到 "${iconData.groupId}" 分组，可以继续添加更多图标`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[90vh] max-h-[90vh] p-0 bg-slate-800/60 backdrop-blur-sm border border-white/20 text-white fixed">
        <div className="flex h-full max-h-[90vh]">
          {/* 左侧导航选项 */}
          <div className="w-48 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">添加组件</h2>
            </div>
            
            <div className="flex-1 py-2">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-none",
                  activeTab === "components" && "bg-white/20 text-white"
                )}
                onClick={() => setActiveTab("components")}
              >
                <span className="text-sm">组件库</span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-none",
                  activeTab === "navigation" && "bg-white/20 text-white"
                )}
                onClick={() => setActiveTab("navigation")}
              >
                <span className="text-sm">网址导航</span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-4 text-white/80 hover:text-white hover:bg-white/10 transition-colors rounded-none",
                  activeTab === "custom" && "bg-white/20 text-white"
                )}
                onClick={() => setActiveTab("custom")}
              >
                <span className="text-sm">自定义图标</span>
              </Button>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {activeTab === "components" && (
              <div className="flex flex-col h-full">
                {/* Category Filter */}
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {componentCategories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-white/10 border-white/20 text-white/80'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Components Grid */}
                <div className="flex-1 p-6 hide-scrollbar overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {filteredComponents.map((component) => (
                      <div
                        key={component.id}
                        className="relative bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                            style={{ backgroundColor: component.color }}
                          >
                            {component.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white mb-1">
                              {component.title}
                            </h3>
                            <p className="text-sm text-white/60 line-clamp-2">
                              {component.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                            onClick={() => handleAddComponent(component)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "navigation" && (
              <div className="flex flex-col h-full">
                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                    <Input
                      placeholder="请输入搜索名称"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-50 pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                {/* Website Category Filter */}
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {websiteData?.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedWebsiteCategory === category.id ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedWebsiteCategory === category.id 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-white/10 border-white/20 text-white/80'
                        }`}
                        onClick={() => setSelectedWebsiteCategory(category.id)}
                      >
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Websites Grid */}
                <div className="flex-1 p-6 hide-scrollbar overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {filteredWebsites.map((website) => (
                      <div
                        key={website.id}
                        className="relative bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: website.color }}
                          >
                            <img 
                              src={website.icon} 
                              alt={website.title}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-white font-bold text-lg">${website.title.charAt(0)}</span>`;
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white mb-1">
                              {website.title}
                            </h3>
                            <p className="text-sm text-white/60 line-clamp-2">
                              {website.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                            onClick={() => handleAddWebsite(website)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredWebsites.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-white/60">
                      {searchQuery ? '未找到匹配的网站' : '暂无网站数据'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "custom" && (
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                <CustomIconForm
                  currentGroupId={currentGroupId}
                  onSave={handleCustomIconSave}
                  onSaveAndContinue={handleCustomIconSaveAndContinue}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};