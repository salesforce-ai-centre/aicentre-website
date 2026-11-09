// Import content directly since we can't use fs in client-side code
import workshopsContent from '../../content/workshops.json';
import experiencesContent from '../../content/experiences.json';
import keynotesContent from '../../content/keynotes.json';
import siteConfigContent from '../../content/site-config.json';
import teamMembersContent from '../../content/team-members.json';
import spacesContent from '../../content/spaces.json';
import testimonialsContent from '../../content/testimonials.json';
import galleryContent from '../../content/gallery.json';
import galleryLiteContent from '../../content/gallery-lite.json';
import {
  Workshop,
  Experience,
  Keynote,
  SiteConfig,
  TeamMember,
  Space,
  Testimonial,
  GalleryImage
} from '@/types/content';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export async function getWorkshops(usePublic = false): Promise<Workshop[]> {
  return fetchWithFallback<Workshop[]>(
    `${usePublic ? BASE_URL : ''}/api/workshops`,
    workshopsContent as Workshop[],
    (data): data is Workshop[] => Array.isArray(data) && data.length > 0
  );
}

export async function getExperiences(usePublic = false): Promise<Experience[]> {
  return fetchWithFallback<Experience[]>(
    `${usePublic ? BASE_URL : ''}/api/experiences`,
    experiencesContent as Experience[],
    (data): data is Experience[] => Array.isArray(data) && data.length > 0
  );
}

export async function getKeynotes(usePublic = false): Promise<Keynote[]> {
  return fetchWithFallback<Keynote[]>(
    `${usePublic ? BASE_URL : ''}/api/keynotes`,
    keynotesContent as Keynote[],
    (data): data is Keynote[] => Array.isArray(data) && data.length > 0
  );
}

export function getSiteConfig(): SiteConfig {
  return siteConfigContent as SiteConfig;
}

export function getTeamMembers(): Promise<TeamMember[]> {
  return fetchWithFallback<TeamMember[]>(
    '/api/team_members',
    teamMembersContent as TeamMember[],
    (data): data is TeamMember[] => Array.isArray(data) && data.length > 0
  );
}

export function getTestimonials(usePublic = false): Promise<Testimonial[]> {
  return fetchWithFallback<Testimonial[]>(
    `${usePublic ? BASE_URL : ''}/api/testimonials`,
    testimonialsContent as Testimonial[],
    (data): data is Testimonial[] => Array.isArray(data) && data.length > 0
  );
}

export async function getGalleryImages(variant: 'full' | 'lite', usePublic = false): Promise<string[]> {
  const fallbackImages = (variant === 'lite' ? galleryLiteContent.images : galleryContent.images) as string[];
  const fallback: GalleryImage[] = fallbackImages.map((image, index) => ({
    id: `${variant}-${index}`,
    image,
    variant,
  }));

  // const images = await fetchWithFallback<GalleryImage[]>(
  //   `${usePublic ? BASE_URL : ''}/api/gallery`,
  //   fallback,
  //   (data): data is GalleryImage[] => Array.isArray(data) && data.length > 0
  // );

  return fallback
    .filter((image) => image.variant === variant)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((image) => image.image);
}

export function getSpaces(usePublic = false): Promise<Space[]> {
  return fetchWithFallback<Space[]>(
    `${usePublic ? BASE_URL : ''}/api/spaces`,
    spacesContent as Space[],
    (data): data is Space[] => Array.isArray(data) && data.length > 0
  );
}

async function fetchWithFallback<T>(
  apiPath: string,
  fallback: T,
  isValid: (data: any) => data is T
): Promise<T> {
  try {
    const response = await fetch(apiPath, { cache: 'no-store' });
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