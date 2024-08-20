import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { ZodPipe } from '@app/utils/zod/zod.pipe';
import {
  ColumnCreatePayloadSchema,
  ColumnCreatePayloadType,
  ColumnUpdatePayloadSchema,
  ColumnUpdatePayloadType,
} from './column.models';
import { AuthGuard, IsAuthorGuard } from '@app/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('users/:userId/columns')
export class ColumnController {
  constructor(private service: ColumnService) {}

  @Post()
  @ApiTags('Column')
  @UseGuards(AuthGuard, IsAuthorGuard)
  async createColumn(
    @Param('userId') userId: string,
    @Body(new ZodPipe(ColumnCreatePayloadSchema))
    payload: ColumnCreatePayloadType,
  ) {
    const column = await this.service.createColumn({
      title: payload.title,
      user: {
        connect: {
          id: userId,
        },
      },
    });
    return column;
  }

  @Get()
  @ApiTags('Column')
  @UseGuards(AuthGuard)
  async getColumns(@Param('userId') userId: string) {
    return await this.service.getColumns(userId);
  }

  @Get(':id')
  @ApiTags('Column')
  @UseGuards(AuthGuard)
  async getColumnById(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    const column = this.service.getColumnByIdAndUserId(userId, id);
    if (!column) {
      throw new NotFoundException();
    }
    return column;
  }

  @Patch(':id')
  @ApiTags('Column')
  @UseGuards(AuthGuard, IsAuthorGuard)
  async updateColumn(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(ColumnUpdatePayloadSchema))
    payload: ColumnUpdatePayloadType,
  ) {
    const column = await this.service.updateColumn(
      {
        userId,
        id,
      },
      payload,
    );
    if (!column) {
      throw new InternalServerErrorException();
    }
    return column;
  }

  @Delete(':id')
  @ApiTags('Column')
  @UseGuards(AuthGuard, IsAuthorGuard)
  async deleteColumn(@Param('userId') userId: string, @Param('id') id: string) {
    return await this.service.deleteColumn({
      userId,
      id,
    });
  }
}
