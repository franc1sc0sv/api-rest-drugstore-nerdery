import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { User } from '@prisma/client';

import { AuthService } from './auth.service';

import { RegisterUserInput } from './dtos/request/register-user.input';
import { LoginUserInput } from './dtos/request/login-user.input';

import { AuthResponseDto } from './dtos/response/auth-response.dto';

import { GqlAuthGuard } from 'src/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserResponseDto } from './dtos/response/user-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String, { description: 'Health check for AuthResolver' })
  healthCheck(): string {
    return 'AuthResolver is up and running!';
  }

  @Mutation(() => UserResponseDto)
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<UserResponseDto> {
    try {
      return await this.authService.register(registerUserInput);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => AuthResponseDto)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(loginUserInput);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @Context('req') req: any,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token not found in request');
    }

    try {
      return await this.authService.logout(user.id, token);
    } catch (error) {
      throw error;
    }
  }
}
