import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/login/LoginPage";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardPage />;
}
