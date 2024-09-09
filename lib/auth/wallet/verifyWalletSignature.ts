import { SiweMessage } from "siwe";
import { WalletSchema } from "./walletSignInSchema";
import log from "loglevel";

export async function verifyWalletSignature({
  message,
  signature,
  csrfToken,
}: WalletSchema) {
  if (!message || !signature || !csrfToken) {
    return null;
  }

  try {
    const siweMessage = new SiweMessage(message);
    const verifiedMessage = await siweMessage.verify({
      signature,
      nonce: csrfToken,
    });

    if (
      verifiedMessage?.error ||
      !verifiedMessage.success ||
      !verifiedMessage.data?.address
    ) {
      return null;
    } else {
      return verifiedMessage.data;
    }
  } catch (err: any) {
    log.error("Error verifying wallet signature", { error: err });
    return null;
  }
}
