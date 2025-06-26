'use client';

import { useState } from 'react';
import { getFAQs } from '@/lib/content';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const faqData = getFAQs();

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 fade-in">
        <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-white text-opacity-80">
          Get answers to common questions about our offerings
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item) => (
          <div key={item.id} className="glass-card overflow-hidden fade-in">
            <button
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white hover:bg-opacity-5 transition-colors font-semibold text-white"
              onClick={() => toggleItem(item.id)}
            >
              <span className="pr-4">
                {item.question}
              </span>
              <span className="text-xl">
                {openItems.includes(item.id) ? '−' : '+'}
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openItems.includes(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-5">
                <div className="border-t border-white border-opacity-10 pt-4">
                  <p className="text-white text-opacity-90 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}