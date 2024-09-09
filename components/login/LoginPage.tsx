import "server-only";

import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { green } from "@mui/material/colors";
import Image from "next/image";
import { ProviderButton } from "./ProviderButton";
import { providerMap } from "@/lib/auth/providers";
import { WarpcastLogin } from "./WarpcastLoginButton";
import { WalletLogin } from "./WalletLogin";

export function LoginPage() {
  const domain = process.env.DOMAIN;

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "100% 0", sm: "auto 40%" }}
      height="100vh"
      width="100vw"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h3" component="h1">
          Sign In to Proto
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          Use any of the following providers to sign in to your account.
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} maxWidth={500}>
          <WalletLogin type="signin" />
          <WarpcastLogin domain={domain} type="signin" />
          {providerMap.map((provider) => (
            <ProviderButton
              key={provider.id}
              provider={provider}
              type="signin"
            />
          ))}
          <Button
            href="/signup"
            LinkComponent={Link}
            variant="text"
            sx={{ textAlign: "center" }}
          >
            Don&apos;t have an account? Sign Up!
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        bgcolor={green[200]}
        px={10}
        py={4}
      >
        <Image
          src="/images/login-proto-app.png"
          alt="Login image artwork"
          sizes="100vw"
          width={800}
          height={530}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
    </Box>
  );
}
