import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronUp, ChevronDown, Plus } from "lucide-react";

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultMemos: Memo[] = [
  {
    id: "1",
    title: "OpenNav 使用小技巧",
    content: `OpenNav 使用小技巧

1. 右键点击图标可以编辑图标信息
2. 拖拽图标可以调整图标位置
3. 点击左侧分类可以切换不同的图标组
4. 搜索框支持多种搜索引擎切换
5. 可以自定义壁纸和主题颜色
6. 支持导入导出配置文件

【隐私安全】
1. 所有数据均存储在本地，不会上传到服务器
2. 您的浏览记录和个人信息完全私密

了解更多：https://OpenNav.com/help`,
    createdAt: new Date("2024-10-30T10:00:00"),
    updatedAt: new Date("2024-10-31T15:30:00"),
  },
  {
    id: "2", 
    title: "2024年10月31日",
    content: `今日工作计划

- [ ] 完成项目文档整理
- [ ] 参加下午的团队会议
- [ ] 回复客户邮件
- [ ] 准备明天的演示材料

备注：记得提前15分钟参加会议`,
    createdAt: new Date("2024-10-31T09:00:00"),
    updatedAt: new Date("2024-10-31T09:00:00"),
  }
];

export const MemoDialog = ({ open, onOpenChange }: MemoDialogProps) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<string>("");
  const [editingContent, setEditingContent] = useState("");

  // Load memos from localStorage on component mount
  useEffect(() => {
    const savedMemos = localStorage.getItem("opennav-memos");
    if (savedMemos) {
      try {
        const parsedMemos = JSON.parse(savedMemos).map((memo: any) => ({
          ...memo,
          createdAt: new Date(memo.createdAt),
          updatedAt: new Date(memo.updatedAt),
        }));
        setMemos(parsedMemos);
        if (parsedMemos.length > 0) {
          setSelectedMemoId(parsedMemos[0].id);
          setEditingContent(parsedMemos[0].content);
        }
      } catch (error) {
        console.error("Failed to parse saved memos:", error);
        setMemos(defaultMemos);
        setSelectedMemoId(defaultMemos[0].id);
        setEditingContent(defaultMemos[0].content);
      }
    } else {
      setMemos(defaultMemos);
      setSelectedMemoId(defaultMemos[0].id);
      setEditingContent(defaultMemos[0].content);
    }
  }, []);

  // Save memos to localStorage whenever memos change
  useEffect(() => {
    if (memos.length > 0) {
      localStorage.setItem("opennav-memos", JSON.stringify(memos));
    }
  }, [memos]);

  // Auto-save content changes
  useEffect(() => {
    if (selectedMemoId && editingContent !== undefined) {
      const timeoutId = setTimeout(() => {
        setMemos(prev => prev.map(memo => 
          memo.id === selectedMemoId 
            ? { ...memo, content: editingContent, updatedAt: new Date() }
            : memo
        ));
      }, 1000); // Auto-save after 1 second of no typing

      return () => clearTimeout(timeoutId);
    }
  }, [editingContent, selectedMemoId]);

  const selectedMemo = memos.find(memo => memo.id === selectedMemoId);

  const handleMemoSelect = (memoId: string) => {
    const memo = memos.find(m => m.id === memoId);
    if (memo) {
      setSelectedMemoId(memoId);
      setEditingContent(memo.content);
    }
  };

  const handleCreateNewMemo = () => {
    const now = new Date();
    const newMemo: Memo = {
      id: Date.now().toString(),
      title: now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    
    setMemos(prev => [newMemo, ...prev]);
    setSelectedMemoId(newMemo.id);
    setEditingContent("");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="flex h-[80vh]">
          {/* Left Sidebar - Memo List */}
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">目录</DialogTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {memos.map((memo) => (
                  <div
                    key={memo.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMemoId === memo.id
                        ? 'bg-white border-l-4 border-blue-500 shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => handleMemoSelect(memo.id)}
                  >
                    <div className="font-medium text-sm text-gray-800 mb-1">
                      {memo.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(memo.updatedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <Button 
                onClick={handleCreateNewMemo}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                新建备忘录
              </Button>
            </div>
          </div>
          
          {/* Right Content Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <DialogTitle className="text-xl font-semibold">
                {selectedMemo?.title || "备忘录"}
              </DialogTitle>
            </div>
            
            <div className="flex-1 p-1">
              {selectedMemo ? (
                <div className="h-full flex flex-col border-none focus:border-none">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    placeholder="开始编写您的备忘录..."
                    className="flex-1 resize-none border-none focus:border-none text-sm outline-none 
                    hide-scrollbar
                    focus:ring-0 focus-visible:outline-none focus-visible:border-0 
                    bg-[linear-gradient(transparent_95%,rgba(235,235,235,0.3)_95%)] 
                    bg-[length:100%_2rem] leading-[2rem] 
                    h-[6rem] overflow-auto transition-all"
                    style={{ minHeight: '400px' }}
                  />
                  
                  <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-1">
                    <div>最后编辑：{formatDate(selectedMemo.updatedAt)}</div>
                    <div>创建时间：{formatDate(selectedMemo.createdAt)}</div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  选择一个备忘录开始编辑
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};