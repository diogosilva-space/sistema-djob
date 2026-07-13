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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface PedidoCompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const PedidoCompraModal: React.FC<PedidoCompraModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [fornecedor, setFornecedor] = useState('');
  const [valor, setValor] = useState(0);
  const [previsao, setPrevisao] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleSave = () => {
    if (!fornecedor || valor <= 0 || !previsao) {
      alert('Preencha os campos obrigatórios');
      return;
    }
    onSave({ fornecedor, valor, previsao, observacoes });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Pedido de Compra</DialogTitle>
          <DialogDescription>
            Crie um novo pedido para aquisição de suprimentos ou produtos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Select value={fornecedor} onValueChange={setFornecedor}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o fornecedor..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="textil-brasil">Têxtil Brasil S.A.</SelectItem>
                <SelectItem value="brindes-express">Brindes Express Ltda</SelectItem>
                <SelectItem value="tecidos-sul">Tecidos do Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor Estimado (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previsao">Previsão de Entrega</Label>
            <Input
              id="previsao"
              type="date"
              value={previsao}
              onChange={(e) => setPrevisao(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observações / Itens</Label>
            <Textarea
              id="obs"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Liste os itens ou adicione observações..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Gerar Pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
