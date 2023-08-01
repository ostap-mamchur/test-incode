import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({ type: 'string' })
  accessToken: string;
}
