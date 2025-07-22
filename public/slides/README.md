# Slides Directory Structure

This directory contains slide images for keynote presentations.

## Folder Structure

```
public/slides/
├── example-keynote/
│   ├── slide_1.jpg
│   ├── slide_2.jpg
│   └── slide_3.jpg
├── ai-fundamentals/
│   ├── slide_1.png
│   ├── slide_2.png
│   └── ...
└── agentforce-overview/
    ├── slide_1.jpg
    ├── slide_2.jpg
    └── ...
```

## Naming Convention

- **Folder names**: Use kebab-case, should match the keynote slug in `content/keynotes.json`
- **Image names**: `slide_1`, `slide_2`, `slide_3`, etc. (starting from 1)
- **File formats**: Supported formats are `.jpg`, `.jpeg`, `.png`, `.webp`

## Adding New Slide Decks

1. Create a new folder with the keynote slug name
2. Add your slide images numbered sequentially: `slide_1.jpg`, `slide_2.jpg`, etc.
3. Update the keynote entry in `content/keynotes.json` to include `"hasSlides": true`

## Recommended Image Settings

- **Resolution**: 1920x1080 (16:9 aspect ratio) for best quality
- **File size**: Optimize images to under 500KB each for faster loading
- **Format**: Use `.webp` for best compression, `.jpg` for compatibility

## Example

If you have a keynote with slug `"ai-fundamentals"`, create:
```
public/slides/ai-fundamentals/
├── slide_1.jpg
├── slide_2.jpg
├── slide_3.jpg
└── slide_4.jpg
```

Then update `content/keynotes.json`:
```json
{
  "slug": "ai-fundamentals",
  "title": "AI Fundamentals",
  "hasSlides": true,
  // ... other properties
}
```