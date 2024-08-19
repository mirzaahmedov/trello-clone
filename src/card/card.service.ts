import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  getCards(columnId: string) {
    return this.prisma.card.findMany({
      where: {
        columnId,
      },
    });
  }

  createCard(data: Prisma.cardCreateInput) {
    return this.prisma.card.create({
      data,
    });
  }

  getCardByIdAndColumnId(columnId: string, id: string) {
    return this.prisma.card.findUnique({
      where: {
        columnId,
        id,
      },
    });
  }

  updateCard(
    where: Prisma.cardUpdateArgs['where'],
    data: Prisma.cardUpdateInput,
  ) {
    return this.prisma.card.update({
      data,
      where,
    });
  }

  deleteCard(where: Prisma.cardDeleteArgs['where']) {
    return this.prisma.card.delete({
      where,
    });
  }
}
