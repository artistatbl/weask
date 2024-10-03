'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Brain, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { step: 1, title: 'Enter URL', description: 'Input the target website URL', icon: Zap },
    { step: 2, title: 'AI Analysis', description: 'Advanced AI scans and processes content', icon: Brain },
    { step: 3, title: 'Interactive Chat', description: 'Engage in real-time, intelligent conversation', icon: MessageCircle }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center">
      <div className="container mx-auto">
        <h2 className="text-4xl font-extrabold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">
          How It Works
        </h2>
        <div className="relative overflow-hidden">
          <div className="flex justify-center items-center">
            <Button variant="ghost" onClick={prevStep} className="text-orange-400 hover:text-orange-300">
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full max-w-md"
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Badge variant="secondary" className="mb-6 text-lg font-semibold bg-gradient-to-r from-orange-400 to-pink-600 text-white">
                      Step {steps[currentStep].step}
                    </Badge>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {React.createElement(steps[currentStep].icon, { className: "w-16 h-16 mb-4 text-orange-500" })}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-orange-400">{steps[currentStep].title}</h3>
                    <p className="text-gray-300">{steps[currentStep].description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            <Button variant="ghost" onClick={nextStep} className="text-orange-400 hover:text-orange-300">
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentStep ? 'bg-orange-500' : 'bg-gray-600'
              }`}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;