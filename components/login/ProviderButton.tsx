"use client";
import { signInAction } from "@/lib/auth/actions/signInAction";
import { Button } from "@mui/material";
import { useAction } from "next-safe-action/hooks";

export function ProviderButton({
  provider,
}: {
  provider: { id: string; name: string };
}) {
  return (
    <Button
      size="large"
      variant="outlined"
      key={provider.id}
      fullWidth
      onClick={async () => {
        await signInAction({ providerId: provider.id });
      }}
    >
      Sign in with {provider.name}
    </Button>
  );
}
