import prisma from "@/prisma/prisma";

export async function getUser({
  id,
  farcasterId,
  walletAddress,
}: {
  id?: string;
  farcasterId?: string;
  walletAddress?: string;
}) {
  return prisma.user.findFirst({
    where: {
      OR: [{ id }, { farcasterId }, { walletAddress }],
    },
  });
}
