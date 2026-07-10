import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CustomerCard from "@/components/admin/customer/CustomerCard";
import ConsultationTimeline from "@/components/admin/ConsultationTimeline";
import {
  updateConsultationDetail,
  addConsultationLog,
  quickUpdateStatus,
  processPayment,
} from "./actions";

const statuses = [
  "신규접수",
  "담당배정",
  "상담중",
  "부재",
  "재통화 예정",
  "고객검토중",
  "보류",
  "취소",
  "상품확정",
  "통신사 접수",
  "설치일 확정",
  "설치완료",
  "지급완료",
  "완료",
];

const carriers = ["", "KT", "LG", "SK", "SKB", "SkyLife", "LG HelloVision"];
const speeds = ["", "100M", "500M", "1G"];

const quickStatuses = [
  { label: "📡 통신사 접수", value: "통신사 접수" },
  { label: "📅 설치일 확정", value: "설치일 확정" },
  { label: "🏠 설치완료", value: "설치완료" },
  { label: "💵 지급완료", value: "지급완료" },
];

export default async function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) redirect("/admin/login");

  const { id } = await params;

  const { data: item } = await supabaseAdmin
    .from("consultations")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const { data: logs } = await supabaseAdmin
    .from("consultation_logs")
    .select("*")
    .eq("consultation_id", id)
    .order("created_at", { ascending: false });

  const { data: staffMembers } = await supabaseAdmin
    .from("staff_members")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: true });

  const assignedStaff = staffMembers?.find(
    (staff: any) => staff.id === item.assigned_to
  );

  const assignedName = assignedStaff?.name ?? "미배정";

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="font-black text-green-600">
          ← 상담목록으로 돌아가기
        </Link>

        <CustomerCard item={item} assignedName={assignedName} />

        <Card className="mt-6 p-6">
          <h2 className="mb-5 text-2xl font-black">빠른 진행</h2>

          <div className="grid gap-3 md:grid-cols-4">
            {quickStatuses.map((status) => (
              <form key={status.value} action={quickUpdateStatus}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="status" value={status.value} />

                <Button type="submit" className="w-full">
                  {status.label}
                </Button>
              </form>
            ))}
          </div>
        </Card>

        <form action={updateConsultationDetail} className="mt-6 space-y-6">
          <input type="hidden" name="id" value={item.id} />

          <Card className="p-6">
            <h2 className="text-2xl font-black text-gray-950">기본 정보</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="font-black">
                담당자
                <select
                  name="assigned_to"
                  defaultValue={item.assigned_to ?? ""}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                >
                  <option value="">미배정</option>
                  {staffMembers?.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} / {staff.role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="font-black">
                진행상태
                <select
                  name="status"
                  defaultValue={item.status ?? "신규접수"}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <label className="font-black">
                통신사
                <select
                  name="carrier"
                  defaultValue={item.carrier ?? ""}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                >
                  {carriers.map((carrier) => (
                    <option key={carrier}>{carrier}</option>
                  ))}
                </select>
              </label>

              <label className="font-black">
                희망 속도
                <select
                  name="desired_speed"
                  defaultValue={item.desired_speed ?? ""}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                >
                  {speeds.map((speed) => (
                    <option key={speed}>{speed}</option>
                  ))}
                </select>
              </label>

              <label className="font-black md:col-span-2">
                희망 TV
                <input
                  name="desired_tv_plan"
                  defaultValue={item.desired_tv_plan ?? ""}
                  placeholder="베이직 TV"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-black text-gray-950">일정 정보</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="font-black">
                재통화 예정
                <input
                  name="callback_at"
                  type="datetime-local"
                  defaultValue={
                    item.callback_at
                      ? new Date(item.callback_at).toISOString().slice(0, 16)
                      : ""
                  }
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

              <label className="font-black">
                설치일
                <input
                  name="install_date"
                  type="date"
                  defaultValue={item.install_date ?? ""}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-black text-gray-950">지급 정보</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="font-black">
                지급상태
                <select
                  name="payment_status"
                  defaultValue={item.payment_status ?? "미지급"}
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                >
                  <option>미지급</option>
                  <option>지급예정</option>
                  <option>지급완료</option>
                </select>
              </label>

              <label className="font-black">
                지급액
                <input
                  name="payout_amount"
                  type="number"
                  defaultValue={item.payout_amount ?? 0}
                  placeholder="450000"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

              <label className="font-black">
                지급은행
                <input
                  name="payout_bank"
                  defaultValue={item.payout_bank ?? ""}
                  placeholder="국민은행"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

              <label className="font-black">
                지급계좌
                <input
                  name="payout_account"
                  defaultValue={item.payout_account ?? ""}
                  placeholder="123456-00-000000"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

              <label className="font-black">
                예금주
                <input
                  name="payout_holder"
                  defaultValue={item.payout_holder ?? ""}
                  placeholder="홍길동"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

              <label className="font-black md:col-span-2">
                지급메모
                <input
                  name="payout_memo"
                  defaultValue={item.payout_memo ?? ""}
                  placeholder="지급 관련 메모"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>
            </div>
          </Card>

          <Button type="submit" className="w-full">
            기본 정보 저장
          </Button>
        </form>

        <form action={processPayment} className="mt-4">
          <input type="hidden" name="id" value={item.id} />

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            💰 지급 완료 처리
          </Button>
        </form>

        <Card className="mt-6 p-6">
          <h2 className="text-2xl font-black text-gray-950">상담 이력</h2>

          <form action={addConsultationLog} className="mt-5 space-y-4">
            <input type="hidden" name="id" value={item.id} />

            <textarea
              name="content"
              placeholder="새 상담 내용을 입력하세요."
              rows={4}
              className="w-full rounded-2xl border p-4 font-bold"
            />

            <Button type="submit" className="w-full">
              상담 이력 추가
            </Button>
          </form>

          <div className="mt-8">
  <ConsultationTimeline logs={logs ?? []} />
</div>
        </Card>
      </div>
    </main>
  );
}