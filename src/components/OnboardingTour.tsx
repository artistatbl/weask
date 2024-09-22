'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

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

    if (isChatPage && !hasSeenTour) {
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
  }, [pathname]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type, action } = data;
    
    console.log('Joyride callback:', { status, index, type, action });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('Tour finished or skipped');
      setRun(false);
      localStorage.setItem('hasSeenChatTour', 'true');
    } else if (type === 'step:after' || type === 'error:target_not_found') {
      console.log('Moving to next step');
      setStepIndex(prevIndex => Math.min(prevIndex + 1, validSteps.length - 1));
    }
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
      disableOverlayClose
      disableCloseOnEsc
    />
  );
}

export const OnboardingTour = dynamic(() => Promise.resolve(OnboardingTourComponent), {
  ssr: false,
});