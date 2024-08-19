import { PrismaService } from '@app/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ColumnController],
  providers: [ColumnService, PrismaService],
})
export class ColumnModule {}
