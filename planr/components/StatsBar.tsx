'use client';

import type { Task } from '@/lib/types';

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  tasks: Task[];
}

export default function StatsBar({ tasks }: Props) {
  const today = localToday();
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const total = tasks.length;
  const completedToday = tasks.filter(t => t.status === 'done' && t.dueDate === today).length;
  const overdue = tasks.filter(t => t.dueDate < today && t.status !== 'done').length;

  const upcoming = tasks
    .filter(t => t.dueDate >= today && t.status !== 'done')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 10);

  return (
    <div className="bg-navy text-cream border-b border-navy">
      {/* Top row */}
      <div className="flex items-center justify-between px-8 pt-5 pb-3">
        <h1 className="font-heading text-3xl tracking-wider text-gold font-semibold">Planr</h1>
        <span className="text-sm text-cream/60 font-sans">{dateLabel}</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-8 px-8 pb-4">
        <Stat label="Total Tasks" value={total} />
        <div className="w-px h-8 bg-cream/10" />
        <Stat label="Done Today" value={completedToday} accent />
        <div className="w-px h-8 bg-cream/10" />
        <Stat label="Overdue" value={overdue} warn={overdue > 0} />
      </div>

      {/* Upcoming strip */}
      {upcoming.length > 0 && (
        <div className="px-8 pb-4 overflow-x-auto">
          <p className="text-xs uppercase tracking-widest text-cream/40 mb-2 font-sans">Upcoming</p>
          <div className="flex gap-3">
            {upcoming.map(t => (
              <UpcomingChip key={t.id} task={t} today={today} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent, warn }: { label: string; value: number; accent?: boolean; warn?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={`text-2xl font-heading font-semibold ${warn ? 'text-red-400' : accent ? 'text-gold' : 'text-cream'}`}>
        {value}
      </span>
      <span className="text-xs text-cream/50 uppercase tracking-wider font-sans">{label}</span>
    </div>
  );
}

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
};

function UpcomingChip({ task, today }: { task: Task; today: string }) {
  const isToday = task.dueDate === today;
  const parts = task.dueDate.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const label = isToday
    ? 'Today'
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="flex items-center gap-2 bg-navy-light/30 border border-cream/10 rounded-full px-3 py-1 shrink-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
      <span className="text-xs text-cream/80 font-sans truncate max-w-32">{task.title}</span>
      <span className="text-xs text-cream/40 font-sans shrink-0">{label}</span>
    </div>
  );
}
