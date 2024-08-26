import type { Metadata } from "next";
import { roboto } from "./fonts";
import { AppProviders } from "@/components/layout/AppProviders";
import Box from "@mui/material/Box";
import "@/theme/cssVariables.css";

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
      <AppProviders>
        <Box component="body" bgcolor="grey.100" className={roboto.className}>
          <Box component="main">{children}</Box>
        </Box>
      </AppProviders>
    </html>
  );
}
