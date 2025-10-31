import { useState, useEffect } from "react";

export const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
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

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-8">
      {/* Time */}
      <div className="text-white text-7xl font-light mb-4 tracking-wider">
        {formatTime(currentTime)}
      </div>
      
      {/* Date */}
      <div className="flex items-center gap-4 text-white/90">
        <span className="text-lg">{dateInfo.monthDay}</span>
        <span className="text-lg">{dateInfo.weekday}</span>
        <span className="text-lg">{dateInfo.lunar}</span>
      </div>
    </div>
  );
};