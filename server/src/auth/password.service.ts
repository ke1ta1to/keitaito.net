import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly pepper: string;
  private readonly cost: number;

  constructor(configService: ConfigService) {
    this.pepper = configService.getOrThrow<string>('PASSWORD_PEPPER');

    const parsedCost = configService.get<string>('BCRYPT_COST', '12');
    const cost = Number.parseInt(parsedCost, 10);
    if (cost < 4 || cost > 31) {
      throw new Error('BCRYPT_COST must be an integer between 4 and 31');
    }
    this.cost = cost;
  }

  hash(password: string) {
    return bcrypt.hash(this.withPepper(password), this.cost);
  }

  compare(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(this.withPepper(plainPassword), hashedPassword);
  }

  private withPepper(password: string) {
    return `${password}${this.pepper}`;
  }
}
