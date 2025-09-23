import { useState, useEffect } from 'react';
import { useTheme } from "../contexts/ThemeContext.js";
// @ts-ignore - react-joyride types may not be available
import Joyride from "react-joyride";

// Extend window interface for global functions
declare global {
  interface Window {
    startCognovaTour?: () => void;
  }
}

interface JoyrideStep {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface JoyrideCallbackData {
  status: string;
  index?: number;
  action?: string;
}

const STATUS = {
  FINISHED: 'finished',
  SKIPPED: 'skipped'
};

export default function OnboardingTour(){
  const [run, setRun] = useState(false);
  const { theme } = useTheme();

  const steps: JoyrideStep[] = [
    {
      target: '.chat-root',
      content: 'Welcome to Cognova! This is where you can chat with AI therapists. Each therapist has a different specialty to help with your mental health journey.',
      placement: 'bottom' as const
    },
    {
      target: '.journal-section',
      content: 'Your personal journal entries appear here. Click on any entry to view the full content, tags, and mood tracking.',
      placement: 'left' as const
    },
    {
      target: 'aside',
      content: 'Your past therapy sessions are listed here. Click on any session to review your conversation history.',
      placement: 'right' as const
    },
    {
      target: 'header',
      content: 'Use the top bar to start new conversations or access your profile. You can always restart this tour by clicking "Show Tour".',
      placement: 'bottom' as const
    }
  ];

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('cognova_onboard_shown');
    if (!hasSeenTour) {
      // Small delay to ensure components are mounted and theme is applied
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to start tour manually (preserves theme)
  const startTour = () => {
    setRun(true);
  };

  // Make startTour available globally for theme persistence
  useEffect(() => {
    (window as any).startCognovaTour = startTour;
    return () => {
      delete (window as any).startCognovaTour;
    };
  }, []);

  const handleJoyrideCallback = (data: JoyrideCallbackData) => {
    const { status } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem('cognova_onboard_shown', 'true');
      setRun(false);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={true}
        scrollToFirstStep={true}
        scrollOffset={100}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#FF7900',
            backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
            textColor: theme === 'dark' ? '#ffffff' : '#000000',
            overlayColor: 'rgba(0, 0, 0, 0.8)',
          },
          tooltip: {
            backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            border: `1px solid rgba(255, 121, 0, 0.3)`,
            borderRadius: '8px',
          },
          buttonNext: {
            backgroundColor: '#FF7900',
            color: '#000000',
            fontWeight: 'bold',
          },
          buttonBack: {
            color: '#FF7900',
          },
          buttonSkip: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          },
          beacon: {
            backgroundColor: '#FF7900',
          },
          beaconInner: {
            backgroundColor: '#FF7900',
          },
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Finish Tour',
          next: 'Next',
          skip: 'Skip Tour'
        }}
        floaterProps={{
          hideArrow: false,
        }}
        beaconComponent={(props: any) => (
          <div 
            {...props}
            className="joyride-beacon"
            style={{
              ...props.style,
              backgroundColor: '#FF7900',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '4px solid rgba(255, 121, 0, 0.3)',
              cursor: 'pointer',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 0 0 rgba(255, 121, 0, 0.7)'
            }}
          />
        )}
      />
      
      {/* Custom Curved Arrow and Click Here Text - positioned dynamically */}
      {run && (
        <style>{`
          .joyride-beacon {
            position: relative;
          }
          .joyride-beacon::after {
            content: '';
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 15px 30px 15px;
            border-color: transparent transparent #FF7900 transparent;
            filter: drop-shadow(0 0 3px rgba(255, 121, 0, 0.5));
            animation: arrowBounce 1.5s ease-in-out infinite;
          }
          .joyride-beacon::before {
            content: 'Click Here';
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF7900;
            color: #000;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            animation: textPulse 1.5s ease-in-out infinite;
            box-shadow: 0 2px 8px rgba(255, 121, 0, 0.3);
          }
          @keyframes arrowBounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-10px); }
          }
          @keyframes textPulse {
            0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
          }
        `}</style>
      )}
    </>
  );
}