import "server-only";
import { signInAction } from "@/lib/auth/actions/signInAction";
import { providerMap } from "@/lib/auth/auth";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export function LoginPage() {
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
        bgcolor="background.default"
        gap={2}
      >
        <Typography variant="h3" component="h1">
          Sign In to Proto
        </Typography>
        <Typography variant="h6" mb={2}>
          Get started - it&apos;s free, no credit card needed
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} maxWidth={300}>
          {providerMap.map((provider) => (
            <Button
              key={provider.id}
              onClick={async () => {
                "use server";
                await signInAction({ providerId: provider.id });
              }}
            >
              Sign in with {provider.name}
            </Button>
          ))}
          <Link href="/signup" style={{ textAlign: "center" }}>
            Don&apos;t have an account? Sign Up!
          </Link>
        </Box>
      </Box>
      <Box></Box>
    </Box>
  );
}
