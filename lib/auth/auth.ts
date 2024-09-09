import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/prisma";
import { providers } from "./providers";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** Is user onboarded. */
      onboarded?: boolean;
      /** Farcaster Id. */
      farcasterId?: string;
      /** Wallet Address */
      walletAddress?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }
      if (account?.provider === "farcaster") {
        // @ts-ignore farcasterId is added above
        return !!user?.farcasterId;
      }
      if (account?.provider === "wallet") {
        // @ts-ignore walletAddress is added above
        return !!user?.walletAddress;
      }
      return true;
    },
    async jwt({ token, account, user, trigger, session }) {
      if (account) {
        token.id = user?.id;
      }

      if (account?.provider === "farcaster") {
        // @ts-ignore farcasterId is added above
        token.farcasterId = user?.farcasterId;
      }

      if (account?.provider === "wallet") {
        // @ts-ignore walletAddress is added above
        token.walletAddress = user?.walletAddress;
      }

      if (trigger === "update" && session?.email) {
        token.email = session.email;
      }

      return token;
    },
    // session does not exist if strategy is database and adapter is prisma
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
});
