export type OpportunityStatus =
  | 'LEAD_QUALIFICADO'
  | 'CONTATO_INICIAL'
  | 'APRESENTACAO'
  | 'PROPOSTA_ENVIADA'
  | 'NEGOCIACAO'
  | 'FECHADO_GANHO'
  | 'FECHADO_PERDIDO';

export type Opportunity = {
  id: string;
  name: string;
  value: number | string;
  probability: number;
  status: OpportunityStatus;
  expectedCloseAt: string | null;
  lastInteractionAt: string;
  closedAt: string | null;
  lostReason: string | null;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  customer: { id: string; name: string; mobile?: string | null; phone?: string | null; email?: string | null } | null;
  contact?: { id: string; name: string; mobile?: string | null; phone?: string | null; email?: string | null } | null;
  seller: { id: string; name: string; email?: string } | null;
  _count?: { activities: number; tasks: number };
};

export type PipelineColumn = {
  status: OpportunityStatus;
  count: number;
  value: number;
  opportunities: Opportunity[];
};

export type PipelineMetrics = {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  totalDeals: number;
  rottingDeals: number;
  winRate: number;
  stageBreakdown: Array<{ status: OpportunityStatus; count: number; value: number }>;
};

export type Activity = {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'WHATSAPP' | 'NOTE';
  subject: string;
  description: string | null;
  occurredAt: string;
  user: { id: string; name: string };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt: string | null;
  assignedTo: { id: string; name: string };
};

export type OpportunityDetail = Opportunity & {
  activities: Activity[];
  tasks: Task[];
};
