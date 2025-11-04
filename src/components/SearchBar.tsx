import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronDown } from "lucide-react";

const searchEngines = [
  { value: "default", label: "Default", icon: "🔍" },
  { value: "google", label: "Google", icon: "🌐" },
  { value: "quark", label: "Quark", icon: "⚛️" },
  { value: "bing", label: "Bing", icon: "🔍" },
  { value: "baidu", label: "Baidu", icon: "🔍" },
  { value: "yandex", label: "Yandex", icon: "🔍" },
  { value: "bilibili", label: "Bilibili", icon: "📺" },
];

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEngine, setSelectedEngine] = useState("default");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Handle search based on selected engine
    const urls = {
      default: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
      google: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
      quark: `https://quark.sm.cn/s?q=${encodeURIComponent(searchQuery)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
      baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
      yandex: `https://yandex.com/search/?text=${encodeURIComponent(searchQuery)}`,
      bilibili: `https://search.bilibili.com/all?keyword=${encodeURIComponent(searchQuery)}`,
    };
    
    window.open(urls[selectedEngine as keyof typeof urls], '_blank');
  };

  return (
    <div className="flex justify-center px-8 mb-8">
      <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 max-w-2xl w-full">
        {/* Search Engine Selector */}
        <Select value={selectedEngine} onValueChange={setSelectedEngine}>
          <SelectTrigger className="w-[60px] border-none bg-transparent text-white focus:ring-0 focus:ring-offset-0">
            <div className="flex items-center">
              <span className="text-lg">
                {searchEngines.find(engine => engine.value === selectedEngine)?.icon}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {searchEngines.map((engine) => (
              <SelectItem key={engine.value} value={engine.value}>
                <div className="flex items-center gap-2">
                  <span>{engine.icon}</span>
                  <span>{engine.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Enter search content"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none bg-transparent text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        
        {/* Search Button */}
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 px-3"
        >
          <Search className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};