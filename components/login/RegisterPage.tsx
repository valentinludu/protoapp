import "server-only";
import { providerMap } from "@/lib/auth/auth";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { green } from "@mui/material/colors";
import Image from "next/image";
import { ProviderButton } from "./ProviderButton";

export function RegisterPage() {
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
          Signup to Proto
        </Typography>
        <Typography variant="h6" mb={2}>
          Get started - it&apos;s free, no credit card needed
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} maxWidth={500}>
          {providerMap.map((provider) => (
            <ProviderButton
              key={provider.id}
              provider={provider}
              type="signup"
            />
          ))}
          <Button
            href="/login"
            LinkComponent={Link}
            variant="text"
            sx={{ textAlign: "center" }}
          >
            Do you have an account? Sign In!
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
          alt="Register image artwork"
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
