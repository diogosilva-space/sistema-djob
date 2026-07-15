const findMany = jest.fn();

jest.mock('@djob/database', () => ({
  prisma: {
    opportunity: { findMany },
  },
}));

import { OpportunitiesService } from './opportunities.service';

describe('OpportunitiesService', () => {
  it('restringe vendedor ao próprio pipeline e tenant', async () => {
    findMany.mockResolvedValue([]);
    const service = new OpportunitiesService();

    await service.findAll({ id: 'seller-1', tenantId: 'tenant-1', role: 'SELLER' }, {});

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ tenantId: 'tenant-1', sellerId: 'seller-1' }),
      }),
    );
  });
});
