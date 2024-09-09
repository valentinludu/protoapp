import { z } from "zod";

export const warpcastSchema = z.object({
  state: z.enum(["pending", "completed"]),
  nonce: z.string(),
  url: z.string().optional(),
  message: z.string(),
  signature: z.string(),
  fid: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  displayName: z.string().optional(),
  pfpUrl: z.string().optional(),
  custody: z
    .string()
    .startsWith("0x", { message: "Must be a valid address" })
    .optional(),
  // verifications: z.array(
  //   z.string().startsWith("0x", { message: "Must be a valid address" })
  // ),
  // signatureParams: z.object({
  //   siweUri: z.string(),
  //   domain: z.string(),
  //   nonce: z.string(),
  //   notBefore: z.string(),
  //   expirationTime: z.string(),
  //   requestId: z.string(),
  //   redirectUrl: z.string(),
  // }),
  // metadata: z.object({
  //   ip: z.string(),
  //   userAgent: z.string(),
  // }),
});

export type WarpcastSchema = z.infer<typeof warpcastSchema>;
