import { useEffect, useRef, useState } from "react";

interface WallpaperSettings {
  backgroundImage: string;
  maskOpacity: number;
  blur: number;
  showWindmill: boolean;
  customUrl: string;
}

const STORAGE_KEY = "wallpaper_settings";

const defaultWallpapers = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop",
];

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [settings, setSettings] = useState<WallpaperSettings>({
    backgroundImage: defaultWallpapers[0],
    maskOpacity: 0,
    blur: 0,
    showWindmill: true,
    customUrl: ""
  });
  const [useWallpaper, setUseWallpaper] = useState(false);

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setUseWallpaper(true);
      } catch (error) {
        console.error("Failed to parse wallpaper settings:", error);
      }
    }
  }, []);

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          setUseWallpaper(true);
        } catch (error) {
          console.error("Failed to parse wallpaper settings:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // 监听自定义事件，用于同一页面内的更新
    window.addEventListener('wallpaperSettingsChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wallpaperSettingsChanged', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && !useWallpaper) {
      videoRef.current.play().catch(console.error);
    }
  }, [useWallpaper]);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 video-background">
      {useWallpaper ? (
        // 壁纸背景
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            background: settings.backgroundImage.startsWith('#') || settings.backgroundImage.startsWith('linear-gradient') 
              ? settings.backgroundImage 
              : `url(${settings.backgroundImage})`,
            filter: settings.blur > 0 ? `blur(${settings.blur}px)` : 'none'
          }}
        >
          {/* 遮罩层 */}
          <div 
            className="absolute inset-0 bg-overlay"
            style={{ backgroundColor: `rgba(0, 0, 0, ${settings.maskOpacity / 100})` }}
          ></div>
        </div>
      ) : (
        // 原始视频背景
        <div>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="https://oss.nbtab.com/public/2025/09/17/0657933952527777-d09685febaa173ccdc51298f3aa082ef.mp4?vframe/jpg/offset/2/w/400/h/240"
          >
            <source
              src="https://oss.nbtab.com/public/2025/09/17/0657933952527777-d09685febaa173ccdc51298f3aa082ef.mp4"
              type="video/mp4"
            />
            {/* Fallback gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
          </video>
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 bg-overlay" />
        </div>
      )}
    </div>
  );
};