import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";

export async function GET() {
  await signOut();

  const cookieStore = await cookies();

  cookieStore.delete("admin-auth");
  cookieStore.delete("staff-id");
  cookieStore.delete("staff-name");
  cookieStore.delete("staff-role");

  redirect("/admin/login");
}