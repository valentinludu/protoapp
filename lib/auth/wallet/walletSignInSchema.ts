import { z } from "zod";

export const walletSchema = z.object({
  message: z.string(),
  signature: z.string(),
  csrfToken: z.string(),
});

export type WalletSchema = z.infer<typeof walletSchema>;
