import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('MAIL_HOST'),
            secure: false,
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASS'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
