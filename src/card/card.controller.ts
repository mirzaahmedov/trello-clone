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
import { CardUpdatePayloadSchema, CardUpdatePayloadType } from './card.schema';
import { ZodPipe } from '@app/utils/validation/zod.pipe';
import { UserId } from '@app/auth/auth.decorator';
import { AuthGuard } from '@app/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('columns/:columnId/cards')
export class CardController {
  constructor(private readonly service: CardService) {}

  @Post()
  @ApiTags('Card')
  @UseGuards(AuthGuard)
  async createCard(
    @Param('columnId') columnId: string,
    @UserId() userId: string,
    @Body(new ZodPipe(CardUpdatePayloadSchema)) payload: CardUpdatePayloadType,
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
  @ApiTags('Card')
  @UseGuards(AuthGuard)
  async getCards(@Param('columnId') columnId: string) {
    return await this.service.getCards(columnId);
  }

  @Get(':id')
  @ApiTags('Card')
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
  @ApiTags('Card')
  @UseGuards(AuthGuard)
  async updateCard(
    @UserId('userId') userId: string,
    @Param('columnId') columnId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(CardUpdatePayloadSchema)) payload: CardUpdatePayloadType,
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
  @ApiTags('Card')
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
