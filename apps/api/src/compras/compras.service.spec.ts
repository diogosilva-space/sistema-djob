import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueService } from '../estoque/estoque.service';
import { ComprasService } from './compras.service';

describe('ComprasService', () => {
  let service: ComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComprasService,
        { provide: EstoqueService, useValue: { addStockForPurchase: jest.fn() } },
      ],
    }).compile();

    service = module.get<ComprasService>(ComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
