import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from '../mails.service';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailsService', () => {
  let mailsService: MailsService;
  let mailerService: MailerService;
  let configService: ConfigService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(
      (key: string) =>
        ({
          MAIL_USER: 'test@example.com',
          MAIL_PASS: 'yourpass',
          MAIL_FROM: 'noreply@example.com',
          MAIL_HOST: 'smtp.gmail.com',
        })[key],
    ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    mailsService = module.get<MailsService>(MailsService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('sendPasswordResetEmail', () => {
    it('should be defined', () => {
      expect(mailsService.sendPasswordResetEmail).toBeDefined();
    });
  });

  describe('sendPasswordChangeConfirmationEmail', () => {
    it('should be defined', () => {
      expect(mailsService.sendPasswordChangeConfirmationEmail).toBeDefined();
    });
  });
});
