import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateTransactionInput, UpdateTransactionInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinancialService {
  async getTransactions(tenantId: string) {
    return prisma.financialTransaction.findMany({
      where: { tenantId },
      include: {
        category: true,
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async getTransactionById(tenantId: string, id: string) {
    const transaction = await prisma.financialTransaction.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }
    return transaction;
  }

  async createTransaction(tenantId: string, userId: string, data: CreateTransactionInput) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.financialTransaction.create({
        data: {
          tenantId,
          categoryId: data.categoryId,
          type: data.type as any,
          description: data.description,
          amount: new Prisma.Decimal(data.amount),
          dueDate: new Date(data.dueDate),
          paidDate: data.paidDate ? new Date(data.paidDate) : null,
          status: data.status as any,
          reference: data.reference,
          notes: data.notes,
        },
      });

      // Audit Log for Transaction Creation
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'CREATE_TRANSACTION',
          entity: 'FinancialTransaction',
          entityId: transaction.id,
          newValue: JSON.stringify(data),
        },
      });

      return transaction;
    });
  }

  async updateTransaction(
    tenantId: string,
    id: string,
    userId: string,
    data: UpdateTransactionInput,
  ) {
    const original = await this.getTransactionById(tenantId, id);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.financialTransaction.update({
        where: { id },
        data: {
          categoryId: data.categoryId,
          type: data.type as any,
          description: data.description,
          amount: data.amount !== undefined ? new Prisma.Decimal(data.amount) : undefined,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          paidDate:
            data.paidDate !== undefined
              ? data.paidDate
                ? new Date(data.paidDate)
                : null
              : undefined,
          status: data.status as any,
          reference: data.reference,
          notes: data.notes,
        },
      });

      // Audit Log for Transaction Update
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'UPDATE_TRANSACTION',
          entity: 'FinancialTransaction',
          entityId: id,
          oldValue: JSON.stringify({ amount: original.amount, status: original.status }),
          newValue: JSON.stringify({ amount: updated.amount, status: updated.status }),
        },
      });

      return updated;
    });
  }

  async removeTransaction(tenantId: string, id: string, userId: string) {
    await this.getTransactionById(tenantId, id);

    return prisma.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'DELETE_TRANSACTION',
          entity: 'FinancialTransaction',
          entityId: id,
        },
      });

      return tx.financialTransaction.delete({
        where: { id },
      });
    });
  }
}
