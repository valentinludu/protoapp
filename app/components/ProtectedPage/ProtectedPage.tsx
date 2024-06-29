import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return children;
}
