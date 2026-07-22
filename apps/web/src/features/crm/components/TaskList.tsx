'use client';

import { CheckCircle2, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Task } from '../types/Opportunity.types';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  isPending?: boolean;
}

export function TaskList({ tasks, onComplete, isPending }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">Nenhum follow-up pendente.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => {
        const isDone = task.status === 'COMPLETED';
        return (
          <li key={task.id} className="flex items-start gap-2 rounded-xl border border-white/20 dark:border-white/[0.08] bg-white/30 dark:bg-white/[0.04] p-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full p-0"
              onClick={() => !isDone && onComplete(task.id)}
              disabled={isDone || isPending}
              aria-label={isDone ? 'Tarefa concluída' : 'Concluir tarefa'}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <div className="min-w-0 flex-1">
              <p
                className={
                  isDone
                    ? 'text-sm text-muted-foreground line-through'
                    : 'text-sm font-medium text-foreground'
                }
              >
                {task.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Intl.DateTimeFormat('pt-BR').format(new Date(task.dueDate))} ·{' '}
                {task.assignedTo.name}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
