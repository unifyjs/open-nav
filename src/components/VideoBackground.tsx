import { useEffect, useRef } from "react";

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
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
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};