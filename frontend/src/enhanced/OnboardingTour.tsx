import React, { useEffect, useState } from "react";
// @ts-ignore - react-joyride types may not be available
import Joyride from "react-joyride";

interface JoyrideStep {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

interface JoyrideCallbackData {
  status: string;
  type: string;
}

const STATUS = {
  FINISHED: 'finished',
  SKIPPED: 'skipped'
};

export default function OnboardingTour(){
  const [run, setRun] = useState(false);

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
      // Small delay to ensure components are mounted
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: JoyrideCallbackData) => {
    const { status, type } = data;
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem('cognova_onboard_shown', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      disableOverlayClose={true}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#FF7900',
          backgroundColor: '#0a0a0a',
          textColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
        },
        tooltip: {
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          border: '1px solid rgba(255, 121, 0, 0.3)',
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
          color: '#9ca3af',
        },
      }}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish Tour',
        next: 'Next',
        skip: 'Skip Tour'
      }}
    />
  );
}