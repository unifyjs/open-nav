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

interface AddComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddComponent: (component: ComponentItem) => void;
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

export const AddComponentDialog = ({ open, onOpenChange, onAddComponent }: AddComponentDialogProps) => {
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

  const handleAddComponent = (component: ComponentItem) => {
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
    onAddComponent(componentItem);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[100vh] p-0">
        <div className="flex flex-col h-[80vh]">
          {/* Header */}
          <DialogHeader className="p-3 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">添加组件</DialogTitle>
            </div>
          </DialogHeader>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">组件库</TabsTrigger>
              <TabsTrigger value="navigation">网址导航</TabsTrigger>
              <TabsTrigger value="custom">自定义图标</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="flex-1 flex flex-col mt-0">
              {/* Category Filter */}
              <div className="px-6 py-4 border-b">
                <div className="flex flex-wrap gap-2">
                  {componentCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === category.id 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Components Grid */}
              <div className="flex-1 p-6 hide-scrollbar max-h-[50vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredComponents.map((component) => (
                    <div
                      key={component.id}
                      className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                          style={{ backgroundColor: component.color }}
                        >
                          {component.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {component.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
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
            </TabsContent>

            <TabsContent value="navigation" className="flex-1 flex flex-col mt-0">
              {/* Search Bar */}
              <div className="px-0 py-1 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="请输入搜索名称"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Website Category Filter */}
              <div className="px-6 py-4 border-b">
                <div className="flex flex-wrap gap-2">
                  {websiteData?.categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedWebsiteCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedWebsiteCategory === category.id 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedWebsiteCategory(category.id)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Websites Grid */}
              <div className="flex-1 p-6 hide-scrollbar max-h-[40vh]  overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredWebsites.map((website) => (
                    <div
                      key={website.id}
                      className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                          <h3 className="font-medium text-gray-900 mb-1">
                            {website.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
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
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    {searchQuery ? '未找到匹配的网站' : '暂无网站数据'}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="flex-1 p-6">
              <div className="flex items-center justify-center h-full text-gray-500">
                自定义图标功能开发中...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};