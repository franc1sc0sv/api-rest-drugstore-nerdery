import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { UserDto } from 'src/common/dtos/user.dto';
import { AuthService } from './auth.service';
import { RestAuthGuard } from 'src/common/guards/rest-auth.guard';
import { User } from '@prisma/client';
import { Request } from 'express';
import { AuthResponseDto } from './dtos/response/auth-response.dto';
import { RegisterUserInput } from './dtos/request/register-user.input';
import { ForgetPasswordInput } from './dtos/request/forget-password.input';
import { ResetPasswordInput } from './dtos/request/reset-password.input';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: UserDto): Promise<AuthResponseDto> {
    return await this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() registerUserInput: RegisterUserInput,
  ): Promise<UserDto> {
    return await this.authService.register(registerUserInput);
  }

  @Post('forget')
  @Throttle({ default: { limit: 3, ttl: 1 * 60000 } })
  async forget(
    @Body() forgetPasswordInput: ForgetPasswordInput,
  ): Promise<boolean> {
    return await this.authService.forget(forgetPasswordInput);
  }

  @Patch('reset')
  @Throttle({ default: { limit: 3, ttl: 1 * 60000 } })
  async reset(
    @Body() resetPasswordInput: ResetPasswordInput,
  ): Promise<boolean> {
    return await this.authService.reset(resetPasswordInput);
  }

  @Post('logout')
  @UseGuards(RestAuthGuard)
  async logout(
    @Req() req: Request,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Token de autorización no proporcionado');
    }

    await this.authService.logout(user.id, token);
    return true;
  }
}