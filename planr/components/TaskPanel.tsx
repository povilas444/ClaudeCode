'use client';

import { useState } from 'react';
import type { Task, Priority, Status } from '@/lib/types';
import TaskCard from './TaskCard';

interface Props {
  isOpen: boolean;
  selectedDate: string | null;
  tasks: Task[];
  onAdd: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, patch: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const EMPTY_FORM = { title: '', description: '', priority: 'medium' as Priority, status: 'todo' as Status };

function formatPanelDate(dateStr: string): string {
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TaskPanel({ isOpen, selectedDate, tasks, onAdd, onUpdate, onDelete, onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const today = localToday();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !selectedDate) return;
    onAdd({ title: form.title.trim(), description: form.description, priority: form.priority, status: form.status, dueDate: selectedDate });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const dateLabel = selectedDate ? formatPanelDate(selectedDate) : '';
  const isToday = selectedDate === today;
  const isPast = selectedDate ? selectedDate < today : false;

  return (
    <div
      className={`
        flex flex-col bg-white border-l border-gray-100 shadow-2xl
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-80 xl:w-96' : 'w-0'}
      `}
    >
      {isOpen && selectedDate && (
        <div className="flex flex-col h-full min-w-80 xl:min-w-96">
          {/* Panel header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs uppercase tracking-widest text-navy/40 font-sans mb-1">
                {isToday ? 'Today' : isPast ? 'Past' : 'Upcoming'}
              </p>
              <h3 className="font-heading text-lg font-semibold text-navy leading-tight">{dateLabel}</h3>
              <p className="text-xs text-navy/40 font-sans mt-1">
                {tasks.length === 0 ? 'No tasks' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-navy/30 hover:text-navy transition-colors p-1 -mr-1 mt-0.5"
              aria-label="Close panel"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {tasks.length === 0 && !showForm && (
              <div className="text-center py-10">
                <p className="text-navy/30 font-sans text-sm">No tasks for this day</p>
              </div>
            )}
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>

          {/* Add form / button */}
          <div className="px-5 pb-5 pt-2 border-t border-gray-100">
            {showForm ? (
              <form onSubmit={submit} className="space-y-3">
                <input
                  className="w-full text-sm font-sans text-navy border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Task title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  autoFocus
                  required
                />
                <textarea
                  className="w-full text-xs font-sans text-navy/70 border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-gold transition-colors"
                  placeholder="Description (optional)"
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  <select
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-2 font-sans text-navy focus:outline-none focus:border-gold"
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                  <select
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-2 font-sans text-navy focus:outline-none focus:border-gold"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                    className="flex-1 text-xs text-navy/50 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 font-sans transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-xs bg-navy text-cream rounded-lg py-2 hover:bg-navy/90 font-sans transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-2 text-sm font-sans text-navy/40 border border-dashed border-gray-200 rounded-xl py-3 px-4 hover:border-gold hover:text-gold transition-colors"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
                Add a task
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
