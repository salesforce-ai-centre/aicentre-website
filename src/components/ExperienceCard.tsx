import { Experience } from '@/types/content';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  /**
   * Maps experience category colors to readiness status
   * Red = Not Ready, Orange = Nearly Ready, Green = Ready
   */
  const getCategoryIndicator = (category: string) => {
    const colors = {
      'red': 'bg-red-500',      // Not ready
      'orange': 'bg-orange-500', // Nearly ready  
      'green': 'bg-green-500',   // Ready
    };
    return colors[category as keyof typeof colors] || colors['orange'];
  };

  /**
   * Gets human-readable status text based on category color
   */
  const getReadinessStatus = (category: string) => {
    const statusMap = {
      'red': 'Not Ready',
      'orange': 'Nearly Ready', 
      'green': 'Ready',
    };
    return statusMap[category as keyof typeof statusMap] || 'Nearly Ready';
  };

  return (
    <div 
      className="glass-card p-8 relative overflow-hidden group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 h-full flex flex-col"
      style={{ transition: 'border-color 0.2s ease', minHeight: '320px' }}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      
      {/* Content container with flexbox for equal height distribution */}
      <div className="flex flex-col flex-1">
        {/* Title section - fixed height to match workshop cards */}
        <div className="mb-4" style={{ minHeight: '60px' }}>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors flex items-start line-clamp-2">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 mt-1.5 flex-shrink-0 ${getCategoryIndicator(experience.category)}`}></span>
            <span className="line-clamp-2">{experience.title}</span>
          </h3>
        </div>
        
        {/* Description section - flexible height but clamped to match workshop cards */}
        <div className="mb-5 flex-1">
          <p className="text-white text-opacity-90 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* Readiness status section - to match workshop tag height */}
        <div className="mb-5" style={{ minHeight: '32px' }}>
          <span className={`px-3 py-1 ${getCategoryIndicator(experience.category)} bg-opacity-30 border ${getCategoryIndicator(experience.category).replace('bg-', 'border-')} border-opacity-50 rounded-full text-xs font-medium text-white`}>
            🎯 {getReadinessStatus(experience.category)}
          </span>
        </div>

        {/* Footer section - empty to maintain consistent spacing */}
        <div className="mt-auto" style={{ minHeight: '40px' }}>
          <div className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 px-3 py-1.5 rounded-xl text-sm font-medium text-white inline-block mr-2">
            👥 {experience.audienceSize}
          </div>
          <div className="bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-30 px-3 py-1.5 rounded-xl text-sm font-medium text-white inline-block">
            ⏰ {experience.duration}
          </div>
        </div>
      </div>
    </div>
  );
}