import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileCategorySelectorProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  "主页",
  "AI", 
  "摸鱼",
  "开发",
  "设计",
  "新媒体"
];

export const MobileCategorySelector = ({ currentCategory, onCategoryChange }: MobileCategorySelectorProps) => {
  return (
    <div className="flex justify-center mb-4 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            {currentCategory}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/80 border-white/20 backdrop-blur-sm">
          {categories.map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => onCategoryChange(category)}
              className="text-white hover:bg-white/20 focus:bg-white/20"
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};