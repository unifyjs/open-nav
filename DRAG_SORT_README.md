# Open Nav Enhanced - 拖动排序功能

## 功能说明

本项目基于 [unifyjs/open-nav](https://github.com/unifyjs/open-nav) 进行了增强，主要实现了以下功能：

### ✨ 新增功能

1. **BookmarkItem 拖动排序**
   - 所有书签项目都支持拖拽重新排序
   - 拖动时提供视觉反馈（透明度变化、缩放效果）
   - 拖动目标区域高亮显示

2. **localStorage 自动保存**
   - 排序结果自动保存到浏览器本地存储
   - 页面刷新后保持用户自定义的排序
   - 按分类独立保存排序状态

3. **增强的用户体验**
   - 悬停时显示拖动手柄图标
   - 平滑的动画过渡效果
   - 首次使用时显示操作提示

### 🎯 使用方法

1. **拖动排序**：
   - 鼠标悬停在任意书签上，会显示拖动手柄图标
   - 按住鼠标左键拖动书签到目标位置
   - 释放鼠标完成排序，结果自动保存

2. **调整大小**：
   - 右键点击任意书签或小组件
   - 在弹出菜单中选择合适的尺寸

3. **分类管理**：
   - 每个分类（主页、AI、摸鱼等）的排序独立保存
   - 切换分类时会加载对应的排序状态

### 🔧 技术实现

- **拖拽API**：使用原生 HTML5 Drag and Drop API
- **状态管理**：React Hooks (useState, useEffect)
- **数据持久化**：localStorage 存储排序信息
- **视觉反馈**：CSS 动画和 Tailwind CSS 样式
- **图标系统**：Lucide React 图标库

### 📁 主要修改文件

- `src/components/BookmarkItem.tsx` - 增强书签组件，添加拖动支持
- `src/components/BookmarkGrid.tsx` - 优化拖动逻辑和视觉反馈
- `src/components/DragHint.tsx` - 新增操作提示组件
- `src/pages/Index.tsx` - 集成拖动提示
- `src/index.css` - 添加拖动动画样式

### 🚀 运行项目

```bash
npm install
npm run dev
```

访问 http://localhost:5173 查看效果。

### 💡 特性亮点

- **无缝集成**：完全兼容原有功能，不影响现有特性
- **响应式设计**：支持不同屏幕尺寸的拖动操作
- **性能优化**：使用防抖和节流技术，确保流畅体验
- **用户友好**：提供清晰的视觉反馈和操作指引