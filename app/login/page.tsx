import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { LoginPage } from "@/components/login/LoginPage";

export default async function Login() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LoginPage />;
}
