'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MessageCircle, Phone, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { activitiesApi, opportunitiesApi, tasksApi } from '../api/opportunities.api';

import { ActivityForm } from './ActivityForm';
import { ActivityTimeline } from './ActivityTimeline';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

interface OpportunityDetailProps {
  id: string;
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function OpportunityDetail({ id }: OpportunityDetailProps) {
  const queryClient = useQueryClient();
  const detail = useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => opportunitiesApi.getOne(id),
  });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['opportunities', id] });
    void queryClient.invalidateQueries({ queryKey: ['opportunities'] });
  };
  const activityMutation = useMutation({ mutationFn: activitiesApi.create, onSuccess: refresh });
  const taskMutation = useMutation({ mutationFn: tasksApi.create, onSuccess: refresh });
  const completeTaskMutation = useMutation({ mutationFn: tasksApi.complete, onSuccess: refresh });

  if (detail.isLoading)
    return (
      <div className="rounded-xl glass-card p-8 text-sm text-muted-foreground">
        Carregando oportunidade...
      </div>
    );
  if (detail.isError || !detail.data)
    return (
      <div className="rounded-xl glass-card border-destructive/20 p-8 text-sm text-destructive">
        Não foi possível carregar a oportunidade.
      </div>
    );
  const opportunity = detail.data;
  const contact = opportunity.contact ?? opportunity.customer;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">{opportunity.name}</CardTitle>
            <CardDescription>
              {currency.format(Number(opportunity.value))} · Probabilidade {opportunity.probability}
              % · {opportunity.status.replaceAll('_', ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <ActivityForm
              isPending={activityMutation.isPending}
              onSubmit={(data) =>
                activityMutation.mutate({
                  ...data,
                  opportunityId: opportunity.id,
                  contactId: contact?.id,
                })
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">Histórico de atividades</CardTitle>
            <CardDescription>Interações registradas para esta negociação</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ActivityTimeline activities={opportunity.activities} />
          </CardContent>
        </Card>
      </div>
      <aside className="space-y-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-2 text-sm">
            {contact ? (
              <>
                <Link
                  href={`/contacts/${contact.id}`}
                  className="flex items-center gap-2 font-medium text-foreground hover:text-primary"
                >
                  <UserRound className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  {contact.name}
                </Link>
                {contact.mobile && (
                  <a
                    href={`https://wa.me/${contact.mobile.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                    WhatsApp
                  </a>
                )}
                {contact.phone && (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" strokeWidth={1.5} />
                    {contact.phone}
                  </span>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                    {contact.email}
                  </a>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Contato não associado.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold">Follow-ups</CardTitle>
            <CardDescription>Próximas ações desta oportunidade</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <TaskList
              tasks={opportunity.tasks}
              onComplete={(taskId) => completeTaskMutation.mutate(taskId)}
              isPending={completeTaskMutation.isPending}
            />
            <TaskForm
              isPending={taskMutation.isPending}
              onSubmit={(data) =>
                taskMutation.mutate({
                  ...data,
                  opportunityId: opportunity.id,
                  contactId: contact?.id,
                })
              }
            />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
