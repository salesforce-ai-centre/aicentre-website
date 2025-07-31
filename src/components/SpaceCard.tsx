import { Space } from '@/types/content';
import Image from 'next/image'

interface SpaceCardProps {
  space: Space;
}

export default function SpaceCaard({ space }: SpaceCardProps) {
  return (
    <div 
      className="glass-card relative overflow-hidden group border-white border-opacity-15 hover:border-purple-500 hover:border-opacity-50 flex flex-col h-full"
      style={{ transition: 'border-color 0.2s ease' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500"></div>
      
      {/* Image Section */}
      <div className="relative w-full h-48 mb-4">
        {space.imageUrl ? (
          <Image
            src={space.imageUrl}
            alt={`Display of the space: ${space.name}`}
            fill
            className="object-cover"
            style={{top: '3.5px'}}
          />
        ) : (
          <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
            <span className="text-3xl text-purple-200">
              {space.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 items-start text-left p-8">
        <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
          {space.name}
        </h3>

        {space.capacity && (
          <div className="text-lg text-purple-300 mb-4">
            Capacity: {space.capacity}
          </div>
        )}

        {space.description && (
          <p className="text-white text-opacity-90 leading-relaxed">
            {space.description}
          </p>
        )}
      </div>
    </div>
  );
}