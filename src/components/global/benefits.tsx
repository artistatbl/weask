"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, TrendingUp, Shield, Clock, Users, ChevronRight } from 'lucide-react';

const TechSaasShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const benefits = [
    { title: "AI-Powered Insights", description: "Harness the power of machine learning for deep analytical understanding.", icon: Lightbulb },
    { title: "Real-Time Processing", description: "Lightning-fast data analysis that keeps pace with your business.", icon: Zap },
    { title: "Predictive Analytics", description: "Forecast trends and make data-driven decisions with ease.", icon: TrendingUp },
    { title: "Enterprise-Grade Security", description: "Bank-level encryption and advanced threat detection.", icon: Shield },
    { title: "Workflow Automation", description: "Streamline processes and boost productivity across your organization.", icon: Clock },
    { title: "Seamless Integration", description: "Connect with your existing tech stack effortlessly.", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/4 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-12 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Supercharge Your <span className="text-orange-600">Workflow</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 relative">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-6 cursor-pointer transition-all duration-300 bg-white border ${
                index === activeIndex 
                  ? 'border-orange-600 shadow-lg' 
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
              whileHover={{ y: -5 }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {React.createElement(benefit.icon, { 
                    className: `h-6 w-6 mr-3 ${index === activeIndex ? 'text-orange-600' : 'text-gray-400'}` 
                  })}
                  <h3 className={`text-lg font-semibold ${index === activeIndex ? 'text-orange-600' : 'text-gray-700'}`}>
                    {benefit.title}
                  </h3>
                </div>
                <ChevronRight className={`h-5 w-5 ${index === activeIndex ? 'text-orange-600' : 'text-gray-300'}`} />
              </div>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

       

        {/* Tech-inspired decorative element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl opacity-10 pointer-events-none">
          <div className="w-full h-full border-2 border-orange-400 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 w-3/4 h-3/4 border-2 border-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 border-2 border-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );
};

export default TechSaasShowcase;