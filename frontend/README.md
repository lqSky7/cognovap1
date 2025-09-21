# Cognova Frontend 🧠

A modern, responsive React-based frontend for Cognova - an AI-powered mental health companion platform.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Dual Theme Support**: Toggle between OLED dark (#050505) and clean light themes
- **Responsive Design**: Adapts to all screen sizes and devices
- **Smooth Animations**: Polished transitions and micro-interactions
- **Professional Typography**: Consistent styling with excellent readability

### 🤖 **AI Chat Interface**
- **Multiple AI Therapists**: Choose from Supportive, Analytical, Creative, CBT, and Jungian AI therapists
- **Real-time Streaming**: Live conversation with AI responses
- **Chat History**: View and manage past conversation sessions
- **Theme-aware Interface**: Proper contrast in both light and dark modes

### 📱 **Collapsible Sidebar (ChatGPT Style)**
- **Smart Collapse**: Expand/collapse sidebar for more screen real estate
- **Icon-only Mode**: Essential functions accessible when collapsed
- **Smooth Animations**: 200ms transitions for professional feel
- **Context Awareness**: Content adapts to sidebar state

### 🌟 **Wellness Journey**
- **Mood Tracking**: Visual mood trends with 7-day history charts
- **Achievement System**: Unlockable badges and milestones
- **Progress Statistics**: Average mood, streak days, session counts
- **Weekly Insights**: AI-generated progress summaries

### 📝 **Smart Journaling**
- **Interactive Journal Cards**: Rich preview of journal entries
- **Modal Detail View**: Full journal reading experience
- **Demo Content**: Sample entries for exploration
- **Integration Ready**: Prepared for backend data persistence

### 🔔 **Notifications System**
- **Real-time Alerts**: Sample notification system with unread badges
- **Multiple Types**: Info, success, warning, and feature notifications
- **Mark as Read**: Individual and bulk read management
- **Smooth Panel**: Elegant slide-in notification center

### ⚙️ **Comprehensive Settings**
- **Multi-tab Interface**: Organized settings across 5 categories
- **Theme Management**: Integrated light/dark mode controls
- **AI Preferences**: Customize AI therapist behavior and responses
- **Privacy Controls**: Data sharing and analytics preferences
- **Journal Settings**: Auto-save, reminders, and mood tracking options

### 👤 **Enhanced Profile Management**
- **Demo Mode Indicators**: Clear messaging about sample data
- **Quick Access Menu**: Direct navigation to main features
- **Guest Experience**: Comprehensive preview of platform capabilities
- **Authentication Ready**: Prepared for user login integration

### 🎯 **Conditional Content Display**
- **Smart Layout**: Journal and wellness hide during focused chat sessions
- **Mode Switching**: Seamless transition between main and chat views
- **Responsive Grid**: Adapts from 4-column to 1-column layouts
- **Context Preservation**: Maintains state across view changes

## 🛠️ **Technology Stack**

### Core Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Fast build tool with hot module replacement

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with custom OLED theme
- **Radix UI** - Accessible component primitives for tooltips and dialogs
- **Custom Components** - Professionally designed component library

### State Management
- **React Context** - Theme management and application state
- **Local State** - Component-level state management with hooks

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefix handling

## 🚀 **Getting Started**

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- **Git Bash** (for Windows users)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognovap1/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

## 📁 **Project Structure**

```
src/
├── components/          # Core UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── chat-interface-fullscreen.tsx
│   ├── journal-page.tsx
│   └── ...
├── enhanced/           # Enhanced UI components
│   ├── LayoutEnhanced.tsx      # Main layout with sidebar
│   ├── SidebarEnhanced.tsx     # Collapsible sidebar
│   ├── TopbarEnhanced.tsx      # Header with notifications
│   ├── ChatWrapper.tsx         # Chat interface wrapper
│   ├── WellnessJourney.tsx     # Wellness dashboard
│   ├── NotificationsPanel.tsx  # Notification system
│   ├── SettingsPanel.tsx       # Settings interface
│   └── ...
├── contexts/           # React contexts
│   ├── ThemeContext.tsx        # Theme management
│   └── AppContext.tsx          # Application state
├── data/              # Mock data and types
│   └── mock.js        # Sample data for demo mode
├── services/          # API services
│   └── api.ts         # API client and types
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
└── App.tsx            # Main application component
```

## 🎨 **Design System**

### Color Palette
- **Primary Orange**: `#FF7900` - Brand color and accents
- **OLED Dark**: `#050505` - Deep black for dark theme
- **Success Green**: Various green shades for positive actions
- **Warning/Error**: Standard warning and error colors

### Typography
- **Font Family**: System fonts for optimal performance
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Sizes**: Responsive typography scale from xs to 6xl

### Spacing
- **Grid System**: 4-column responsive grid layout
- **Spacing Scale**: 0.25rem increments following Tailwind conventions
- **Margins/Padding**: Consistent spacing throughout components

## 🔧 **Configuration**

### Theme Configuration
The application supports dual themes configured in `src/contexts/ThemeContext.tsx`:
- **Dark Theme**: OLED black background with orange accents
- **Light Theme**: Clean white background with proper contrast
- **Persistence**: Theme preference saved to localStorage

### Tailwind Configuration
Custom theme configuration in `tailwind.config.js`:
- OLED color definitions
- Custom spacing and typography
- Dark mode support
- Custom component styles

## 🌟 **Key Components**

### LayoutEnhanced
Main layout component providing:
- Collapsible sidebar integration
- Conditional content display
- Theme-aware styling
- Responsive grid management

### SidebarEnhanced
Advanced sidebar with:
- Collapse/expand functionality
- Chat session history
- Settings access
- User profile integration

### NotificationsPanel
Notification system featuring:
- Sample notification data
- Unread badge management
- Mark as read functionality
- Smooth slide-in animation

### SettingsPanel
Comprehensive settings interface:
- Multi-tab organization
- Theme controls
- AI preferences
- Privacy settings
- Journal configuration

## 🎭 **Demo Mode**

The frontend includes a comprehensive demo mode that showcases all features:

### Sample Data
- **Chat Sessions**: 5 realistic conversation examples
- **Journal Entries**: Various mood and reflection entries
- **Wellness Stats**: Mood trends, achievements, and progress
- **Notifications**: Different types of platform notifications

### Demo Indicators
- Clear "Demo" badges throughout the interface
- Informative messages about sample data
- Explanations of full functionality when backend connects

## 🔗 **Backend Integration**

The frontend is prepared for backend integration with:

### API Structure
- **Authentication**: Login/logout endpoints ready
- **Chat Interface**: Streaming conversation API
- **Journal System**: CRUD operations for entries
- **User Management**: Profile and preferences
- **Wellness Data**: Mood tracking and statistics

### Data Flow
- **Real-time Updates**: WebSocket support for live features
- **State Management**: Context-based state for user data
- **Error Handling**: Graceful fallbacks and error states

## 🚀 **Production Deployment**

### Build Process
```bash
npm run build
```

### Build Output
- Optimized bundle with code splitting
- Static assets with proper caching headers
- Source maps for debugging (optional)

### Deployment Options
- **Vercel**: Optimized for React applications
- **Netlify**: Simple static site deployment
- **AWS S3 + CloudFront**: Enterprise-grade hosting
- **Traditional Web Servers**: Apache, Nginx compatible

## 🤝 **Contributing**

### Development Guidelines
1. **Code Style**: Follow existing TypeScript and React patterns
2. **Component Structure**: Use functional components with hooks
3. **Styling**: Utilize Tailwind CSS classes consistently
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Performance**: Optimize for mobile and slow connections

### Adding New Features
1. Create components in appropriate directories
2. Follow existing naming conventions
3. Include TypeScript interfaces
4. Add demo data if applicable
5. Update this README if significant

## 📝 **License**

This project is part of the Cognova platform. Please refer to the main repository for licensing information.

## 🆘 **Support**

For questions or issues:
1. Check existing documentation
2. Review component examples in the codebase
3. Refer to the main Cognova repository for backend integration
4. Contact the development team for specific implementation questions

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**