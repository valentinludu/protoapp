"use client";
import { AuthKitProvider, type AuthClientError } from "@farcaster/auth-kit";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { warpcastConfig } from "@/lib/auth/warpcast/config";
import { FarcasterLoginModal } from "./WarpcastModal";
import { useWarpcastSignIn } from "@/hooks/useWarpcastSignIn";
import { FarcasterLogo } from "./FarcasterLogo";

function WarpcastLoginButton() {
  const router = useRouter();

  const [popupState, setPopupState] = useState(false);

  const onSuccessCallback = useCallback(async () => {
    setPopupState(false);
    router.push("/profile");
  }, []);

  const onErrorCallback = useCallback((err?: AuthClientError) => {
    setPopupState(false);
    router.push("/login");
  }, []);

  const onClick = useCallback(() => {
    setPopupState(true);
  }, []);

  const { url, signIn: signInHandler } = useWarpcastSignIn({
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
    onClick,
  });

  return (
    <>
      <Button
        onClick={signInHandler}
        size="large"
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{ backgroundColor: "background.default", gap: 1 }}
      >
        <FarcasterLogo />
        Sign in with Farcaster
      </Button>
      <FarcasterLoginModal
        open={popupState}
        onClose={() => setPopupState(false)}
        url={url}
      />
    </>
  );
}

export function WarpcastLogin() {
  return (
    <AuthKitProvider config={warpcastConfig}>
      <WarpcastLoginButton />
    </AuthKitProvider>
  );
}
