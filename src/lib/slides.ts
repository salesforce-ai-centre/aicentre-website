export interface SlideInfo {
  src: string;
  alt: string;
  index: number;
  extension: string;
}

export async function loadSlides(keynoteSlug: string): Promise<SlideInfo[]> {
  const slideUrls: SlideInfo[] = [];
  let slideIndex = 1;
  const maxSlides = 100; // Maximum number of slides to check
  const extensions = ['webp', 'jpg', 'jpeg', 'png']; // Order by preference

  while (slideIndex <= maxSlides) {
    let found = false;
    
    for (const ext of extensions) {
      try {
        const url = `/slides/${keynoteSlug}/slide_${slideIndex}.${ext}`;
        const response = await fetch(url, { method: 'HEAD' });
        
        if (response.ok) {
          slideUrls.push({
            src: url,
            alt: `Slide ${slideIndex}`,
            index: slideIndex,
            extension: ext
          });
          found = true;
          break; // Found slide with this extension, move to next slide
        }
      } catch {
        // Continue trying other extensions
      }
    }
    
    if (!found) {
      break; // No more slides found
    }
    
    slideIndex++;
  }
  
  return slideUrls;
}

export function hasSlides(keynoteSlug: string): Promise<boolean> {
  return loadSlides(keynoteSlug).then(slides => slides.length > 0);
}

export async function getSlideCount(keynoteSlug: string): Promise<number> {
  const slides = await loadSlides(keynoteSlug);
  return slides.length;
}

export function createSlideUrl(keynoteSlug: string, slideIndex: number, extension: string = 'jpg'): string {
  return `/slides/${keynoteSlug}/slide_${slideIndex}.${extension}`;
}

export function validateSlideFileName(fileName: string): boolean {
  const pattern = /^slide_\d+\.(jpg|jpeg|png|webp)$/i;
  return pattern.test(fileName);
}

export function extractSlideNumber(fileName: string): number | null {
  const match = fileName.match(/^slide_(\d+)\./i);
  return match ? parseInt(match[1], 10) : null;
}