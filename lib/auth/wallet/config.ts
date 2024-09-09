import type { Chain, Transport } from "viem";
import * as chains from "viem/chains";
import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

export function getConfig(options?: {
  walletConnectProjectId?: string;
  ssr?: boolean;
}) {
  // const projectId =
  //   options?.walletConnectProjectId ||
  //   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECTID;
  const viemChains = Object.values(chains) as unknown as [Chain, ...Chain[]];

  const connectors = [
    metaMask(),
    coinbaseWallet(),
    // ...(projectId ? [walletConnect({ projectId })] : []),
  ];

  const transports = viemChains.reduce<Record<string, Transport>>(
    (acc, chain) => {
      acc[chain.id] = http();
      return acc;
    },
    {}
  );

  const config = createConfig({
    chains: viemChains,
    connectors,
    multiInjectedProviderDiscovery: false, // Disable injected provider discovery
    ssr: options?.ssr ?? true,
    storage: createStorage({ storage: cookieStorage }),
    transports,
  });

  return config;
}
