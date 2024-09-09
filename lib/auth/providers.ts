import CredentialsProvider from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Mastodon from "next-auth/providers/mastodon";
import Slack from "next-auth/providers/slack";
import type { Provider } from "next-auth/providers";
import { isHex } from "viem/utils";

import { getUser } from "../user/getUser";
import { upsertFarcasterUser } from "../user/upsertFarcasteruser";
import { upsertWalletUser } from "../user/upsertWalletUser";
import { farcasterAppClient } from "./farcasterClient";
import { warpcastSchema } from "./warpcast/warpcastSignInSchema";
import { walletSchema } from "./wallet/walletSignInSchema";
import { verifyWalletSignature } from "./wallet/verifyWalletSignature";
import { getENSDetails } from "../blockchain/ens/getEnsDetails";

export const providers: Provider[] = [
  Discord,
  Google({
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        emailVerified: profile.email_verified ? new Date() : null,
        onboarded: false,
      };
    },
  }),
  Slack,
  CredentialsProvider({
    id: "farcaster",
    name: "Farcaster",
    credentials: {
      state: {
        label: "State",
        type: "text",
      },
      url: {
        label: "Url",
        type: "text",
      },
      message: {
        label: "Message",
        type: "text",
      },
      signature: {
        label: "Signature",
        type: "text",
      },
      fid: {
        label: "FarcasterId",
        type: "text",
      },
      username: {
        label: "Username",
        type: "text",
      },
      displayName: {
        label: "DisplayName",
        type: "text",
      },
      bio: {
        label: "Bio",
        type: "text",
      },
      pfpUrl: {
        label: "PfpUrl",
        type: "text",
      },
      custody: {
        label: "Custody",
        type: "text",
      },
      nonce: {
        label: "Nonce",
        type: "text",
      },
      verifications: {
        label: "Verifications",
        type: "array",
      },
      signatureParams: {
        label: "SignatureParams",
        type: "object",
      },
      metadata: {
        label: "Metadata",
        type: "json",
      },
    },
    async authorize(_credentials) {
      const domain = process.env.DOMAIN;

      if (!domain) {
        return null;
      }

      const credentials = await warpcastSchema.parseAsync(_credentials);

      const signature = isHex(credentials.signature)
        ? credentials.signature
        : null;

      if (!signature) {
        return null;
      }

      const verifyResponse = await farcasterAppClient.verifySignInMessage({
        message: credentials.message,
        signature: signature,
        domain: domain,
        nonce: credentials.nonce,
      });

      const { success, fid } = verifyResponse;

      if (!success) {
        return null;
      }
      const user = await getUser({ farcasterId: fid.toString() });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          farcasterId: user.farcasterId,
          name: user.name,
          image: user.image,
        };
      }

      const name = credentials.username || credentials.displayName;
      const image = credentials?.pfpUrl;
      const farcasterId = fid.toString();

      const { id, email } = await upsertFarcasterUser({
        farcasterId: fid.toString(),
        name: name,
        image: image,
      });

      return {
        id,
        email,
        farcasterId,
        name: name,
        image: image,
      };
    },
  }),
  CredentialsProvider({
    id: "wallet",
    name: "Wallet",
    credentials: {
      message: {
        label: "Message",
        type: "text",
      },
      signature: {
        label: "Signature",
        type: "text",
      },
    },
    async authorize(_credentials, req) {
      const domain = process.env.DOMAIN;

      if (!domain) {
        return null;
      }

      const credentials = await walletSchema.parseAsync(_credentials);

      const signature = isHex(credentials.signature)
        ? credentials.signature
        : null;

      if (!signature) {
        return null;
      }

      const verifyResponse = await verifyWalletSignature({
        message: credentials.message,
        signature: signature,
        csrfToken: credentials.csrfToken,
      });

      if (!verifyResponse) {
        return null;
      }

      const address = verifyResponse.address.toLowerCase();
      const user = await getUser({ walletAddress: address });

      if (user) {
        return {
          id: user.id,
          email: user.email,
          farcasterId: user.farcasterId,
          walletAddress: address,
          name: user.name,
          image: user.image,
        };
      }

      const profile = await getENSDetails(address);
      const name = profile?.ens;
      const image = profile?.avatar;

      const { id, email } = await upsertWalletUser({
        walletAddress: address,
        name: name,
        image: image,
      });

      return {
        id,
        email,
        name,
        image,
        walletAddress: address,
      };
    },
  }),
];

export const providerIconMap: Record<string, string> = {
  apple: "https://authjs.dev/img/providers/apple.svg",
  discord: "https://authjs.dev/img/providers/discord.svg",
  google: "https://authjs.dev/img/providers/google.svg",
  mastodon: "https://authjs.dev/img/providers/mastodon.svg",
  slack: "https://authjs.dev/img/providers/slack.svg",
  metaMask: "/images/logos/metamask-icon.png",
  coinbaseWallet: "/images/logos/coinbase-wallet-icon.svg",
};

export const providerMap = providers
  .filter((p) => p.options?.id !== "farcaster" && p.options?.id !== "wallet")
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return {
        id: providerData.id,
        name: providerData.name,
        image: providerIconMap[providerData.id],
      };
    } else {
      return {
        id: provider.id,
        name: provider.name,
        image: providerIconMap[provider.id],
      };
    }
  });
