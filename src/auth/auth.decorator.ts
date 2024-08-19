import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (
      !('userId' in request) ||
      typeof request.userId !== 'string' ||
      request.userId === ''
    ) {
      throw new ForbiddenException('invalid token');
    }
    return request.userId;
  },
);
