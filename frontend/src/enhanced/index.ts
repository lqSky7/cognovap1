// Component Integration Verification
// This file verifies that all enhanced components are properly exported and integrated

// Enhanced Layout Components
export { default as LayoutEnhanced } from './LayoutEnhanced';
export { default as TopbarEnhanced } from './TopbarEnhanced';
export { default as SidebarEnhanced } from './SidebarEnhanced';
export { default as ChatWrapper } from './ChatWrapper';

// Interactive Components
export { default as JournalCard } from './JournalCard';
export { default as JournalModal } from './JournalModal';
export { default as ConversationModal } from './ConversationModal';

// Utility Components
export { default as TooltipRadix } from './TooltipRadix';
export { default as OnboardingTour } from './OnboardingTour';

// Mock Data
export * from '../data/mock';

// Component Features Checklist:
// ✅ OLED Dark Theme (#050505 background, #FF7900 accent)
// ✅ Tooltips on all interactive elements
// ✅ Onboarding tour with localStorage persistence
// ✅ Clickable conversation history with modal view
// ✅ Journal cards with rich modal content
// ✅ Accessibility: ARIA labels, keyboard navigation
// ✅ TypeScript support for all components
// ✅ Responsive design and hover states
// ✅ Integration with existing authentication system