import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ReactNode } from "react";
import theme from "@/theme/theme";
import { SessionProvider } from "next-auth/react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppRouterCacheProvider>
        <CssVarsProvider theme={theme}>{children}</CssVarsProvider>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
}
