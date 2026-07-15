import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@djob/database';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@djob/validators';
import { Prisma } from '@prisma/client';

@Injectable()
export class RhService {
  async getEmployees(tenantId: string) {
    return prisma.employee.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async getEmployeeById(tenantId: string, id: string) {
    const employee = await prisma.employee.findFirst({
      where: { id, tenantId },
      include: {
        payrolls: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado');
    }
    return employee;
  }

  async createEmployee(tenantId: string, userId: string, data: CreateEmployeeInput) {
    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          tenantId,
          name: data.name,
          document: data.document,
          email: data.email,
          phone: data.phone,
          position: data.position,
          department: data.department,
          admissionDate: data.admissionDate ? new Date(data.admissionDate) : null,
          salary: data.salary ? new Prisma.Decimal(data.salary) : null,
          status: data.status as any,
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          notes: data.notes,
        },
      });

      // Audit Log for Employee creation
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'CREATE_EMPLOYEE',
          entity: 'Employee',
          entityId: employee.id,
          newValue: JSON.stringify(data),
        },
      });

      return employee;
    });
  }

  async updateEmployee(tenantId: string, id: string, userId: string, data: UpdateEmployeeInput) {
    const original = await this.getEmployeeById(tenantId, id);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.employee.update({
        where: { id },
        data: {
          name: data.name,
          document: data.document,
          email: data.email,
          phone: data.phone,
          position: data.position,
          department: data.department,
          admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
          salary:
            data.salary !== undefined
              ? data.salary
                ? new Prisma.Decimal(data.salary)
                : null
              : undefined,
          status: data.status as any,
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          notes: data.notes,
        },
      });

      // Audit Log for Salary Change or Update
      const salaryChanged =
        data.salary !== undefined && Number(original.salary) !== Number(data.salary);
      const action = salaryChanged ? 'UPDATE_SALARY' : 'UPDATE_EMPLOYEE';

      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action,
          entity: 'Employee',
          entityId: id,
          oldValue: JSON.stringify({ salary: original.salary, status: original.status }),
          newValue: JSON.stringify({ salary: updated.salary, status: updated.status }),
        },
      });

      return updated;
    });
  }

  async removeEmployee(tenantId: string, id: string, userId: string) {
    await this.getEmployeeById(tenantId, id);

    return prisma.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          tenantId,
          userId,
          action: 'DELETE_EMPLOYEE',
          entity: 'Employee',
          entityId: id,
        },
      });

      return tx.employee.delete({
        where: { id },
      });
    });
  }
}
