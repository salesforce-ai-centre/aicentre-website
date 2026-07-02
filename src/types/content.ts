export interface Workshop {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  audienceSize: string;
  duration: string;
  category: 'hands-on' | 'ideation' | 'business' | 'technical';
  image?: string;
  featured?: boolean;
  whatYoullLearn?: string[];
  agendaId?: string;
  sampleAgenda?: string;
  engagementExpectations?: string[];
  videoUrl?: string;
  videoThumbnail?: string;
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
  isHosted?: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
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
  subtitle?: string;
  description: string;
  secondaryDescription?: string;
  callToAction?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  imageUrl: string;
}

export interface Space {
  id: string;
  name: string;
  capacity?: string;
  description?: string;
  imageUrl: string;
  status?: 'Active' | 'Planned' | 'Temporarily Unavailable' | 'Retired';
}

export interface EngagementTier {
  id: string;
  name: string;
  color: string;
  tagline: string;
  description: string;
  includes: string[];
  yourRole: string;
  support: string;
}

export interface UserEvent {
  id: string;
  name: string;
  date: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  status: string;
  eventType: string | null;
  program: string | null;
  account: string | null;
  space: string | null;
  slackChannelLink: string | null;
  role: string;
}