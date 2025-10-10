import { PartialType } from '@nestjs/swagger';

import { ActivityCreateDto } from './activity.create.dto';

export class ActivityUpdateDto extends PartialType(ActivityCreateDto) {}
