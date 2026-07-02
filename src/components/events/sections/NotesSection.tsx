'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useEventSection } from '@/hooks/useEventSection';
import type { EventNote } from '@/types/events';

export default function NotesSection({ eventId }: { eventId: string }) {
  const { data: notes, isLoading, error, refetch } = useEventSection<EventNote[]>(eventId, 'notes', true);
  const [showAdd, setShowAdd] = useState(false);
  const [newBody, setNewBody] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function createNote() {
    if (!newBody.trim()) return;
    setCreating(true);
    try {
      await fetch(`/api/events/${eventId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() || undefined, body: newBody.trim() }),
      });
      setNewBody('');
      setNewTitle('');
      setShowAdd(false);
      refetch();
    } finally {
      setCreating(false);
    }
  }

  async function deleteNote(noteId: string) {
    setDeletingId(noteId);
    try {
      await fetch(`/api/events/${eventId}/notes/${noteId}`, { method: 'DELETE' });
      refetch();
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2].map((i) => <div key={i} className="h-16 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      {notes && notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id} className="p-3 bg-surface-muted rounded-xl group relative">
            {note.title && <p className="text-xs font-semibold text-ink mb-1">{note.title}</p>}
            <p className="text-sm text-ink-secondary whitespace-pre-wrap">{note.body}</p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-ink-tertiary">
              {note.createdBy && <span>{note.createdBy}</span>}
              <span>{new Date(note.createdDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <button
              onClick={() => deleteNote(note.id)}
              disabled={deletingId === note.id}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-ink-tertiary hover:text-red-500 transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))
      ) : (
        <p className="text-xs text-ink-tertiary">No notes yet</p>
      )}

      {showAdd ? (
        <div className="space-y-2 pt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Note content..."
            rows={3}
            autoFocus
            className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={createNote}
              disabled={creating || !newBody.trim()}
              className="text-xs font-semibold text-accent hover:text-accent-dark disabled:opacity-50 transition-colors"
            >
              {creating ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewBody(''); setNewTitle(''); }}
              className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-dark transition-colors pt-2"
        >
          <Plus size={14} />
          Add note
        </button>
      )}
    </div>
  );
}
