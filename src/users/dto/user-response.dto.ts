import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty({ type: 'string', format: 'uuid' })
  bossId: string;
  @ApiProperty({ enum: Role })
  role: Role;
}
