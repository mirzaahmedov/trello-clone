import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CommentCreatePayloadSchema = z.object({
  content: z.string().min(1),
});
export class CommentCreatePayloadDto extends createZodDto(
  CommentCreatePayloadSchema,
) {}

export const CommentUpdatePayloadSchema = z.object({
  content: z.string().optional(),
});
export class CommentUpdatePayloadDto extends createZodDto(
  CommentUpdatePayloadSchema,
) {}
