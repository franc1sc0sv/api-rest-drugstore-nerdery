import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from '../mails.service';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailResetPasswordDto } from '../dto/send-email-reset.dto';
import { SendEmailOptionalDto } from '../dto/send-email-optional.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('MailsService', () => {
  let mailsService: MailsService;

  const mockMailerService = {
    sendMail: jest
      .fn()
      .mockResolvedValue({ message: 'Email sent successfully' }),
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
  });

  describe('sendPasswordResetEmail', () => {
    it('should be defined', () => {
      expect(mailsService.sendPasswordResetEmail).toBeDefined();
    });

    it('should send a password reset email successfully', async () => {
      const sendEmailResetPasswordDto: SendEmailResetPasswordDto = {
        resetToken: 'reset-token-123',
        to: 'user@example.com',
      };

      await mailsService.sendPasswordResetEmail(sendEmailResetPasswordDto);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'user@example.com',
        subject: 'Reset Your Password',
        text: 'To reset your password, please use the following link: reset-token-123',
        html: expect.any(String), // You can validate the HTML content if needed
      });
    });
  });

  describe('sendPasswordChangeConfirmationEmail', () => {
    it('should be defined', () => {
      expect(mailsService.sendPasswordChangeConfirmationEmail).toBeDefined();
    });

    it('should send a password change confirmation email successfully', async () => {
      const sendEmailOptionalDto: SendEmailOptionalDto = {
        to: 'user@example.com',
      };

      await mailsService.sendPasswordChangeConfirmationEmail(
        sendEmailOptionalDto,
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: 'user@example.com',
        subject: 'Your Password Has Been Successfully Changed',
        text: 'Your password has been successfully changed',
        html: expect.any(String), // You can validate the HTML content if needed
      });
    });
  });

  describe('sendMail', () => {
    it('should throw an error if email sending fails', async () => {
      const sendEmailDto = {
        to: 'user@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: 'Test HTML',
      };

      mockMailerService.sendMail.mockRejectedValue(
        new Error('Email sending failed'),
      );

      try {
        await mailsService.sendMail(sendEmailDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Error sending email');
      }
    });
  });
});
