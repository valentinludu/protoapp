"use client";
import { signInAction } from "@/lib/auth/actions/signInAction";
import { Button } from "@mui/material";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";

export function ProviderButton({
  provider,
  type,
}: {
  provider: { id: string; name: string; image: string };
  type: "signin" | "signup";
}) {
  const text = type === "signin" ? "Sign in" : "Sign up";

  return (
    <Button
      key={provider.id}
      size="large"
      variant="outlined"
      color="inherit"
      fullWidth
      onClick={async () => {
        await signInAction({ providerId: provider.id });
      }}
      sx={{ backgroundColor: "background.default" }}
    >
      <Image
        src={provider.image}
        alt={provider.name}
        width={14}
        height={14}
        style={{ marginRight: 5 }}
      />
      {text} with {provider.name}
    </Button>
  );
}
