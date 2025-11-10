import { useState, useEffect } from "react";

const quotes = [
  "生活就像海洋，只有意志坚强的人才能到达彼岸。",
  "成功不是终点，失败也不是末日，最重要的是继续前进的勇气。",
  "每一个不曾起舞的日子，都是对生命的辜负。",
  "世界上最快乐的事，莫过于为理想而奋斗。",
  "不要等待机会，而要创造机会。",
  "今天的努力，是为了明天的美好。",
];

export const DailyQuote = () => {
  const [quote, setQuote] = useState("正在加载一言...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and then show a random quote
    const timer = setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!isLoading) {
      // Copy to clipboard
      navigator.clipboard.writeText(quote).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = quote;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading) {
      // Switch to a new quote
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
  };

  return (
    <div className="flex justify-center px-8 mb-4">
      <div
        className="text-white/80 text-center max-w-2xl cursor-pointer hover:text-white transition-colors"
        onClick={handleClick}
        onContextMenu={handleRightClick}
        title="点击左键复制，右键切换"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="ml-2">{quote}</span>
          </div>
        ) : (
          <p className="text-lg leading-relaxed">{quote}</p>
        )}
      </div>
    </div>
  );
};