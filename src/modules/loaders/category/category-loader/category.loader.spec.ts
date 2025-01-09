import { Test, TestingModule } from '@nestjs/testing';
import { CategoryLoader } from './category.loader';

describe('CategoryLoader', () => {
  let service: CategoryLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryLoader],
    }).compile();

    service = module.get<CategoryLoader>(CategoryLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
