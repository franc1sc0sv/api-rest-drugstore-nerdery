import { Test, TestingModule } from '@nestjs/testing';
import { CartItemLoader } from './cart-item.loader';

describe('CartItemLoader', () => {
  let service: CartItemLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartItemLoader],
    }).compile();

    service = module.get<CartItemLoader>(CartItemLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
