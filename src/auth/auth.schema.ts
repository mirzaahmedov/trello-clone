import { z } from 'zod';

export const SignupPayloadSchema = z.object({
  email: z.string().min(1, 'required').email(),
  password: z.string().min(8).max(20),
});
export type SignupPayloadType = z.infer<typeof SignupPayloadSchema>;

export const SigninPayloadSchema = z.object({
  email: z.string().min(1, 'required').email(),
  password: z.string().min(1, 'required'),
});
export type SigninPayloadType = z.infer<typeof SigninPayloadSchema>;
