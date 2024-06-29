import { cookies, headers } from "next/headers";
import log from "loglevel";
import { createSafeActionClient } from "next-safe-action/typeschema";
import { z } from "zod";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  handleReturnedServerError: (err, utils) => {
    return { error: err } as { error: any };
  },
  handleServerErrorLog(err, utils) {
    const message = err.message
      ? "Action error: " + err.message
      : "There was an error in the action";

    log.error(message, {
      error: err,
      meta: utils.metadata,
      clientInput: utils.clientInput,
    });
  },
})
  /**
   * Middleware used for auth purposes.
   * Returns the context with the session object.
   */
  .use(async ({ next }) => {
    // const session = await getIronSession<SessionData>(
    //   cookies(),
    //   getIronOptions()
    // );
    // const headerList = headers();
    return next({
      ctx: null,
    });
  });

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const userId = "";

  if (!userId) {
    throw new Error("You are not logged in. Please try to login");
  }

  return next({ ctx });
});
