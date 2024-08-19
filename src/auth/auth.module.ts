import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@app/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, PrismaService, ConfigService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
