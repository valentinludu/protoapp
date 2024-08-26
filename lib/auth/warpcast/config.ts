import { optimism } from "viem/chains";
import { Provider } from "@farcaster/auth-client";

interface AuthKitConfig {
  relay?: string;
  domain?: string;
  siweUri?: string;
  rpcUrl?: string;
  redirectUrl?: string;
  version?: string;
  provider?: Provider;
}

export const warpcastConfig: AuthKitConfig = {
  relay: "https://relay.farcaster.xyz",
  rpcUrl: "https://mainnet.optimism.io",
  domain: process.env.DOMAIN || "farcaster.xyz",
  siweUri: "https://app.protoapp.io/login",
} as const;
