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
import { CardService } from './card.service';
import {
  CardCreatePayloadDto,
  CardCreatePayloadSchema,
  CardUpdatePayloadDto,
  CardUpdatePayloadSchema,
} from './card.models';
import { ZodPipe } from '@app/utils/zod/zod.pipe';
import { UserId } from '@app/auth/auth.decorator';
import { AuthGuard } from '@app/auth/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('columns/:columnId/cards')
@ApiTags('Cards')
export class CardController {
  constructor(private readonly service: CardService) {}

  @Post()
  @ApiOkResponse({
    example: {
      id: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      content: 'Example',
      columnId: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:37:09.438Z',
    },
  })
  @UseGuards(AuthGuard)
  async createCard(
    @Param('columnId') columnId: string,
    @UserId() userId: string,
    @Body(new ZodPipe(CardCreatePayloadSchema)) payload: CardCreatePayloadDto,
  ) {
    const card = await this.service.createCard({
      content: payload.content,
      user: {
        connect: {
          id: userId,
        },
      },
      column: {
        connect: {
          id: columnId,
        },
      },
    });
    if (!card) {
      throw new InternalServerErrorException();
    }
    return card;
  }

  @Get()
  @ApiOkResponse({
    example: [
      {
        id: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
        content: 'Example',
        columnId: 'd0390268-ad5c-4072-8870-dfe4765a2139',
        userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
        createdAt: '2024-08-20T17:37:09.438Z',
      },
    ],
  })
  @UseGuards(AuthGuard)
  async getCards(@Param('columnId') columnId: string) {
    return await this.service.getCards(columnId);
  }

  @Get(':id')
  @ApiOkResponse({
    example: {
      id: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      content: 'Example',
      columnId: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:37:09.438Z',
    },
  })
  @UseGuards(AuthGuard)
  async getCardById(
    @Param('columnId') columnId: string,
    @Param('id') id: string,
  ) {
    const card = await this.service.getCardByIdAndColumnId(columnId, id);
    if (!card) {
      throw new NotFoundException();
    }
    return card;
  }

  @Patch(':id')
  @ApiOkResponse({
    example: {
      id: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      content: 'Example',
      columnId: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:37:09.438Z',
    },
  })
  @UseGuards(AuthGuard)
  async updateCard(
    @UserId('userId') userId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(CardUpdatePayloadSchema)) payload: CardUpdatePayloadDto,
  ) {
    const card = await this.service.updateCard(
      {
        userId,
        columnId,
        id,
      },
      payload,
    );
    if (!card) {
      throw new InternalServerErrorException();
    }
    return card;
  }

  @Delete(':id')
  @ApiOkResponse({
    example: {
      id: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      content: 'Example',
      columnId: 'd0390268-ad5c-4072-8870-dfe4765a2139',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:37:09.438Z',
    },
  })
  @UseGuards(AuthGuard)
  async deleteCard(
    @UserId() userId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
  ) {
    return await this.service.deleteCard({
      userId,
      columnId,
      id,
    });
  }
}
