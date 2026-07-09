import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { createStaff, unassignStaffCustomers } from "./actions";

export default async function StaffPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const { data: staff } = await supabaseAdmin
    .from("staff_members")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-gray-950">직원관리</h1>

        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-black">직원 추가</h2>

          <form action={createStaff} className="mt-5 grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="이름 예: 김대리" className="rounded-2xl border p-4 font-bold" />
            <input name="login_id" placeholder="아이디 예: kim01" className="rounded-2xl border p-4 font-bold" />
            <input name="password" type="password" placeholder="비밀번호" className="rounded-2xl border p-4 font-bold" />
            <input name="phone" placeholder="연락처" className="rounded-2xl border p-4 font-bold" />

            <select name="role" className="rounded-2xl border p-4 font-bold">
              <option value="super_admin">대표</option>
              <option value="manager">팀장</option>
              <option value="staff">상담원</option>
            </select>

            <Button type="submit">직원 추가</Button>
          </form>
        </Card>

        <Card className="mt-8 overflow-hidden p-0">
          <div className="grid grid-cols-6 bg-gray-100 p-4 text-sm font-black text-gray-600">
            <p>이름</p>
            <p>아이디</p>
            <p>권한</p>
            <p>연락처</p>
            <p>상태</p>
            <p>관리</p>
          </div>

          {staff?.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-6 items-center border-t p-4 text-sm font-bold"
            >
              <p className="font-black text-gray-950">{item.name}</p>
              <p>{item.login_id ?? "-"}</p>
              <p>{item.role}</p>
              <p>{item.phone || "-"}</p>
              <p>{item.active ? "활성" : "비활성"}</p>

              <form action={unassignStaffCustomers}>
                <input type="hidden" name="staff_id" value={item.id} />
                <Button type="submit">담당 고객 미배정</Button>
              </form>
            </div>
          ))}
        </Card>
      </div>
    </main>
  );
}