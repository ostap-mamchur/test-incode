import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserBossRequestDto } from './dto/update-user-boss-request.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Access token')
  @ApiCreatedResponse({ type: UserResponseDto, isArray: true })
  getUsers(@Request() req: any) {
    return this.usersService.getUsers(req.user.id as string);
  }

  @Patch(':id/boss')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('Access token')
  @ApiBody({
    type: UpdateUserBossRequestDto,
  })
  updateUserBoss(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) subordinateId: string,
    @Body('bossId', ParseUUIDPipe) bossId: string,
  ) {
    return this.usersService.updateUserBoss(
      req.user.id as string,
      subordinateId,
      bossId,
    );
  }
}
