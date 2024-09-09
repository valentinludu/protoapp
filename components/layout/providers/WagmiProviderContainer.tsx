import "server-only";
import { cookieToInitialState } from "wagmi";

import { getConfig } from "@/lib/auth/wallet/config";
import { WagmiProvider } from "./WagmiProvider";
import { headers } from "next/headers";

export function WagmiProviderContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const wagmiInitialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );

  return (
    <WagmiProvider initialState={wagmiInitialState}>{children}</WagmiProvider>
  );
}
