import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { MailsService } from '../mails/mails.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return { secret: configService.get<string>('JWT_SECRET') };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, MailsService],
  controllers: [AuthController],
})
export class AuthModule {}
