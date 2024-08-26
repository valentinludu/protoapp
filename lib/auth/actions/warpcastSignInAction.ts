"use server";

import { actionClient } from "@/lib/actions/actionClient";
import { signIn } from "@/lib/auth/auth";
import { schema } from "@/lib/auth/actions/schemas/warpcastSignInSchema";

export const warpcastSignInAction = actionClient
  .metadata({ actionName: "warpcastSignIn" })
  .schema(schema)
  .action(async ({ parsedInput }) => {
    await signIn("credentials", {
      message: parsedInput.message,
      signature: parsedInput.signature,
      username: parsedInput.username,
      displayName: parsedInput.displayName,
      bio: parsedInput.bio,
      pfpUrl: parsedInput.pfpUrl,
      nonce: parsedInput.nonce,
      redirectTo: "/dashboard",
    });

    return { success: true };
  });
