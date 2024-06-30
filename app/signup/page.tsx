import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { RegisterPage } from "@/components/login/RegisterPage";

export default async function Register() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <RegisterPage />;
}
