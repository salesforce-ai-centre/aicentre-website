'use client';

import { useChat } from '@/contexts/ChatContext';
import { Sparkles } from 'lucide-react';

const goals = [
  { label: "Executive AI alignment", message: "Recommend an engagement for executive AI alignment" },
  { label: "Upskill technical teams", message: "What tier and format works for upskilling a technical team?" },
  { label: "Drive consensus", message: "Help me plan an engagement to drive consensus around AI adoption" },
  { label: "Explore use cases", message: "My customer wants to explore Agentforce use cases — what do you recommend?" },
];

export default function AIRecommendation() {
  const { openChatWithMessage } = useChat();

  return (
    <section className="py-20 section-padding">
      <div className="container-max">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles size={18} className="text-accent" />
          </div>
          <h2 className="font-sans font-bold text-h2 text-ink mb-2">
            Not sure where to start?
          </h2>
          <p className="text-ink-secondary text-sm mb-8">
            Tell Agent Eric your goals and get a personalised recommendation
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {goals.map((goal) => (
              <button
                key={goal.label}
                onClick={() => openChatWithMessage(goal.message)}
                className="border border-border hover:border-accent text-ink-secondary hover:text-accent px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
