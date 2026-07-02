'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export interface Person {
  id: string;
  name: string;
  title: string;
  email: string;
  photoUrl?: string;
}

interface PeoplePickerProps {
  label: string;
  required?: boolean;
  multiple?: boolean;
  value: Person[];
  onChange: (people: Person[]) => void;
  placeholder?: string;
  hint?: string;
}

export default function PeoplePicker({ label, required, multiple = true, value, onChange, placeholder, hint }: PeoplePickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/people-search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        const filtered = data.results.filter((r: Person) => !value.some(v => v.id === r.id));
        setResults(filtered);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const addPerson = (person: Person) => {
    if (multiple) {
      onChange([...value, person]);
    } else {
      onChange([person]);
    }
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const removePerson = (id: string) => {
    onChange(value.filter(p => p.id !== id));
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-ink mb-1.5">
        {label} {required && <span className="text-warm">*</span>}
      </label>
      <div className="w-full px-3 py-2 rounded-xl border border-border bg-surface focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-all min-h-[44px] flex flex-wrap items-center gap-1.5">
        {value.map((person) => (
          <span key={person.id} className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
            {person.photoUrl ? (
              <img src={person.photoUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            )}
            {person.name}
            <button type="button" onClick={() => removePerson(person.id)} className="hover:text-accent-dark transition-colors ml-0.5">
              <X size={12} />
            </button>
          </span>
        ))}
        {(multiple || value.length === 0) && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => search(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={value.length === 0 ? (placeholder || 'Search by name...') : 'Add another...'}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-ink placeholder:text-ink-tertiary"
          />
        )}
      </div>
      {hint && <p className="text-ink-tertiary text-xs mt-1.5">{hint}</p>}

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {results.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => addPerson(person)}
              className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
            >
              {person.photoUrl ? (
                <img src={person.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                  {person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{person.name}</p>
                <p className="text-xs text-ink-tertiary truncate">{person.title}</p>
              </div>
              <span className="text-xs text-ink-tertiary flex-shrink-0">{person.email?.split('@')[0]}</span>
            </button>
          ))}
        </div>
      )}

      {open && loading && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg px-4 py-3">
          <p className="text-sm text-ink-tertiary">Searching...</p>
        </div>
      )}

      {open && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-surface border border-border rounded-xl shadow-lg px-4 py-3">
          <p className="text-sm text-ink-tertiary">No results found</p>
        </div>
      )}
    </div>
  );
}
