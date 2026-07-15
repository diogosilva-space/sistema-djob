'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { Opportunity, OpportunityStatus } from '../types/Opportunity.types';

interface StageChangeModalProps {
  opportunity: Opportunity;
  status: Extract<OpportunityStatus, 'FECHADO_GANHO' | 'FECHADO_PERDIDO'>;
  onCancel: () => void;
  onConfirm: (data: { value?: number; lostReason?: string }) => void;
  isPending?: boolean;
}

export function StageChangeModal({
  opportunity,
  status,
  onCancel,
  onConfirm,
  isPending,
}: StageChangeModalProps) {
  const [value, setValue] = useState(String(opportunity.value));
  const [lostReason, setLostReason] = useState('');
  const isWon = status === 'FECHADO_GANHO';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isWon && !lostReason.trim()) return;
    onConfirm({
      ...(isWon ? { value: Number(value) } : {}),
      ...(!isWon ? { lostReason: lostReason.trim() } : {}),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-lg"
      >
        <h2 className="text-base font-semibold text-foreground">
          {isWon ? 'Confirmar oportunidade ganha' : 'Registrar oportunidade perdida'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{opportunity.name}</p>
        <div className="mt-5 space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="stage-change-field">
            {isWon ? 'Valor final' : 'Motivo da perda'}
          </label>
          <Input
            id="stage-change-field"
            type={isWon ? 'number' : 'text'}
            min={isWon ? 0 : undefined}
            step={isWon ? '0.01' : undefined}
            value={isWon ? value : lostReason}
            onChange={(event) =>
              isWon ? setValue(event.target.value) : setLostReason(event.target.value)
            }
            placeholder={isWon ? '0,00' : 'Ex.: preço, concorrência, sem resposta'}
            required
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
