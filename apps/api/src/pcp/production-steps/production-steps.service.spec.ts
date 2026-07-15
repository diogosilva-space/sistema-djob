import { Test, TestingModule } from '@nestjs/testing';
import { ProductionStepsService } from './production-steps.service';

describe('ProductionStepsService', () => {
  let service: ProductionStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionStepsService],
    }).compile();

    service = module.get<ProductionStepsService>(ProductionStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
