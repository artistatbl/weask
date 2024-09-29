import React from 'react';

const Benefits = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-indigo-600 dark:text-indigo-300">Amazing Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚀', title: 'Lightning Fast', description: 'Get instant answers to your questions' },
            { icon: '🧠', title: 'AI-Powered', description: 'Leverage cutting-edge AI technology' },
            { icon: '🎨', title: 'User-Friendly', description: 'Intuitive interface for seamless experience' }
          ].map((benefit, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;