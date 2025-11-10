import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JwtPayload } from './jwt-payload.interface';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    // TODO: ハッシュ化されたパスワードとの比較に変更
    if (user === null || user.password !== password) {
      return null;
    }
    return user;
  }

  signIn(user: Request['user']) {
    const payload = { sub: user.id } satisfies JwtPayload;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
