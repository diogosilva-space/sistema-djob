import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Oportunidade, StatusOportunidade } from '../types/Oportunidade.types';
import { OportunidadeCard } from './OportunidadeCard';

// Definição de Tipos (Props)
interface PipelineKanbanProps {
  oportunidades: Oportunidade[];
  onMoveOportunidade?: (id: string, novoStatus: StatusOportunidade) => void;
  onClickOportunidade?: (oportunidade: Oportunidade) => void;
}

// Definição das colunas do Kanban
const COLUNAS_KANBAN = [
  {
    id: 'lead_qualificado' as StatusOportunidade,
    titulo: 'Lead Qualificado',
    cor: 'bg-category-5',
  },
  {
    id: 'contato_inicial' as StatusOportunidade,
    titulo: 'Contato Inicial',
    cor: 'bg-category-2',
  },
  {
    id: 'apresentacao' as StatusOportunidade,
    titulo: 'Apresentação',
    cor: 'bg-category-3',
  },
  {
    id: 'proposta_enviada' as StatusOportunidade,
    titulo: 'Proposta Enviada',
    cor: 'bg-category-1',
  },
  {
    id: 'negociacao' as StatusOportunidade,
    titulo: 'Negociação',
    cor: 'bg-category-4',
  },
  {
    id: 'fechado_ganho' as StatusOportunidade,
    titulo: 'Fechado (Ganho)',
    cor: 'bg-success',
  },
];

// Componente Funcional
export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  oportunidades,
  onMoveOportunidade,
  onClickOportunidade,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Agrupar oportunidades por status
  const oportunidadesPorStatus = useMemo(() => {
    const grouped: Record<StatusOportunidade, Oportunidade[]> = {
      lead_qualificado: [],
      contato_inicial: [],
      apresentacao: [],
      proposta_enviada: [],
      negociacao: [],
      fechado_ganho: [],
      fechado_perdido: [],
    };

    oportunidades.forEach((oportunidade) => {
      grouped[oportunidade.status].push(oportunidade);
    });

    return grouped;
  }, [oportunidades]);

  // Calcular valor total por coluna
  const calcularValorTotal = (status: StatusOportunidade) => {
    return oportunidadesPorStatus[status].reduce(
      (total, oportunidade) => total + oportunidade.valor,
      0
    );
  };

  // Funções de Manipulação de Eventos
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const oportunidadeId = active.id as string;
    const novoStatus = over.id as StatusOportunidade;

    if (onMoveOportunidade && COLUNAS_KANBAN.some((col) => col.id === novoStatus)) {
      onMoveOportunidade(oportunidadeId, novoStatus);
    }

    setActiveId(null);
  };

  const activeOportunidade = useMemo(
    () => oportunidades.find((o) => o.id === activeId),
    [activeId, oportunidades]
  );

  // Retorno JSX
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUNAS_KANBAN.map((coluna) => (
          <div key={coluna.id} className="flex-shrink-0 w-80">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {coluna.titulo}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {oportunidadesPorStatus[coluna.id].length}{' '}
                        {oportunidadesPorStatus[coluna.id].length === 1
                          ? 'oportunidade'
                          : 'oportunidades'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        R${' '}
                        {calcularValorTotal(coluna.id).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <SortableContext
                  id={coluna.id}
                  items={oportunidadesPorStatus[coluna.id].map((o) => o.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {oportunidadesPorStatus[coluna.id].map((oportunidade) => (
                    <OportunidadeCard
                      key={oportunidade.id}
                      oportunidade={oportunidade}
                      onClick={() => onClickOportunidade?.(oportunidade)}
                    />
                  ))}
                </SortableContext>

                {/* Área de Drop */}
                <div
                  id={coluna.id}
                  className="min-h-[100px] border-2 border-dashed border-transparent"
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Overlay durante drag */}
      <DragOverlay>
        {activeOportunidade && (
          <OportunidadeCard oportunidade={activeOportunidade} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  );
};
