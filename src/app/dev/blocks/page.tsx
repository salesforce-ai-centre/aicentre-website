/**
 * /dev/blocks — internal gallery proving BlockRenderer (AIC2-152) renders a
 * hand-authored block list using the real site components. Not linked from
 * navigation; kept permanently as a quick way to preview new block types
 * without needing a live agent session.
 */

import BlockRenderer from '@/components/blocks/BlockRenderer';
import type { Block } from '@/types/blocks';

const demoBlocks: Block[] = [
  {
    type: 'text',
    markdown:
      "Here are a few technical workshops that fit a data-heavy exec audience, plus the kind of space you'd run them in.",
  },
  {
    type: 'sectionHeading',
    title: 'Technical workshops',
    subtitle: 'Hands-on sessions led by our solution engineers',
  },
  {
    type: 'carousel',
    variant: 'workshop',
    items: [
      {
        id: 'demo-workshop-1',
        title: 'Agentforce for Data Teams',
        description: 'A hands-on session building agents over live Salesforce data.',
        tags: ['Agentforce', 'Data'],
        audienceSize: '10-20',
        duration: '90 min',
        isNew: true,
        image: '/images/Experiences/workshops/workshop-agentforce-hands-on.jpg',
      },
      {
        id: 'demo-workshop-2',
        title: 'Prompt Builder Deep Dive',
        description: 'Design and test grounded prompts for production agents.',
        tags: ['Prompt Builder'],
        audienceSize: '10-20',
        duration: '60 min',
        image: '/images/Experiences/workshops/workshop-agent-bar.jpg',
      },
    ],
  },
  {
    type: 'card',
    variant: 'space',
    data: {
      id: 'demo-space-1',
      name: 'The Hub',
      capacity: 'Up to 30',
      description: 'A flexible room for workshops and demos.',
      imageUrl: '/images/Experiences/spaces/space-bloomsbury.jpg',
    },
  },
  {
    type: 'card',
    variant: 'team',
    data: {
      id: 'demo-team-1',
      name: 'Jordan Lee',
      role: 'Solution Engineer',
      imageUrl: '/images/About/Team Headshots/team-chris.jpeg',
    },
  },
  {
    type: 'card',
    variant: 'testimonial',
    data: {
      id: 'demo-testimonial-1',
      quote: 'The AI Centre team tailored the session exactly to our use case.',
      attribution: 'Independent Journalist',
    },
  },
  {
    type: 'ctaWell',
    heading: 'Plan your visit',
    body: "Let's find the right workshop for your team.",
    buttonLabel: 'Plan your visit',
    href: '/plan-engagement',
  },
  // Deliberately unregistered type — proves BlockRenderer's graceful
  // fallback (logs a warning, renders nothing) instead of crashing.
  { type: 'unknown-block-type' } as unknown as Block,
];

export default function BlocksDevPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '72rem', margin: '0 auto' }}>
      <h1>Block renderer gallery</h1>
      <p>Hand-authored block list rendered through real site components. See docs/adr-ask-ai-blocks.md.</p>
      <BlockRenderer blocks={demoBlocks} />
    </main>
  );
}
