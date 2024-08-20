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
  CommentCreatePayloadDto,
  CommentCreatePayloadSchema,
  CommentUpdatePayloadDto,
  CommentUpdatePayloadSchema,
} from './comment.models';
import { ZodPipe } from '@app/utils/zod/zod.pipe';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('cards/:cardId/comments')
@ApiTags('Comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  @ApiOkResponse({
    example: {
      id: '85de1520-8cee-443a-9231-e1e15aa92ce6',
      content: 'Example',
      cardId: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:39:57.295Z',
    },
  })
  @UseGuards(AuthGuard)
  async createComment(
    @UserId() userId: string,
    @Param('cardId') cardId: string,
    @Body(new ZodPipe(CommentCreatePayloadSchema))
    payload: CommentCreatePayloadDto,
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
  @ApiOkResponse({
    example: {
      id: '85de1520-8cee-443a-9231-e1e15aa92ce6',
      content: 'Example',
      cardId: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:39:57.295Z',
    },
  })
  @UseGuards(AuthGuard)
  async getComments(@Param('cardId') cardId: string) {
    return await this.service.getComments(cardId);
  }

  @Get(':id')
  @ApiOkResponse({
    example: {
      id: '85de1520-8cee-443a-9231-e1e15aa92ce6',
      content: 'Example',
      cardId: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:39:57.295Z',
    },
  })
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
  @ApiOkResponse({
    example: {
      id: '85de1520-8cee-443a-9231-e1e15aa92ce6',
      content: 'Example',
      cardId: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:39:57.295Z',
    },
  })
  @UseGuards(AuthGuard)
  async updateComment(
    @UserId() userId: string,
    @Param('cardId') cardId: string,
    @Param('id') id: string,
    @Body(new ZodPipe(CommentUpdatePayloadSchema))
    payload: CommentUpdatePayloadDto,
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
  @ApiOkResponse({
    example: {
      id: '85de1520-8cee-443a-9231-e1e15aa92ce6',
      content: 'Example',
      cardId: '6504ff8b-7705-4bfe-b3c1-0b43f7bd2e83',
      userId: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      createdAt: '2024-08-20T17:39:57.295Z',
    },
  })
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
