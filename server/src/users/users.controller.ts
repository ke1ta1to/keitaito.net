import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { UserResponseDto } from './dto/user.response.dto';
import { UsersService } from './users.service';

import { AuthGuard } from '@/auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponseDto })
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('users')
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
