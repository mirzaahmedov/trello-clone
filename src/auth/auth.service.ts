import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

type JWTTokenPayload = {
  userId: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async createUser(input: Prisma.userCreateInput) {
    return await this.prisma.user.create({
      data: input,
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  createJWTToken(userId: string) {
    return this.jwt.sign(
      { userId },
      {
        secret: this.config.get<string>('JWT_SECRET'),
      },
    );
  }

  verifyJWTToken(token: string): JWTTokenPayload | null {
    try {
      const decoded = this.jwt.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      return decoded as JWTTokenPayload;
    } catch {
      return null;
    }
  }
}
