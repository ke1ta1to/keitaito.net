import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { UserResponseDto } from './dto/user.response.dto';
import { UsersService } from './users.service';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponseDto })
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOneOrThrow(id);
  }
}
