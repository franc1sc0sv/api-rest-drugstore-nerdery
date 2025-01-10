import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemLoader } from './order-item.loader';

describe('OrderItemLoader', () => {
  let service: OrderItemLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderItemLoader],
    }).compile();

    service = module.get<OrderItemLoader>(OrderItemLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
