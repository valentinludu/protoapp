import { createAppClient, viemConnector } from "@farcaster/auth-client";

export const farcasterAppClient = createAppClient({
  ethereum: viemConnector(),
});
