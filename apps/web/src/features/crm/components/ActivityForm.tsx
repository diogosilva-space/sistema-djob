'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ActivityFormProps {
  onSubmit: (data: { type: string; subject: string; description?: string }) => void;
  isPending?: boolean;
}

export function ActivityForm({ onSubmit, isPending }: ActivityFormProps) {
  const [type, setType] = useState('CALL');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ type, subject, description: description || undefined });
    setSubject('');
    setDescription('');
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/20 dark:border-white/[0.08] bg-white/20 dark:bg-white/[0.03] p-3">
      <div className="grid gap-2 sm:grid-cols-[9rem_1fr_auto]">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-8 rounded-lg border glass-input px-3 text-sm text-foreground"
          aria-label="Tipo de atividade"
        >
          <option value="CALL">Ligação</option>
          <option value="EMAIL">E-mail</option>
          <option value="MEETING">Reunião</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="NOTE">Nota</option>
        </select>
        <Input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="O que aconteceu?"
          required
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Registrar'}
        </Button>
      </div>
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="mt-2 min-h-16 w-full rounded-lg border glass-input px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Detalhes opcionais"
      />
    </form>
  );
}
