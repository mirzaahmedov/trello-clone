import bcrypt from 'bcrypt';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from '@app/utils/validation/zod.pipe';
import {
  SigninPayloadSchema,
  SigninPayloadType,
  SignupPayloadSchema,
  SignupPayloadType,
} from './auth.schema';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signin')
  @ApiTags('Authentication')
  @ApiOkResponse({
    example: { email: 'example@gmail.com', password: 'example' },
  })
  async signin(
    @Body(new ZodPipe(SigninPayloadSchema)) payload: SigninPayloadType,
  ) {
    const user = await this.service.findUserByEmail(payload.email);
    if (!user || !bcrypt.compareSync(payload.password, user.password)) {
      throw new UnauthorizedException('incorrect email or password');
    }

    const token = this.service.createJWTToken(user.id);
    if (!token) {
      throw new InternalServerErrorException();
    }

    return { user, token };
  }

  @Post('signup')
  @ApiTags('Authentication')
  @ApiOkResponse({
    example: { email: 'example@gmail.com', password: 'example' },
  })
  async signup(
    @Body(new ZodPipe(SignupPayloadSchema)) payload: SignupPayloadType,
  ) {
    const encrypted = await bcrypt.hash(payload.password, 10);

    payload.password = encrypted;
    const user = await this.service.createUser(payload);
    if (!user) {
      throw new BadRequestException('invalid payload');
    }

    const token = this.service.createJWTToken(user.id);
    if (!token) {
      throw new InternalServerErrorException();
    }

    return { user, token };
  }
}
