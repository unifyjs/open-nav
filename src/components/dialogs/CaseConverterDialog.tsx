import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CaseConverterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseConverterDialog = ({ open, onOpenChange }: CaseConverterDialogProps) => {
  const [inputText, setInputText] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("uppercase");

  // 不需要大写的次要单词（APA Style）
  const minorWords = [
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 
    'by', 'in', 'of', 'up', 'as', 'so', 'yet', 'off', 'if', 'per', 'via', 'out'
  ];

  // 转换函数
  const convertText = (text: string, format: string): string => {
    if (!text.trim()) return "";

    switch (format) {
      case "uppercase":
        return text.toUpperCase();
      
      case "lowercase":
        return text.toLowerCase();
      
      case "capitalize":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      
      case "title":
        return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      
      case "sentence":
        return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, (char) => char.toUpperCase());
      
      case "camelCase":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[A-Z]/, (char) => char.toLowerCase());
      
      case "pascalCase":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^[a-z]/, (char) => char.toUpperCase());
      
      case "snakeCase":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      
      case "kebabCase":
        return text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      
      case "apa":
        const words = text.toLowerCase().split(/\s+/);
        return words.map((word, index) => {
          // 第一个和最后一个单词总是大写
          if (index === 0 || index === words.length - 1) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          // 检查是否为次要单词
          if (minorWords.includes(word.toLowerCase())) {
            return word.toLowerCase();
          }
          // 其他单词首字母大写
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
      
      case "alternating":
        return text
          .split('')
          .map((char, index) => 
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
      
      case "inverse":
        return text
          .split('')
          .map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
      
      default:
        return text;
    }
  };

  const formats = [
    { id: "uppercase", label: "全部大写", description: "HELLO WORLD" },
    { id: "lowercase", label: "全部小写", description: "hello world" },
    { id: "capitalize", label: "首字母大写", description: "Hello world" },
    { id: "title", label: "标题格式", description: "Hello World" },
    { id: "sentence", label: "句子格式", description: "Hello world. Another sentence." },
    { id: "camelCase", label: "驼峰命名", description: "helloWorld" },
    { id: "pascalCase", label: "帕斯卡命名", description: "HelloWorld" },
    { id: "snakeCase", label: "下划线命名", description: "hello_world" },
    { id: "kebabCase", label: "短横线命名", description: "hello-world" },
    { id: "apa", label: "APA标题格式", description: "Hello World and the Universe" },
    { id: "alternating", label: "交替大小写", description: "hElLo WoRlD" },
    { id: "inverse", label: "反转大小写", description: "hELLO wORLD" },
  ];

  const convertedText = convertText(inputText, selectedFormat);

  const handleCopy = async () => {
    if (!convertedText) {
      toast({
        title: "复制失败",
        description: "没有可复制的内容",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(convertedText);
      toast({
        title: "复制成功",
        description: "转换结果已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法访问剪贴板",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[80vh] max-h-[90vh] bg-slate-800/95 backdrop-blur-sm border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">Aa</span>
            英文字母大小写转换
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* 输入区域 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">输入文本</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="h-8 px-3 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                清空
              </Button>
            </div>
            <Textarea
              placeholder="请输入需要转换的英文文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none"
            />
          </div>

          {/* 格式选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">转换格式</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
              {formats.map((format) => (
                <div
                  key={format.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/10 ${
                    selectedFormat === format.id
                      ? 'bg-blue-600/20 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/20 text-white/80'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="font-medium text-sm mb-1">{format.label}</div>
                  <div className="text-xs text-white/60 font-mono">{format.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 输出区域 */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">转换结果</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!convertedText}
                className="h-8 px-3 bg-white/5 border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                <Copy className="w-3 h-3 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={convertedText}
              readOnly
              className="min-h-[120px] bg-white/5 border-white/20 text-white resize-none font-mono"
              placeholder="转换结果将显示在这里..."
            />
          </div>

          {/* 说明文字 */}
          <div className="text-xs text-white/60 bg-white/5 rounded-lg p-3">
            <div className="font-medium mb-2">格式说明：</div>
            <div className="space-y-1">
              <div><strong>APA标题格式：</strong>遵循APA Style，次要单词（冠词、短介词、连词）不大写，除非是第一个或最后一个单词</div>
              <div><strong>驼峰命名：</strong>第一个单词小写，后续单词首字母大写，常用于编程变量名</div>
              <div><strong>帕斯卡命名：</strong>所有单词首字母大写，常用于编程类名</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};