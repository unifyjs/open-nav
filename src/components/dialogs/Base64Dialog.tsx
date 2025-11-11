import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RotateCcw, ArrowUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Base64DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Base64Dialog = ({ open, onOpenChange }: Base64DialogProps) => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState("encode");

  // Base64编码函数
  const encodeBase64 = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      throw new Error("编码失败：输入文本包含无效字符");
    }
  };

  // Base64解码函数
  const decodeBase64 = (text: string): string => {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch (error) {
      throw new Error("解码失败：输入不是有效的Base64编码");
    }
  };

  // 处理编码
  const handleEncode = () => {
    if (!inputText.trim()) {
      toast({
        title: "编码失败",
        description: "请输入需要编码的文本",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoded = encodeBase64(inputText);
      setOutputText(encoded);
      toast({
        title: "编码成功",
        description: "文本已成功编码为Base64格式",
      });
    } catch (error) {
      toast({
        title: "编码失败",
        description: error instanceof Error ? error.message : "编码过程中发生错误",
        variant: "destructive",
      });
    }
  };

  // 处理解码
  const handleDecode = () => {
    if (!inputText.trim()) {
      toast({
        title: "解码失败",
        description: "请输入需要解码的Base64文本",
        variant: "destructive",
      });
      return;
    }

    try {
      const decoded = decodeBase64(inputText);
      setOutputText(decoded);
      toast({
        title: "解码成功",
        description: "Base64文本已成功解码",
      });
    } catch (error) {
      toast({
        title: "解码失败",
        description: error instanceof Error ? error.message : "解码过程中发生错误",
        variant: "destructive",
      });
    }
  };

  // 自动转换
  const handleAutoConvert = () => {
    if (activeTab === "encode") {
      handleEncode();
    } else {
      handleDecode();
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
        description: "结果已复制到剪贴板",
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

  // 交换输入输出
  const handleSwap = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setActiveTab(activeTab === "encode" ? "decode" : "encode");
  };

  // 切换标签时自动转换
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (inputText.trim()) {
      setTimeout(() => {
        if (value === "encode") {
          handleEncode();
        } else {
          handleDecode();
        }
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[80vh] max-h-[90vh] bg-slate-800/95 backdrop-blur-sm border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-2xl">64</span>
            Base64编码解码工具
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* 标签切换 */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger 
                value="encode" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                编码 (Encode)
              </TabsTrigger>
              <TabsTrigger 
                value="decode"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                解码 (Decode)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4 mt-6">
              <div className="text-sm text-white/80 bg-blue-600/20 rounded-lg p-3">
                <strong>编码模式：</strong>将普通文本转换为Base64编码格式
              </div>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4 mt-6">
              <div className="text-sm text-white/80 bg-green-600/20 rounded-lg p-3">
                <strong>解码模式：</strong>将Base64编码转换为普通文本
              </div>
            </TabsContent>
          </Tabs>

          {/* 输入区域 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">
                {activeTab === "encode" ? "输入文本" : "输入Base64编码"}
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwap}
                  className="h-8 px-3 bg-white/5 border-white/20 text-white/80 hover:bg-white/10"
                >
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  交换
                </Button>
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
            </div>
            <Textarea
              placeholder={
                activeTab === "encode" 
                  ? "请输入需要编码的文本..." 
                  : "请输入需要解码的Base64编码..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] bg-white/5 border-white/20 text-white placeholder:text-white/40 resize-none font-mono"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center">
            <Button
              onClick={handleAutoConvert}
              disabled={!inputText.trim()}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {activeTab === "encode" ? "开始编码" : "开始解码"}
            </Button>
          </div>

          {/* 输出区域 */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/90">
                {activeTab === "encode" ? "Base64编码结果" : "解码结果"}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!outputText}
                className="h-8 px-3 bg-white/5 border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-50"
              >
                <Copy className="w-3 h-3 mr-1" />
                复制
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[150px] bg-white/5 border-white/20 text-white resize-none font-mono"
              placeholder={
                activeTab === "encode" 
                  ? "Base64编码结果将显示在这里..." 
                  : "解码结果将显示在这里..."
              }
            />
          </div>

          {/* 说明文字 */}
          <div className="text-xs text-white/60 bg-white/5 rounded-lg p-3">
            <div className="font-medium mb-2">Base64编码说明：</div>
            <div className="space-y-1">
              <div><strong>编码原理：</strong>Base64编码将3个8位字节转化为4个6位字节，使用64个可打印字符表示二进制数据</div>
              <div><strong>字符集：</strong>A-Z, a-z, 0-9, +, / 共64个字符，末尾可能包含1-2个等号(=)作为填充</div>
              <div><strong>应用场景：</strong>邮件传输、URL参数、数据存储等需要将二进制数据转换为文本的场合</div>
              <div><strong>注意事项：</strong>Base64编码后的数据大小约为原数据的4/3倍</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};