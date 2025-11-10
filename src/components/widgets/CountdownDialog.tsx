import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CountdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const weekdays = [
  { id: "monday", label: "周一", checked: true },
  { id: "tuesday", label: "周二", checked: true },
  { id: "wednesday", label: "周三", checked: true },
  { id: "thursday", label: "周四", checked: true },
  { id: "friday", label: "周五", checked: true },
  { id: "saturday", label: "周六", checked: false },
  { id: "sunday", label: "周日", checked: false },
];

const fontColors = [
  "#000000", "#FFFFFF", "#3B82F6", "#EF4444", "#10B981", 
  "#F59E0B", "#8B5CF6", "#EC4899", "#6B7280", "#F97316"
];

const backgroundColors = [
  "#FFFFFF", "#000000", "#F3F4F6", "#DBEAFE", "#FEE2E2", 
  "#D1FAE5", "#FEF3C7", "#E9D5FF", "#FCE7F3", "#FED7AA"
];

export const CountdownDialog = ({ open, onOpenChange }: CountdownDialogProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workDays, setWorkDays] = useState(weekdays);
  const [workStartTime, setWorkStartTime] = useState("09:00");
  const [workEndTime, setWorkEndTime] = useState("18:00");
  const [selectedFontColor, setSelectedFontColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#FFFFFF");
  const [showPayday, setShowPayday] = useState(true);
  const [showNextHoliday, setShowNextHoliday] = useState(false);
  const [showFriday, setShowFriday] = useState(true);
  const [showDailyEarning, setShowDailyEarning] = useState(true);
  const [paydayDate, setPaydayDate] = useState("15");
  const [dailyIncome, setDailyIncome] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeUntilOffWork = () => {
    const now = new Date();
    const [endHour, endMinute] = workEndTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);
    
    if (now > endTime) {
      // If past work time, show next day
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const diff = endTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleWorkDayChange = (dayId: string, checked: boolean) => {
    setWorkDays(prev => prev.map(day => 
      day.id === dayId ? { ...day, checked } : day
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex h-full">
          {/* Left Side - Countdown Display */}
          <div className="flex-1 p-6 bg-gray-50">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-800">下班倒计时</DialogTitle>
            </DialogHeader>
            
            {/* Main Countdown */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                下班还有 {calculateTimeUntilOffWork()}
              </div>
            </div>
            
            {/* Cute Dog Animation */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center">
                <div className="text-6xl">🐕</div>
              </div>
            </div>
            
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {showPayday && (
                <div className="bg-blue-100 rounded-lg p-4 text-center">
                  <div className="text-gray-600 text-sm">发薪</div>
                  <div className="text-2xl font-bold text-blue-600">16天</div>
                </div>
              )}
              
              {showNextHoliday && (
                <div className="bg-red-100 rounded-lg p-4 text-center">
                  <div className="text-gray-600 text-sm">元旦</div>
                  <div className="text-2xl font-bold text-red-600">63天</div>
                </div>
              )}
              
              {showFriday && (
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <div className="text-gray-600 text-sm">周五</div>
                  <div className="text-2xl font-bold text-purple-600">1天</div>
                </div>
              )}
              
              {showDailyEarning && (
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <div className="text-gray-600 text-sm">日赚</div>
                  <div className="text-xl font-bold text-green-600">{dailyIncome.toFixed(3)} ¥</div>
                </div>
              )}
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center mt-6 space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Right Side - Settings */}
          <div className="w-80 p-6 bg-white border-l">
            <div className="space-y-6 mt-8">
              {/* Work Days */}
              <div>
                <Label className="text-sm font-medium mb-3 block">工作日</Label>
                <div className="grid grid-cols-4 gap-2">
                  {workDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={day.checked}
                        onCheckedChange={(checked) => handleWorkDayChange(day.id, !!checked)}
                      />
                      <Label htmlFor={day.id} className="text-xs">{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Work Time */}
              <div>
                <Label className="text-sm font-medium mb-3 block">工作时间</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">至</span>
                  <Input
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              {/* Font Color */}
              <div>
                <Label className="text-sm font-medium mb-3 block">字体颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {fontColors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${
                        selectedFontColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedFontColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Background Color */}
              <div>
                <Label className="text-sm font-medium mb-3 block">背景颜色</Label>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 ${
                        selectedBgColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedBgColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              {/* Display Options */}
              <div>
                <Label className="text-sm font-medium mb-3 block">显示更多？</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={showPayday ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPayday(!showPayday)}
                    className="text-xs"
                  >
                    发薪日
                  </Button>
                  <Button
                    variant={showNextHoliday ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowNextHoliday(!showNextHoliday)}
                    className="text-xs"
                  >
                    下一个节日
                  </Button>
                  <Button
                    variant={showFriday ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFriday(!showFriday)}
                    className="text-xs"
                  >
                    距离周五
                  </Button>
                  <Button
                    variant={showDailyEarning ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDailyEarning(!showDailyEarning)}
                    className="text-xs"
                  >
                    日赚
                  </Button>
                </div>
              </div>
              
              {/* Payday */}
              <div>
                <Label className="text-sm font-medium mb-3 block">发薪日</Label>
                <Select value={paydayDate} onValueChange={setPaydayDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择发薪日" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        每月{day}日
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Daily Income */}
              <div>
                <Label className="text-sm font-medium mb-3 block">每天收入</Label>
                <div className="flex items-center">
                  <Input
                    type="number"
                    value={dailyIncome}
                    onChange={(e) => setDailyIncome(Number(e.target.value))}
                    className="flex-1"
                    min="0"
                    step="0.01"
                  />
                  <div className="ml-2 flex flex-col">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-4 w-6 p-0 text-xs"
                      onClick={() => setDailyIncome(prev => prev + 100)}
                    >
                      ▲
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-4 w-6 p-0 text-xs"
                      onClick={() => setDailyIncome(prev => Math.max(0, prev - 100))}
                    >
                      ▼
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};