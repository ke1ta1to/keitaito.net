export class ActivityResponseDto {
  id: number;
  title: string;
  content: string | null;
  dateText: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
