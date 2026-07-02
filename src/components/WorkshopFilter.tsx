'use client';

import { useState } from 'react';

interface WorkshopFilterProps {
  onFilterChange: (filter: string) => void;
}

export default function WorkshopFilter({ onFilterChange }: WorkshopFilterProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Offerings' },
    { id: 'hands-on', label: 'Hands-on' },
    { id: 'ideation', label: 'Ideation' },
    { id: 'executive', label: 'Executives' },
    { id: 'technical', label: 'Technical' },
  ];

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className="flex justify-center gap-2 mb-10 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            activeFilter === filter.id
              ? 'bg-ink text-white border-ink'
              : 'bg-surface-elevated text-ink-secondary border-border hover:border-ink/30 hover:text-ink'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
