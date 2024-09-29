import React from 'react';
import { CheckCircle } from 'lucide-react';

const Pricing = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-pink-600 dark:text-pink-300">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { plan: 'Basic', price: '$9', features: ['100 chats/month', 'Basic support', 'Standard AI model'] },
            { plan: 'Pro', price: '$29', features: ['Unlimited chats', 'Priority support', 'Advanced AI model', 'Custom branding'] },
            { plan: 'Enterprise', price: 'Custom', features: ['Unlimited everything', '24/7 support', 'Dedicated account manager', 'On-premise option'] }
          ].map((tier, index) => (
            <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg ${index === 1 ? 'transform scale-105 border-4 border-pink-500' : ''}`}>
              <h3 className="text-2xl font-bold mb-4">{tier.plan}</h3>
              <div className="text-4xl font-bold mb-6">{tier.price}<span className="text-base font-normal">/mo</span></div>
              <ul className="text-left mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2">
                    <CheckCircle className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;