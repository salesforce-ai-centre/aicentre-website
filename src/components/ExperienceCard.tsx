import { Experience } from '@/types/content';
import { useRouter } from 'next/navigation';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/experiences/${experience.id}`);
  };
  const getCategoryIndicator = (category: string) => {
    const colors = {
      'orange': 'bg-orange-500',
      'green': 'bg-green-500',
      'red': 'bg-red-500',
    };
    return colors[category as keyof typeof colors] || colors['orange'];
  };

  return (
    <div 
      className="glass-card p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-purple-500 group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 cursor-pointer"
      onClick={handleClick}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-200 transition-colors flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryIndicator(experience.category)}`}></span>
          {experience.title}
        </h3>
        
        <p className="text-white text-opacity-90 mb-5 leading-relaxed">
          {experience.description}
        </p>
      </div>
    </div>
  );
}