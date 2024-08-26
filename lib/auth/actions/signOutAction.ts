"use server";

import { actionClient } from "@/lib/actions/actionClient";
import { signOut } from "@/lib/auth/auth";

export const signOutAction = actionClient
  .metadata({ actionName: "signOut" })
  .action(async () => {
    await signOut();
  });
