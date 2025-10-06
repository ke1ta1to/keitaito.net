export class CreateActivityDto {
  title: string;
  description: string;
  dateText: string;
  userId?: number | null | undefined;
}
