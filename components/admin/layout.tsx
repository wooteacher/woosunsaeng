import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const role =
    cookieStore.get("staff-role")?.value ?? "super_admin";

  const name =
    cookieStore.get("staff-name")?.value ?? "관리자";

  return (
    <>
      <AdminSidebar
        role={role}
        name={name}
      />

      <main className="md:ml-64">
        {children}
      </main>
    </>
  );
}