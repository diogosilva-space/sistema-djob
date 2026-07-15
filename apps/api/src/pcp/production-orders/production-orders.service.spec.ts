import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueService } from '../../estoque/estoque.service';
import { ProductionOrdersService } from './production-orders.service';

describe('ProductionOrdersService', () => {
  let service: ProductionOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductionOrdersService,
        { provide: EstoqueService, useValue: { deductStockForProduction: jest.fn() } },
      ],
    }).compile();

    service = module.get<ProductionOrdersService>(ProductionOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
