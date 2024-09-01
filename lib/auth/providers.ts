import Coinbase from "next-auth/providers/coinbase";
import CredentialsProvider from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Mastodon from "next-auth/providers/mastodon";
import Slack from "next-auth/providers/slack";
import type { Provider } from "next-auth/providers";

import { upsertFarcasterUser } from "../user/upsertFarcasteruser";
import { farcasterAppClient } from "./farcasterClient";
import { warpcastSchema } from "./actions/schemas/warpcastSignInSchema";
import { isHex } from "viem";
import { getUser } from "../user/getUser";

export const providers: Provider[] = [
  Coinbase,
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
];

const providerIconMap: Record<string, string> = {
  coinbase: "https://authjs.dev/img/providers/coinbase.svg",
  discord: "https://authjs.dev/img/providers/discord.svg",
  google: "https://authjs.dev/img/providers/google.svg",
  mastodon: "https://authjs.dev/img/providers/mastodon.svg",
  slack: "https://authjs.dev/img/providers/slack.svg",
  farcaster: "https://farcaster.xyz",
};

export const providerMap = providers
  .filter((p) => p.options?.id !== "farcaster")
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
