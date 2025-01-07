import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from '../mails.service';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import {
  mockSendEmailDto,
  mockSendEmailOptionalDto,
  mockSendEmailResetPasswordDto,
} from '../../../__mocks__/data/mails.mock';

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
    it('should send a password reset email successfully', async () => {
      await mailsService.sendPasswordResetEmail(mockSendEmailResetPasswordDto);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: mockSendEmailResetPasswordDto.to,
        subject: 'Reset Your Password',
        text: `To reset your password, please use the following link: ${mockSendEmailResetPasswordDto.resetToken}`,
        html: expect.any(String),
      });
    });
  });

  describe('sendPasswordChangeConfirmationEmail', () => {
    it('should be defined', () => {
      expect(mailsService.sendPasswordChangeConfirmationEmail).toBeDefined();
    });

    it('should send a password change confirmation email successfully', async () => {
      await mailsService.sendPasswordChangeConfirmationEmail(
        mockSendEmailOptionalDto,
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: mockSendEmailOptionalDto.to,
        subject: 'Your Password Has Been Successfully Changed',
        text: 'Your password has been successfully changed',
        html: expect.any(String),
      });
    });
  });

  describe('sendMail', () => {
    it('should throw an error if email sending fails', async () => {
      mockMailerService.sendMail.mockRejectedValue(
        new Error('Email sending failed'),
      );

      try {
        await mailsService.sendMail(mockSendEmailDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Error sending email');
      }
    });
  });
});
