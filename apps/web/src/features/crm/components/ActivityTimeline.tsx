'use client';

import { Mail, MessageCircle, Phone, StickyNote, Users } from 'lucide-react';

import type { Activity } from '../types/Opportunity.types';

interface ActivityTimelineProps {
  activities: Activity[];
}

const activityIcons = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  WHATSAPP: MessageCircle,
  NOTE: StickyNote,
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-white/15 dark:divide-white/[0.06]">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type];
        return (
          <li key={activity.id} className="flex gap-3 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/10 backdrop-blur-sm text-primary">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-foreground">{activity.subject}</p>
                <time className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(activity.occurredAt))}
                </time>
              </div>
              {activity.description && (
                <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">{activity.user.name}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
