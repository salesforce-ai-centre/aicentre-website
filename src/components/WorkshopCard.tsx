import { Workshop } from '@/types/content';
import { useRouter } from 'next/navigation';

interface WorkshopCardProps {
  workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/workshops/${workshop.id}`);
  };

  return (
    <div
      className="card p-6 relative overflow-hidden group cursor-pointer h-full flex flex-col"
      onClick={handleClick}
      style={{ minHeight: '280px' }}
    >
      <div className="flex flex-col flex-1">
        <div className="mb-3" style={{ minHeight: '52px' }}>
          <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors line-clamp-2">
            {workshop.title}
          </h3>
        </div>

        <div className="mb-4 flex-1">
          <p className="text-ink-secondary text-sm leading-relaxed line-clamp-3">
            {workshop.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4" style={{ minHeight: '28px' }}>
          {workshop.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-surface-muted border border-border rounded-full text-xs font-medium text-ink-secondary"
            >
              {tag}
            </span>
          ))}
          {workshop.tags.length > 3 && (
            <span className="px-2.5 py-0.5 bg-surface-muted border border-border rounded-full text-xs font-medium text-ink-tertiary">
              +{workshop.tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <span className="bg-accent-light text-accent px-3 py-1 rounded-full text-xs font-medium">
            {workshop.audienceSize}
          </span>
        </div>
      </div>
    </div>
  );
}
