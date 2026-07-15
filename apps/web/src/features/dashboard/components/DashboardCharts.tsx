'use client';

import type { DashboardSummary } from '@djob/validators';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardRevenueChartProps {
  revenueSeries: DashboardSummary['revenueSeries'];
  className?: string;
}

interface DashboardSalesByTypeChartProps {
  salesByProductType: DashboardSummary['salesByProductType'];
  className?: string;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const chartColors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--muted-foreground))',
];

export function DashboardRevenueChart({ revenueSeries, className }: DashboardRevenueChartProps) {
  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">Evolução do faturamento</CardTitle>
        <CardDescription>Pedidos não cancelados nos últimos seis meses</CardDescription>
      </CardHeader>
      <CardContent className="h-72 p-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboard-revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => currencyFormatter.format(Number(value))}
            />
            <Tooltip
              formatter={(value) => currencyFormatter.format(Number(value))}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              name="Faturamento"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#dashboard-revenue-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DashboardSalesByTypeChart({
  salesByProductType,
  className,
}: DashboardSalesByTypeChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">Vendas por tipo</CardTitle>
        <CardDescription>Participação no período selecionado</CardDescription>
      </CardHeader>
      <CardContent className="h-72 p-4 pt-2">
        {salesByProductType.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Nenhuma venda categorizada no período.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesByProductType}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
              >
                {salesByProductType.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={chartColors[index % chartColors.length] ?? 'hsl(var(--primary))'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
