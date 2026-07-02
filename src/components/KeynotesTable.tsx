import { useState, useEffect } from 'react';
import { getKeynotes } from '@/lib/content';
import { Keynote } from '@/types/content';

export default function KeynotesTable() {
  const [keynotes, setKeynotes] = useState<Keynote[]>([]);

  useEffect(() => {
    getAllKeynotes();
  }, [])

  const getAllKeynotes = async () => {
    const allKeynotes = await getKeynotes();
    setKeynotes(allKeynotes);
  }

  return (
    <div className="card overflow-hidden rounded-2xl my-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-muted">
            <th className="px-6 py-4 text-left font-semibold text-ink text-sm border-b border-border">
              Keynote
            </th>
            <th className="px-6 py-4 text-left font-semibold text-ink text-sm border-b border-border">
              Focus Area
            </th>
            <th className="px-6 py-4 text-left font-semibold text-ink text-sm border-b border-border">
              Audience
            </th>
            <th className="px-6 py-4 text-left font-semibold text-ink text-sm border-b border-border">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {keynotes.map((keynote) => (
            <tr
              key={keynote.id}
              className="hover:bg-surface-muted transition-colors border-b border-border last:border-b-0"
            >
              <td className="px-6 py-4 text-ink">
                <div className="font-medium">{keynote.title}</div>
              </td>
              <td className="px-6 py-4 text-ink-secondary text-sm">
                {keynote.focusArea}
              </td>
              <td className="px-6 py-4 text-ink-secondary text-sm">
                {keynote.audience}
              </td>
              <td className="px-6 py-4 text-ink-secondary text-sm">
                {keynote.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
