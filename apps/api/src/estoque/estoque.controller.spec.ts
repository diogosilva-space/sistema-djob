import { Test, TestingModule } from '@nestjs/testing';
import { EstoqueService } from './estoque.service';
import { EstoqueController } from './estoque.controller';

describe('EstoqueController', () => {
  let controller: EstoqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstoqueController],
      providers: [{ provide: EstoqueService, useValue: {} }],
    }).compile();

    controller = module.get<EstoqueController>(EstoqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
