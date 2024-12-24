import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dtos/request/login-user.input';
import { AuthResponseDto } from './dtos/response/auth-response.dto';
import { comparePassword, hashPassword } from 'src/common/utils/bcrypt.util';
import { RegisterUserInput } from './dtos/request/register-user.input';
import { UserResponseDto } from './dtos/response/user-response.dto';
import { UserDto } from 'src/common/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserInput: RegisterUserInput,
  ): Promise<UserResponseDto> {
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

  async login(user: UserDto): Promise<AuthResponseDto> {
    const { id } = user;
    const payload = { userId: id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(loginUserInput: LoginUserInput): Promise<UserResponseDto> {
    const { email, password } = loginUserInput;

    try {
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
    } catch (error) {
      console.error('Error in login:', error);
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error logging in user');
    }
  }

  async logout(userId: string, token: string): Promise<boolean> {
    try {
      await this.prismaService.revokedToken.create({
        data: { userId, token },
      });
      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      throw new InternalServerErrorException('Error during logout');
    }
  }
}
