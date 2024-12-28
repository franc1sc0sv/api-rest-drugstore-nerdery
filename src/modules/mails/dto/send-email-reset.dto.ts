import { IsEmail, IsString } from 'class-validator';

export class SendEmailResetPasswordDto {
  @IsEmail()
  to: string;

  @IsString()
  resetToken: string;
}
