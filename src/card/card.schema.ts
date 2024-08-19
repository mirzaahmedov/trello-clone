import { z } from 'zod';

export const CardCreatePayloadSchema = z.object({
  content: z.string(),
});
export type CardCreatePayloadType = z.infer<typeof CardCreatePayloadSchema>;

export const CardUpdatePayloadSchema = z.object({
  content: z.string().optional(),
});
export type CardUpdatePayloadType = z.infer<typeof CardCreatePayloadSchema>;
