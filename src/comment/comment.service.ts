import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(data: Prisma.commentCreateInput) {
    return this.prisma.comment.create({ data });
  }

  getComments(cardId: string) {
    return this.prisma.comment.findMany({
      where: {
        cardId,
      },
    });
  }

  getCommentByIdAndCardId(cardId: string, id: string) {
    return this.prisma.comment.findUnique({
      where: {
        cardId,
        id,
      },
    });
  }

  updateComment(
    where: Prisma.commentUpdateArgs['where'],
    data: Prisma.commentUpdateInput,
  ) {
    return this.prisma.comment.update({
      data,
      where,
    });
  }

  deleteComment(where: Prisma.commentDeleteArgs['where']) {
    return this.prisma.comment.delete({
      where,
    });
  }
}
