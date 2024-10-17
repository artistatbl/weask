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
      question: "Why should I add reviews to my website?",
      answer: "Adding reviews to your website can increase trust, provide social proof, and help potential customers make informed decisions."
    },
    {
      question: "Why choose YoReview to add reviews on my website?",
      answer: "YoReview offers easy integration, customizable widgets, and reliable service for showcasing authentic customer reviews on your website."
    },
    {
      question: "Which reviews can I embed on my website for free?",
      answer: "You can embed a certain number of reviews for free with our basic plan. Check our pricing page for more details on free and paid options."
    },
    {
      question: "How can I trust YoReview?",
      answer: "YoReview uses verified review collection methods and has strict policies against fake reviews to ensure authenticity and trustworthiness."
    },
    {
      question: "How to use review widget Component Code?",
      answer: "We provide easy-to-use code snippets for our review widgets. Simply copy the code from your YoReview dashboard and paste it into your website's HTML."
    },
    {
      question: "How can I embed reviews on my website?",
      answer: "You can embed reviews using our customizable widgets. We offer various styles and options to match your website's design."
    },
    {
      question: "On which website can I embed reviews from YoReview?",
      answer: "You can embed YoReview reviews on any website you own or manage, including e-commerce platforms, business websites, and landing pages."
    },
    {
      question: "What to Look for When Customizing Your Customer Review Form?",
      answer: "When customizing your review form, consider factors like ease of use, relevance of questions, and the option for customers to add photos or videos to their reviews."
    }
  ];

  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left gap-8">
          <div className="lg:w-1/3">
          <h2 className="text-3xl font-bold mb-2 text-black max-w-7xl">Frequent questions and answers</h2>

            <p className="text-gray-600">Answers to commonly asked questions about our services/packages</p>
          </div>
          <div className="lg:w-2/3 w-full">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 text-left font-medium text-black hover:bg-orange-50 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 text-gray-700 bg-orange-50">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}