import { Role } from '@prisma/client';

export class CreateUserRequestDto {
  username: string;
  password: string;
  bossId: string;
  role?: Role;
}
