// Import content directly since we can't use fs in client-side code
import heroContent from '../../content/hero.json';
import workshopsContent from '../../content/workshops.json';
import experiencesContent from '../../content/experiences.json';
import keynotesContent from '../../content/keynotes.json';
import faqsContent from '../../content/faqs.json';
import siteConfigContent from '../../content/site-config.json';
import { 
  Workshop, 
  Experience, 
 
  Keynote, 
  FAQ, 
  HeroContent, 
  SiteConfig 
} from '@/types/content';

export function getHeroContent(): HeroContent {
  return heroContent as HeroContent;
}

export function getWorkshops(): Workshop[] {
  return workshopsContent as Workshop[];
}

export function getExperiences(): Experience[] {
  return experiencesContent as Experience[];
}


export function getKeynotes(): Keynote[] {
  return keynotesContent as Keynote[];
}

export function getFAQs(): FAQ[] {
  return faqsContent as FAQ[];
}

export function getSiteConfig(): SiteConfig {
  return siteConfigContent as SiteConfig;
}

export function getWorkshopsByCategory(category: Workshop['category']): Workshop[] {
  const workshops = getWorkshops();
  return workshops.filter(workshop => workshop.category === category);
}

export function getFeaturedWorkshops(): Workshop[] {
  const workshops = getWorkshops();
  return workshops.filter(workshop => workshop.featured);
}

export function getFeaturedExperiences(): Experience[] {
  const experiences = getExperiences();
  return experiences.filter(experience => experience.featured);
}