'use client';

import { useState } from 'react';
import type { Task, Priority, Status } from '@/lib/types';

interface Props {
  task: Task;
  onUpdate: (id: string, patch: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_BORDER: Record<Priority, string> = {
  low: 'border-l-emerald-400',
  medium: 'border-l-amber-400',
  high: 'border-l-red-400',
};

const PRIORITY_BADGE: Record<Priority, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const STATUS_BADGE: Record<Status, string> = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABEL: Record<Status, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);

  const saveEdit = () => {
    if (!title.trim()) return;
    onUpdate(task.id, { title: title.trim(), description, priority, status });
    setEditing(false);
  };

  const cancelEdit = () => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setEditing(false);
  };

  const toggleDone = () => {
    const next: Status = task.status === 'done' ? 'todo' : 'done';
    onUpdate(task.id, { status: next });
    setStatus(next);
  };

  if (editing) {
    return (
      <div className={`bg-white rounded-xl border-l-4 ${PRIORITY_BORDER[priority]} shadow-sm p-4 space-y-3`}>
        <input
          className="w-full text-sm font-sans text-navy border-b border-gray-200 pb-1 focus:outline-none focus:border-gold"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          className="w-full text-xs font-sans text-navy/70 resize-none focus:outline-none focus:border-gold border border-gray-100 rounded p-2"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <div className="flex gap-2">
          <select
            className="text-xs border border-gray-200 rounded px-2 py-1 font-sans text-navy focus:outline-none focus:border-gold"
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="text-xs border border-gray-200 rounded px-2 py-1 font-sans text-navy focus:outline-none focus:border-gold"
            value={status}
            onChange={e => setStatus(e.target.value as Status)}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={cancelEdit}
            className="text-xs text-navy/50 px-3 py-1 rounded hover:bg-gray-50 font-sans transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="text-xs bg-navy text-cream px-3 py-1 rounded hover:bg-navy/90 font-sans transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-xl border-l-4 ${PRIORITY_BORDER[task.priority]} shadow-sm p-4 transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={toggleDone}
          className={`mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
            task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-gold'
          }`}
          aria-label="Toggle done"
        >
          {task.status === 'done' && (
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-sans font-medium text-navy leading-snug ${task.status === 'done' ? 'line-through text-navy/40' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-navy/50 font-sans mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full capitalize ${PRIORITY_BADGE[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[task.status]}`}>
              {STATUS_LABEL[task.status]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 text-navy/30 hover:text-gold rounded transition-colors"
            aria-label="Edit task"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path
                d="M11.5 2.5a1.414 1.414 0 012 2L5 13H2v-3L11.5 2.5z"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-navy/30 hover:text-red-500 rounded transition-colors"
            aria-label="Delete task"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path
                d="M3 4h10M6 4V2.5h4V4M5 4l.5 9h5L11 4"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
