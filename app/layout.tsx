import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata } from "next";
import { roboto } from "./fonts";
import theme from "@/theme/theme";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Proto app",
  description: "Post your content anywhere, anytime.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <SessionProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
              </SessionProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        }
      </body>
    </html>
  );
}
