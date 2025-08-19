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
    <div className="glass-card overflow-hidden border border-white border-opacity-20 rounded-2xl my-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-purple-500 bg-opacity-30">
            <th className="px-6 py-5 text-left font-bold text-white border-b border-white border-opacity-10">
              Keynote
            </th>
            <th className="px-6 py-5 text-left font-bold text-white border-b border-white border-opacity-10">
              Focus Area
            </th>
            <th className="px-6 py-5 text-left font-bold text-white border-b border-white border-opacity-10">
              Audience
            </th>
            <th className="px-6 py-5 text-left font-bold text-white border-b border-white border-opacity-10">
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {keynotes.map((keynote, index) => (
            <tr 
              key={keynote.id} 
              className="hover:bg-purple-500 hover:bg-opacity-20 transition-colors border-b border-white border-opacity-10 last:border-b-0"
            >
              <td className="px-6 py-5 text-white">
                <div className="font-semibold">{keynote.title}</div>
              </td>
              <td className="px-6 py-5 text-white text-opacity-80">
                {keynote.focusArea}
              </td>
              <td className="px-6 py-5 text-white text-opacity-80">
                {keynote.audience}
              </td>
              <td className="px-6 py-5 text-white text-opacity-80">
                {keynote.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}