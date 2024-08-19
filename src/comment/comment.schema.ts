import { z } from 'zod';

export const CommentCreatePayloadSchema = z.object({
  content: z.string().min(1, 'required'),
});
export type CommentCreatePayloadType = z.infer<
  typeof CommentCreatePayloadSchema
>;

export const CommentUpdatePayloadSchema = z.object({
  content: z.string().optional(),
});
export type CommentUpdatePayloadType = z.infer<
  typeof CommentUpdatePayloadSchema
>;
