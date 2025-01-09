import { faker } from '@faker-js/faker';
import { SendEmailOptionalDto } from 'src/modules/mails/dto/request/send-email-optional.dto';
import { SendEmailResetPasswordDto } from 'src/modules/mails/dto/request/send-email-reset.dto';
import { SendEmailDto } from 'src/modules/mails/dto/request/send-email.dto';

const generateSendEmailResetPassword = (): SendEmailResetPasswordDto => ({
  to: faker.internet.email(),
  resetToken: faker.string.uuid(),
});

const generateSendEmailOptional = (): SendEmailOptionalDto => ({
  to: faker.internet.email(),
  subject: faker.lorem.sentence(),
  text: faker.lorem.paragraph(),
  html: faker.lorem.paragraph(),
});

const generateSendEmail = (): SendEmailDto => ({
  to: faker.internet.email(),
  subject: faker.lorem.sentence(),
  text: faker.lorem.paragraph(),
  html: faker.lorem.paragraph(),
});

export const mockSendEmailResetPasswordDto = generateSendEmailResetPassword();
export const mockSendEmailOptionalDto = generateSendEmailOptional();
export const mockSendEmailDto = generateSendEmail();
