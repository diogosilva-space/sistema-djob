import { Test, TestingModule } from '@nestjs/testing';
import { LogisticaService } from './logistica.service';
import { LogisticaController } from './logistica.controller';

describe('LogisticaController', () => {
  let controller: LogisticaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticaController],
      providers: [{ provide: LogisticaService, useValue: {} }],
    }).compile();

    controller = module.get<LogisticaController>(LogisticaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
