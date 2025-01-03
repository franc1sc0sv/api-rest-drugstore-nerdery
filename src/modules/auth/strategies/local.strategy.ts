import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginUserInput } from '../dtos/request/login-user.input';
import { UserModel } from 'src/common/models/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<UserModel> {
    const loginUserInput: LoginUserInput = { email, password };
    return await this.authService.validateUser(loginUserInput);
  }
}
