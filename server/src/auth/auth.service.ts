import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './jwt-payload.interface';
import { PasswordService } from './password.service';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user === null) return null;
    const isValid = await this.passwordService.compare(password, user.password);
    if (!isValid) return null;

    return user;
  }

  async signIn(user: { id: number }) {
    const payload = { sub: user.id } satisfies JwtPayload;
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, password: string) {
    const hashedPassword = await this.passwordService.hash(password);
    const user = await this.usersService.create(email, hashedPassword);
    return this.signIn(user);
  }
}
