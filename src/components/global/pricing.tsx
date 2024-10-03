"use client"
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const PricingComponent = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plan = {
    name: 'Pro Plan',
    monthlyPrice: 7.99,
    yearlyPrice: 39.99,
    features: [
      'Unlimited Users',
      'Unlimited Storage',
      'Priority Support',
      'Advanced Analytics',
      'Custom Integrations',
      'API Access'
    ],
  };

  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const billing = isYearly ? 'year' : 'month';

  return (
    <div className="flex flex-col items-center  p-8  text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Choose Your Plan</h1>
      
      <div className="flex items-center space-x-4 mb-8">
        <span className={`font-semibold ${!isYearly ? 'text-orange-600' : 'text-gray-600'}`}>Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="bg-blue-300"
        />
        <span className={`font-semibold ${isYearly ? 'text-orange-600' : 'text-gray-600'}`}>Yearly</span>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white border  border-orange-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-orange-600 text-white">
            <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
            <p className="text-5xl font-bold">
              ${price.toFixed(2)}
              <span className="text-lg font-normal">/{billing}</span>
            </p>
            {isYearly && (
              <p className="mt-2 text-orange-200">Save ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)} annually</p>
            )}
          </div>
          <div className="px-8 py-8">
            <ul className="mb-8 ">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center mb-4">
                  <Check className="mr-3 text-orange-500" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;