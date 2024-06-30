import NextAuth, { type DefaultSession } from "next-auth";
import Coinbase from "next-auth/providers/coinbase";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import Mastodon from "next-auth/providers/mastodon";
import Slack from "next-auth/providers/slack";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/prisma";
import log from "loglevel";
import type { Provider } from "next-auth/providers";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Is user onboarded. */
      onboarded?: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

const providerIconMap: Record<string, string> = {
  coinbase: "https://authjs.dev/img/providers/coinbase.svg",
  discord: "https://authjs.dev/img/providers/discord.svg",
  google: "https://authjs.dev/img/providers/google.svg",
  mastodon: "https://authjs.dev/img/providers/mastodon.svg",
  slack: "https://authjs.dev/img/providers/slack.svg",
};

const providers: Provider[] = [
  Coinbase,
  Discord,
  Google({
    profile(profile) {
      return { onboarded: profile.onboarded ?? false, ...profile };
    },
  }),
  Slack,
]; // Mastodon throws url type error;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  debug: true,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      return true;
    },
  },
});

export const providerMap = providers.map((provider) => {
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
