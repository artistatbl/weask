import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Faq() {
  const faqData = [
    {
      question: "What is [Product Name] and how does it work?",
      answer: "[Product Name] is a [brief description]. It works by [explanation of key features or processes]."
    },
    {
      question: "How much does [Product Name] cost?",
      answer: "We offer flexible pricing plans to suit businesses of all sizes. Our plans start at $X/month. Visit our pricing page for more details."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "How secure is my data with [Product Name]?",
      answer: "We take data security seriously. [Product Name] uses industry-standard encryption and security protocols to ensure your data is always protected."
    },
    {
      question: "Can I integrate [Product Name] with other tools?",
      answer: "Absolutely! [Product Name] offers integrations with many popular tools and platforms. Check our integrations page for a full list."
    }
  ];

  return (
    <div className="w-full">
      <section className="w-full py-20 lg:py-24 ">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12 lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4 ">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-orange-600 rounded-lg shadow-sm "
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-gray-900 hover:text-orange-600 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-gray-700">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Still have questions? We're here to help!
            </p>
            <a
              href="#"
              className="inline-block mt-4 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}