import { Experience } from '@/types/content';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      'red': 'bg-red-500',
      'orange': 'bg-orange-500',
      'green': 'bg-green-500',
    };
    return colors[category as keyof typeof colors] || colors['orange'];
  };

  const getReadinessStatus = (category: string) => {
    const statusMap = {
      'red': 'Not Ready',
      'orange': 'Nearly Ready',
      'green': 'Ready',
    };
    return statusMap[category as keyof typeof statusMap] || 'Nearly Ready';
  };

  const getStatusBadgeClasses = (category: string) => {
    const classes = {
      'red': 'bg-red-50 text-red-700 border-red-200',
      'orange': 'bg-orange-50 text-orange-700 border-orange-200',
      'green': 'bg-green-50 text-green-700 border-green-200',
    };
    return classes[category as keyof typeof classes] || classes['orange'];
  };

  return (
    <div
      className="card p-6 relative overflow-hidden group h-full flex flex-col"
      style={{ minHeight: '280px' }}
    >
      <div className="flex flex-col flex-1">
        <div className="mb-3" style={{ minHeight: '52px' }}>
          <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors flex items-start line-clamp-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 mt-1.5 flex-shrink-0 ${getCategoryColor(experience.category)}`}></span>
            <span className="line-clamp-2">{experience.title}</span>
          </h3>
        </div>

        <div className="mb-4 flex-1">
          <p className="text-ink-secondary text-sm leading-relaxed line-clamp-3">
            {experience.description}
          </p>
        </div>

        <div className="mb-4" style={{ minHeight: '28px' }}>
          <span className={`px-2.5 py-0.5 border rounded-full text-xs font-medium ${getStatusBadgeClasses(experience.category)}`}>
            {getReadinessStatus(experience.category)}
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          <span className="bg-surface-muted border border-border px-2.5 py-1 rounded-lg text-xs font-medium text-ink-secondary">
            {experience.audienceSize}
          </span>
          <span className="bg-surface-muted border border-border px-2.5 py-1 rounded-lg text-xs font-medium text-ink-secondary">
            {experience.duration}
          </span>
          <span className="bg-surface-muted border border-border px-2.5 py-1 rounded-lg text-xs font-medium text-ink-secondary">
            {experience.isHosted ? "Guided" : "Self-Service"}
          </span>
        </div>
      </div>
    </div>
  );
}
