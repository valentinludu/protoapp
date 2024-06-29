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
      /** The user's postal address. */
      onboarded: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

const providers: Provider[] = [Coinbase, Discord, Google, Slack]; // Mastodon throws url type error;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      return true;
    },
    // session({ session, user }) {
    //   log.info(`User ${user.id} has logged in.`);

    //   return session;
    // },
  },
});

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});
