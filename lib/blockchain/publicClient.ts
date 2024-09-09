import log from "loglevel";
import { createPublicClient, http } from "viem";
import { getConfig } from "../auth/wallet/config";

/**
 * Create a viem public client for a given chain.
 * It uses alchemy rpcs if available, otherwise it will use the first rpc url found.
 * The best use case for this is reading a contract details using a custom ABI from the protocols we use.
 *
 * @param chainId number
 * @returns the public client
 * @throws InvalidInputError if the chain is not supported
 */
export const getPublicClient = (chainId: number) => {
  const config = getConfig({ ssr: false });
  const chainDetails = config.chains.find((c) => c.id === chainId);

  if (!chainDetails) {
    log.error("Chain not supported", { chainId });
  }

  return createPublicClient({
    chain: chainDetails,
    transport: http(undefined, {
      retryCount: 1,
      timeout: 5000,
    }),
  });
};
