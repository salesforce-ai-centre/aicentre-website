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
      className="glass-card p-8 relative overflow-hidden group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 cursor-pointer h-full flex flex-col"
      onClick={handleClick}
      style={{ transition: 'border-color 0.2s ease', minHeight: '320px' }}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      
      {/* Content container with flexbox for equal height distribution */}
      <div className="flex flex-col flex-1">
        {/* Title section - fixed height */}
        <div className="mb-4" style={{ minHeight: '60px' }}>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2">
            {workshop.title}
          </h3>
        </div>
        
        {/* Description section - flexible height but clamped */}
        <div className="mb-5 flex-1">
          <p className="text-white text-opacity-90 leading-relaxed line-clamp-3">
            {workshop.description}
          </p>
        </div>

        {/* Tags section - flexible height */}
        <div className="flex flex-wrap gap-2 mb-5" style={{ minHeight: '32px' }}>
          {workshop.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-500 bg-opacity-30 border border-purple-500 border-opacity-50 rounded-full text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))}
          {workshop.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-500 bg-opacity-30 border border-gray-500 border-opacity-50 rounded-full text-xs font-medium text-white">
              +{workshop.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Audience size - footer section */}
        <div className="mt-auto">
          <div className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 px-3 py-1.5 rounded-xl text-sm font-medium text-white inline-block">
            👥 {workshop.audienceSize}
          </div>
        </div>
      </div>
    </div>
  );
}