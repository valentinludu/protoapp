import Coinbase from "next-auth/providers/coinbase";
import CredentialsProvider from "next-auth/providers/credentials";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Mastodon from "next-auth/providers/mastodon";
import Slack from "next-auth/providers/slack";
import type { Provider } from "next-auth/providers";

import { upsertFarcasterUser } from "./upsertFarcasteruser";
import { farcasterAppClient } from "./farcasterClient";

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
    name: "Farcaster",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
      // In a production app with a server, these should be fetched from
      // your Farcaster data indexer rather than have them accepted as part
      // of credentials.
      username: {
        label: "Username",
        type: "text",
        placeholder: "0x0",
      },
      displayName: {
        label: "Name",
        type: "text",
        placeholder: "0x0",
      },
      bio: {
        label: "Bio",
        type: "text",
        placeholder: "0x0",
      },
      pfp: {
        label: "Pfp",
        type: "text",
        placeholder: "0x0",
      },
      nonce: {
        label: "Nonce",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      const farcasterDomain = process.env.DOMAIN;

      const verifyResponse = await farcasterAppClient.verifySignInMessage({
        message: credentials?.message as string,
        signature: credentials?.signature as `0x${string}`,
        domain: farcasterDomain!,
        nonce: (credentials?.nonce as string) ?? "",
      });

      const { success, fid } = verifyResponse;

      if (!success) {
        return null;
      }

      // Create or update the user in our database
      const { id, email, farcasterId } = await upsertFarcasterUser({
        farcasterId: fid.toString(),
        name: credentials?.displayName as string | undefined,
        username: credentials?.username as string | undefined,
        imageUrl: credentials?.pfp as string | undefined,
        bio: credentials?.bio as string | undefined,
      });

      return {
        id,
        email,
        farcasterId,
        name: credentials?.displayName as string | undefined,
        image: credentials?.pfp as string | undefined,
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
  .filter((p) => p.options?.name !== "Farcaster")
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
