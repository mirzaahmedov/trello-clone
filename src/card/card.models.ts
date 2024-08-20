import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CardCreatePayloadSchema = z.object({
  content: z.string().min(1),
});
export class CardCreatePayloadDto extends createZodDto(
  CardCreatePayloadSchema,
) {}

export const CardUpdatePayloadSchema = z.object({
  content: z.string().optional(),
});
export class CardUpdatePayloadDto extends createZodDto(
  CardUpdatePayloadSchema,
) {}
