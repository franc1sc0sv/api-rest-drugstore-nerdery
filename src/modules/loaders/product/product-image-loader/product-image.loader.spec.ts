import { Test, TestingModule } from '@nestjs/testing';
import { ProductImageLoader } from './product-image.loader';

describe('ProductImageLoader', () => {
  let service: ProductImageLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductImageLoader],
    }).compile();

    service = module.get<ProductImageLoader>(ProductImageLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
