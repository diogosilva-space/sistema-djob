-- P0-a CRM: atividades, tarefas e motivo de perda de oportunidade.
-- Este arquivo deve ser aplicado após reconciliar o histórico de migrações
-- do banco de desenvolvimento existente.

ALTER TABLE "opportunities"
  ADD COLUMN "expectedCloseAt" TIMESTAMP(3),
  ADD COLUMN "lostReason" VARCHAR(100);

CREATE TYPE "ActivityType" AS ENUM ('CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'NOTE');
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE "activities" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "opportunityId" UUID,
  "customerId" UUID,
  "userId" UUID NOT NULL,
  "type" "ActivityType" NOT NULL,
  "subject" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tasks" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "opportunityId" UUID,
  "customerId" UUID,
  "assignedToId" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "activities_tenantId_opportunityId_idx" ON "activities"("tenantId", "opportunityId");
CREATE INDEX "activities_tenantId_customerId_idx" ON "activities"("tenantId", "customerId");
CREATE INDEX "activities_tenantId_occurredAt_idx" ON "activities"("tenantId", "occurredAt");
CREATE INDEX "tasks_tenantId_opportunityId_idx" ON "tasks"("tenantId", "opportunityId");
CREATE INDEX "tasks_tenantId_customerId_idx" ON "tasks"("tenantId", "customerId");
CREATE INDEX "tasks_tenantId_assignedToId_status_idx" ON "tasks"("tenantId", "assignedToId", "status");

ALTER TABLE "activities"
  ADD CONSTRAINT "activities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "activities_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "activities_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tasks"
  ADD CONSTRAINT "tasks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tasks_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tasks_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
