'use client';

import { Mail, MessageCircle, Phone, UserRound } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { PageActionHeader } from '@/components/dashboard/PageActionHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contactsApi } from '@/features/crm/api/contacts.api';

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const contact = useQuery({ queryKey: ['contacts', id], queryFn: () => contactsApi.getOne(id) });

  if (contact.isLoading)
    return <div className="text-sm text-muted-foreground">Carregando contato...</div>;
  if (contact.isError || !contact.data)
    return <div className="text-sm text-destructive">Não foi possível carregar o contato.</div>;
  const data = contact.data;
  const activities =
    (data.activities as
      | Array<{ id: string; subject: string; occurredAt: string; description?: string }>
      | undefined) ?? [];
  const opportunities =
    (data.opportunities as
      Array<{ id: string; name: string; status: string; value: number | string }> | undefined) ??
    [];
  const tasks =
    (data.tasks as
      Array<{ id: string; title: string; dueDate: string; status: string }> | undefined) ?? [];

  return (
    <div className="space-y-6 mt-6">
      <PageActionHeader
        icon={UserRound}
        title={data.name}
        subtitle="Visão 360° de relacionamento"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold">Dados cadastrais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-4 pt-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Documento: </span>
                {data.document ?? '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Papel: </span>
                {data.role}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {data.email ?? '—'}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {data.mobile ?? data.phone ?? '—'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold">Histórico de interações</CardTitle>
              <CardDescription>Atividades registradas neste contato</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {activities.length ? (
                <ul className="divide-y divide-white/15 dark:divide-white/[0.06]">
                  {activities.map((activity) => (
                    <li key={activity.id} className="py-3">
                      <p className="text-sm font-medium">{activity.subject}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(activity.occurredAt))}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-sm text-muted-foreground">Nenhuma interação registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold">Oportunidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-2">
              {opportunities.length ? (
                opportunities.map((opportunity) => (
                  <a
                    className="block rounded-lg border border-white/20 dark:border-white/[0.08] p-3 text-sm hover:bg-white/15 dark:hover:bg-white/[0.06]"
                    key={opportunity.id}
                    href={`/crm/opportunities/${opportunity.id}`}
                  >
                    <p className="font-medium">{opportunity.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {opportunity.status.replaceAll('_', ' ')}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma oportunidade.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-semibold">Tarefas pendentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 pt-2">
              {tasks.length ? (
                tasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-white/20 dark:border-white/[0.08] p-3 text-sm">
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('pt-BR').format(new Date(task.dueDate))}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum follow-up.</p>
              )}
            </CardContent>
          </Card>
          {data.mobile && (
            <a
              className="flex h-8 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              href={`https://wa.me/${data.mobile.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
