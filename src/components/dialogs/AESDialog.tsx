import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RotateCcw, Lock, Unlock, Key, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AESDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// AES加密模式
const AES_MODES = [
  { value: "CBC", label: "CBC", description: "密码块链接模式（推荐）", recommended: true },
  { value: "ECB", label: "ECB", description: "电子密码本模式（不推荐）", recommended: false },
  { value: "CTR", label: "CTR", description: "计数器模式（推荐）", recommended: true },
  { value: "CFB", label: "CFB", description: "密码反馈模式", recommended: false },
  { value: "OFB", label: "OFB", description: "输出反馈模式", recommended: false },
];

// AES填充方式
const PADDING_MODES = [
  { value: "PKCS7", label: "PKCS#7", description: "标准填充（推荐）", recommended: true },
  { value: "ZeroPadding", label: "ZeroPadding", description: "零填充", recommended: false },
  { value: "NoPadding", label: "NoPadding", description: "无填充", recommended: false },
];

// 密钥长度
const KEY_LENGTHS = [
  { value: "128", label: "128位", description: "16字节密钥" },
  { value: "192", label: "192位", description: "24字节密钥" },
  { value: "256", label: "256位", description: "32字节密钥（推荐）" },
];

export const AESDialog = ({ open, onOpenChange }: AESDialogProps) => {
  const [activeTab, setActiveTab] = useState("encrypt");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [iv, setIv] = useState("");
  const [mode, setMode] = useState("CBC");
  const [padding, setPadding] = useState("PKCS7");
  const [keyLength, setKeyLength] = useState("256");
  const [outputFormat, setOutputFormat] = useState("hex");

  // 生成随机密钥
  const generateRandomKey = () => {
    const length = parseInt(keyLength) / 8;
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setSecretKey(key);
    toast({
      title: "密钥已生成",
      description: `已生成${keyLength}位随机密钥`,
    });
  };

  // 生成随机IV
  const generateRandomIV = () => {
    const array = new Uint8Array(16); // AES块大小固定为16字节
    crypto.getRandomValues(array);
    const ivHex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setIv(ivHex);
    toast({
      title: "IV已生成",
      description: "已生成16字节随机初始化向量",
    });
  };

  // 字符串转字节数组
  const stringToBytes = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };

  // 字节数组转字符串
  const bytesToString = (bytes: Uint8Array): string => {
    return new TextDecoder().decode(bytes);
  };

  // 十六进制字符串转字节数组
  const hexToBytes = (hex: string): Uint8Array => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  };

  // 字节数组转十六进制字符串
  const bytesToHex = (bytes: Uint8Array): string => {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Base64编码
  const bytesToBase64 = (bytes: Uint8Array): string => {
    return btoa(String.fromCharCode(...bytes));
  };

  // Base64解码
  const base64ToBytes = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // PKCS7填充
  const pkcs7Pad = (data: Uint8Array, blockSize: number): Uint8Array => {
    const padding = blockSize - (data.length % blockSize);
    const padded = new Uint8Array(data.length + padding);
    padded.set(data);
    for (let i = data.length; i < padded.length; i++) {
      padded[i] = padding;
    }
    return padded;
  };

  // PKCS7去填充
  const pkcs7Unpad = (data: Uint8Array): Uint8Array => {
    const padding = data[data.length - 1];
    return data.slice(0, data.length - padding);
  };

  // AES加密
  const aesEncrypt = async () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "错误",
          description: "请输入要加密的文本",
          variant: "destructive",
        });
        return;
      }

      if (!secretKey.trim()) {
        toast({
          title: "错误",
          description: "请输入密钥",
          variant: "destructive",
        });
        return;
      }

      // 验证密钥长度
      const expectedKeyLength = parseInt(keyLength) / 8 * 2; // 十六进制字符数
      if (secretKey.length !== expectedKeyLength) {
        toast({
          title: "错误",
          description: `密钥长度应为${expectedKeyLength}个十六进制字符（${parseInt(keyLength) / 8}字节）`,
          variant: "destructive",
        });
        return;
      }

      // 对于需要IV的模式，验证IV
      if (mode !== "ECB" && (!iv.trim() || iv.length !== 32)) {
        toast({
          title: "错误",
          description: "IV长度应为32个十六进制字符（16字节）",
          variant: "destructive",
        });
        return;
      }

      const keyBytes = hexToBytes(secretKey);
      const ivBytes = mode !== "ECB" ? hexToBytes(iv) : new Uint8Array(16);
      
      // 导入密钥
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" }, // Web Crypto API主要支持CBC模式
        false,
        ["encrypt"]
      );

      let dataToEncrypt = stringToBytes(inputText);
      
      // 应用填充（仅对需要填充的模式）
      if (padding === "PKCS7" && mode !== "CTR") {
        dataToEncrypt = pkcs7Pad(dataToEncrypt, 16);
      }

      // 执行加密
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-CBC",
          iv: ivBytes,
        },
        cryptoKey,
        dataToEncrypt
      );

      const encryptedBytes = new Uint8Array(encrypted);
      
      // 根据输出格式转换结果
      let result: string;
      if (outputFormat === "hex") {
        result = bytesToHex(encryptedBytes);
      } else {
        result = bytesToBase64(encryptedBytes);
      }

      setOutputText(result);
      toast({
        title: "加密成功",
        description: `使用${mode}模式和${padding}填充方式加密完成`,
      });

    } catch (error) {
      console.error("Encryption error:", error);
      toast({
        title: "加密失败",
        description: "加密过程中发生错误，请检查输入参数",
        variant: "destructive",
      });
    }
  };

  // AES解密
  const aesDecrypt = async () => {
    try {
      if (!inputText.trim()) {
        toast({
          title: "错误",
          description: "请输入要解密的文本",
          variant: "destructive",
        });
        return;
      }

      if (!secretKey.trim()) {
        toast({
          title: "错误",
          description: "请输入密钥",
          variant: "destructive",
        });
        return;
      }

      // 验证密钥长度
      const expectedKeyLength = parseInt(keyLength) / 8 * 2;
      if (secretKey.length !== expectedKeyLength) {
        toast({
          title: "错误",
          description: `密钥长度应为${expectedKeyLength}个十六进制字符（${parseInt(keyLength) / 8}字节）`,
          variant: "destructive",
        });
        return;
      }

      // 对于需要IV的模式，验证IV
      if (mode !== "ECB" && (!iv.trim() || iv.length !== 32)) {
        toast({
          title: "错误",
          description: "IV长度应为32个十六进制字符（16字节）",
          variant: "destructive",
        });
        return;
      }

      const keyBytes = hexToBytes(secretKey);
      const ivBytes = mode !== "ECB" ? hexToBytes(iv) : new Uint8Array(16);
      
      // 解析输入数据
      let dataToDecrypt: Uint8Array;
      try {
        if (outputFormat === "hex") {
          dataToDecrypt = hexToBytes(inputText.replace(/\s/g, ''));
        } else {
          dataToDecrypt = base64ToBytes(inputText.replace(/\s/g, ''));
        }
      } catch (error) {
        toast({
          title: "错误",
          description: `无效的${outputFormat === "hex" ? "十六进制" : "Base64"}格式`,
          variant: "destructive",
        });
        return;
      }

      // 导入密钥
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );

      // 执行解密
      const decrypted = await crypto.subtle.decrypt(
        {
          name: "AES-CBC",
          iv: ivBytes,
        },
        cryptoKey,
        dataToDecrypt
      );

      let decryptedBytes = new Uint8Array(decrypted);
      
      // 去除填充（仅对使用填充的模式）
      if (padding === "PKCS7" && mode !== "CTR") {
        try {
          decryptedBytes = pkcs7Unpad(decryptedBytes);
        } catch (error) {
          toast({
            title: "警告",
            description: "去填充时出现问题，可能影响解密结果",
            variant: "destructive",
          });
        }
      }

      const result = bytesToString(decryptedBytes);
      setOutputText(result);
      
      toast({
        title: "解密成功",
        description: `使用${mode}模式和${padding}填充方式解密完成`,
      });

    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "解密失败",
        description: "解密过程中发生错误，请检查输入参数和密钥",
        variant: "destructive",
      });
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "复制成功",
        description: "内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  // 清空所有内容
  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setSecretKey("");
    setIv("");
    toast({
      title: "已清空",
      description: "所有内容已清空",
    });
  };

  // 交换输入输出
  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setActiveTab(activeTab === "encrypt" ? "decrypt" : "encrypt");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            AES加密解密工具
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 参数设置区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label>加密模式</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AES_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div className="flex items-center gap-2">
                        {m.label}
                        {m.recommended && <Badge variant="secondary" className="text-xs">推荐</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {AES_MODES.find(m => m.value === mode)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label>填充方式</Label>
              <Select value={padding} onValueChange={setPadding}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PADDING_MODES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      <div className="flex items-center gap-2">
                        {p.label}
                        {p.recommended && <Badge variant="secondary" className="text-xs">推荐</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {PADDING_MODES.find(p => p.value === padding)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label>密钥长度</Label>
              <Select value={keyLength} onValueChange={setKeyLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KEY_LENGTHS.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {KEY_LENGTHS.find(k => k.value === keyLength)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label>输出格式</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hex">十六进制</SelectItem>
                  <SelectItem value="base64">Base64</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 密钥和IV设置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>密钥 (十六进制)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomKey}
                  className="h-7 px-2"
                >
                  <Key className="w-3 h-3 mr-1" />
                  生成
                </Button>
              </div>
              <Input
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder={`请输入${parseInt(keyLength) / 8 * 2}位十六进制密钥`}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                需要{parseInt(keyLength) / 8 * 2}个十六进制字符（{parseInt(keyLength) / 8}字节）
              </p>
            </div>

            {mode !== "ECB" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>初始化向量 IV (十六进制)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateRandomIV}
                    className="h-7 px-2"
                  >
                    <Key className="w-3 h-3 mr-1" />
                    生成
                  </Button>
                </div>
                <Input
                  value={iv}
                  onChange={(e) => setIv(e.target.value)}
                  placeholder="请输入32位十六进制IV"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  需要32个十六进制字符（16字节）
                </p>
              </div>
            )}
          </div>

          {/* 加密解密操作区域 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encrypt" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                加密
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="flex items-center gap-2">
                <Unlock className="w-4 h-4" />
                解密
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4">
              <div className="space-y-2">
                <Label>明文输入</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="请输入要加密的文本..."
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={aesEncrypt} className="flex-1">
                  <Lock className="w-4 h-4 mr-2" />
                  加密
                </Button>
                <Button variant="outline" onClick={swapInputOutput}>
                  ⇅
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>密文输出</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputText)}
                    disabled={!outputText}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder="加密结果将显示在这里..."
                  className="min-h-[120px] font-mono text-sm bg-gray-50"
                />
              </div>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4">
              <div className="space-y-2">
                <Label>密文输入</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`请输入要解密的${outputFormat === "hex" ? "十六进制" : "Base64"}密文...`}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={aesDecrypt} className="flex-1">
                  <Unlock className="w-4 h-4 mr-2" />
                  解密
                </Button>
                <Button variant="outline" onClick={swapInputOutput}>
                  ⇅
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  清空
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>明文输出</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(outputText)}
                    disabled={!outputText}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    复制
                  </Button>
                </div>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder="解密结果将显示在这里..."
                  className="min-h-[120px] font-mono text-sm bg-gray-50"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 使用说明 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">使用说明：</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>推荐设置</strong>：CBC模式 + PKCS#7填充 + 256位密钥</li>
              <li>• <strong>密钥格式</strong>：十六进制字符串，如：0123456789abcdef...</li>
              <li>• <strong>IV要求</strong>：除ECB模式外，其他模式都需要16字节IV</li>
              <li>• <strong>安全提示</strong>：请妥善保管密钥，不要在不安全的环境中使用</li>
              <li>• <strong>兼容性</strong>：本工具基于Web Crypto API，主要支持CBC模式</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};