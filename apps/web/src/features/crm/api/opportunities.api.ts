import { apiFetch } from '@/lib/api-client';

import type {
  Activity,
  Opportunity,
  OpportunityDetail,
  OpportunityStatus,
  PipelineColumn,
  PipelineMetrics,
  Task,
} from '../types/Opportunity.types';

type QueryParams = Record<string, string | undefined>;

function toQuery(params: QueryParams) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined) as Array<[string, string]>,
  );
  return query.size ? `?${query.toString()}` : '';
}

export const opportunitiesApi = {
  getPipeline: (params: QueryParams = {}) =>
    apiFetch<PipelineColumn[]>(`/opportunities/pipeline${toQuery(params)}`),
  getMetrics: (params: QueryParams = {}) =>
    apiFetch<PipelineMetrics>(`/opportunities/metrics${toQuery(params)}`),
  getOne: (id: string) => apiFetch<OpportunityDetail>(`/opportunities/${id}`),
  create: (data: Record<string, unknown>) =>
    apiFetch<Opportunity>('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch<Opportunity>(`/opportunities/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  changeStage: (
    id: string,
    data: { status: OpportunityStatus; value?: number; closedAt?: string; lostReason?: string },
  ) =>
    apiFetch<Opportunity>(`/opportunities/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const activitiesApi = {
  create: (data: Record<string, unknown>) =>
    apiFetch<Activity>('/activities', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/activities/${id}`, { method: 'DELETE' }),
};

export const tasksApi = {
  create: (data: Record<string, unknown>) =>
    apiFetch<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  complete: (id: string) =>
    apiFetch<Task>(`/tasks/${id}/complete`, { method: 'PATCH' }),
  remove: (id: string) => apiFetch<Task>(`/tasks/${id}`, { method: 'DELETE' }),
};
