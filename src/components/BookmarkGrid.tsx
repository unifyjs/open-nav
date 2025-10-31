import { BookmarkItem } from "./BookmarkItem";
import { WidgetItem } from "./WidgetItem";

interface BookmarkGridProps {
  category: string;
}

// 定义书签数据
const bookmarkData = {
  主页: [
    // 功能小部件
    { type: "widget", id: "countdown", title: "下班倒计时", size: "2x4" },
    { type: "widget", id: "hotsearch", title: "今日热搜", size: "2x4" },
    { type: "widget", id: "calendar", title: "日历", size: "2x2" },
    
    // 常用网站
    { type: "bookmark", id: "bookmark", title: "书签", icon: "https://oss.nbtab.com/public/admin/website/3672712353746537-2.svg", url: "chrome://bookmarks/", color: "#ff6816" },
    { type: "bookmark", id: "extensions", title: "扩展管理", icon: "https://oss.nbtab.com/public/admin/website/7025340996327276-0.svg", url: "chrome://extensions/", color: "#136bff" },
    { type: "bookmark", id: "xiaohongshu", title: "小红书", icon: "https://oss.nbtab.com/website/hot/xiaohongshu.svg", url: "https://www.xiaohongshu.com/", color: "#ff2442" },
    { type: "bookmark", id: "doubao", title: "豆包", icon: "https://oss.nbtab.com/website/ai/doubao.com.webp", url: "https://www.doubao.com/", color: "#ffffff" },
    { type: "bookmark", id: "bilibili", title: "哔哩哔哩", icon: "https://oss.nbtab.com/website/hot/bilibili2.svg", url: "https://www.bilibili.com/", color: "#ff5ca1" },
    
    { type: "widget", id: "eat", title: "今天吃什么", size: "1x1" },
    
    { type: "bookmark", id: "history", title: "历史记录", icon: "https://oss.nbtab.com/public/admin/website/3762344249346179-0.svg", url: "chrome://history/", color: "#37cf6b" },
    { type: "bookmark", id: "downloads", title: "下载管理", icon: "https://oss.nbtab.com/public/admin/website/3771099125625612-0.svg", url: "chrome://downloads/", color: "#5525ff" },
    { type: "bookmark", id: "douyin", title: "抖音", icon: "https://oss.nbtab.com/website/hot/douyin.svg", url: "https://www.douyin.com/", color: "#1c0b1a" },
    { type: "bookmark", id: "deepseek", title: "DeepSeek", icon: "https://oss.nbtab.com/website/ai/deepseek.svg", url: "https://www.deepseek.com/", color: "#ffffff" },
    { type: "bookmark", id: "pixabay", title: "音效图片库", icon: "https://oss.nbtab.com/public/admin/website/6943408599669363-pixa.svg", url: "https://pixabay.com/", color: "#01ab6b" },
    { type: "bookmark", id: "ghxi", title: "果核剥壳", icon: "https://oss.nbtab.com/website/hot/ghxi.svg", url: "https://www.ghxi.com/", color: "#ffffff" },
    
    { type: "widget", id: "holiday", title: "下一个假期", size: "2x4" },
    { type: "widget", id: "notes", title: "备忘录", size: "2x2" },
    { type: "widget", id: "tomato", title: "番茄时钟", size: "2x2" },
    
    { type: "bookmark", id: "feedback", title: "建议反馈", icon: "https://oss.nbtab.com/public/admin/website/6860359797687536-0.svg", url: "#", color: "#3e7eff" },
    { type: "bookmark", id: "settings", title: "设置", icon: "https://oss.nbtab.com/website/hot/setting.svg", url: "#", color: "#ffffff" },
    { type: "bookmark", id: "wallpaper", title: "壁纸", icon: "https://oss.nbtab.com/public/admin/website/7659467557723183-0.svg", url: "#", color: "#ffffff" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/public/admin/website/7319643153289458-0.svg", url: "#", color: "#ffffff" },
  ],
  
  AI: [
    { type: "bookmark", id: "chatgpt", title: "ChatGPT", icon: "https://oss.nbtab.com/public/admin/website/0172964491237669-2.svg", url: "https://chat.openai.com/", color: "#000000" },
    { type: "bookmark", id: "deepseek", title: "DeepSeek", icon: "https://oss.nbtab.com/website/ai/deepseek.svg", url: "https://www.deepseek.com/", color: "#ffffff" },
    { type: "bookmark", id: "doubao", title: "豆包", icon: "https://oss.nbtab.com/website/ai/doubao.com.webp", url: "https://www.doubao.com/", color: "#ffffff" },
    { type: "bookmark", id: "kimi", title: "Kimi", icon: "https://oss.nbtab.com/website/ai/kimi.moonshot.png", url: "https://kimi.moonshot.cn/", color: "#000000" },
    { type: "bookmark", id: "wenxin", title: "文心一言", icon: "https://oss.nbtab.com/website/ai/yige.baidu.png", url: "https://yiyan.baidu.com/", color: "#ffffff" },
    { type: "bookmark", id: "tongyi", title: "通义千问", icon: "https://oss.nbtab.com/website/ai/tongyi.aliyun.png", url: "https://tongyi.aliyun.com/", color: "#ffffff" },
    { type: "bookmark", id: "gaoding", title: "稿定", icon: "https://oss.nbtab.com/website/ai/gaoding.svg", url: "https://www.gaoding.com/", color: "#0050ff" },
    { type: "bookmark", id: "ai-tools", title: "AI工具集", icon: "https://oss.nbtab.com/website/ai/ai-bot.svg", url: "https://ai-bot.cn/", color: "#ffffff" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/public/admin/website/7319643153289458-0.svg", url: "#", color: "#ffffff" },
  ],
  
  摸鱼: [
    { type: "bookmark", id: "bilibili", title: "哔哩哔哩", icon: "https://oss.nbtab.com/website/music/bilibili2.svg", url: "https://www.bilibili.com/", color: "#ff5ca1" },
    { type: "bookmark", id: "douyin", title: "抖音", icon: "https://oss.nbtab.com/website/music/douyin.svg", url: "https://www.douyin.com/", color: "#1c0b1a" },
    { type: "bookmark", id: "weibo", title: "新浪微博", icon: "https://oss.nbtab.com/website/social/weibo.svg", url: "https://weibo.com/", color: "#ffd850" },
    { type: "bookmark", id: "twitter", title: "Twitter", icon: "https://oss.nbtab.com/website/news/x.com.svg", url: "https://twitter.com/", color: "#000000" },
    { type: "bookmark", id: "music163", title: "网易云音乐", icon: "https://oss.nbtab.com/website/music/music163.svg", url: "https://music.163.com/", color: "#fe1816" },
    { type: "bookmark", id: "qqvideo", title: "腾讯视频", icon: "https://oss.nbtab.com/website/music/qqvideo.svg", url: "https://v.qq.com/", color: "#ffffff" },
    { type: "bookmark", id: "iqiyi", title: "爱奇艺", icon: "https://oss.nbtab.com/website/music/iqiyi.svg", url: "https://www.iqiyi.com/", color: "#00cc4c" },
    { type: "bookmark", id: "taobao", title: "淘宝网", icon: "https://oss.nbtab.com/website/shopping/taobao.svg", url: "https://www.taobao.com/", color: "#ff5c00" },
    { type: "bookmark", id: "jd", title: "京东商城", icon: "https://oss.nbtab.com/website/shopping/jd.svg", url: "https://www.jd.com/", color: "#ff0000" },
    { type: "bookmark", id: "zhihu", title: "知乎", icon: "https://oss.nbtab.com/website/social/zhihu.svg", url: "https://www.zhihu.com/", color: "#0c6dfe" },
    { type: "bookmark", id: "xiaohongshu", title: "小红书", icon: "https://oss.nbtab.com/website/read/xiaohongshu.svg", url: "https://www.xiaohongshu.com/", color: "#ff2442" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/public/admin/website/7319643153289458-0.svg", url: "#", color: "#ffffff" },
  ],
  
  开发: [
    { type: "bookmark", id: "github", title: "GitHub", icon: "https://oss.nbtab.com/website/hot/github.svg", url: "https://github.com/", color: "#000000" },
    { type: "bookmark", id: "gitee", title: "码云Gitee", icon: "https://oss.nbtab.com/website/hot/gitee.svg", url: "https://gitee.com/", color: "#bb2124" },
    { type: "bookmark", id: "stackoverflow", title: "Stack Overflow", icon: "https://oss.nbtab.com/website/education/stackoverflow.svg", url: "https://stackoverflow.com/", color: "#444444" },
    { type: "bookmark", id: "docker", title: "Docker", icon: "https://oss.nbtab.com/website/tech/5eec31067e261c1f0b4e6d00.png", url: "https://www.docker.com/", color: "#0096e5" },
    { type: "bookmark", id: "vuejs", title: "Vue.js", icon: "https://oss.nbtab.com/website/others/vuejs.svg", url: "https://vuejs.org/", color: "#ffffff" },
    { type: "bookmark", id: "react", title: "React", icon: "https://oss.nbtab.com/website/tech/react.svg", url: "https://reactjs.org/", color: "#27333b" },
    { type: "bookmark", id: "tailwind", title: "Tailwind CSS", icon: "https://oss.nbtab.com/website/tech/5fc4ae988af9860fb41a9bcc.png", url: "https://tailwindcss.com/", color: "#ffffff" },
    { type: "bookmark", id: "juejin", title: "掘金", icon: "https://oss.nbtab.com/website/tech/juejin.svg", url: "https://juejin.cn/", color: "#0984fe" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/website/hot/add.svg", url: "#", color: "#ffffff" },
  ],
  
  设计: [
    { type: "bookmark", id: "jsdesign", title: "即时设计", icon: "https://oss.nbtab.com/website/hot/jsdesign.svg", url: "https://js.design/", color: "#cf3d35" },
    { type: "bookmark", id: "huaban", title: "花瓣", icon: "https://oss.nbtab.com/website/hot/huaban.svg", url: "https://huaban.com/", color: "#ea2936" },
    { type: "bookmark", id: "zcool", title: "站酷", icon: "https://oss.nbtab.com/website/hot/zcool.svg", url: "https://www.zcool.com.cn/", color: "#e6be1c" },
    { type: "bookmark", id: "gaoding", title: "稿定设计", icon: "https://oss.nbtab.com/website/photos/gaoding.svg", url: "https://www.gaoding.com/", color: "#0050ff" },
    { type: "bookmark", id: "unsplash", title: "Unsplash", icon: "https://oss.nbtab.com/website/photos/unsplash.svg", url: "https://unsplash.com/", color: "#ffffff" },
    { type: "bookmark", id: "figma", title: "Figma", icon: "https://oss.nbtab.com/public/admin/website/1466253414959867-figma.png", url: "https://www.figma.com/", color: "#000000" },
    { type: "bookmark", id: "dribbble", title: "Dribbble", icon: "https://oss.nbtab.com/public/admin/website/0897599982894387-Unknown7.jpg", url: "https://dribbble.com/", color: "#f96a9b" },
    { type: "bookmark", id: "iconfont", title: "阿里图标库", icon: "https://oss.nbtab.com/public/admin/website/2563334757616684-1220.png", url: "https://www.iconfont.cn/", color: "#1e1e1e" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/website/hot/add.svg", url: "#", color: "#ffffff" },
  ],
  
  新媒体: [
    { type: "bookmark", id: "douyin-creator", title: "抖音创作", icon: "https://oss.nbtab.com/website/others/douyin.svg", url: "https://creator.douyin.com/", color: "#211020" },
    { type: "bookmark", id: "xiaohongshu-creator", title: "小红书创作", icon: "https://oss.nbtab.com/website/hot/xiaohongshu.svg", url: "https://creator.xiaohongshu.com/", color: "#ff2442" },
    { type: "bookmark", id: "toutiao", title: "今日头条", icon: "https://oss.nbtab.com/website/hot/toutiao.svg", url: "https://www.toutiao.com/", color: "#ffffff" },
    { type: "bookmark", id: "wechat-mp", title: "微信公众平台", icon: "https://oss.nbtab.com/website/hot/mp-weixin-qq.svg", url: "https://mp.weixin.qq.com/", color: "#ffffff" },
    { type: "bookmark", id: "gaoding", title: "稿定设计", icon: "https://oss.nbtab.com/website/photos/gaoding.svg", url: "https://www.gaoding.com/", color: "#0050ff" },
    { type: "bookmark", id: "xiumi", title: "秀米", icon: "https://oss.nbtab.com/website/career/xinmeitiyunying/b80cd8.xiumi_logo_40.png", url: "https://xiumi.us/", color: "#ffffff" },
    { type: "bookmark", id: "365editor", title: "365编辑器", icon: "https://oss.nbtab.com/public/admin/website/7000778335732497-365.jpeg", url: "https://www.365editor.com/", color: "#ffffff" },
    { type: "bookmark", id: "converter", title: "在线格式转换", icon: "https://oss.nbtab.com/public/admin/website/4980263855847926-0.svg", url: "https://convertio.co/zh/", color: "#ffffff" },
    { type: "bookmark", id: "add", title: "添加图标", icon: "https://oss.nbtab.com/website/hot/add.svg", url: "#", color: "#ffffff" },
  ],
};

export const BookmarkGrid = ({ category }: BookmarkGridProps) => {
  const items = bookmarkData[category as keyof typeof bookmarkData] || [];

  return (
    <div className="flex-1 px-8 pb-8">
      <div className="grid grid-cols-12 gap-6 auto-rows-[80px]">
        {items.map((item, index) => {
          if (item.type === "widget") {
            return (
              <WidgetItem
                key={`${item.id}-${index}`}
                id={item.id}
                title={item.title}
                size={item.size}
              />
            );
          } else {
            return (
              <BookmarkItem
                key={`${item.id}-${index}`}
                title={item.title}
                icon={item.icon}
                url={item.url}
                color={item.color}
              />
            );
          }
        })}
      </div>
    </div>
  );
};