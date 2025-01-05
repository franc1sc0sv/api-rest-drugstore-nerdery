import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

import { SendEmailDto } from './dto/send-email.dto';
import { SendEmailOptionalDto } from './dto/send-email-optional.dto';
import { SendEmailResetPasswordDto } from './dto/send-email-reset.dto';
import * as path from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  compileTemplate(templateName: string, context: any): string {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'static',
      'templates',
      `${templateName}.hbs`,
    );

    const source = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(source);

    const currentYear = new Date().getFullYear();
    return template({ ...context, year: currentYear });
  }

  async sendPasswordResetEmail(
    sendEmailResetPasswordDto: SendEmailResetPasswordDto,
  ) {
    const { resetToken, to } = sendEmailResetPasswordDto;

    const subject = 'Reset Your Password';
    const context = { resetToken };
    const html = this.compileTemplate('reset-password', context);
    const text = `To reset your password, please use the following link: ${resetToken}`;

    await this.sendMail({ to, subject, text, html });
  }

  async sendPasswordChangeConfirmationEmail(
    sendEmailOptionalDto: SendEmailOptionalDto,
  ) {
    const { to } = sendEmailOptionalDto;
    const subject = 'Your Password Has Been Successfully Changed';
    const context = {};
    const html = this.compileTemplate('confirm-password-change', context);
    const text = 'Your password has been successfully changed';

    await this.sendMail({ to, subject, text, html });
  }

  async sendMail(sendEmailDto: SendEmailDto) {
    const { html, subject, text, to } = sendEmailDto;

    const mailOptions = {
      from: this.configService.get<string>('MAIL_USER'),
      to,
      subject,
      text,
      html,
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      return { message: 'Email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error sending email', error);
    }
  }
}
