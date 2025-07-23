'use client';

import type { FAQ as FaqType } from '@/types/content';
import { useEffect, useState } from 'react';
import { getFAQs } from '@/lib/content';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [faqData, setFaqData] = useState<FaqType[]>([]);

  useEffect(() => {
    getAllFaqs();
  }, []);

  const getAllFaqs = async () => {
    const faqs = await getFAQs();
    setFaqData(faqs);
  }

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const processAnswerText = (text: string) => {
    // Replace #ai-centre-uk with a clickable link
    const parts = text.split(/(#ai-centre-uk)/g);
    return parts.map((part, index) => {
      if (part === '#ai-centre-uk') {
        return (
          <a
            key={index}
            href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline underline-offset-2 decoration-blue-300/50 hover:decoration-blue-200 transition-colors font-semibold"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16 fade-in">
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-white bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <p className="text-xl md:text-2xl text-white text-opacity-80 max-w-3xl mx-auto leading-relaxed">
          Get answers to common questions about our offerings
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item) => (
          <div 
            key={item.id} 
            className="bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 overflow-hidden fade-in smooth-hover"
          >
            <button
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white hover:bg-opacity-5 smooth-hover"
              onClick={() => toggleItem(item.id)}
            >
              <span className="text-lg font-semibold text-white pr-4">
                {item.question}
              </span>
              <div className="flex-shrink-0 ml-4">
                {openItems.includes(item.id) ? (
                  <ChevronDown className="w-5 h-5 text-blue-300" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white text-opacity-60" />
                )}
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-out ${
              openItems.includes(item.id) 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-5">
                <div className="border-t border-white border-opacity-10 pt-4">
                  <p className="text-white text-opacity-90 leading-relaxed">
                    {processAnswerText(item.answer)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-white bg-opacity-10 rounded-full px-6 py-3 border border-white border-opacity-20">
          <span className="text-white text-opacity-80">Still have questions?</span>
          <a
            href="https://salesforce.enterprise.slack.com/archives/C080TP9HENQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
          >
            Ask us on Slack
          </a>
        </div>
      </div>
    </div>
  );
}