"use client"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Server, Cpu, Globe, BarChart3, RefreshCw } from 'lucide-react';

const Comparison = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { name: "Lightning-Fast Processing", oldWay: "Hours of waiting", newWay: "Results in seconds", icon: Zap },
    { name: "Advanced AI Analysis", oldWay: "Manual data crunching", newWay: "AI-powered insights", icon: Cpu },
    { name: "Comprehensive Insights", oldWay: "Fragmented view", newWay: "360° data perspective", icon: BarChart3 },
    { name: "Seamless Integration", oldWay: "Complex setup process", newWay: "One-click connections", icon: Globe },
    { name: "Unlimited Scalability", oldWay: "Performance bottlenecks", newWay: "Grow without limits", icon: Server },
    { name: "Real-Time Updates", oldWay: "Outdated information", newWay: "Always current data", icon: RefreshCw },
  ];

  return (
    <div className="bg-white  text-gray-800 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-center mb-12 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
            Revolutionize
          </span>
          <br />
          Your Data Analysis
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-100 rounded-full z-0 animate-pulse"></div>
        </h1>
        
        <div className="grid md:grid-cols-5 gap-8 relative">
          <Card className="md:col-span-2 bg-gray-50 border border-orange-300 shadow-xl hover:shadow-2xl transition-all duration-300 z-10">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-orange-600">Cutting-Edge Features</h2>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <Button
                    key={index}
                    variant={activeFeature === index ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left rounded-lg transition-all duration-300 ${
                      activeFeature === index ? 'bg-orange-100 text-orange-600 shadow-md' : 'hover:bg-orange-50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <feature.icon className={`mr-3 h-5 w-5 ${activeFeature === index ? 'text-orange-500' : 'text-gray-400'}`} />
                    {feature.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-300 shadow-xl overflow-hidden z-10">
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 z-0"></div>
              <div className="relative z-10">
                <div className="bg-white rounded-full p-4 inline-block mb-6 shadow-lg">
                  {React.createElement(features[activeFeature].icon, { className: "h-10 w-10 text-orange-500" })}
                </div>
                <h3 className="text-3xl font-bold mb-4 text-orange-600">{features[activeFeature].name}</h3>
                <p className="text-xl text-gray-700 mb-6">{features[activeFeature].newWay}</p>
              </div>
              <div className="bg-white bg-opacity-60 p-6 rounded-lg border border-orange-200 shadow-inner relative z-10">
                <h4 className="text-sm font-semibold uppercase mb-2 text-orange-600">Traditional Approach</h4>
                <p className="text-gray-600 text-lg">{features[activeFeature].oldWay}</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-50 rounded-full z-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;