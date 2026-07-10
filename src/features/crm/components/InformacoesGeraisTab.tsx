import React from 'react';
import { maskCPF, maskCNPJ } from '@/lib/utils/masks';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import { Cliente, TipoPessoa, Segmento, OrigemCliente } from '../types/Cliente.types';

interface InformacoesGeraisTabProps {
  formData: Partial<Cliente>;
  onChange: (field: string, value: any) => void;
}

export const InformacoesGeraisTab: React.FC<InformacoesGeraisTabProps> = ({
  formData,
  onChange,
}) => {
  const isPessoaJuridica = formData.tipoPessoa === 'juridica';

  return (
    <div className="space-y-4">
      {/* Tipo de Pessoa */}
      <FormField name="tipoPessoa">
        <FormItem>
          <FormLabel>Tipo de Pessoa *</FormLabel>
          <FormControl>
            <RadioGroup
              value={formData.tipoPessoa}
              onValueChange={(value) => onChange('tipoPessoa', value as TipoPessoa)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fisica" id="fisica" />
                <Label htmlFor="fisica" className="cursor-pointer">
                  Pessoa Física
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="juridica" id="juridica" />
                <Label htmlFor="juridica" className="cursor-pointer">
                  Pessoa Jurídica
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      </FormField>

      {/* Razão Social / Nome */}
      <FormField name="razaoSocial">
        <FormItem>
          <FormLabel>
            {isPessoaJuridica ? 'Razão Social' : 'Nome Completo'} *
          </FormLabel>
          <FormControl>
            <Input
              placeholder={isPessoaJuridica ? 'Digite a razão social' : 'Digite o nome completo'}
              value={formData.razaoSocial || ''}
              onChange={(e) => onChange('razaoSocial', e.target.value)}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      {/* Nome Fantasia (apenas PJ) */}
      {isPessoaJuridica && (
        <FormField name="nomeFantasia">
          <FormItem>
            <FormLabel>Nome Fantasia</FormLabel>
            <FormControl>
              <Input
                placeholder="Digite o nome fantasia"
                value={formData.nomeFantasia || ''}
                onChange={(e) => onChange('nomeFantasia', e.target.value)}
              />
            </FormControl>
          </FormItem>
        </FormField>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CPF / CNPJ */}
        <FormField name="cpfCnpj">
          <FormItem>
            <FormLabel>
              {isPessoaJuridica ? 'CNPJ' : 'CPF'} *
            </FormLabel>
            <FormControl>
              <Input
                placeholder={isPessoaJuridica ? '00.000.000/0000-00' : '000.000.000-00'}
                value={formData.cpfCnpj || ''}
                onChange={(e) => {
                  const masked = isPessoaJuridica
                    ? maskCNPJ(e.target.value)
                    : maskCPF(e.target.value);
                  onChange('cpfCnpj', masked);
                }}
                required
              />
            </FormControl>
          </FormItem>
        </FormField>

        {/* Inscrição Estadual (apenas PJ) */}
        {isPessoaJuridica && (
          <FormField name="inscricaoEstadual">
            <FormItem>
              <FormLabel>Inscrição Estadual</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite a inscrição estadual"
                  value={formData.inscricaoEstadual || ''}
                  onChange={(e) => onChange('inscricaoEstadual', e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Segmento */}
        <FormField name="segmento">
          <FormItem>
            <FormLabel>Segmento *</FormLabel>
            <FormControl>
              <Select
                value={formData.segmento}
                onValueChange={(value) => onChange('segmento', value as Segmento)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporativo">Corporativo</SelectItem>
                  <SelectItem value="Escolas">Escolas</SelectItem>
                  <SelectItem value="Eventos">Eventos</SelectItem>
                  <SelectItem value="Varejo">Varejo</SelectItem>
                  <SelectItem value="Governo">Governo</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>

        {/* Origem */}
        <FormField name="origem">
          <FormItem>
            <FormLabel>Origem</FormLabel>
            <FormControl>
              <Select
                value={formData.origem}
                onValueChange={(value) => onChange('origem', value as OrigemCliente)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Redes Sociais">Redes Sociais</SelectItem>
                  <SelectItem value="Feira/Evento">Feira/Evento</SelectItem>
                  <SelectItem value="Prospecção Ativa">Prospecção Ativa</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      {/* Vendedor Responsável */}
      <FormField name="vendedorResponsavel">
        <FormItem>
          <FormLabel>Vendedor Responsável *</FormLabel>
          <FormControl>
            <Select
              value={formData.vendedorResponsavel}
              onValueChange={(value) => onChange('vendedorResponsavel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor1">João Silva</SelectItem>
                <SelectItem value="vendedor2">Maria Santos</SelectItem>
                <SelectItem value="vendedor3">Pedro Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Vendedor responsável pelo relacionamento com este cliente
          </FormDescription>
        </FormItem>
      </FormField>

      {/* Tags */}
      <FormField name="tags">
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[42px]">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = formData.tags?.filter((_, i) => i !== index);
                      onChange('tags', newTags);
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Input
                placeholder="Digite e pressione Enter para adicionar tag"
                className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[120px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      const newTags = [...(formData.tags || []), value];
                      onChange('tags', newTags);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </FormControl>
          <FormDescription>
            Ex: "Fiel", "Potencial", "VIP", etc.
          </FormDescription>
        </FormItem>
      </FormField>

      {/* Observações */}
      <FormField name="observacoes">
        <FormItem>
          <FormLabel>Observações</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Digite observações sobre o cliente..."
              value={formData.observacoes || ''}
              onChange={(e) => onChange('observacoes', e.target.value)}
              rows={4}
              maxLength={500}
            />
          </FormControl>
          <FormDescription>
            Máximo de 500 caracteres ({formData.observacoes?.length || 0}/500)
          </FormDescription>
        </FormItem>
      </FormField>
    </div>
  );
};
