import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-teal-600 dark:text-teal-300">How It Works</h2>
        <div className="flex flex-col items-center">
          {[
            { step: 1, title: 'Enter URL', description: 'Paste the website URL you want to chat with' },
            { step: 2, title: 'AI Analysis', description: 'Our AI quickly analyzes the website content' },
            { step: 3, title: 'Start Chatting', description: 'Ask questions and get instant, accurate answers' }
          ].map((step, index) => (
            <div key={index} className="flex items-center mb-8 last:mb-0">
              <div className="bg-teal-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                {step.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;