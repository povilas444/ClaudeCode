'use client';

import { useState, useEffect } from 'react';
import type { Task } from './types';

const KEY = 'planr_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    persist([...tasks, task]);
  };

  const updateTask = (
    id: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'dueDate' | 'priority' | 'status'>>
  ) => {
    persist(tasks.map(t => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTask = (id: string) => {
    persist(tasks.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTask, deleteTask };
}
