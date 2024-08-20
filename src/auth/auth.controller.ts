import bcrypt from 'bcrypt';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodPipe } from '@app/utils/zod/zod.pipe';
import {
  SigninPayloadSchema,
  SigninPayloadType,
  SignupPayloadSchema,
  SignupPayloadType,
  TokenPayloadType,
} from './auth.models';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserId } from './auth.decorator';
import { UserService } from '@app/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signin')
  @ApiOkResponse({
    example: { email: 'example@example.com', password: 'example' },
  })
  async signin(
    @Body(new ZodPipe(SigninPayloadSchema)) payload: SigninPayloadType,
  ) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user || !bcrypt.compareSync(payload.password, user.password)) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const token = this.jwtService.sign(
      {
        userId: user.id,
      } satisfies TokenPayloadType,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
    if (!token) {
      throw new InternalServerErrorException();
    }

    return { user: excludeConfidentialFields(user), token };
  }

  @Post('signup')
  @ApiOkResponse({
    example: { email: 'example@example.com', password: 'example' },
  })
  async signup(
    @Body(new ZodPipe(SignupPayloadSchema)) payload: SignupPayloadType,
  ) {
    const encrypted = await bcrypt.hash(payload.password, 10);

    payload.password = encrypted;
    const user = await this.userService.createUser(payload);
    if (!user) {
      throw new BadRequestException('invalid payload');
    }

    const token = this.jwtService.sign(
      {
        userId: user.id,
      } satisfies TokenPayloadType,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
    if (!token) {
      throw new InternalServerErrorException();
    }

    return { user: excludeConfidentialFields(user), token };
  }

  @Get('me')
  @ApiTags('User')
  @UseGuards(AuthGuard)
  async getUserById(@UserId() userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}

const excludeConfidentialFields = <T extends { password?: string }>(
  data: T,
): Omit<T, 'password'> => {
  delete data.password;
  return data;
};
