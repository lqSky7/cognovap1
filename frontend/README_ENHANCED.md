# Cognova Frontend - Enhanced UI/UX

## Latest Updates

### 🎨 Site-wide UI/UX Modernization (Latest)

We've completely modernized the Cognova interface with a polished OLED dark theme and interactive enhancements:

#### 🌟 Key Features Added
- **OLED Dark Theme**: Deep black (#050505) background with vibrant orange (#FF7900) accents
- **Interactive Tooltips**: Hover descriptions on all interactive elements with keyboard navigation support
- **Onboarding Tour**: First-time user walkthrough with the ability to replay from the topbar
- **Conversation History**: Clickable past sessions that open detailed conversation modals
- **Enhanced Journal**: Journal cards open rich modals showing full content, tags, and mood tracking
- **Full Accessibility**: ARIA labels, keyboard navigation, and focus management

#### 🚀 How to Run

**Prerequisites:**
- Node.js (v16 or higher)
- Git Bash (required for npm commands)

**Local Development:**
```bash
# Using Git Bash (required)
cd cognovap1/frontend
npm install
npm run dev

# Open http://localhost:5173 in your browser
```

#### 🎯 New Interactive Components

1. **Enhanced Layout** (`src/enhanced/LayoutEnhanced.tsx`)
   - Modern OLED theme with orange accents
   - Grid-based layout with chat and journal sections
   - Integrated tooltips and modals

2. **Smart Sidebar** (`src/enhanced/SidebarEnhanced.tsx`)
   - Clickable conversation history
   - User profile integration
   - Tooltips on all interactive elements

3. **Journal System** (`src/enhanced/JournalCard.tsx` + `JournalModal.tsx`)
   - Card-based journal entry display
   - Full-screen modal with mood tracking
   - Tag system and attachment placeholders

4. **Onboarding Tour** (`src/enhanced/OnboardingTour.tsx`)
   - React Joyride integration
   - Customized styling to match theme
   - Persistent state in localStorage

5. **Accessibility** 
   - Full keyboard navigation support
   - ARIA labels and roles
   - Focus management for modals
   - High contrast tooltips

#### 🎨 Theme Colors
- **Primary Background**: `#050505` (OLED black)
- **Surface**: `#0a0a0a` (OLED surface)
- **Accent**: `#FF7900` (Vibrant orange)
- **Muted Text**: `#9ca3af` (Gray)

#### 📱 Responsive Design
- Desktop-first approach
- Grid layouts that adapt to screen size
- Mobile-optimized tooltips and modals

#### 🔧 Technology Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible tooltips and dialogs
- **React Joyride** for onboarding tours
- **Framer Motion** for smooth animations

---

## Original Setup Instructions

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Original UI components
├── enhanced/           # New enhanced UI components
├── data/               # Mock data and types
├── services/           # API integration
└── lib/                # Utilities
```

## API Integration

The frontend integrates with the Cognova backend API for:
- User authentication
- Conversation management
- Journal entries
- AI therapy sessions

Backend endpoint: `http://localhost:5003/api`

## Features

### Authentication
- User registration and login
- Session management
- Profile updates

### AI Therapy Chat
- Multiple AI therapist personalities
- Real-time streaming responses
- Conversation history

### Journal System
- Mood tracking
- Tag organization
- AI integration for therapy sessions

### Analytics
- Progress tracking
- Mood visualization
- Session insights

---

*For deployment to Vercel, connect your GitHub repository and Vercel will automatically build and deploy the application.*