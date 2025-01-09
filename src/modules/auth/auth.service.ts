import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dtos/request/login-user.input';
import { AuthResponse } from './dtos/response/auth-response.response';

import { RegisterUserInput } from './dtos/request/register-user.input';
import { UserModel } from 'src/common/models/user.model';
import { ForgetPasswordInput } from './dtos/request/forget-password.input';
import { ResetPasswordInput } from './dtos/request/reset-password.input';
import { randomUUID } from 'crypto';
import { MailsService } from '../mails/mails.service';
import { hashPassword, comparePassword } from '../../common/utils/bcrypt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
  ) {}

  async register(registerUserInput: RegisterUserInput): Promise<UserModel> {
    const { email, password, name } = registerUserInput;

    try {
      const existingUser = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await hashPassword(password);

      return await this.prismaService.user.create({
        data: { email, password: hashedPassword, name },
      });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async login(user: UserModel): Promise<AuthResponse> {
    const { id } = user;
    const payload = { userId: id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(loginUserInput: LoginUserInput): Promise<UserModel> {
    const { email, password } = loginUserInput;

    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async logout(userId: string, token: string): Promise<boolean> {
    if (!token) {
      throw new Error('Token de autorización no proporcionado');
    }

    await this.prismaService.revokedToken.create({
      data: { userId, token },
    });
    return true;
  }

  async forget(forgetPasswordInput: ForgetPasswordInput): Promise<boolean> {
    const { email } = forgetPasswordInput;

    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await this.mailsService.sendPasswordResetEmail({
      to: user.email,
      resetToken,
    });

    return true;
  }

  async reset(resetPasswordInput: ResetPasswordInput) {
    const { newPassword, token } = resetPasswordInput;

    const user = await this.prismaService.user.findFirst({
      where: { resetToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    await this.mailsService.sendPasswordChangeConfirmationEmail({
      to: user.email,
    });

    return true;
  }

  private generateResetToken(): string {
    return randomUUID();
  }
}
