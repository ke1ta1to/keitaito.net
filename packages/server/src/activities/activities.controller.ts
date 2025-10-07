import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { ActivityCreateDto } from './dto/activity.create.dto';
import { ActivityResponseDto } from './dto/activity.response.dto';
import { ActivityUpdateDto } from './dto/activity.update.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: ActivityResponseDto })
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiCreatedResponse({ type: ActivityResponseDto })
  create(@Body() createActivityDto: ActivityCreateDto) {
    const userId = 1; // TODO
    return this.activitiesService.create({
      data: { ...createActivityDto, user: { connect: { id: userId } } },
    });
  }

  @Get()
  @ApiOkResponse({ type: [ActivityResponseDto] })
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ActivityResponseDto })
  @ApiNotFoundResponse()
  findOne(@Param('id') id: number) {
    return this.activitiesService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({ type: ActivityResponseDto })
  update(
    @Param('id') id: number,
    @Body() updateActivityDto: ActivityUpdateDto,
  ) {
    return this.activitiesService.update({ id, data: updateActivityDto });
  }

  @Delete(':id')
  @ApiNoContentResponse()
  remove(@Param('id') id: number) {
    return this.activitiesService.remove({ id });
  }
}
