import { IsEmail, IsString, IsOptional } from 'class-validator';

export class SendEmailOptionalDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;
}
