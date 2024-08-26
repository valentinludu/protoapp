"use client";

import { signOut as signOutAuth, signIn as signInAuth } from "@/lib/auth/auth";

import type { StatusAPIResponse } from "@farcaster/auth-kit";
import { useSignIn } from "@farcaster/auth-kit";
import log from "loglevel";
import { getCsrfToken } from "next-auth/react";
import { useCallback, useEffect } from "react";

export function useWarpcastSignIn({
  onError,
  onSuccess,
  onClick,
}: {
  onSuccess?: () => Promise<void>;
  onError?: (error: any) => void;
  onClick?: () => void;
}) {
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      log.error("Unable to generate nonce");
    }
    return nonce;
  }, []);

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      const signInResponse = await signInAuth("credentials", {
        message: res.message,
        signature: res.signature,
        username: res.username,
        name: res.displayName,
        bio: res.bio,
        pfp: res.pfpUrl,
        nonce: res.nonce,
        redirect: false,
      });

      if (!signInResponse || signInResponse.error) {
        // Don't let farcaster sign in in this case
        log.error("Failed to sign in with farcaster credentials", {
          error: signInResponse?.error,
        });
        signOutAuth();
        onError?.(signInResponse.error || "Unknown error");
        return;
      }
      onSuccess?.();
    },
    [onError, onSuccess]
  );

  const signInProps = useSignIn({
    onError,
    onSuccess: handleSuccess,
    nonce: getNonce,
  });

  const { signIn, connect, reconnect, isError, channelToken } = signInProps;

  const onSignInClick = useCallback(() => {
    if (isError) {
      reconnect();
    }
    onClick?.();
    signIn();
  }, [isError, reconnect, signIn, onClick]);

  useEffect(() => {
    if (!channelToken) {
      connect();
    }
  }, [channelToken, connect]);

  return { ...signInProps, signIn: onSignInClick };
}
