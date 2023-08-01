import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateUserBossRequestDto {
  @ApiProperty()
  @IsUUID()
  bossId: string;
}
