"use server";

import { actionClient } from "@/lib/actions/actionClient";
import { signIn } from "@/lib/auth/auth";
import { schema } from "@/lib/auth/actions/schemas/signInSchema";

export const signInAction = actionClient
  .metadata({ actionName: "signIn" })
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    await signIn(parsedInput.providerId, { redirectTo: "/dashboard" });
  });
