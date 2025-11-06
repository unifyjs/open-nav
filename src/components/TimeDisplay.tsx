import { useState, useEffect } from "react";

interface DateTimeSettings {
  showTime: boolean;
  showSearchBar: boolean;
  showMonthDay: boolean;
  showWeek: boolean;
  showLunar: boolean;
  show24Hour: boolean;
  showSeconds: boolean;
  isBold: boolean;
  fontSize: number;
  fontColor: string;
}

const DATETIME_STORAGE_KEY = "datetime_settings";

const defaultSettings: DateTimeSettings = {
  showTime: true,
  showSearchBar: true,
  showMonthDay: true,
  showWeek: true,
  showLunar: true,
  show24Hour: true,
  showSeconds: false,
  isBold: false,
  fontSize: 70,
  fontColor: "#ffffff"
};

export const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState<DateTimeSettings>(defaultSettings);

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem(DATETIME_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse datetime settings:", error);
      }
    }

    // 监听设置变化
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings({ ...defaultSettings, ...event.detail });
    };

    window.addEventListener('dateTimeSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('dateTimeSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, settings.showSeconds ? 1000 : 60000); // 根据是否显示秒数调整更新频率

    return () => clearInterval(timer);
  }, [settings.showSeconds]);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !settings.show24Hour
    };
    
    if (settings.showSeconds) {
      options.second = '2-digit';
    }
    
    return date.toLocaleTimeString('zh-CN', options);
  };

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[date.getDay()];
    
    return {
      monthDay: `${month}/${day}`,
      weekday: weekday,
      lunar: "九月初九" // Static for demo
    };
  };

  const dateInfo = formatDate(currentTime);

  // 如果设置为不显示时间，则返回 null
  if (!settings.showTime) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      {/* Time */}
      <div 
        className={`tracking-wider ${settings.isBold ? 'font-bold' : 'font-light'}`}
        style={{
          fontSize: `${settings.fontSize}px`,
          color: settings.fontColor
        }}
      >
        {formatTime(currentTime)}
      </div>
      
      {/* Date */}
      <div className="flex items-center gap-4" style={{ color: settings.fontColor + '90' }}>
        {settings.showMonthDay && <span className="text-lg">{dateInfo.monthDay}</span>}
        {settings.showWeek && <span className="text-lg">{dateInfo.weekday}</span>}
        {settings.showLunar && <span className="text-lg">{dateInfo.lunar}</span>}
      </div>
    </div>
  );
};