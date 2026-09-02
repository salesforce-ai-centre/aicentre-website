// Import content directly since we can't use fs in client-side code
import workshopsContent from '../../content/workshops.json';
import experiencesContent from '../../content/experiences.json';
import keynotesContent from '../../content/keynotes.json';
import siteConfigContent from '../../content/site-config.json';
import teamMembersContent from '../../content/team-members.json';
import spacesContent from '../../content/spaces.json';
import testimonialsContent from '../../content/testimonials.json';
import {
  Workshop,
  Experience,
  Keynote,
  SiteConfig,
  TeamMember,
  Space,
  Testimonial
} from '@/types/content';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export async function getWorkshops(): Promise<Workshop[]> {
  return fetchWithFallback<Workshop[]>(
    '/api/workshops',
    workshopsContent as Workshop[],
    (data): data is Workshop[] => Array.isArray(data)
  );
}

export async function getExperiences(): Promise<Experience[]> {
  return fetchWithFallback<Experience[]>(
    '/api/experiences',
    experiencesContent as Experience[],
    (data): data is Experience[] => Array.isArray(data)
  );
}

export async function getKeynotes(usePublic = false): Promise<Keynote[]> {
  return fetchWithFallback<Keynote[]>(
    `${usePublic ? BASE_URL : ''}/api/keynotes`,
    keynotesContent as Keynote[],
    (data): data is Keynote[] => Array.isArray(data)
  );
}

export function getSiteConfig(): SiteConfig {
  return siteConfigContent as SiteConfig;
}

export function getTeamMembers(): TeamMember[] {
  return teamMembersContent as TeamMember[];
}

export function getTestimonials(): Testimonial[] {
  return testimonialsContent as Testimonial[];
}

export function getSpaces(): Promise<Space[]> {
  return fetchWithFallback<Space[]>(
    `/api/spaces`,
    spacesContent as Space[],
    (data): data is Space[] => Array.isArray(data)
  );
}

async function fetchWithFallback<T>(
  apiPath: string,
  fallback: T,
  isValid: (data: any) => data is T
): Promise<T> {
  try {
    const response = await fetch(apiPath);
    if (!response.ok) {
      console.error(`Failed to fetch from ${apiPath}:`, response.statusText);
      return fallback;
    }
    const json = await response.json();
    if (isValid(json.data)) {
      return json.data;
    }
    return fallback;
  } catch (error) {
    console.error(`Error fetching from ${apiPath}:`, error);
    return fallback;
  }
}