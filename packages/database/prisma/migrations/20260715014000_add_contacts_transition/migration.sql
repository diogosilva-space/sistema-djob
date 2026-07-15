-- P0-b CRM: base unificada de contatos em modo de transição.
-- As colunas legadas customerId/supplierId permanecem até que todos os módulos
-- consumidores sejam migrados. Os novos contactId são preenchidos abaixo.

CREATE TYPE "ContactRole" AS ENUM ('CLIENT', 'SUPPLIER', 'BOTH');

CREATE TABLE "contacts" (
  "id" UUID NOT NULL,
  "tenantId" UUID NOT NULL,
  "role" "ContactRole" NOT NULL DEFAULT 'CLIENT',
  "type" "PersonType" NOT NULL DEFAULT 'JURIDICA',
  "name" VARCHAR(255) NOT NULL,
  "tradeName" VARCHAR(255),
  "document" VARCHAR(20),
  "stateReg" VARCHAR(20),
  "email" VARCHAR(255),
  "phone" VARCHAR(20),
  "mobile" VARCHAR(20),
  "website" VARCHAR(255),
  "zipCode" VARCHAR(10),
  "street" VARCHAR(255),
  "number" VARCHAR(20),
  "complement" VARCHAR(100),
  "neighborhood" VARCHAR(100),
  "city" VARCHAR(100),
  "state" VARCHAR(2),
  "segment" VARCHAR(100),
  "notes" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "opportunities" ADD COLUMN "contactId" UUID;
ALTER TABLE "activities" ADD COLUMN "contactId" UUID;
ALTER TABLE "tasks" ADD COLUMN "contactId" UUID;
ALTER TABLE "quotes" ADD COLUMN "contactId" UUID;
ALTER TABLE "sales_orders" ADD COLUMN "contactId" UUID;
ALTER TABLE "purchase_orders" ADD COLUMN "contactId" UUID;

-- Clientes preservam o próprio UUID para tornar a transição de relações determinística.
INSERT INTO "contacts" (
  "id", "tenantId", "role", "type", "name", "tradeName", "document", "stateReg",
  "email", "phone", "mobile", "website", "zipCode", "street", "number",
  "complement", "neighborhood", "city", "state", "notes", "isActive", "createdAt", "updatedAt"
)
SELECT
  "id", "tenantId", 'CLIENT'::"ContactRole", "type", "name", "tradeName", "document", "stateReg",
  "email", "phone", "mobile", "website", "zipCode", "street", "number",
  "complement", "neighborhood", "city", "state", "notes", "isActive", "createdAt", "updatedAt"
FROM "customers";

-- Se fornecedor e cliente compartilham o mesmo documento no tenant, usam um único contato BOTH.
UPDATE "contacts" AS contact
SET "role" = 'BOTH'
FROM "suppliers" AS supplier
WHERE contact."tenantId" = supplier."tenantId"
  AND contact."document" IS NOT NULL
  AND contact."document" = supplier."document";

INSERT INTO "contacts" (
  "id", "tenantId", "role", "type", "name", "tradeName", "document", "stateReg",
  "email", "phone", "mobile", "website", "zipCode", "street", "number",
  "complement", "neighborhood", "city", "state", "notes", "isActive", "createdAt", "updatedAt"
)
SELECT
  supplier."id", supplier."tenantId", 'SUPPLIER'::"ContactRole", supplier."type", supplier."name",
  supplier."tradeName", supplier."document", supplier."stateReg", supplier."email", supplier."phone",
  supplier."mobile", supplier."website", supplier."zipCode", supplier."street", supplier."number",
  supplier."complement", supplier."neighborhood", supplier."city", supplier."state", supplier."notes",
  supplier."isActive", supplier."createdAt", supplier."updatedAt"
FROM "suppliers" AS supplier
WHERE NOT EXISTS (
  SELECT 1 FROM "contacts" AS contact
  WHERE contact."tenantId" = supplier."tenantId"
    AND contact."document" IS NOT NULL
    AND contact."document" = supplier."document"
);

UPDATE "opportunities" SET "contactId" = "customerId" WHERE "customerId" IS NOT NULL;
UPDATE "activities" SET "contactId" = "customerId" WHERE "customerId" IS NOT NULL;
UPDATE "tasks" SET "contactId" = "customerId" WHERE "customerId" IS NOT NULL;
UPDATE "quotes" SET "contactId" = "customerId";
UPDATE "sales_orders" SET "contactId" = "customerId";
UPDATE "purchase_orders" AS purchase_order
SET "contactId" = (
  SELECT contact."id"
  FROM "contacts" AS contact
  JOIN "suppliers" AS supplier ON supplier."id" = purchase_order."supplierId"
  WHERE contact."tenantId" = supplier."tenantId"
    AND (
      contact."id" = supplier."id"
      OR (contact."document" IS NOT NULL AND contact."document" = supplier."document")
    )
  ORDER BY CASE WHEN contact."id" = supplier."id" THEN 0 ELSE 1 END
  LIMIT 1
);

CREATE INDEX "contacts_tenantId_idx" ON "contacts"("tenantId");
CREATE INDEX "contacts_tenantId_role_idx" ON "contacts"("tenantId", "role");
CREATE INDEX "contacts_tenantId_document_idx" ON "contacts"("tenantId", "document");
CREATE INDEX "opportunities_tenantId_contactId_idx" ON "opportunities"("tenantId", "contactId");
CREATE INDEX "activities_tenantId_contactId_idx" ON "activities"("tenantId", "contactId");
CREATE INDEX "tasks_tenantId_contactId_idx" ON "tasks"("tenantId", "contactId");
CREATE INDEX "quotes_tenantId_contactId_idx" ON "quotes"("tenantId", "contactId");
CREATE INDEX "sales_orders_tenantId_contactId_idx" ON "sales_orders"("tenantId", "contactId");
CREATE INDEX "purchase_orders_tenantId_contactId_idx" ON "purchase_orders"("tenantId", "contactId");

ALTER TABLE "contacts" ADD CONSTRAINT "contacts_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "activities" ADD CONSTRAINT "activities_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
