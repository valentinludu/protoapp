"use client";
import { signInAction } from "@/lib/auth/actions/signInAction";
import { Button } from "@mui/material";
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
      sx={{ backgroundColor: "background.default", gap: 1 }}
    >
      <Image src={provider.image} alt={provider.name} width={20} height={20} />
      {text} with {provider.name}
    </Button>
  );
}
