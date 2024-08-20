import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  createColumn(input: Prisma.ColumnCreateInput) {
    return this.prisma.column.create({
      data: input,
    });
  }

  getColumns(userId: string) {
    return this.prisma.column.findMany({
      where: {
        userId,
      },
    });
  }

  getColumnByIdAndUserId(userId: string, id: string) {
    return this.prisma.column.findUnique({
      where: {
        userId,
        id,
      },
    });
  }

  deleteColumn(where: Prisma.ColumnDeleteArgs['where']) {
    return this.prisma.column.delete({
      where,
    });
  }

  updateColumn(
    where: Prisma.ColumnUpdateArgs['where'],
    data: Prisma.ColumnUpdateInput,
  ) {
    return this.prisma.column.update({
      data,
      where,
    });
  }
}
