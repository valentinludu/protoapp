import log from "loglevel";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { auth } from "../auth/auth";
import { AuthError, Session } from "next-auth";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleReturnedServerError: (error, utils) => {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: error.cause,
    };
  },
  handleServerErrorLog(error, utils) {
    const context = utils.ctx as {
      session?: Session | null;
    } | null;
    const userId = context?.session?.user?.id as string | undefined;
    const message = error.message
      ? "Action error: " + error.message
      : "There was an error in the action";

    log.error(message, {
      error,
      userId,
      metadata: utils.metadata,
      clientInput: utils.clientInput,
    });
  },
})
  /**
   * Middleware used for auth purposes.
   * Returns the context with the session object.
   */
  .use(async ({ next }) => {
    const session = await auth();

    return next({ ctx: { session } });
  });

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const session = ctx.session;

  if (!session?.user) {
    throw new AuthError("You are not logged in. Please try to login");
  }

  return next({ ctx });
});
