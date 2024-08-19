import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  createColumn(input: Prisma.columnCreateInput) {
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

  deleteColumn(where: Prisma.columnDeleteArgs['where']) {
    return this.prisma.column.delete({
      where,
    });
  }

  updateColumn(
    where: Prisma.columnUpdateArgs['where'],
    data: Prisma.columnUpdateInput,
  ) {
    return this.prisma.column.update({
      data,
      where,
    });
  }
}
