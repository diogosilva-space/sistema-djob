import { z } from 'zod';

export const dashboardSummaryQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type DashboardSummaryQuery = z.infer<typeof dashboardSummaryQuerySchema>;

export type DashboardAlertSeverity = 'critical' | 'warning';

export interface DashboardSummary {
  period: {
    from: string;
    to: string;
  };
  kpis: {
    revenue: number;
    openOrders: number;
    activeProductionOrders: number;
    criticalStock: number;
  };
  revenueSeries: Array<{
    month: string;
    amount: number;
  }>;
  salesByProductType: Array<{
    name: 'Brindes' | 'Confecção' | 'Outros';
    amount: number;
  }>;
  recentOrders: Array<{
    id: string;
    code: string;
    customerName: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    deliveryDate: string | null;
  }>;
  alerts: Array<{
    id: string;
    severity: DashboardAlertSeverity;
    title: string;
    description: string;
    href: string;
  }>;
}
