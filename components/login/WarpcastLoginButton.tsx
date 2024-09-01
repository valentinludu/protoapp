"use client";

import { AuthKitProvider, type AuthClientError } from "@farcaster/auth-kit";
import Button from "@mui/material/Button";
import { useCallback, useState } from "react";

import { warpcastConfig } from "@/lib/auth/warpcast/config";
import { FarcasterLoginModal } from "./WarpcastModal";
import { useWarpcastSignIn } from "@/hooks/useWarpcastSignIn";
import { FarcasterLogo } from "./FarcasterLogo";

function WarpcastLoginButton() {
  const [popupState, setPopupState] = useState(false);

  const onSuccessCallback = useCallback(async () => {
    setPopupState(false);
  }, []);

  const onErrorCallback = useCallback(async (_err?: AuthClientError) => {
    setPopupState(false);
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
        disabled={!url}
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

export function WarpcastLogin({ domain }: { domain?: string }) {
  return (
    <AuthKitProvider config={{ ...warpcastConfig, domain }}>
      <WarpcastLoginButton />
    </AuthKitProvider>
  );
}
