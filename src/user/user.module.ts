import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}
