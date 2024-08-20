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
  SigninPayloadDto,
  SigninPayloadSchema,
  SignupPayloadDto,
  SignupPayloadSchema,
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
    example: {
      user: {
        id: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
        email: 'example@gmail.com',
        createdAt: '2024-08-20T15:25:04.744Z',
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZDdkN2I0MC1jNTYxLTRjN2EtYTc1NC01NWY4NDc3ZWFmNzUiLCJpYXQiOjE3MjQxNzUwMzN9.IiDL-SIfss7uffAhcf2f_5F_u6D1E8B4F4yocws7ho8',
    },
  })
  async signin(
    @Body(new ZodPipe(SigninPayloadSchema)) payload: SigninPayloadDto,
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
    example: {
      user: {
        id: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
        email: 'example@gmail.com',
        createdAt: '2024-08-20T15:25:04.744Z',
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZDdkN2I0MC1jNTYxLTRjN2EtYTc1NC01NWY4NDc3ZWFmNzUiLCJpYXQiOjE3MjQxNzUwMzN9.IiDL-SIfss7uffAhcf2f_5F_u6D1E8B4F4yocws7ho8',
    },
  })
  async signup(
    @Body(new ZodPipe(SignupPayloadSchema)) payload: SignupPayloadDto,
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
  @ApiOkResponse({
    example: {
      id: 'ed7d7b40-c561-4c7a-a754-55f8477eaf75',
      email: 'example@gmail.com',
      createdAt: '2024-08-20T15:25:04.744Z',
    },
  })
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
