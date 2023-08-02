import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserRequestDto } from './dto/register-user-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ username, password, bossId }: RegisterUserRequestDto) {
    const bossCandidate = await this.usersService.getUserById(bossId);
    const saltRounds = +this.configService.get<number>('BCRYPT_SALT_ROUNDS');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this.usersService.createUser(
      username,
      hashedPassword,
      bossCandidate.id,
    );
  }

  async login(user: User) {
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
    });

    return { accessToken };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByUsername(username);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`The password is invalid`);
    }

    return user;
  }
}
