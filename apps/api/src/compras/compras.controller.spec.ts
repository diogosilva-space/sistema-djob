import { Test, TestingModule } from '@nestjs/testing';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';

describe('ComprasController', () => {
  let controller: ComprasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComprasController],
      providers: [{ provide: ComprasService, useValue: {} }],
    }).compile();

    controller = module.get<ComprasController>(ComprasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
