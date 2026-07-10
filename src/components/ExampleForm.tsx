import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

/**
 * Exemplo de Formulário usando os componentes shadcn/ui
 * 
 * Este componente demonstra como usar os componentes de formulário
 * de forma integrada e reutilizável.
 */
export const ExampleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo: '',
    observacoes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    alert('Formulário enviado! Veja o console para os dados.');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Exemplo de Formulário</CardTitle>
        <CardDescription>
          Demonstração dos componentes de formulário com shadcn/ui
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Nome */}
          <FormField name="nome">
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </FormControl>
              <FormDescription>
                Informe seu nome completo como consta nos documentos
              </FormDescription>
            </FormItem>
          </FormField>

          {/* Campo de E-mail */}
          <FormField name="email">
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </FormControl>
            </FormItem>
          </FormField>

          {/* Campo Select */}
          <FormField name="tipo">
            <FormItem>
              <FormLabel>Tipo de Cliente</FormLabel>
              <FormControl>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
                    <SelectItem value="pessoa-juridica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          {/* Campo Textarea */}
          <FormField name="observacoes">
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite observações adicionais..."
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Máximo de 500 caracteres
              </FormDescription>
            </FormItem>
          </FormField>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
