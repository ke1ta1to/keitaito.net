import { Injectable, UnauthorizedException } from '@nestjs/common';

import { SignInDto } from './dto/sign-in.dto';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
