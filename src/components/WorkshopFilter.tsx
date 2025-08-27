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
    <div className="flex justify-center gap-4 mb-10 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
            activeFilter === filter.id
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-500 border-opacity-50'
              : 'bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-500 hover:border-purple-500 hover:border-opacity-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}