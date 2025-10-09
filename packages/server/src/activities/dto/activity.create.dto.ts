import { IsDefined, IsOptional } from 'class-validator';

export class ActivityCreateDto {
  @IsDefined() title: string;
  @IsOptional() content?: string | null;
  @IsDefined() dateText: string;
}
