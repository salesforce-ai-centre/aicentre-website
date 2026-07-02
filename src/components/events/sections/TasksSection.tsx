'use client';

import { useState } from 'react';
import { Check, Circle, Loader2, Plus } from 'lucide-react';
import { useEventSection } from '@/hooks/useEventSection';
import type { EventTask } from '@/types/events';

const priorityColors: Record<string, string> = {
  'High': 'text-red-600',
  'Medium': 'text-orange-600',
  'Low': 'text-ink-tertiary',
};

export default function TasksSection({ eventId }: { eventId: string }) {
  const { data: tasks, isLoading, error, refetch } = useEventSection<EventTask[]>(eventId, 'tasks', true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  async function toggleTask(task: EventTask) {
    const newStatus = task.status === 'Completed' ? 'Not Started' : 'Completed';
    setUpdatingId(task.id);
    try {
      await fetch(`/api/events/${eventId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      refetch();
    } finally {
      setUpdatingId(null);
    }
  }

  async function createTask() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      await fetch(`/api/events/${eventId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setNewTitle('');
      setShowAdd(false);
      refetch();
    } finally {
      setCreating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-surface-muted rounded-lg" />)}
      </div>
    );
  }

  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <div className="space-y-2">
      {tasks && tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 py-2 group">
            <button
              onClick={() => toggleTask(task)}
              disabled={updatingId === task.id}
              className="mt-0.5 flex-shrink-0"
            >
              {updatingId === task.id ? (
                <Loader2 size={16} className="text-ink-tertiary animate-spin" />
              ) : task.status === 'Completed' ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Circle size={16} className="text-ink-tertiary group-hover:text-accent transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.status === 'Completed' ? 'line-through text-ink-tertiary' : 'text-ink'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {task.assignee && <span className="text-[11px] text-ink-tertiary">{task.assignee}</span>}
                {task.dueDate && <span className="text-[11px] text-ink-tertiary">{new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                {task.priority && <span className={`text-[10px] font-semibold ${priorityColors[task.priority] || ''}`}>{task.priority}</span>}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xs text-ink-tertiary">No tasks yet</p>
      )}

      {showAdd ? (
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createTask()}
            placeholder="Task title..."
            autoFocus
            className="flex-1 text-sm border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <button
            onClick={createTask}
            disabled={creating || !newTitle.trim()}
            className="text-xs font-semibold text-accent hover:text-accent-dark disabled:opacity-50 transition-colors"
          >
            {creating ? 'Adding...' : 'Add'}
          </button>
          <button
            onClick={() => { setShowAdd(false); setNewTitle(''); }}
            className="text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-dark transition-colors pt-2"
        >
          <Plus size={14} />
          Add task
        </button>
      )}
    </div>
  );
}
