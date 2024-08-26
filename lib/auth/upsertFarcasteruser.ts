import prisma from "@/prisma/prisma";

export async function upsertFarcasterUser({
  farcasterId,
  ...user
}: {
  farcasterId: string;
  name?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
}) {
  return prisma.user.upsert({
    where: {
      farcasterId,
    },
    update: {
      ...user,
    },
    create: {
      farcasterId,
      ...user,
    },
  });
}
