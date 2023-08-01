import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { LocalGuard } from './guards/local.guard';
import { User } from '@prisma/client';
import { LoginUserRequestDto } from './dto/login-user-request.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { RegisterUserRequestDto } from './dto/register-user-request.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserRequestDto: RegisterUserRequestDto) {
    return this.authService.register(registerUserRequestDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginUserRequestDto })
  @ApiCreatedResponse({ type: LoginUserResponseDto })
  login(@Request() req: any) {
    return this.authService.login(req.user as User);
  }
}
