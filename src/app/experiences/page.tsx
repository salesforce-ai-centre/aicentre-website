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
import SiteFooter from '@/components/ui/SiteFooter';

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

const SPACES: ExperienceCardData[] = [
  {
    id: 'exhibition-road',
    title: 'Exhibition Road',
    description:
      'The immersive walkthrough space, featuring interactive activations like the History of AI wall, Customer Showcase, Lego City, and more.',
    image: '/images/Experiences/spaces/space-exhibition-road.jpg',
  },
  {
    id: 'kensington',
    title: 'Kensington',
    description:
      'A flexible meeting room fitting 16–39 people (24 workshop-style, 39 theatre-style). It can be combined with Knightsbridge to form one larger space seating up to 72 theatre-style.',
    image: '/images/Experiences/spaces/space-kensington.jpg',
  },
  {
    id: 'knightsbridge',
    title: 'Knightsbridge',
    description:
      'A smaller meeting room suited to groups of 10–25. It can be combined with Kensington to form one larger space seating up to 72 theatre-style.',
    image: '/images/Experiences/spaces/space-knightsbridge.jpg',
  },
  {
    id: 'richmond',
    title: 'Richmond',
    description:
      'A boardroom-style meeting room designed for smaller, focused sessions, seating up to 8 people.',
    image: '/images/Experiences/spaces/space-richmond.jpg',
  },
  {
    id: 'the-studio',
    title: 'The Studio',
    description:
      'A media production space for recording customer conversations, enablement content, and other media.',
      image: '/images/Experiences/spaces/space-the-studio.jpg',
  },
  {
    id: 'the-exchange',
    title: 'The Exchange',
    description:
      "The AI Centre's social lounge, this is the go-to spot for informal chats and mingling between sessions. It's also home to the main kitchen, stocked with snacks and drinks, making it a natural gathering point throughout the day.",
    image: '/images/Experiences/spaces/space-exchange1.jpg',
  },
  {
    id: 'greenwich',
    title: 'Greenwich',
    description:
      'A large, flexible high-capacity space for townhalls and workshops: up to 85 theatre-style, 64 classroom, or 40 workshop-style.',
    image: '/images/Experiences/spaces/space-greenwich1.jpg',
  },
  {
    id: 'primrose-hill',
    title: 'Primrose Hill',
    description:
      'Tiered seating built for short, high-impact presentations, live demos, or storytelling, with a dedicated townhall zone holding up to 70.',
    image: '/images/Experiences/spaces/space-primrose-hill.jpg',
  },
  {
    id: 'the-concourse',
    title: 'The Concourse',
    description:
      'The area where the F1 Data Driven Experience and other guided immersive experiences take place.',
    image: '/images/Experiences/spaces/space-concourse1.jpg',
  },
  {
    id: 'bloomsbury',
    title: 'Bloomsbury',
    description:
      'A large, flexible high-capacity space for townhalls and workshops: up to 85 theatre-style, 64 classroom, or 40 workshop-style — for internal meetings only.',
    image: '/images/Experiences/spaces/space-bloomsbury.jpg',
  },
  {
    id: 'camden',
    title: 'Camden',
    description:
      'A smaller meeting room suited to groups of 10–25 on floor 2 — for internal meetings only.',
    image: '/images/Experiences/spaces/space-camden.jpg',
  },
];

export default function ExperiencesPage() {
  return (
    <main
      className="page-gradient overflow-x-hidden"
      style={{ '--page-gradient': 'linear-gradient(0deg, #00B3FF 0%, #90D0FE 21.42%, #EAF5FE 68.72%, #F9F0FF 100%)' } as React.CSSProperties}
    >
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
      <SiteFooter />
    </main>
  );
}
