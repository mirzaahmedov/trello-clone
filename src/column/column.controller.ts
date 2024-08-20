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
  ColumnCreatePayloadDto,
  ColumnCreatePayloadSchema,
  ColumnUpdatePayloadDto,
  ColumnUpdatePayloadSchema,
} from './column.models';
import { AuthGuard, IsAuthorGuard } from '@app/auth/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('users/:userId/columns')
@ApiTags('Columns')
export class ColumnController {
  constructor(private service: ColumnService) {}

  @Post()
  @ApiOkResponse({
    example: {
      id: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      title: 'Example',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:32:45.132Z',
    },
  })
  @UseGuards(AuthGuard, IsAuthorGuard)
  async createColumn(
    @Param('userId') userId: string,
    @Body(new ZodPipe(ColumnCreatePayloadSchema))
    payload: ColumnCreatePayloadDto,
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
  @ApiOkResponse({
    example: [
      {
        id: 'd0390268-ad5c-4072-8870-dfe4765a2139',
        title: 'Example',
        userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
        createdAt: '2024-08-20T17:32:45.132Z',
      },
    ],
  })
  @UseGuards(AuthGuard)
  async getColumns(@Param('userId') userId: string) {
    return await this.service.getColumns(userId);
  }

  @Get(':id')
  @ApiOkResponse({
    example: {
      id: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      title: 'Example',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:32:45.132Z',
    },
  })
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
  @ApiOkResponse({
    example: {
      id: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      title: 'Example',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:32:45.132Z',
    },
  })
  @UseGuards(AuthGuard, IsAuthorGuard)
  async updateColumn(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(ColumnUpdatePayloadSchema))
    payload: ColumnUpdatePayloadDto,
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
  @ApiOkResponse({
    example: {
      id: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      title: 'Example',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:32:45.132Z',
    },
  })
  @UseGuards(AuthGuard, IsAuthorGuard)
  async deleteColumn(@Param('userId') userId: string, @Param('id') id: string) {
    return await this.service.deleteColumn({
      userId,
      id,
    });
  }
}
