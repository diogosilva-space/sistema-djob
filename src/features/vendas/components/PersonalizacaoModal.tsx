import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

import {
  Personalizacao,
  TecnicaPersonalizacao,
  TECNICAS_PERSONALIZACAO,
} from '../types/Orcamento.types';

// Definição de Tipos (Props)
interface PersonalizacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personalizacao?: Personalizacao;
  onSave: (personalizacao: Personalizacao) => void;
}

// Técnicas que requerem número de cores
const TECNICAS_COM_CORES: TecnicaPersonalizacao[] = ['SIL', 'SIL360', 'SILTEX', 'TAM'];

// Componente Funcional
export const PersonalizacaoModal: React.FC<PersonalizacaoModalProps> = ({
  open,
  onOpenChange,
  personalizacao: personalizacaoInicial,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Personalizacao>>({
    posicaoArte: 'Frente',
    tamanhoArte: 'Médio (10x10cm)',
    numeroCores: 1,
    custoCalculado: 0,
    arquivos: [],
  });

  useEffect(() => {
    if (personalizacaoInicial) {
      setFormData(personalizacaoInicial);
    } else {
      setFormData({
        posicaoArte: 'Frente',
        tamanhoArte: 'Médio (10x10cm)',
        numeroCores: 1,
        custoCalculado: 0,
        arquivos: [],
      });
    }
  }, [personalizacaoInicial, open]);

  // Calcular custo automaticamente
  useEffect(() => {
    if (formData.tecnica) {
      const tecnicaInfo = TECNICAS_PERSONALIZACAO[formData.tecnica];
      let custo = tecnicaInfo.custoBase;

      // Ajustar custo conforme número de cores para técnicas específicas
      if (TECNICAS_COM_CORES.includes(formData.tecnica) && formData.numeroCores) {
        custo = tecnicaInfo.custoBase * formData.numeroCores;
      }

      setFormData((prev) => ({ ...prev, custoCalculado: custo }));
    }
  }, [formData.tecnica, formData.numeroCores]);

  // Handlers
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddArquivo = (arquivo: string) => {
    setFormData((prev) => ({
      ...prev,
      arquivos: [...(prev.arquivos || []), arquivo],
    }));
  };

  const handleRemoveArquivo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      arquivos: prev.arquivos?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!formData.tecnica || !formData.posicaoArte || !formData.tamanhoArte) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData as Personalizacao);
    onOpenChange(false);
  };

  const showNumeroCores = formData.tecnica && TECNICAS_COM_CORES.includes(formData.tecnica);

  // Retorno JSX
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Personalização</DialogTitle>
          <DialogDescription>
            Configure os detalhes da personalização do produto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Técnica de Personalização */}
          <div className="space-y-2">
            <Label htmlFor="tecnica">
              Técnica de Personalização <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tecnica}
              onValueChange={(value) =>
                handleFieldChange('tecnica', value as TecnicaPersonalizacao)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a técnica" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TECNICAS_PERSONALIZACAO).map((tecnica) => (
                  <SelectItem key={tecnica.codigo} value={tecnica.codigo}>
                    <div className="flex flex-col">
                      <span>{tecnica.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        R$ {tecnica.custoBase.toFixed(2)} - {tecnica.variavelCusto}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Número de Cores (Condicional) */}
          {showNumeroCores && (
            <div className="space-y-2">
              <Label htmlFor="numeroCores">
                Número de Cores <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numeroCores"
                type="number"
                min="1"
                max="10"
                value={formData.numeroCores || 1}
                onChange={(e) =>
                  handleFieldChange('numeroCores', parseInt(e.target.value) || 1)
                }
              />
              <p className="text-xs text-muted-foreground">
                Quantidade de cores diferentes (1-10)
              </p>
            </div>
          )}

          {/* Posição da Arte */}
          <div className="space-y-2">
            <Label htmlFor="posicaoArte">
              Posição da Arte <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.posicaoArte}
              onValueChange={(value) => handleFieldChange('posicaoArte', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frente">Frente</SelectItem>
                <SelectItem value="Costas">Costas</SelectItem>
                <SelectItem value="Manga">Manga</SelectItem>
                <SelectItem value="Lateral">Lateral</SelectItem>
                <SelectItem value="360°">360° (Circular)</SelectItem>
                <SelectItem value="Alça">Alça</SelectItem>
                <SelectItem value="Tampa">Tampa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tamanho da Arte */}
          <div className="space-y-2">
            <Label htmlFor="tamanhoArte">
              Tamanho da Arte <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tamanhoArte}
              onValueChange={(value) => handleFieldChange('tamanhoArte', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pequeno (5x5cm)">Pequeno (5x5cm)</SelectItem>
                <SelectItem value="Médio (10x10cm)">Médio (10x10cm)</SelectItem>
                <SelectItem value="Grande (20x20cm)">Grande (20x20cm)</SelectItem>
                <SelectItem value="Extra Grande (30x30cm)">
                  Extra Grande (30x30cm)
                </SelectItem>
                <SelectItem value="Personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Arte (Placeholder) */}
          <div className="space-y-2">
            <Label htmlFor="upload">Upload da Arte</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                .ai, .pdf, .png, .jpg (máx. 10MB)
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Selecionar Arquivos
              </Button>
            </div>
            {formData.arquivos && formData.arquivos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.arquivos.map((arquivo, index) => (
                  <Badge key={index} variant="secondary">
                    {arquivo}
                    <button
                      onClick={() => handleRemoveArquivo(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações da Personalização</Label>
            <Textarea
              id="observacoes"
              placeholder="Instruções especiais, detalhes adicionais..."
              value={formData.observacoes || ''}
              onChange={(e) => handleFieldChange('observacoes', e.target.value)}
              maxLength={300}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.observacoes?.length || 0}/300
            </p>
          </div>

          {/* Custo Calculado */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Custo de Personalização:</Label>
              <span className="text-2xl font-bold text-green-600">
                R$ {formData.custoCalculado?.toFixed(2) || '0,00'}
              </span>
            </div>
            {formData.tecnica && (
              <p className="text-xs text-muted-foreground mt-1">
                {TECNICAS_PERSONALIZACAO[formData.tecnica].variavelCusto}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Personalização</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
