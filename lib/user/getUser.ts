import prisma from "@/prisma/prisma";

export async function getUser({
  id,
  farcasterId,
}: {
  id?: string;
  farcasterId?: string;
}) {
  return prisma.user.findFirst({
    where: {
      OR: [{ id }, { farcasterId }],
    },
  });
}
