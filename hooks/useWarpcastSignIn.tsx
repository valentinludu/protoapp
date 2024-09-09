import { signIn as signInWithCredentials, signOut } from "next-auth/react";
import type { StatusAPIResponse } from "@farcaster/auth-kit";
import { useSignIn } from "@farcaster/auth-kit";
import log from "loglevel";
import { getCsrfToken } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useWarpcastSignIn({
  onError,
  onSuccess,
  onClick,
}: {
  onSuccess?: () => Promise<void>;
  onError?: (error: any) => Promise<void>;
  onClick?: () => void;
}) {
  const router = useRouter();
  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) {
      log.error("Unable to generate nonce");
    }
    return nonce;
  }, []);

  const logOut = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router]);

  const handleSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      await signInWithCredentials("farcaster", {
        ...res,
        redirect: true,
        redirectTo: "/dashboard",
      });
    },
    [logOut]
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
