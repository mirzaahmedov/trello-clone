import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  createComment(data: Prisma.CommentCreateInput) {
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
    where: Prisma.CommentUpdateArgs['where'],
    data: Prisma.CommentUpdateInput,
  ) {
    return this.prisma.comment.update({
      data,
      where,
    });
  }

  deleteComment(where: Prisma.CommentDeleteArgs['where']) {
    return this.prisma.comment.delete({
      where,
    });
  }
}
