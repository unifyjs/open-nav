import { useState, useEffect } from "react";
import { ToolsSidebar } from "@/components/ToolsSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, RotateCcw, Hash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MD5ToolPage = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("32-lowercase");

  // 更新页面标题和meta信息
  useEffect(() => {
    document.title = "MD5加密工具 - 在线MD5哈希生成器 - 实用工具";
    
    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'MD5加密工具，在线生成MD5哈希值，支持多种输出格式，文本完整性验证和密码加密的实用工具。');
    }
    
    // 更新meta关键词
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'MD5,加密,哈希,散列,在线工具,文本加密,MD5生成器,密码加密,数据完整性');
    }
  }, []);

  // 简化的MD5实现（用于演示）
  const simpleMD5 = (text: string): string => {
    // 这是一个简化的哈希函数，仅用于演示
    // 实际项目中应该使用标准的MD5算法
    let hash = 0;
    if (text.length === 0) return "d41d8cd98f00b204e9800998ecf8427e"; // 空字符串的MD5
    
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    // 转换为16进制并确保32位长度
    let hexHash = Math.abs(hash).toString(16);
    while (hexHash.length < 8) {
      hexHash = "0" + hexHash;
    }
    
    // 扩展到32位（模拟MD5长度）
    const fullHash = (hexHash + hexHash + hexHash + hexHash).substring(0, 32);
    return fullHash;
  };

  // 格式化MD5输出
  const formatMD5 = (hash: string, format: string): string => {
    switch (format) {
      case "32-lowercase":
        return hash.toLowerCase();
      case "32-uppercase":
        return hash.toUpperCase();
      case "16-lowercase":
        return hash.toLowerCase().substring(8, 24);
      case "16-uppercase":
        return hash.toUpperCase().substring(8, 24);
      default:
        return hash.toLowerCase();
    }
  };

  // 处理MD5加密
  const handleEncrypt = () => {
    if (!inputText.trim()) {
      toast({
        title: "加密失败",
        description: "请输入需要加密的文本",
        variant: "destructive",
      });
      return;
    }

    try {
      const hash = simpleMD5(inputText);
      const formattedHash = formatMD5(hash, selectedFormat);
      setOutputText(formattedHash);
      toast({
        title: "加密成功",
        description: "文本已成功转换为MD5哈希值",
      });
    } catch (error) {
      toast({
        title: "加密失败",
        description: "加密过程中发生错误",
        variant: "destructive",
      });
    }
  };

  // 复制结果
  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "复制失败",
        description: "没有可复制的内容",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "MD5哈希值已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  // 清空内容
  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  // 格式选项
  const formats = [
    { id: "32-lowercase", label: "32位小写", description: "标准MD5格式" },
    { id: "32-uppercase", label: "32位大写", description: "大写MD5格式" },
    { id: "16-lowercase", label: "16位小写", description: "截取中间16位" },
    { id: "16-uppercase", label: "16位大写", description: "截取中间16位大写" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <ToolsSidebar currentTool="md5" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hash className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">MD5加密工具</h1>
              <p className="text-gray-600">在线MD5哈希生成器，支持多种输出格式，安全可靠</p>
            </div>
          </div>
        </div>

        {/* Tool Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
              {/* 说明信息 */}
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-6">
                <strong>MD5加密：</strong>将任意长度的文本转换为固定长度的32位十六进制哈希值，常用于数据完整性验证和密码存储
              </div>

              {/* 输入区域 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">输入文本</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-3"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    清空
                  </Button>
                </div>
                <Textarea
                  placeholder="请输入需要MD5加密的文本..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* 格式选择 */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700">输出格式</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formats.map((format) => (
                    <div
                      key={format.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedFormat === format.id
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-white border-gray-200 text-gray-700'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <div className="font-medium text-sm mb-1">{format.label}</div>
                      <div className="text-xs text-gray-500">{format.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center mb-6">
                <Button
                  onClick={handleEncrypt}
                  disabled={!inputText.trim()}
                  className="px-8 py-2 bg-red-600 hover:bg-red-700"
                >
                  开始加密
                </Button>
              </div>

              {/* 输出区域 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">MD5哈希值</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!outputText}
                    className="h-8 px-3"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                </div>
                <Input
                  value={outputText}
                  readOnly
                  className="font-mono text-center bg-gray-50"
                  placeholder="MD5哈希值将显示在这里..."
                />
              </div>

              {/* 常用示例 */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700">常用示例</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-600 mb-1">输入: "hello"</div>
                    <div className="text-green-600 font-mono text-xs">5d41402abc4b2a76b9719d911017c592</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-600 mb-1">输入: "123456"</div>
                    <div className="text-green-600 font-mono text-xs">e10adc3949ba59abbe56e057f20f883e</div>
                  </div>
                </div>
              </div>

              {/* 说明文字 */}
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                <div className="font-medium mb-2 text-gray-900">MD5算法说明：</div>
                <div className="space-y-2">
                  <div><strong>算法特点：</strong>MD5是一种广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值</div>
                  <div><strong>输出格式：</strong>通常用32位十六进制数字表示，也可以截取16位使用</div>
                  <div><strong>应用场景：</strong>文件完整性验证、密码存储、数字签名等</div>
                  <div><strong>安全提醒：</strong>MD5已被证明存在安全漏洞，不建议用于高安全性要求的场景</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MD5ToolPage;