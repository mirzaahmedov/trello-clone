import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { UserId } from '@app/auth/auth.decorator';
import { AuthGuard } from '@app/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  @ApiTags('User')
  @UseGuards(AuthGuard)
  async getUserById(@UserId() userId: string) {
    const user = await this.service.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  @ApiTags('User')
  @UseGuards(AuthGuard)
  async updateUser(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() body: Prisma.userUpdateInput,
  ) {
    if (userId !== id) {
      throw new ForbiddenException();
    }
    const user = await this.service.updateUser(id, body);
    if (!user) {
      throw new InternalServerErrorException();
    }
    return user;
  }
}
