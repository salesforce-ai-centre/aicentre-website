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
      className="glass-card p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-purple-500 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 cursor-pointer"
      onClick={handleClick}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors">
          {workshop.title}
        </h3>
        
        <p className="text-white text-opacity-90 mb-5 leading-relaxed">
          {workshop.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {workshop.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-purple-500 bg-opacity-30 border border-purple-500 border-opacity-50 rounded-full text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 px-3 py-1.5 rounded-xl text-sm font-medium text-white inline-block">
          👥 {workshop.audienceSize}
        </div>
      </div>
    </div>
  );
}