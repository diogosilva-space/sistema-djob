import React from 'react';
import { maskPhone } from '@/lib/utils/masks';
import { Phone } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

import { Cliente } from '../types/Cliente.types';

interface ContatosTabProps {
  formData: Partial<Cliente>;
  onChange: (field: string, value: any) => void;
}

export const ContatosTab: React.FC<ContatosTabProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Telefone Principal */}
        <FormField name="telefonePrincipal">
          <FormItem>
            <FormLabel>Telefone Principal *</FormLabel>
            <FormControl>
              <Input
                placeholder="(00) 00000-0000"
                value={formData.telefonePrincipal || ''}
                onChange={(e) => onChange('telefonePrincipal', maskPhone(e.target.value))}
                required
              />
            </FormControl>
          </FormItem>
        </FormField>

        {/* WhatsApp */}
        <FormField name="whatsapp">
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp || ''}
                  onChange={(e) => onChange('whatsapp', maskPhone(e.target.value))}
                  className="pr-10"
                />
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              </div>
            </FormControl>
            <FormDescription>
              Número com WhatsApp para contato rápido
            </FormDescription>
          </FormItem>
        </FormField>
      </div>

      {/* E-mail */}
      <FormField name="email">
        <FormItem>
          <FormLabel>E-mail *</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="contato@empresa.com"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              required
            />
          </FormControl>
        </FormItem>
      </FormField>

      {/* Site */}
      <FormField name="site">
        <FormItem>
          <FormLabel>Site</FormLabel>
          <FormControl>
            <Input
              type="url"
              placeholder="https://www.empresa.com"
              value={formData.site || ''}
              onChange={(e) => onChange('site', e.target.value)}
            />
          </FormControl>
        </FormItem>
      </FormField>

      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Pessoa de Contato</h3>

        <div className="space-y-4">
          {/* Contato Principal (Nome) */}
          <FormField name="contatoPrincipal">
            <FormItem>
              <FormLabel>Nome do Contato</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome da pessoa de contato"
                  value={formData.contatoPrincipal || ''}
                  onChange={(e) => onChange('contatoPrincipal', e.target.value)}
                />
              </FormControl>
              <FormDescription>
                Nome da pessoa responsável pelo contato na empresa
              </FormDescription>
            </FormItem>
          </FormField>

          {/* Cargo do Contato */}
          <FormField name="cargoContato">
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Gerente de Compras, Diretor, etc."
                  value={formData.cargoContato || ''}
                  onChange={(e) => onChange('cargoContato', e.target.value)}
                />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  );
};
