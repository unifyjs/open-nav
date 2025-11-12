import { useState } from "react";
import { Search, Home, TrendingUp, Hash, FileText, Image, BarChart3, Brain, Briefcase, Type, Calculator, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tools?: ToolItem[];
}

interface ToolItem {
  id: string;
  label: string;
  path: string;
}

const toolCategories: ToolCategory[] = [
  {
    id: "home",
    label: "首页",
    icon: Home,
  },
  {
    id: "ranking",
    label: "排行榜",
    icon: TrendingUp,
  },
  {
    id: "video",
    label: "视频工具",
    icon: FileText,
    tools: [
      { id: "video-converter", label: "视频转换器", path: "/tools/video-converter" },
      { id: "video-compressor", label: "视频压缩器", path: "/tools/video-compressor" },
    ]
  },
  {
    id: "audio",
    label: "音频工具",
    icon: FileText,
    tools: [
      { id: "audio-converter", label: "音频转换器", path: "/tools/audio-converter" },
      { id: "audio-editor", label: "音频编辑器", path: "/tools/audio-editor" },
    ]
  },
  {
    id: "image",
    label: "图片工具",
    icon: Image,
    tools: [
      { id: "image-converter", label: "图片转换器", path: "/tools/image-converter" },
      { id: "image-compressor", label: "图片压缩器", path: "/tools/image-compressor" },
    ]
  },
  {
    id: "document",
    label: "文档处理",
    icon: FileText,
    tools: [
      { id: "pdf-converter", label: "PDF转换器", path: "/tools/pdf-converter" },
      { id: "word-converter", label: "Word转换器", path: "/tools/word-converter" },
    ]
  },
  {
    id: "conversion",
    label: "文档转换",
    icon: FileText,
    tools: [
      { id: "format-converter", label: "格式转换器", path: "/tools/format-converter" },
      { id: "encoding-converter", label: "编码转换器", path: "/tools/encoding-converter" },
    ]
  },
  {
    id: "chart",
    label: "数据图表",
    icon: BarChart3,
    tools: [
      { id: "chart-generator", label: "图表生成器", path: "/tools/chart-generator" },
      { id: "data-visualizer", label: "数据可视化", path: "/tools/data-visualizer" },
    ]
  },
  {
    id: "ai-text",
    label: "智能文本",
    icon: Brain,
    tools: [
      { id: "text-analyzer", label: "文本分析器", path: "/tools/text-analyzer" },
      { id: "text-generator", label: "文本生成器", path: "/tools/text-generator" },
    ]
  },
  {
    id: "office",
    label: "办公辅助",
    icon: Briefcase,
    tools: [
      { id: "qr-generator", label: "二维码生成器", path: "/tools/qr-generator" },
      { id: "color-picker", label: "颜色选择器", path: "/tools/color-picker" },
    ]
  },
  {
    id: "text",
    label: "文本工具",
    icon: Type,
    tools: [
      { id: "case-converter", label: "大小写转换", path: "/tools/case-converter" },
      { id: "text-formatter", label: "文本格式化", path: "/tools/text-formatter" },
    ]
  },
  {
    id: "number",
    label: "数字工具",
    icon: Calculator,
    tools: [
      { id: "unit-converter", label: "单位转换器", path: "/tools/unit-converter" },
      { id: "calculator", label: "计算器", path: "/tools/calculator" },
    ]
  },
  {
    id: "encryption",
    label: "加密工具",
    icon: Shield,
    tools: [
      { id: "base64", label: "Base64加密", path: "/tools/base64" },
      { id: "md5", label: "MD5加密", path: "/tools/md5" },
      { id: "aes", label: "AES加密", path: "/tools/aes" },
      { id: "hash", label: "Hash生成器", path: "/tools/hash" },
    ]
  },
];

interface ToolsSidebarProps {
  currentTool?: string;
  onToolSelect?: (toolPath: string) => void;
}

export const ToolsSidebar = ({ currentTool, onToolSelect }: ToolsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["encryption"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToolClick = (toolPath: string) => {
    if (onToolSelect) {
      onToolSelect(toolPath);
    } else {
      window.location.href = `#${toolPath}`;
    }
  };

  const filteredCategories = toolCategories.filter(category => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const categoryMatch = category.label.toLowerCase().includes(query);
    const toolMatch = category.tools?.some(tool => 
      tool.label.toLowerCase().includes(query)
    );
    
    return categoryMatch || toolMatch;
  });

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-gray-900">实用工具</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="站内搜索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);
            const hasTools = category.tools && category.tools.length > 0;

            return (
              <div key={category.id} className="mb-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start h-9 px-3 text-sm font-normal ${
                    !hasTools && currentTool === category.id 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (hasTools) {
                      toggleCategory(category.id);
                    } else {
                      handleToolClick(`/${category.id}`);
                    }
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <span className="flex-1 text-left">{category.label}</span>
                  {hasTools && (
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                  )}
                </Button>

                {/* Sub-tools */}
                {hasTools && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.tools?.map((tool) => (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        className={`w-full justify-start h-8 px-3 text-sm font-normal ${
                          currentTool === tool.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => handleToolClick(tool.path)}
                      >
                        {tool.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Links */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start h-8 px-3 text-sm text-gray-600">
            <span className="bg-red-500 text-white px-1 rounded text-xs mr-2">新</span>
            特性
          </Button>
          <Button variant="ghost" className="w-full justify-start h-8 px-3 text-sm text-gray-600">
            导航版
          </Button>
          <Button variant="ghost" className="w-full justify-start h-8 px-3 text-sm text-gray-600">
            关于我们
          </Button>
        </div>
      </div>
    </div>
  );
};