import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Coffee, StickyNote, Timer, TrendingUp } from "lucide-react";
import { CountdownDialog } from "./CountdownDialog";
import { MemoDialog } from "./MemoDialog";

interface WidgetItemProps {
  id: string;
  title: string;
  size: string;
}

export const WidgetItem = ({ id, title, size }: WidgetItemProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCountdownDialog, setShowCountdownDialog] = useState(false);
  const [showMemoDialog, setShowMemoDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGridSpan = (size: string) => {
    switch (size) {
      case "1x1": return "col-span-1 row-span-1";
      case "2x2": return "col-span-2 row-span-2";
      case "2x4": return "col-span-2 row-span-4";
      case "4x1": return "col-span-4 row-span-1";
      case "4x2": return "col-span-4 row-span-2";
      default: return "col-span-1 row-span-1";
    }
  };

  const renderWidgetContent = () => {
    switch (id) {
      case "countdown":
        return (
          <>
            <div 
              className="w-full h-full p-4 flex flex-col cursor-pointer hover:bg-white/5 transition-colors rounded-2xl"
              onClick={() => setShowCountdownDialog(true)}
            >
              <div className="flex items-center justify-center flex-1">
                <img 
                  src="https://oss.nbtab.com/base/widget/offwork1.png" 
                  alt="休息时间"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-center text-white mb-2">
                <div className="text-lg font-medium">休息时间</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-100/20 rounded p-2 text-center">
                  <div className="text-white/80">发薪</div>
                  <div className="text-white font-bold">17天</div>
                </div>
                <div className="bg-red-100/20 rounded p-2 text-center">
                  <div className="text-white/80">元旦</div>
                  <div className="text-white font-bold">64天</div>
                </div>
                <div className="bg-purple-100/20 rounded p-2 text-center">
                  <div className="text-white/80">周五</div>
                  <div className="text-white font-bold">2天</div>
                </div>
                <div className="bg-cyan-100/20 rounded p-2 text-center">
                  <div className="text-white/80">日赚</div>
                  <div className="text-white font-bold text-xs">199.27￥</div>
                </div>
              </div>
            </div>
            <CountdownDialog 
              open={showCountdownDialog} 
              onOpenChange={setShowCountdownDialog} 
            />
          </>
        );

      case "hotsearch":
        return (
          <div className="w-full h-full p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-white font-medium">今日热搜</span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                "AI技术发展趋势",
                "新能源汽车市场",
                "元宇宙概念股",
                "在线教育平台",
                "数字货币政策"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer">
                  <span className="text-orange-400 font-bold text-xs">{index + 1}</span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center">
            <Calendar className="w-8 h-8 text-white mb-2" />
            <div className="text-white text-3xl font-bold mb-1">
              {currentTime.getDate()}
            </div>
            <div className="text-white/80 text-xs text-center">
              <div>第{Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1}天 第{Math.ceil((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}周</div>
              <div>九月初九 周三</div>
            </div>
          </div>
        );

      case "eat":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Coffee className="w-8 h-8 text-yellow-400 mb-2" />
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-medium"
              onClick={() => {
                const foods = ["麻辣烫", "兰州拉面", "黄焖鸡米饭", "沙县小吃", "重庆小面", "煎饼果子"];
                const randomFood = foods[Math.floor(Math.random() * foods.length)];
                alert(`今天吃：${randomFood}！`);
              }}
            >
              开始
            </Button>
          </div>
        );

      case "holiday":
        return (
          <div className="w-full h-full p-4">
            <div className="mb-4">
              <div className="text-white text-lg font-medium">元旦还有</div>
              <div className="text-white text-2xl font-bold">64<span className="text-sm ml-1">天</span></div>
              <div className="text-white/80 text-sm">01/01</div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { name: "春节", date: "02/17", days: "111" },
                { name: "清明节", date: "04/04", days: "156" },
                { name: "劳动节", date: "05/01", days: "183" }
              ].map((holiday, index) => (
                <div key={index} className="flex justify-between items-center text-white/80">
                  <div>
                    <span className="font-medium">{holiday.name}</span>
                    <span className="ml-2 text-xs">{holiday.date}</span>
                  </div>
                  <span className="font-bold">{holiday.days}<span className="text-xs ml-1">天</span></span>
                </div>
              ))}
            </div>
          </div>
        );

      case "notes":
        return (
          <>
            <div 
              className="w-full h-full p-4 cursor-pointer hover:bg-white/5 transition-colors rounded-2xl"
              onClick={() => setShowMemoDialog(true)}
            >
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Notes</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-white/80 truncate">OpenNav 使用小技巧</div>
                <div className="text-white/80 truncate">OpenNav Usage Tips</div>
              </div>
            </div>
            <MemoDialog 
              open={showMemoDialog} 
              onOpenChange={setShowMemoDialog} 
            />
          </>
        );

      case "tomato":
        return (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-2xl">
            <div className="relative w-24 h-24 mb-2">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Timer className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-white text-xl font-bold mb-2">25:00</div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20"
              onClick={() => alert("番茄时钟功能演示")}
            >
              <Timer className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white/60" />
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-200 hover:scale-105 overflow-hidden">
      {renderWidgetContent()}
    </div>
  );
};