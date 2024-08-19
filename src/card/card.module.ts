import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CardController],
  providers: [CardService, PrismaService],
})
export class CardModule {}
