'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MessageSquare, ChevronRight, ChevronLeft, Database, Zap, Send } from 'lucide-react';

const HowItWorks = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Input URL',
      icon: Globe,
      content: (
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md border h-[15vh] border-orange-500">
          <div className="flex items-center  bg-gray-200 p-2 rounded">
            <input 
              type="text" 
              placeholder="https://example.com" 
              className="w-full bg-transparent text-green-600 placeholder-gray-500 focus:outline-none text-sm sm:text-base"
              disabled
            />
          </div>
          <button className="mt-10 w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors flex items-center justify-center text-sm sm:text-base">
            <Zap className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Initiate Analysis
          </button>
        </div>
      )
    },
    {
      title: 'AI Processing',
      icon: Database,
      content: (
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md border h-[23vh] border-orange-500">
          <div className="space-y-2">
            <div className="h-3 sm:h-4 bg-orange-600 rounded animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-orange-500 rounded animate-pulse w-5/6"></div>
            <div className="h-3 sm:h-4 bg-orange-400 rounded animate-pulse w-4/6"></div>
            <div className="h-3 sm:h-4 bg-orange-300 rounded animate-pulse w-3/6"></div>
            <div className="h-3 sm:h-4 bg-orange-200 rounded animate-pulse w-2/6"></div>


          </div>
          <p className="mt-8 text-orange-600 text-sm sm:text-base">AI algorithms processing website data...</p>
          <div className="mt-4 flex justify-between text-xs sm:text-sm text-gray-600">
            <span>Analyzing structure</span>
            <span>Extracting content</span>
            <span>Generating insights</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI Interaction',
      icon: MessageSquare,
      content: (
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md border border-orange-500">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-orange-100 rounded-lg p-3 max-w-xs">
                <p className="text-xs sm:text-sm text-black">What's the main focus of this website?</p>
              </div>
            </div>
            <div className="flex items-start justify-end">
              <div className="bg-green-100 rounded-lg p-3 max-w-xs">
                <p className="text-xs sm:text-sm text-black">The website primarily focuses on eco-friendly tech products, featuring 15 items across 4 categories.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex bg-gray-200 rounded">
            <input 
              type="text" 
              placeholder="Ask about the analyzed content..." 
              className="flex-grow p-2 bg-transparent  text-black placeholder-gray-500 focus:outline-none text-xs sm:text-sm"
              disabled
            />
            <button className="bg-orange-600 rounded-sm text-white px-3 py-2 rounded-r hover:bg-orange-700 transition-colors flex items-center text-xs sm:text-sm">
             
              <Send className="mr-1 w-3 h-3 sm:w-4 sm:h-4"/>
              Send
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-10 sm:py-20 px-4 bg-white text-black flex items-center ">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 text-center text-black">
          How It <span className="text-orange-600">Works</span>
        </h2>
        <p className="text-center text-black mb-8 sm:mb-12 max-w-3xl mx-auto text-sm sm:text-base md:text-lg">
          Experience cutting-edge AI-powered web analysis. Journey from URL input to intelligent insights in seconds.
        </p>

        <div className="relative bg-gray-100 rounded-xl shadow-2xl p-4 sm:p-8 border border-orange-500">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= step ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                  index <= step ? 'bg-orange-100' : 'bg-gray-200'
                }`}>
                  {React.createElement(s.icon, { className: "w-4 h-4 sm:w-6 sm:h-6" })}
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium">{s.title}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px] sm:min-h-[250px]"
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 sm:mt-8 flex justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center text-xs sm:text-sm ${
                step === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-orange-600 hover:text-orange-500'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              Previous
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
              className={`flex items-center text-xs sm:text-sm ${
                step === steps.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-orange-600 hover:text-orange-500'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;