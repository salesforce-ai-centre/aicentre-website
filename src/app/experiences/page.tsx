/**
 * Experiences page — redesigned light theme.
 *
 * Hero + pill section-switcher, then Activations / Workshops / Spaces, each a
 * SectionHeading + Carousel of ContentCards, closing with the shared CtaWell.
 * Figma frame 14:446.
 *
 * Card data is defined here mapped to the assets in
 * public/images/Experiences/*. Only browser-renderable images (jpg/png/webp)
 * are referenced; cards whose source photo is currently HEIC fall back to the
 * branded placeholder until those are converted (see AIC2-147 / content note).
 *
 * AIC2-148 — assembles the Experiences Page epic (AIC2-128).
 */

import Navigation from '@/components/Navigation';
import ExperiencesHero from '@/components/experiences/ExperiencesHero';
import ExperienceSection, {
  type ExperienceCardData,
} from '@/components/experiences/ExperienceSection';
import CtaWell from '@/components/ui/CtaWell';

const ACTIVATIONS: ExperienceCardData[] = [
  {
    id: 'f1-data-race',
    title: 'Formula 1 Data Race',
    description:
      'An interactive racing activation where telemetry from a competitive driving experience is fed into Data 360 and turned into a personalised, Agentforce-generated pit crew debrief.',
    image: '/images/Experiences/activations/activation-f1.jpg',
    badge: 'Guided',
  },
  {
    id: 'robot-armtist',
    title: 'Robot Armtist',
    description:
      'A robotic arm and camera duo that sketches a personalised, take-home portrait for every visitor in real time.',
    image: '/images/Experiences/activations/activation-armtists2.jpg',
    badge: 'Self Serve',
  },
  {
    id: 'lego-city',
    title: 'Lego City',
    description:
      'A connected, animated LEGO city that brings Salesforce industry solutions to life across Manufacturing, Healthcare, Retail, Utilities and Banking.',
    image: '/images/Experiences/activations/activation-lego-city1.jpg',
    badge: 'Self Serve',
  },
  {
    id: 'sommelai',
    title: 'SommelAI',
    description:
      'An AI sommelier that pairs recommendations to your taste — a playful showcase of agentic personalisation.',
    image: '/images/Experiences/activations/activation-sommelai1.jpg',
    badge: 'Guided',
  },
  {
    id: 'ai-or-human',
    title: 'AI or Human?',
    description:
      'A photo-frame guessing game that challenges visitors to tell AI-generated content from the real thing.',
    image: '/images/Experiences/activations/activation-ai-or-human-frame3.jpg',
    badge: 'Self Serve',
  },
  {
    id: 'customer-stories',
    title: 'Customer Stories',
    description:
      'Real customer transformation stories brought to life across the Centre.',
    image: '/images/Experiences/activations/activations-customer-stories.jpg',
    badge: 'Guided',
  },
];

const WORKSHOPS: ExperienceCardData[] = [
  {
    id: 'agentforce-hands-on',
    title: 'Agentforce Hands-on Workshop',
    description:
      'A hands-on technical workshop that enables teams to design, build, and test AI agents using Agentforce capabilities, including instructions, actions, and evaluation.',
    image: '/images/Experiences/workshops/workshop-agentforce-hands-on.jpg',
  },
  {
    id: 'agent-challenge-day',
    title: 'Agent Challenge Day',
    description:
      'A human-centred workshop focused on identifying, designing and pitching Agentforce use cases aligned to customer business challenges.',
    image: '/images/Experiences/workshops/workshop-agentforce-challenge-day1.jpg',
  },
  {
    id: 'agentforce-ideation',
    title: 'Agentforce Ideation',
    description:
      'A strategic session exploring how organisations can move from AI ideation to enterprise-wide implementation.',
    image: '/images/Experiences/workshops/workshop-agentforce-ideation.jpg',
  },
  {
    id: 'data360-ideation',
    title: 'Data 360 Ideation',
    description:
      'Map the data foundations your agents need, using proven ideation frameworks to turn strategy into a plan.',
    image: '/images/Experiences/workshops/workshop-data360-ideation.jpg',
  },
  {
    id: 'data-readiness',
    title: 'Data Readiness',
    description:
      'Assess and prepare your data estate so it is ready to power trusted, high-quality AI agents.',
    image: '/images/Experiences/workshops/workshop-data-readiness.jpg',
  },
  {
    id: 'prompt-builder',
    title: 'Prompt Builder Workshop',
    description:
      'A practical session building and refining prompts that get reliable, on-brand results from generative AI.',
    image: '/images/Experiences/workshops/workshop-prompt-builder.jpg',
  },
];

// One card per room, with default copy for now — real capacity/blurbs to follow.
const SPACES: ExperienceCardData[] = [
  { id: 'reception', title: 'Reception', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-reception1.jpg' },
  { id: 'concourse', title: 'Concourse', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-concourse1.jpg' },
  { id: 'exchange', title: 'Exchange', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-exchange1.jpg' },
  { id: 'knightsbridge', title: 'Knightsbridge', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-knightsbridge.jpg' },
  { id: 'kensington', title: 'Kensington', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-kensington.jpg' },
  { id: 'greenwich', title: 'Greenwich', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-greenwich1.jpg' },
  { id: 'bloomsbury', title: 'Bloomsbury', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-bloomsbury.jpg' },
  { id: 'camden', title: 'Camden', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-camden.jpg' },
  { id: 'primrose-hill', title: 'Primrose Hill', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-primrose-hill.jpg' },
  { id: 'exhibition-road', title: 'Exhibition Road', description: 'Seats up to xx people and is perfect for...', image: '/images/Experiences/spaces/space-exhibition-road.jpg' },
];

export default function ExperiencesPage() {
  return (
    <main className="page-gradient overflow-x-hidden" style={{ '--page-gradient': 'linear-gradient(0deg, #00B3FF 0%, #90D0FE 21.42%, #EAF5FE 68.72%, #F9F0FF 100%)'}}>
      <Navigation />
      <ExperiencesHero />
      <ExperienceSection id="activations" title="Activations" items={ACTIVATIONS} />
      <ExperienceSection id="workshops" title="Workshops" items={WORKSHOPS} />
      <ExperienceSection id="spaces" title="Spaces" items={SPACES} />
      <CtaWell
        heading="Plan your visit to the AI Centre"
        body="Follow our three simple steps to plan your visit with us."
        buttonLabel="Plan your visit"
        href="/plan-engagement"
        className="mt-12"
      />
    </main>
  );
}
