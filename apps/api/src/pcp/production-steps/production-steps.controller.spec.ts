import { Test, TestingModule } from '@nestjs/testing';
import { ProductionStepsController } from './production-steps.controller';

describe('ProductionStepsController', () => {
  let controller: ProductionStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductionStepsController],
    }).compile();

    controller = module.get<ProductionStepsController>(ProductionStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
