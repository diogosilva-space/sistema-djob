const findMany = jest.fn();

jest.mock('@djob/database', () => ({
  prisma: {
    task: { findMany },
  },
}));

import { TasksService } from './tasks.service';

describe('TasksService', () => {
  it('lista tarefas pendentes apenas do vendedor autenticado', async () => {
    findMany.mockResolvedValue([]);
    const service = new TasksService();

    await service.findAll(
      { id: 'seller-1', tenantId: 'tenant-1', role: 'SELLER' },
      { status: 'PENDING' },
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tenantId: 'tenant-1',
          assignedToId: 'seller-1',
          status: 'PENDING',
        }),
      }),
    );
  });
});
