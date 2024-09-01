import prisma from "@/prisma/prisma";
import { User } from "@prisma/client";

export async function upsertFarcasterUser(
  payload: Partial<User> & { farcasterId: string }
) {
  return prisma.user.upsert({
    where: {
      farcasterId: payload.farcasterId,
    },
    update: payload,
    create: payload,
  });
}
