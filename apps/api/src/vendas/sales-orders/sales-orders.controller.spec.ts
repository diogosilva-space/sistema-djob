import { Test, TestingModule } from '@nestjs/testing';
import { SalesOrdersService } from './sales-orders.service';
import { SalesOrdersController } from './sales-orders.controller';

describe('SalesOrdersController', () => {
  let controller: SalesOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesOrdersController],
      providers: [{ provide: SalesOrdersService, useValue: {} }],
    }).compile();

    controller = module.get<SalesOrdersController>(SalesOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
