import type { Metadata } from "next";
import Box from "@mui/material/Box";

export const metadata: Metadata = {
  title: "Dashboard - Proto app",
  description: "Your web3 social media dashboard.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Box>{children}</Box>;
}
