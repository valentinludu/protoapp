import "server-only";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ReactNode } from "react";
import theme from "@/theme/theme";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";

// Check if Suspense works
const WagmiProvider = dynamic(() =>
  import("./WagmiProviderContainer").then((mod) => mod.WagmiProviderContainer)
);

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider options={{ key: "proto" }}>
        <ThemeProvider theme={theme}>
          <WagmiProvider>{children}</WagmiProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
