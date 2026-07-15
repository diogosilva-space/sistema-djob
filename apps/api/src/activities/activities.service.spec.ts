const findMany = jest.fn();

jest.mock('@djob/database', () => ({
  prisma: {
    activity: { findMany },
  },
}));

import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  it('aplica tenant e escopo do vendedor ao listar atividades', async () => {
    findMany.mockResolvedValue([]);
    const service = new ActivitiesService();

    await service.findAll(
      { id: 'seller-1', tenantId: 'tenant-1', role: 'SELLER' },
      { opportunityId: '00000000-0000-4000-8000-000000000001' },
    );

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: 'tenant-1' }),
      }),
    );
  });
});
