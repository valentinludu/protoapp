"use client";

import { signOutAction } from "@/lib/auth/actions/signoutAction";
import { warpcastSignInAction } from "@/lib/auth/actions/warpcastSignInAction";

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

  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    const signInResponse = await warpcastSignInAction(res);

    if (!signInResponse || signInResponse.serverError?.message) {
      // Don't let farcaster sign in in this case
      signOutAction();
      onError?.(signInResponse?.serverError?.message || "Unknown error");
      return;
    }
    onSuccess?.();
  }, []);

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
