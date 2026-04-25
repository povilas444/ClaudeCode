'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/useTasks';
import type { Task } from '@/lib/types';
import StatsBar from './StatsBar';
import Calendar from './Calendar';
import TaskPanel from './TaskPanel';

export default function PlanrApp() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayClick = (date: string) => {
    setSelectedDate(prev => (prev === date ? null : date));
  };

  const dayTasks = selectedDate ? tasks.filter(t => t.dueDate === selectedDate) : [];

  const handleAdd = (data: Omit<Task, 'id' | 'createdAt'>) => {
    addTask(data);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cream">
      <StatsBar tasks={tasks} />

      <div className="flex flex-1 overflow-hidden">
        {/* Calendar area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <Calendar tasks={tasks} selectedDate={selectedDate} onDayClick={handleDayClick} />
        </div>

        {/* Sliding task panel */}
        <TaskPanel
          isOpen={!!selectedDate}
          selectedDate={selectedDate}
          tasks={dayTasks}
          onAdd={handleAdd}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onClose={() => setSelectedDate(null)}
        />
      </div>
    </div>
  );
}
