'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRIORITY_DOT: Record<string, string> = {
  low: 'bg-emerald-400',
  medium: 'bg-amber-400',
  high: 'bg-red-400',
};

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface Props {
  tasks: Task[];
  selectedDate: string | null;
  onDayClick: (date: string) => void;
}

export default function Calendar({ tasks, selectedDate, onDayClick }: Props) {
  const today = localToday();
  const todayDate = new Date();

  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  // Index tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  for (const task of tasks) {
    if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
    tasksByDate[task.dueDate].push(task);
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setViewYear(todayDate.getFullYear());
    setViewMonth(todayDate.getMonth());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="font-heading text-2xl font-semibold text-navy">
            {MONTHS[viewMonth]} <span className="text-navy/40">{viewYear}</span>
          </h2>
          {(viewYear !== todayDate.getFullYear() || viewMonth !== todayDate.getMonth()) && (
            <button
              onClick={goToday}
              className="text-xs text-gold border border-gold/40 px-3 py-1 rounded-full hover:bg-gold/10 font-sans transition-colors"
            >
              Today
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <NavBtn onClick={prevMonth} label="Previous month">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavBtn>
          <NavBtn onClick={nextMonth} label="Next month">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavBtn>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-sans font-medium uppercase tracking-widest text-navy/30 pb-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNum = i - firstDay + 1;
          if (dayNum < 1 || dayNum > daysInMonth) {
            return <div key={i} />;
          }

          const dateStr = toDateStr(viewYear, viewMonth, dayNum);
          const dayTasks = tasksByDate[dateStr] ?? [];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasOverdue = dayTasks.some(t => dateStr < today && t.status !== 'done');

          // Show up to 3 priority dots (deduplicated by priority)
          const dotPriorities = [...new Set(dayTasks.map(t => t.priority))].slice(0, 3);

          return (
            <button
              key={i}
              onClick={() => onDayClick(isSelected ? dateStr : dateStr)}
              className={`
                relative flex flex-col items-center justify-start pt-2 pb-1 rounded-xl min-h-16 transition-all
                ${isSelected ? 'bg-gold text-cream shadow-md' : isToday ? 'bg-navy text-cream' : 'hover:bg-navy/5 text-navy'}
                ${hasOverdue && !isSelected && !isToday ? 'ring-1 ring-red-300' : ''}
              `}
            >
              <span className={`text-sm font-sans font-medium leading-none ${isSelected || isToday ? 'text-current' : ''}`}>
                {dayNum}
              </span>
              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center px-1">
                  {dotPriorities.map(p => (
                    <span
                      key={p}
                      className={`w-1.5 h-1.5 rounded-full ${isSelected || isToday ? 'bg-current opacity-60' : PRIORITY_DOT[p]}`}
                    />
                  ))}
                </div>
              )}
              {dayTasks.length > 3 && (
                <span className={`text-[9px] font-sans mt-0.5 ${isSelected || isToday ? 'opacity-70' : 'text-navy/40'}`}>
                  +{dayTasks.length - 3}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-navy/50 hover:text-navy hover:bg-navy/5 transition-colors"
    >
      {children}
    </button>
  );
}
