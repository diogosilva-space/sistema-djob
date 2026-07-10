import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ptBR } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';
import { GripVertical, DollarSign, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Oportunidade } from '../types/Oportunidade.types';

// Definição de Tipos (Props)
interface OportunidadeCardProps {
  oportunidade: Oportunidade;
  onClick?: () => void;
  isDragging?: boolean;
}

// Função auxiliar para determinar a cor da badge de probabilidade
const getProbabilidadeBadgeVariant = (probabilidade: number) => {
  if (probabilidade < 30) return 'destructive';
  if (probabilidade < 70) return 'secondary';
  return 'default';
};

// Componente Funcional
export const OportunidadeCard: React.FC<OportunidadeCardProps> = ({
  oportunidade,
  onClick,
  isDragging = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: oportunidade.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const dataRelativa = formatDistanceToNow(new Date(oportunidade.dataUltimaInteracao), {
    addSuffix: true,
    locale: ptBR,
  });

  // Retorno JSX
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg' : ''
        }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">
              {oportunidade.nomeCliente}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium text-success">
                R${' '}
                {oportunidade.valor.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-accent rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {/* Probabilidade */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Probabilidade</span>
          <Badge
            variant={getProbabilidadeBadgeVariant(oportunidade.probabilidade)}
            className="text-xs"
          >
            {oportunidade.probabilidade}%
          </Badge>
        </div>

        {/* Vendedor */}
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">
            {oportunidade.vendedor}
          </span>
        </div>

        {/* Última Interação */}
        <p className="text-xs text-muted-foreground">{dataRelativa}</p>

        {/* Tags */}
        {oportunidade.tags && oportunidade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {oportunidade.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {oportunidade.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{oportunidade.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
