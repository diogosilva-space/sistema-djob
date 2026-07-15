'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Lock } from 'lucide-react';
import { PageActionHeader } from '@/components/dashboard/PageActionHeader';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageActionHeader
        icon={Package}
        title="Produtos e Matérias-Primas"
        subtitle="Gestão de produtos acabados, serviços e grade de insumos"
      />

      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader className="flex flex-col items-center">
          <div className="p-3 bg-muted rounded-full mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-base font-semibold">Catálogo de Produtos</CardTitle>
          <CardDescription className="max-w-md mt-2">
            Este módulo permite cadastrar os produtos da confecção, fichas técnicas (BOM) e suas
            respectivas grades de cores e tamanhos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center text-sm text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3 gap-2">
          <Lock className="h-4 w-4 text-amber-600" />
          <span>
            A integração com o Estoque e PCP será ativada na próxima fase de desenvolvimento.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
