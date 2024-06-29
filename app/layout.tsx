import type { Metadata } from "next";
import { roboto } from "./fonts";
import { AppProviders } from "@/components/layout/AppProviders";
import Box from "@mui/material/Box";

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
      <Box component="body" bgcolor="grey.100" className={roboto.className}>
        <AppProviders>
          <Box component="main">{children}</Box>
        </AppProviders>
      </Box>
    </html>
  );
}
