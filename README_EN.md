# OpenNav - Efficient Personal Workspace

OpenNav is a feature-rich browser new tab application that provides a highly customizable personal start page, integrating quick links, utility tools, and information displays to enhance work efficiency and browsing experience.

## 🌟 Key Features

### 🎯 Core Functionality
- **Smart Bookmark Management** - Multi-category bookmarks with customizable icons, colors, and layouts
- **Responsive Design** - Adaptive layout with icons automatically wrapping based on screen width
- **Sidebar Navigation** - Customizable position, width, transparency, and auto-hide functionality
- **Video Background** - Dynamic video backgrounds for enhanced visual experience

### 🛠️ Utility Tools
- **Time Display** - Customizable time format, font size, and color
- **Search Bar** - Quick search functionality
- **Daily Quotes** - Inspirational quotes display
- **Work Countdown** - Work status reminders
- **Hot Search Trends** - Real-time trending information
- **Calendar Component** - Date viewing functionality
- "What to Eat Today" - Random food recommendations

### 🎨 Personalization
- **Minimalist Mode** - Clean interface options
- **Icon Settings** - Customizable icon size, spacing, and border radius
- **Color Themes** - Support for custom color schemes
- **Layout Adjustments** - Flexible component layout configuration

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Component Library**: shadcn/ui + Radix UI
- **Styling Solution**: Tailwind CSS
- **State Management**: React Query
- **Routing Management**: React Router
- **Icon Library**: Lucide React

## 📦 Project Structure

```
src/
├── components/           # Component Directory
│   ├── dialogs/         # Dialog Components
│   ├── ui/              # Base UI Components
│   ├── widgets/         # Widget Components
│   ├── BookmarkGrid.tsx # Bookmark Grid Component
│   ├── Sidebar.tsx      # Sidebar Component
│   ├── TopBar.tsx       # Top Bar Component
│   └── ...
├── pages/               # Page Components
│   ├── Index.tsx        # Home Page
│   └── NotFound.tsx     # 404 Page
├── hooks/               # Custom Hooks
│   ├── use-mobile.tsx   # Mobile Detection
│   └── use-toast.ts     # Toast Notifications
└── lib/                 # Utility Library
    └── utils.ts         # Utility Functions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or pnpm

### Install Dependencies
```bash
npm install
# or using pnpm
pnpm install
```

### Development Mode
```bash
npm run dev
```
Visit http://localhost:5173 to view the application

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 📱 Responsive Design

The project features responsive design supporting various screen sizes:
- **Desktop**: Full feature display
- **Tablet**: Adaptive layout adjustments
- **Mobile**: Mobile-optimized interface

### Adaptive Features
- Icon containers use Flexbox layout with automatic wrapping
- Media queries adapt to different screen widths
- Mobile-optimized sidebar display

## 🔧 Configuration Guide

### Sidebar Settings
- Position: Left/Right
- Auto-hide: Show on hover
- Width: Adjustable sidebar width
- Transparency: Background transparency settings

### Time Display Settings
- Time Format: 12/24-hour format
- Display Options: Month/Day, Week, Lunar calendar, etc.
- Font Styles: Size, color, weight

### Layout Settings
- Minimalist Mode: Simplified interface elements
- Daily Quotes: Show/Hide
- Icon Settings: Size, spacing, border radius

## 🎯 Usage Guide

### Adding Bookmarks
1. Click the "+" button in the sidebar
2. Fill in bookmark information (title, URL, icon)
3. Select category and color
4. Save the bookmark

### Customizing Categories
1. Right-click on category labels
2. Select "Edit Category"
3. Modify category name and icon
4. Save settings

### Adjusting Layout
1. Access settings interface
2. Adjust component positions and sizes
3. Save layout configuration

## 🔄 Data Storage

The application uses browser local storage to save user configurations:
- Bookmark data
- Sidebar settings
- Time display settings
- Layout preferences

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

We welcome issues and pull requests to improve the project.

## 📞 Contact

For questions or suggestions, please contact us through:
- Submit GitHub Issues
- Email the development team

---

**OpenNav - Making every new tab a starting point for efficient work**
