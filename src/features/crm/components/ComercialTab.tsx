import React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import { Cliente, CondicaoPagamento } from '../types/Cliente.types';

interface ComercialTabProps {
  formData: Partial<Cliente>;
  onChange: (field: string, value: any) => void;
}

export const ComercialTab: React.FC<ComercialTabProps> = ({ formData, onChange }) => {
  const formatarMoeda = (valor: string) => {
    // Remove tudo que não é número
    const numero = valor.replace(/\D/g, '');
    // Converte para número e divide por 100
    const valorNumerico = Number(numero) / 100;
    // Formata como moeda brasileira
    return valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleLimiteCreditoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarMoeda(e.target.value);
    const valorNumerico = Number(valorFormatado.replace(/\./g, '').replace(',', '.'));
    onChange('limiteCredito', valorNumerico);
  };

  return (
    <div className="space-y-4">
      {/* Limite de Crédito */}
      <FormField name="limiteCredito">
        <FormItem>
          <FormLabel>Limite de Crédito</FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                type="text"
                placeholder="0,00"
                value={
                  formData.limiteCredito
                    ? formData.limiteCredito.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : ''
                }
                onChange={handleLimiteCreditoChange}
                className="pl-9"
              />
            </div>
          </FormControl>
          <FormDescription>Limite de crédito aprovado para este cliente</FormDescription>
        </FormItem>
      </FormField>

      {/* Condição de Pagamento Padrão */}
      <FormField name="condicaoPagamentoPadrao">
        <FormItem>
          <FormLabel>Condição de Pagamento Padrão</FormLabel>
          <FormControl>
            <Select
              value={formData.condicaoPagamentoPadrao}
              onValueChange={(value) =>
                onChange('condicaoPagamentoPadrao', value as CondicaoPagamento)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a condição de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="À Vista">À Vista</SelectItem>
                <SelectItem value="7 dias">7 dias</SelectItem>
                <SelectItem value="14 dias">14 dias</SelectItem>
                <SelectItem value="21 dias">21 dias</SelectItem>
                <SelectItem value="28 dias">28 dias</SelectItem>
                <SelectItem value="30/60/90">30/60/90</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>Condição de pagamento padrão para este cliente</FormDescription>
        </FormItem>
      </FormField>

      {/* Tabela de Preço */}
      <FormField name="tabelaPreco">
        <FormItem>
          <FormLabel>Tabela de Preço</FormLabel>
          <FormControl>
            <Select
              value={formData.tabelaPreco}
              onValueChange={(value) => onChange('tabelaPreco', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tabela de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Tabela Padrão</SelectItem>
                <SelectItem value="atacado">Tabela Atacado</SelectItem>
                <SelectItem value="varejo">Tabela Varejo</SelectItem>
                <SelectItem value="especial">Tabela Especial</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>Tabela de preços diferenciada para este cliente</FormDescription>
        </FormItem>
      </FormField>

      <div className="border-t pt-4 mt-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Resumo Comercial</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Limite de Crédito:</span>
              <span className="font-medium">
                {formData.limiteCredito
                  ? `R$ ${formData.limiteCredito.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}`
                  : 'Não definido'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Condição de Pagamento:</span>
              <span className="font-medium">
                {formData.condicaoPagamentoPadrao || 'Não definida'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tabela de Preço:</span>
              <span className="font-medium">{formData.tabelaPreco || 'Padrão'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
