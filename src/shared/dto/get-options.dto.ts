import { z } from 'zod';

export const getOptionsResponse = z.array(
  z.object({
    label: z.string(),
    value: z.any()
  })
);

export type GetOptionsResponse = z.infer<typeof getOptionsResponse>;
