import prisma from "@/prisma/prisma";
import { User } from "@prisma/client";

export async function upsertWalletUser(
  payload: Partial<User> & { walletAddress: string }
) {
  return prisma.user.upsert({
    where: {
      walletAddress: payload.walletAddress,
    },
    update: payload,
    create: payload,
  });
}
