'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface-elevated border border-border rounded-2xl shadow-card break-inside-avoid mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-surface-muted/50 transition-colors"
      >
        <span className="text-accent/70">{icon}</span>
        <span className="text-xs font-semibold text-ink flex-1 tracking-wide">{title}</span>
        {badge !== undefined && (
          <span className="text-[9px] font-bold bg-accent/8 text-accent px-1.5 py-0.5 rounded-md tabular-nums">
            {badge}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-ink-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
