import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TokenPayloadSchema = z.object({
  userId: z.string().uuid(),
});
export type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;

export const SignupPayloadSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8).max(20),
});
export class SignupPayloadDto extends createZodDto(SignupPayloadSchema) {}

export const SigninPayloadSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8).max(20),
});
export class SigninPayloadDto extends createZodDto(SignupPayloadSchema) {}
