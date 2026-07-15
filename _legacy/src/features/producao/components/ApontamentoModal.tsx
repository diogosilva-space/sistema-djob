import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EtapaProducao } from '@/features/producao/types/Producao.types';

interface ApontamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  etapa: EtapaProducao;
  onSave: (data: any) => void;
}

export const ApontamentoModal: React.FC<ApontamentoModalProps> = ({
  isOpen,
  onClose,
  etapa,
  onSave,
}) => {
  const [tipo, setTipo] = useState<'Início' | 'Fim'>(
    etapa.status === 'Pendente' ? 'Início' : 'Fim',
  );
  const [responsavel, setResponsavel] = useState(etapa.responsavelNome || '');
  const [quantidade, setQuantidade] = useState<number>(0);
  const [defeito, setDefeito] = useState<number>(0);
  const [observacoes, setObservacoes] = useState('');

  const handleSave = () => {
    onSave({
      tipo,
      responsavel,
      quantidade,
      defeito,
      observacoes,
      dataHora: new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apontamento de Etapa: {etapa.nome}</DialogTitle>
          <DialogDescription>Registre o progresso desta etapa na produção.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Ação</Label>
            <RadioGroup
              value={tipo}
              onValueChange={(v) => setTipo(v as 'Início' | 'Fim')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Início" id="inicio" />
                <Label htmlFor="inicio" className="font-normal cursor-pointer">
                  Iniciar
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Fim" id="fim" />
                <Label htmlFor="fim" className="font-normal cursor-pointer">
                  Finalizar
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome do operador"
              className="h-9 text-sm"
            />
          </div>

          {tipo === 'Fim' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Qtd. Processada</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defeito">Qtd. Defeito</Label>
                <Input
                  id="defeito"
                  type="number"
                  value={defeito}
                  onChange={(e) => setDefeito(parseFloat(e.target.value) || 0)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Instruções ou alertas..."
              className="text-sm min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="h-9">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="h-9">
            Salvar Apontamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
