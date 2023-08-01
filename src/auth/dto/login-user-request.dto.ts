import { OmitType } from '@nestjs/swagger';
import { RegisterUserRequestDto } from './register-user-request.dto';

export class LoginUserRequestDto extends OmitType(RegisterUserRequestDto, [
  'bossId',
] as const) {}
