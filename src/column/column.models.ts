import { z } from 'zod';

export const ColumnCreatePayloadSchema = z.object({
  title: z.string().min(1),
});
export type ColumnCreatePayloadType = z.infer<typeof ColumnCreatePayloadSchema>;

export const ColumnUpdatePayloadSchema = z.object({
  title: z.string().optional(),
});
export type ColumnUpdatePayloadType = z.infer<typeof ColumnUpdatePayloadSchema>;
