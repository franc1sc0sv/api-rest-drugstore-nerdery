import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserModel } from 'src/common/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserModel> {
    try {
      const { userId } = payload;
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const revokedToken = await this.prismaService.revokedToken.findFirst({
        where: {
          userId,
          token,
        },
      });

      if (revokedToken) {
        throw new UnauthorizedException('Token has been revoked');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error validating user');
    }
  }
}
