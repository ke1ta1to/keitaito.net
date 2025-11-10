import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(200)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'P@ssw0rd' },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    },
  })
  @ApiOkResponse({ example: { access_token: 'your-access-token' } })
  signIn(@Req() req: Request) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string', nullable: true },
      },
      required: ['id', 'email', 'name'],
      additionalProperties: false,
    },
  })
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
