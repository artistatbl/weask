'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';
import { useUser } from '@clerk/nextjs';

const steps: Step[] = [
  {
    target: 'body',
    content: 'Welcome to the NectLink chat! Let us show you around.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.chat-input',
    content: 'Type your messages here to chat with the AI about the website content.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.website-preview',
    content: 'Here you can see a preview of the website you\'re chatting about.',
    placement: 'left',
    disableBeacon: true,
  },
  {
    target: '.ai-response',
    content: 'AI responses will appear here.',
    placement: 'right',
    disableBeacon: true,
  },
  {
    target: '.command-k-hint',
    content: 'Press Cmd+K (Mac) or Ctrl+K (Windows) to quickly access the chat feature from anywhere.',
    placement: 'bottom',
    disableBeacon: true,
  }
];

function OnboardingTourComponent() {
  const { isSignedIn } = useUser();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [validSteps, setValidSteps] = useState<Step[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const isChatPage = pathname && pathname.startsWith('/chat/');
    const hasSeenTour = localStorage.getItem('hasSeenChatTour');
    
    console.log('Current pathname:', pathname);
    console.log('Is chat page:', isChatPage);
    console.log('Has seen tour:', hasSeenTour);
    console.log('Is signed in:', isSignedIn);

    if (isSignedIn && isChatPage && !hasSeenTour) {
      console.log('Starting tour in 2 seconds...');
      setTimeout(() => {
        const filteredSteps = steps.filter(step => 
          step.target === 'body' || document.querySelector(step.target as string)
        );
        setValidSteps(filteredSteps);
        console.log('Valid steps:', filteredSteps);
        setRun(true);
      }, 2000);
    }
  }, [pathname, isSignedIn]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type, action } = data;
    
    console.log('Joyride callback:', { status, index, type, action });

    if ([(STATUS.FINISHED as string), (STATUS.SKIPPED as string)].includes(status as string)) {
      console.log('Tour finished or skipped');
      endTour();
    } else if (type === EVENTS.STEP_AFTER) {
      if (action === 'next') {
        const nextIndex = index + 1;
        if (nextIndex < validSteps.length) {
          setStepIndex(nextIndex);
        } else {
          endTour();
        }
      } else if (action === 'prev') {
        setStepIndex(prevIndex => Math.max(prevIndex - 1, 0));
      }
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + 1;
      if (nextIndex < validSteps.length) {
        setStepIndex(nextIndex);
      } else {
        endTour();
      }
    }

    if (action === 'close' || type === EVENTS.TOUR_END) {
      endTour();
    }
  };

  const endTour = () => {
    setRun(false);
    localStorage.setItem('hasSeenChatTour', 'true');
  };

  console.log('Rendering Joyride with run:', run, 'and stepIndex:', stepIndex);

  return (
    <Joyride
      steps={validSteps}
      run={run}
      continuous
      showSkipButton
      showProgress
      stepIndex={stepIndex}
      styles={{
        options: {
          primaryColor: '#007bff',
          zIndex: 10000,
        },
      }}
      callback={handleJoyrideCallback}
      disableOverlayClose={false}
      disableCloseOnEsc={false}
    />
  );
}

export const OnboardingTour = dynamic(() => Promise.resolve(OnboardingTourComponent), {
  ssr: false,
});