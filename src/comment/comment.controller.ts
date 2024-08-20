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
import { CommentService } from './comment.service';
import { AuthGuard } from '@app/auth/auth.guard';
import { UserId } from '@app/auth/auth.decorator';
import {
  CommentCreatePayloadSchema,
  CommentCreatePayloadType,
  CommentUpdatePayloadSchema,
  CommentUpdatePayloadType,
} from './comment.models';
import { ZodPipe } from '@app/utils/zod/zod.pipe';
import { ApiTags } from '@nestjs/swagger';

@Controller('cards/:cardId/comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiTags('Comment')
  @UseGuards(AuthGuard)
  async createComment(
    @UserId() userId: string,
    @Param('cardId') cardId: string,
    @Body(new ZodPipe(CommentCreatePayloadSchema))
    payload: CommentCreatePayloadType,
  ) {
    const comment = await this.service.createComment({
      user: {
        connect: {
          id: userId,
        },
      },
      card: {
        connect: {
          id: cardId,
        },
      },
      content: payload.content,
    });

    if (!comment) {
      throw new InternalServerErrorException();
    }

    return comment;
  }

  @Get()
  @ApiTags('Comment')
  @UseGuards(AuthGuard)
  async getComments(@Param('cardId') cardId: string) {
    return await this.service.getComments(cardId);
  }

  @Get(':id')
  @ApiTags('Comment')
  @UseGuards(AuthGuard)
  async getCommentById(
    @Param('cardId') cardId: string,
    @Param('id') id: string,
  ) {
    const comment = await this.service.getCommentByIdAndCardId(cardId, id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @Patch(':id')
  @ApiTags('Comment')
  @UseGuards(AuthGuard)
  async updateComment(
    @UserId() userId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(CommentUpdatePayloadSchema))
    payload: CommentUpdatePayloadType,
  ) {
    const comment = await this.service.updateComment(
      {
        userId,
        cardId,
        id,
      },
      payload,
    );

    return comment;
  }

  @Delete(':id')
  @ApiTags('Comment')
  @UseGuards(AuthGuard)
  async deleteComment(
    @UserId() userId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
  ) {
    return await this.service.deleteComment({
      userId,
      cardId,
      id,
    });
  }
}
