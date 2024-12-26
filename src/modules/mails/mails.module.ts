import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsResolver } from './mails.resolver';

@Module({
  providers: [MailsService, MailsResolver],
})
export class MailsModule {}
