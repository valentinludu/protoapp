import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata } from "next";
import { roboto } from "./fonts";
import theme from "@/theme/theme";
import NextAuthProvider from "./components/context/NextAuthSessionProvider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Figma proto app",
  description: "Test a Figma prototype in minutes, not hours",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={roboto.className}>
        {
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <NextAuthProvider session={session}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
              </NextAuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        }
      </body>
    </html>
  );
}
