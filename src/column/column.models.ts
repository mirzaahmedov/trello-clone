import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ColumnCreatePayloadSchema = z.object({
  title: z.string().min(1),
});
export class ColumnCreatePayloadDto extends createZodDto(
  ColumnCreatePayloadSchema,
) {}

export const ColumnUpdatePayloadSchema = z.object({
  title: z.string().optional(),
});
export class ColumnUpdatePayloadDto extends createZodDto(
  ColumnUpdatePayloadSchema,
) {}
