"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, TrendingUp, Shield, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TechSaasShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const benefits = [
    { title: "AI-Powered Insights", description: "Harness the power of machine learning for deep analytical understanding.", icon: Lightbulb, color: "from-purple-500 to-indigo-600" },
    { title: "Real-Time Processing", description: "Lightning-fast data analysis that keeps pace with your business.", icon: Zap, color: "from-yellow-400 to-orange-500" },
    { title: "Predictive Analytics", description: "Forecast trends and make data-driven decisions with ease.", icon: TrendingUp, color: "from-green-400 to-cyan-500" },
    { title: "Enterprise-Grade Security", description: "Bank-level encryption and advanced threat detection.", icon: Shield, color: "from-red-500 to-pink-600" },
    { title: "Workflow Automation", description: "Streamline processes and boost productivity across your organization.", icon: Clock, color: "from-blue-400 to-indigo-500" },
    { title: "Seamless Integration", description: "Connect with your existing tech stack effortlessly.", icon: Users, color: "from-teal-400 to-green-500" },
  ];

  return (
    <div className=" bg-white   text-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Animated background */}
        <div className="absolute inset-0  overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full mix-blend-multiply filter  animate-blob"
                style={{
                  backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.1)`,
                  width: `${Math.random() * 400 + 100}px`,
                  height: `${Math.random() * 400 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-12 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Workflow</span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveIndex(index)}
            >
              <Card className={cn(
                "cursor-pointer transition-all text-black duration-300 overflow-hidden group",
                "bg-white border-orange-600 hover:bg-orange-100",
                index === activeIndex && "ring-2 ring-orange-500"
              )}>
                <CardContent className="p-6">
                  <div className={cn(
                    "w-16 h-16 rounded-full mb-4 flex items-center justify-center text-black",
                    `bg-gradient-to-br ${benefit.color}`
                  )}>
                    {React.createElement(benefit.icon, { size: 32 })}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-black">{benefit.description}</p>
                  <ArrowRight className="mt-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

       
       

      
      </div>
    </div>
  );
};

export default TechSaasShowcase;