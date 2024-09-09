"use client";

import WalletIcon from "@mui/icons-material/Wallet";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SiweMessage } from "siwe";
import { getAddress } from "viem/utils";
import type { Connector } from "wagmi";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import log from "loglevel";
import { getCsrfToken, signIn } from "next-auth/react";
import { providerIconMap } from "@/lib/auth/providers";

export function WalletLogin({ type }: { type: "signin" | "signup" }) {
  const text = type === "signin" ? "Sign in" : "Sign up";
  const router = useRouter();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const {
    connectors,
    connectAsync,
    error: connectError,
  } = useConnect({
    mutation: {
      onError(error) {
        log.error("Error connecting wallet", { error });
      },
    },
  });

  const { signMessageAsync, error: signMessageError } = useSignMessage({
    mutation: {
      onError(error) {
        log.error("Error on signing with wallet", { error });
      },
    },
  });

  const handleWalletConnect = async (connector: Connector) => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }

      const accountData = await connectAsync({ connector });
      const accountAddress = accountData.accounts.at(0);
      const chainId = accountData.chainId;

      if (!accountAddress) {
        log.error("No account address found");
        return;
      }

      const nonce = await getCsrfToken();

      const preparedMessage: Partial<SiweMessage> = {
        domain: window.location.host,
        address: getAddress(accountAddress),
        uri: window.location.origin,
        version: "1",
        nonce: nonce,
        chainId: chainId ?? 1,
      };

      const siweMessage = new SiweMessage(preparedMessage);
      const message = siweMessage.prepareMessage();
      const signature = await signMessageAsync({ message });
      return { message, signature };
    } catch (error) {
      // handle error outside
    }
  };

  const handleWalletLogin = async (connector: Connector) => {
    const data = await handleWalletConnect(connector);
    if (!data) {
      return;
    }

    const { message, signature } = data;

    await signIn("wallet", {
      message,
      signature,
      redirect: true,
      redirectTo: "/dashboard",
    });
  };

  const errorWalletMessage = signMessageError?.message || connectError?.message;

  return (
    <>
      <Stack gap={2}>
        {connectors
          .filter((connector, _i, arr) =>
            arr.length > 1 ? connector.id !== "injected" : true
          )
          .map((connector) => (
            <Button
              key={connector.uid}
              size="large"
              variant="outlined"
              color="inherit"
              fullWidth
              sx={{ backgroundColor: "background.default" }}
              onClick={() => handleWalletLogin(connector)}
              startIcon={
                <ConnectorIcon
                  icon={connector.icon}
                  name={connector.name}
                  type={connector.type}
                />
              }
            >
              {text} with {connector.name}
            </Button>
          ))}
      </Stack>
      {errorWalletMessage && (
        <Typography variant="body2">
          {errorWalletMessage ||
            "There was an error while logging in with your wallet"}
        </Typography>
      )}
    </>
  );
}

function ConnectorIcon({
  icon,
  name,
  type,
}: {
  icon?: string;
  name?: string;
  type: string;
}) {
  const providerIcon: string | undefined = providerIconMap[type];

  if (providerIcon || icon) {
    return (
      <Image
        src={providerIcon || icon || ""}
        alt={name || "icon"}
        width={20}
        height={20}
      />
    );
  }

  return <WalletIcon fontSize="small" />;
}
