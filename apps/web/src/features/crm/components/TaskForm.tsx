'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskFormProps {
  onSubmit: (data: { title: string; dueDate: string; priority: string }) => void;
  isPending?: boolean;
}

export function TaskForm({ onSubmit, isPending }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dueDate) return;
    onSubmit({ title, dueDate: new Date(dueDate).toISOString(), priority });
    setTitle('');
    setDueDate('');
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 grid gap-2">
      <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Novo follow-up" required />
      <div className="flex gap-2">
        <Input className="flex-1" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} required />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
          aria-label="Prioridade"
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
        </select>
        <Button type="submit" size="sm" disabled={isPending}>Adicionar</Button>
      </div>
    </form>
  );
}
