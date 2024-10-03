"use client"
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';

const Comparison: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { name: "Processing Speed", oldWay: "Hours", newWay: "Seconds", description: "Analyze data in seconds instead of hours" },
    { name: "AI Analysis", oldWay: false, newWay: true, description: "Leverage cutting-edge AI for deeper insights" },
    { name: "Data Insights", oldWay: "Limited", newWay: "Comprehensive", description: "Get a 360° view of your data" },
    { name: "URL Integration", oldWay: false, newWay: true, description: "Seamlessly analyze any web content" },
    { name: "Scalability", oldWay: "Low", newWay: "High", description: "Grow your analysis capabilities with your business" },
    { name: "Real-time Updates", oldWay: false, newWay: true, description: "Stay up-to-date with live data feeds" },
  ];

  const FeatureRow: React.FC<{ feature: typeof features[0], index: number }> = ({ feature, index }) => (
    <div 
      className={`grid grid-cols-3 gap-4 py-4 px-6 border-b transition-all duration-300 ${hoveredFeature === index ? 'bg-orange-50' : ''}`}
      onMouseEnter={() => setHoveredFeature(index)}
      onMouseLeave={() => setHoveredFeature(null)}
    >
      <div className="font-medium flex items-center">
        <Sparkles className={`h-6 w-6 mr-3 ${hoveredFeature === index ? 'text-orange-500' : 'text-gray-400'}`} />
        {feature.name}
      </div>
      <div className="text-center">
        {typeof feature.oldWay === 'boolean' ? (
          feature.oldWay ? <Check className="inline h-6 w-6 text-green-500" /> : <X className="inline h-6 w-6 text-red-500" />
        ) : (
          feature.oldWay
        )}
      </div>
      <div className="text-center">
        {typeof feature.newWay === 'boolean' ? (
          feature.newWay ? <Check className="inline h-6 w-6 text-green-500" /> : <X className="inline h-6 w-6 text-red-500" />
        ) : (
          <span className="font-semibold text-blue-600">{feature.newWay}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white text-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center bg-clip-text text-orange-600 mb-6">
            Revolutionize Your Workflow
          </h2>
          <p className="text-xl md:text-2xl text-center text-gray-600 max-w-3xl">Experience the power of AI-driven analysis</p>
        </div>
        
        <Card className="overflow-hidden shadow-2xl border-4 border-orange-600 hover:shadow-3xl mx-auto w-full max-w-7xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-orange-600 to-orange-800 p-6 font-semibold text-white text-lg">
              <div>Feature</div>
              <div className="text-center">Traditional Method</div>
              <div className="text-center">Our SaaS Solution</div>
            </div>
            {features.map((feature, index) => (
              <FeatureRow key={index} feature={feature} index={index} />
            ))}
          </CardContent>
        </Card>

        {hoveredFeature !== null && (
          <div className="mt-6 text-center animate-fadeIn">
            <p className="text-xl text-gray-700">{features[hoveredFeature].description}</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-orange-800 text-white border-none hover:from-orange-600 hover:to-pink-600 transition-all duration-300 px-8 py-4 text-xl"
          >
            Get Started <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comparison;