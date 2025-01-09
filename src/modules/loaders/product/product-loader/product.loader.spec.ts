import { Test, TestingModule } from '@nestjs/testing';
import { ProductLoader } from './product.loader';

describe('ProductLoader', () => {
  let service: ProductLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLoader],
    }).compile();

    service = module.get<ProductLoader>(ProductLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
