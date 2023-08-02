import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async isUserBossForUser(
    subordinate: User,
    boss: User,
  ): Promise<boolean> {
    if (boss.role === Role.ADMINISTRATOR) {
      return true;
    }

    return this.isUserHierarchicalBossForUser(subordinate, boss);
  }

  private async isUserHierarchicalBossForUser(
    subordinate: User,
    boss: User,
  ): Promise<boolean> {
    if (!subordinate.bossId) {
      return false;
    }

    if (subordinate.bossId === boss.id) {
      return true;
    }

    const bossOfSubordinate = await this.prisma.user.findUnique({
      where: { id: subordinate.bossId },
    });

    return this.isUserHierarchicalBossForUser(bossOfSubordinate, boss);
  }

  private async getSubordinates(user: User): Promise<User[]> {
    const subordinates = await this.prisma.user.findMany({
      where: { bossId: user.id },
    });

    if (subordinates.length === 0) {
      return [];
    }

    const subordinatesOfSubordinates = await Promise.all(
      subordinates.map((subordinate) => this.getSubordinates(subordinate)),
    ).then((result) => result.flat());

    return [...subordinates, ...subordinatesOfSubordinates];
  }

  private mapUserToDto(user: User): UserResponseDto {
    const { password, ...userEntity } = user;
    return userEntity;
  }

  async getUsers(id: string): Promise<UserResponseDto[]> {
    const user = await this.getUserById(id);

    let users: User[];

    if (user.role === Role.ADMINISTRATOR) {
      users = await this.prisma.user.findMany();
    } else {
      const subordinates = await this.getSubordinates(user);
      users = [user, ...subordinates];
    }
    return users.map((user) => this.mapUserToDto(user));
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(`The user with (${id}) does not exist`);
    }

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new BadRequestException(
        `The user with (${username}) does not exist`,
      );
    }

    return user;
  }

  async createUser(
    username: string,
    password: string,
    bossId: string,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: { username, password, bossId },
    });
    return user;
  }

  async updateUserBoss(id: string, subordinateId: string, bossId: string) {
    const user = await this.getUserById(id);
    const subordinate = await this.getUserById(subordinateId);
    const boss = await this.getUserById(bossId);

    const isUserBossForSubordinate = await this.isUserBossForUser(
      subordinate,
      user,
    );

    if (!isUserBossForSubordinate) {
      throw new ForbiddenException(
        `The user with ${id} id is not a boss for the subordinate with ${subordinateId} id`,
      );
    }

    const isSubordinateBossForBoss = await this.isUserBossForUser(
      boss,
      subordinate,
    );

    if (isSubordinateBossForBoss) {
      throw new BadRequestException(
        `You cannot set a subordinate as a new boss`,
      );
    }

    await this.prisma.user.update({
      where: { id: subordinateId },
      data: { bossId },
    });
  }
}
