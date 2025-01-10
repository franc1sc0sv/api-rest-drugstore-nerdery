import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { PaymentIntentModel } from 'src/common/models/payment-intent.model';

@Injectable({ scope: Scope.REQUEST })
export class PaymentLoader {
  constructor(private readonly prisma: PrismaService) {}

  public readonly batchPaymentsByOrderId = new DataLoader<
    string,
    PaymentIntentModel[]
  >(async (orderIds: readonly string[]) => {
    const payments = await this.prisma.paymentIntent.findMany({
      where: { orderId: { in: [...orderIds] } },
    });

    const paymentsMap = orderIds.map((orderId) =>
      payments.filter((payment) => payment.orderId === orderId),
    );

    return paymentsMap;
  });
}
