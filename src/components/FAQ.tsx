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
    const parts = text.split(/(#ai-centre-uk)/g);
    return parts.map((part, index) => {
      if (part === '#ai-centre-uk') {
        return (
          <a
            key={index}
            href="https://salesforce.enterprise.slack.com/archives/C08E6SK1TFU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-dark underline underline-offset-2 decoration-accent/50 hover:decoration-accent transition-colors font-semibold"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-serif text-h2 text-ink mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-ink-secondary max-w-2xl mx-auto">
          Get answers to common questions about our offerings
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-surface-elevated border border-border rounded-xl overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-muted transition-colors duration-200"
              onClick={() => toggleItem(item.id)}
            >
              <span className="text-base font-medium text-ink pr-4">
                {item.question}
              </span>
              <div className="flex-shrink-0 ml-4">
                {openItems.includes(item.id) ? (
                  <ChevronDown className="w-5 h-5 text-accent" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-ink-tertiary" />
                )}
              </div>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-out ${
              openItems.includes(item.id)
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-5">
                <div className="border-t border-border pt-4">
                  <p className="text-ink-secondary leading-relaxed">
                    {processAnswerText(item.answer)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-surface-muted rounded-full px-5 py-2.5 border border-border">
          <span className="text-ink-secondary text-sm">Still have questions?</span>
          <a
            href="https://salesforce.enterprise.slack.com/archives/C08E6SK1TFU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-dark font-semibold text-sm transition-colors"
          >
            Ask us on Slack
          </a>
        </div>
      </div>
    </div>
  );
}
