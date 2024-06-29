"use server";

import { authActionClient } from "@/lib/actions/actionClient";
import { schema } from "./schemas/signInSchema";
import { signIn } from "../auth";
import { redirect } from "next/navigation";

export const signInAction = authActionClient
  .metadata({ actionName: "signIn" })
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    await signIn(parsedInput.providerId);
    redirect("/dashboard");
    // } catch (error) {
    //   // Signin can fail for a number of reasons, such as the user
    //   // not existing, or the user not having the correct role.
    //   // In some cases, you may want to redirect to a custom error
    //   if (error instanceof AuthError) {
    //     return redirect(`/?error=${error.type}`);
    //   }

    //   // Otherwise if a redirects happens NextJS can handle it
    //   // so you can just re-thrown the error and let NextJS handle it.
    //   // Docs:
    //   // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    //   throw error;
    // }
  });
