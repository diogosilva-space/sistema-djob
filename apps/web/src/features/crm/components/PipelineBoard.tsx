'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { opportunitiesApi } from '../api/opportunities.api';
import type { Opportunity, OpportunityStatus } from '../types/Opportunity.types';

import { CreateOpportunityModal } from './CreateOpportunityModal';
import { PipelineColumn } from './PipelineColumn';
import { PipelineKpis } from './PipelineKpis';
import { StageChangeModal } from './StageChangeModal';
import { OpportunityCard } from './OpportunityCard';

const CLOSED_STAGES: OpportunityStatus[] = ['FECHADO_GANHO', 'FECHADO_PERDIDO'];

export function PipelineBoard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState<{
    opportunity: Opportunity;
    status: Extract<OpportunityStatus, 'FECHADO_GANHO' | 'FECHADO_PERDIDO'>;
  } | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const query = search.trim() ? { search: search.trim() } : {};
  const pipeline = useQuery({
    queryKey: ['opportunities', 'pipeline', query],
    queryFn: () => opportunitiesApi.getPipeline(query),
  });
  const metrics = useQuery({
    queryKey: ['opportunities', 'metrics'],
    queryFn: () => opportunitiesApi.getMetrics(),
  });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['opportunities'] });
  };
  const createMutation = useMutation({
    mutationFn: opportunitiesApi.create,
    onSuccess: () => {
      setIsCreateOpen(false);
      refresh();
    },
  });
  const stageMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof opportunitiesApi.changeStage>[1];
    }) => opportunitiesApi.changeStage(id, data),
    onSuccess: () => {
      setPendingStage(null);
      refresh();
    },
  });

  const columns = pipeline.data ?? [];
  const activeColumns = columns.filter((column) => !CLOSED_STAGES.includes(column.status));
  const closedColumns = columns.filter((column) => CLOSED_STAGES.includes(column.status));

  function handleDragEnd(event: DragEndEvent) {
    const destination = event.over?.id as OpportunityStatus | undefined;
    if (!destination || destination === event.active.data.current?.status) return;
    const opportunity = columns
      .flatMap((column) => column.opportunities)
      .find((item) => item.id === event.active.id);
    if (!opportunity) return;

    if (destination === 'FECHADO_GANHO' || destination === 'FECHADO_PERDIDO') {
      setPendingStage({ opportunity, status: destination });
      return;
    }

    stageMutation.mutate({ id: opportunity.id, data: { status: destination } });
  }

  if (pipeline.isLoading || metrics.isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
        Carregando pipeline...
      </div>
    );
  }

  if (pipeline.isError || metrics.isError || !metrics.data) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-card p-8 text-sm text-destructive">
        Não foi possível carregar o pipeline comercial.
      </div>
    );
  }

  return (
    <>
      <PipelineKpis metrics={metrics.data} />
      <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.5}
            />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar oportunidade ou cliente"
            />
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nova oportunidade
          </Button>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="hidden gap-3 overflow-x-auto pb-2 md:flex">
            {activeColumns.map((column) => (
              <PipelineColumn key={column.status} column={column} />
            ))}
            {closedColumns.map((column) => (
              <PipelineColumn key={column.status} column={column} collapsed />
            ))}
          </div>
          <div className="space-y-3 md:hidden">
            {[...activeColumns, ...closedColumns].map((column) => (
              <details
                key={column.status}
                className="rounded-lg border border-border bg-card p-3"
                open={column.count > 0}
              >
                <summary className="cursor-pointer text-sm font-semibold text-foreground">
                  {column.status.replaceAll('_', ' ')}{' '}
                  <span className="ml-1 text-muted-foreground">({column.count})</span>
                </summary>
                <div className="mt-3 space-y-2">
                  {column.opportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity.id}
                      opportunity={opportunity}
                      draggable={false}
                    />
                  ))}
                  {column.opportunities.length === 0 && (
                    <p className="py-2 text-xs text-muted-foreground">Nenhuma oportunidade</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </DndContext>
      </section>
      {isCreateOpen && (
        <CreateOpportunityModal
          onCancel={() => setIsCreateOpen(false)}
          onCreate={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}
      {pendingStage && (
        <StageChangeModal
          opportunity={pendingStage.opportunity}
          status={pendingStage.status}
          isPending={stageMutation.isPending}
          onCancel={() => setPendingStage(null)}
          onConfirm={(data) =>
            stageMutation.mutate({
              id: pendingStage.opportunity.id,
              data: { status: pendingStage.status, ...data },
            })
          }
        />
      )}
    </>
  );
}
