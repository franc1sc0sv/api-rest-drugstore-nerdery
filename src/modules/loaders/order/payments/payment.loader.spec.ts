import { Test, TestingModule } from '@nestjs/testing';
import { PaymentLoader } from './payment.loader';

describe('PaymentLoader', () => {
  let service: PaymentLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentLoader],
    }).compile();

    service = module.get<PaymentLoader>(PaymentLoader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
