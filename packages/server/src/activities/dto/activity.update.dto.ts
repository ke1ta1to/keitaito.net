import { PartialType } from '@nestjs/mapped-types';

import { ActivityCreateDto } from './activity.create.dto';

export class ActivityUpdateDto extends PartialType(ActivityCreateDto) {}
