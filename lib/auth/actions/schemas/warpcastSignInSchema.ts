import { z } from "zod";

export const schema = z.object({
  message: z.string().optional(),
  signature: z.string().optional(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  pfpUrl: z.string().optional(),
  nonce: z.string().optional(),
});
