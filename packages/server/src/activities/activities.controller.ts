import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { ActivityCreateDto } from './dto/activity.create.dto';
import { ActivityResponseDto } from './dto/activity.response.dto';
import { ActivityUpdateDto } from './dto/activity.update.dto';

import { AuthGuard } from '@/auth/auth.guard';
import { UserResponseDto } from '@/users/dto/user.response.dto';
import { User } from '@/users/user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ActivityResponseDto })
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiCreatedResponse({ type: ActivityResponseDto })
  create(
    @Body() createActivityDto: ActivityCreateDto,
    @User() user: UserResponseDto,
  ) {
    const userId = user.id;
    return this.activitiesService.create({
      data: { ...createActivityDto, user: { connect: { id: userId } } },
    });
  }

  @Get()
  @ApiOkResponse({ type: ActivityResponseDto, isArray: true })
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ActivityResponseDto })
  @ApiNotFoundResponse()
  findOne(@Param('id') id: number) {
    return this.activitiesService.findOneOrThrow({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: ActivityResponseDto })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: ActivityUpdateDto,
    @User() user: UserResponseDto,
  ) {
    const activity = await this.activitiesService.findOneOrThrow({ id });
    const userId = user.id;
    // 自分のIDと異なる場合はエラー
    if (activity.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.activitiesService.update({ id, data: updateActivityDto });
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  async remove(
    @Param('id') id: number,
    @User() user: UserResponseDto,
  ): Promise<void> {
    const activity = await this.activitiesService.findOneOrThrow({ id });
    const userId = user.id;
    // 自分のIDと異なる場合はエラー
    if (activity.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.activitiesService.remove({ id });
  }
}
