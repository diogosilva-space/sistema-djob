import React, { useState } from 'react';
import { maskCEP } from '@/lib/utils/masks';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import { Cliente, Endereco, TipoEndereco } from '../types/Cliente.types';
import { buscarCEP } from '@/lib/viaCep';

interface EnderecosTabProps {
  formData: Partial<Cliente>;
  onChange: (field: string, value: any) => void;
}

export const EnderecosTab: React.FC<EnderecosTabProps> = ({ formData, onChange }) => {
  const [buscandoCEP, setBuscandoCEP] = useState<number | null>(null);

  const enderecos = formData.enderecos || [];

  const handleAddEndereco = () => {
    const novoEndereco: Endereco = {
      tipo: 'Ambos',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
    };
    onChange('enderecos', [...enderecos, novoEndereco]);
  };

  const handleRemoveEndereco = (index: number) => {
    const novosEnderecos = enderecos.filter((_, i) => i !== index);
    onChange('enderecos', novosEnderecos);
  };

  const handleEnderecoChange = (index: number, field: keyof Endereco, value: any) => {
    const novosEnderecos = [...enderecos];
    novosEnderecos[index] = { ...novosEnderecos[index], [field]: value };
    onChange('enderecos', novosEnderecos);
  };

  const handleBuscarCEP = async (index: number, cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    setBuscandoCEP(index);
    try {
      const resultado = await buscarCEP(cepLimpo);
      if (resultado) {
        const novosEnderecos = [...enderecos];
        novosEnderecos[index] = {
          ...novosEnderecos[index],
          logradouro: resultado.logradouro,
          bairro: resultado.bairro,
          cidade: resultado.localidade,
          estado: resultado.uf,
        };
        onChange('enderecos', novosEnderecos);
      } else {
        alert('CEP não encontrado');
      }
    } catch (error) {
      alert('Erro ao buscar CEP');
    } finally {
      setBuscandoCEP(null);
    }
  };

  return (
    <div className="space-y-4">
      {enderecos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum endereço cadastrado. Clique em "Adicionar Endereço" para começar.
        </div>
      ) : (
        enderecos.map((endereco, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Endereço {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEndereco(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tipo de Endereço */}
              <FormField name={`endereco-${index}-tipo`}>
                <FormItem>
                  <FormLabel>Tipo de Endereço *</FormLabel>
                  <FormControl>
                    <Select
                      value={endereco.tipo}
                      onValueChange={(value) =>
                        handleEnderecoChange(index, 'tipo', value as TipoEndereco)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Faturamento">Faturamento</SelectItem>
                        <SelectItem value="Entrega">Entrega</SelectItem>
                        <SelectItem value="Ambos">Ambos</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              </FormField>

              {/* CEP */}
              <FormField name={`endereco-${index}-cep`}>
                <FormItem>
                  <FormLabel>CEP *</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="00000-000"
                        value={endereco.cep}
                        onChange={(e) =>
                          handleEnderecoChange(index, 'cep', maskCEP(e.target.value))
                        }
                        onBlur={(e) => handleBuscarCEP(index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleBuscarCEP(index, endereco.cep)}
                        disabled={buscandoCEP === index}
                      >
                        {buscandoCEP === index ? 'Buscando...' : 'Buscar'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>O endereço será preenchido automaticamente</FormDescription>
                </FormItem>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Logradouro */}
                <div className="md:col-span-3">
                  <FormField name={`endereco-${index}-logradouro`}>
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua, Avenida, etc."
                          value={endereco.logradouro}
                          onChange={(e) =>
                            handleEnderecoChange(index, 'logradouro', e.target.value)
                          }
                          required
                        />
                      </FormControl>
                    </FormItem>
                  </FormField>
                </div>

                {/* Número */}
                <FormField name={`endereco-${index}-numero`}>
                  <FormItem>
                    <FormLabel>Número *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoChange(index, 'numero', e.target.value)}
                        required
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>

              {/* Complemento */}
              <FormField name={`endereco-${index}-complemento`}>
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apto, Sala, Bloco, etc."
                      value={endereco.complemento || ''}
                      onChange={(e) => handleEnderecoChange(index, 'complemento', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bairro */}
                <FormField name={`endereco-${index}-bairro`}>
                  <FormItem>
                    <FormLabel>Bairro *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bairro"
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoChange(index, 'bairro', e.target.value)}
                        required
                      />
                    </FormControl>
                  </FormItem>
                </FormField>

                {/* Cidade */}
                <FormField name={`endereco-${index}-cidade`}>
                  <FormItem>
                    <FormLabel>Cidade *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cidade"
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoChange(index, 'cidade', e.target.value)}
                        required
                      />
                    </FormControl>
                  </FormItem>
                </FormField>

                {/* Estado */}
                <FormField name={`endereco-${index}-estado`}>
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UF"
                        value={endereco.estado}
                        onChange={(e) => handleEnderecoChange(index, 'estado', e.target.value)}
                        maxLength={2}
                        required
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Button type="button" variant="outline" onClick={handleAddEndereco} className="w-full">
        + Adicionar Endereço
      </Button>
    </div>
  );
};
