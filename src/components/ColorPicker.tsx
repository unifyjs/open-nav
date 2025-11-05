import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ColorPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

export const ColorPicker = ({ open, onOpenChange, onColorSelect, currentColor = "#ffffff" }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);

  // 预设颜色
  const presetColors = [
    "#3b82f6", // 蓝色
    "#10b981", // 绿色  
    "#f59e0b", // 橙色
    "#ef4444", // 红色
    "#8b5cf6", // 紫色
    "#06b6d4", // 青色
    "#f97316", // 橙红色
    "#84cc16", // 青绿色
  ];

  // 将HSL转换为十六进制
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // 将十六进制转换为HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // 初始化颜色值
  useEffect(() => {
    if (currentColor) {
      const [h, s, l] = hexToHsl(currentColor);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setSelectedColor(currentColor);
    }
  }, [currentColor]);

  // 更新选中的颜色
  useEffect(() => {
    const color = hslToHex(hue, saturation, lightness);
    setSelectedColor(color);
  }, [hue, saturation, lightness]);

  // 绘制主色彩选择区域
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 创建渐变
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100;
        const l = 100 - (y / height) * 100;
        const color = `hsl(${hue}, ${s}%, ${l}%)`;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hue]);

  // 绘制色相条
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      const h = (x / width) * 360;
      const color = `hsl(${h}, 100%, 50%)`;
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, 1, height);
    }
  }, []);

  // 处理主色彩区域点击
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = (x / canvas.width) * 100;
    const l = 100 - (y / canvas.height) * 100;

    setSaturation(s);
    setLightness(l);
  };

  // 处理色相条点击
  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const h = (x / canvas.width) * 360;

    setHue(h);
  };

  // 处理十六进制输入
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const [h, s, l] = hexToHsl(hex);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setSelectedColor(hex);
    }
  };

  // 确认选择
  const handleConfirm = () => {
    onColorSelect(selectedColor);
    onOpenChange(false);
  };

  // 清空颜色
  const handleClear = () => {
    onColorSelect("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-800/90 backdrop-blur-sm border border-white/20 text-white">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">选择颜色</h3>
          
          {/* 预设颜色 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">预设颜色</label>
            <div className="flex gap-2 flex-wrap">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const [h, s, l] = hexToHsl(color);
                    setHue(h);
                    setSaturation(s);
                    setLightness(l);
                  }}
                />
              ))}
            </div>
          </div>

          {/* 主色彩选择区域 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">颜色选择</label>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={280}
                height={200}
                className="border border-white/20 rounded cursor-crosshair"
                onClick={handleCanvasClick}
              />
              {/* 选择指示器 */}
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(saturation / 100) * 280}px`,
                  top: `${(1 - lightness / 100) * 200}px`,
                }}
              />
            </div>
          </div>

          {/* 色相条 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">色相</label>
            <div className="relative">
              <canvas
                ref={hueCanvasRef}
                width={280}
                height={20}
                className="border border-white/20 rounded cursor-pointer"
                onClick={handleHueClick}
              />
              {/* 色相指示器 */}
              <div
                className="absolute w-1 h-6 bg-white border border-gray-400 pointer-events-none transform -translate-x-1/2"
                style={{
                  left: `${(hue / 360) * 280}px`,
                  top: '-3px',
                }}
              />
            </div>
          </div>

          {/* 颜色预览和十六进制输入 */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded border border-white/20"
              style={{ backgroundColor: selectedColor }}
            />
            <Input
              value={selectedColor}
              onChange={handleHexChange}
              className="flex-1 bg-white/10 border-white/20 text-white"
              placeholder="#ffffff"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClear}
              className="border-white/20 text-white hover:bg-white/10"
            >
              清空
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              确定
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};