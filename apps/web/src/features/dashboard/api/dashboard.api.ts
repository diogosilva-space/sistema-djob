import type { DashboardSummary } from '@djob/validators';

import { apiFetch } from '@/lib/api-client';

interface DashboardSummaryParams {
  from?: Date;
  to?: Date;
}

export const dashboardApi = {
  getSummary: ({ from, to }: DashboardSummaryParams = {}) => {
    const searchParams = new URLSearchParams();

    if (from) searchParams.set('from', from.toISOString());
    if (to) searchParams.set('to', to.toISOString());

    const query = searchParams.size > 0 ? `?${searchParams.toString()}` : '';

    return apiFetch<DashboardSummary>(`/dashboard/summary${query}`);
  },
};
