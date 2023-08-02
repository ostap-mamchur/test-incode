import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UpdateUserBossRequestDto {
  @ApiProperty({ description: 'The id of a new boss' })
  @IsUUID()
  bossId: string;
}
