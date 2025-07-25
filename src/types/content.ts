export interface Workshop {
  id: string;
  title: string;
  description: string;
  tags: string[];
  audienceSize: string;
  duration: string;
  category: 'hands-on' | 'ideation' | 'business' | 'technical';
  image?: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  type: 'demo' | 'interactive' | 'immersive';
  duration: string;
  audienceSize: string;
  tags: string[];
  category: string;
  image?: string;
  featured?: boolean;
}


export interface Keynote {
  id: string;
  title: string;
  description: string;
  presenter: string;
  presenterRole: string;
  duration: string;
  audienceSize: string;
  topics: string[];
  focusArea: string;
  audience: string;
  image?: string;
  hasSlides?: boolean;
  slug?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  contactInfo: {
    slackChannel: string;
    slackDescription: string;
    supportDescription: string;
    email?: string;
  };
  navigation: Array<{
    name: string;
    href: string;
  }>;
  agentforceBadge: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  analytics?: {
    googleAnalyticsId?: string | null;
  };
}