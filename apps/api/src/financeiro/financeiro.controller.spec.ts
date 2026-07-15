import { Test, TestingModule } from '@nestjs/testing';
import { FinancialController } from './financeiro.controller';
import { FinancialService } from './financeiro.service';

describe('FinancialController', () => {
  let controller: FinancialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialController],
      providers: [{ provide: FinancialService, useValue: {} }],
    }).compile();

    controller = module.get<FinancialController>(FinancialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
