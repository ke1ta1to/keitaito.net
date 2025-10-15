import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { PayloadDto } from './dto/payload.dto';

import { UserResponseDto } from '@/users/dto/user.response.dto';
import { UsersService } from '@/users/users.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (token === null) {
      throw new UnauthorizedException();
    }

    try {
      const payload = plainToInstance(
        PayloadDto,
        await this.jwtService.verifyAsync<PayloadDto>(token, {
          secret: this.configService.getOrThrow('JWT_SECRET'),
        }),
      );
      // @ts-expect-error: custom property
      request['auth'] = payload;

      const user = await this.usersService.findOneOrThrow(payload.sub);
      // @ts-expect-error: custom property
      request['user'] = plainToInstance(UserResponseDto, user);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
