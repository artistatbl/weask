'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MessageSquare, Database, Zap, Send, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Input URL',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div className="flex items-center bg-white rounded-lg shadow-inner p-3">
            <input 
              type="text" 
              placeholder="https://example.com" 
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              disabled
            />
          </div>
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            <Zap className="mr-2 h-5 w-5" />
            Initiate Analysis
          </Button>
        </div>
      )
    },
    {
      title: 'AI Processing',
      icon: Database,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-orange-600 rounded animate-pulse"></div>
            <div className="h-3 bg-orange-500 rounded animate-pulse w-5/6"></div>
            <div className="h-3 bg-orange-400 rounded animate-pulse w-4/6"></div>
            <div className="h-3 bg-orange-300 rounded animate-pulse w-3/6"></div>
          </div>
          <p className="text-orange-600">AI algorithms processing website data...</p>
          <div className="flex justify-between text-sm text-gray-600">
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
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-orange-100 rounded-lg p-3 max-w-xs">
              <p className="text-sm">What&apos;s the main focus of this website?</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3 max-w-xs ml-auto">
              <p className="text-sm">The website primarily focuses on eco-friendly tech products, featuring 15 items across 4 categories.</p>
            </div>
          </div>
          <div className="flex bg-white rounded-lg shadow-inner">
            <input 
              type="text" 
              placeholder="Ask about the analyzed content..." 
              className="flex-grow p-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              disabled
            />
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Send className="mr-2 h-4 w-4"/>
              Send
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 relative">
          How It <span className="text-orange-600">Works</span>
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-orange-100 rounded-full z-0 animate-pulse opacity-50"></div>
        </h1>
        
        <div className="grid md:grid-cols-5 gap-8 relative">
          <Card className="md:col-span-3 bg-orange-100 border-2 border-orange-200 shadow-xl overflow-hidden z-10 rounded-2xl">
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-100 rounded-full -ml-16 -mt-16 z-0 opacity-50"></div>
              <div className="relative z-10">
                <div className="bg-orange-100 rounded-full p-4 inline-block mb-6 shadow-lg">
                  {React.createElement(steps[activeStep].icon, { className: "h-10 w-10 text-orange-600" })}
                </div>
                <h3 className="text-3xl font-bold mb-4 text-orange-600">{steps[activeStep].title}</h3>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[activeStep].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 z-10 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-orange-600">Process Steps</h2>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <Button
                    key={index}
                    variant={activeStep === index ? "secondary" : "ghost"}
                    className={`w-full justify-between text-left rounded-lg transition-all duration-300 ${
                      activeStep === index ? 'bg-orange-100 text-orange-600 shadow-md' : 'hover:bg-orange-50'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <span className="flex items-center">
                      <step.icon className={`mr-3 h-5 w-5 ${activeStep === index ? 'text-orange-500' : 'text-gray-400'}`} />
                      {step.title}
                    </span>
                    {activeStep === index && <ArrowRight className="h-5 w-5" />}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-100 rounded-full z-0 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;