import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  updateConsultationDetail,
  addConsultationLog,
  quickUpdateStatus,
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

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin" className="font-black text-green-600">
          ← 상담목록으로 돌아가기
        </Link>

        <Card className="mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-950">{item.name}</h1>

              <a
                href={`tel:${item.phone}`}
                className="mt-2 block text-2xl font-black text-green-600"
              >
                📞 {item.phone}
              </a>

              <p className="mt-2 font-bold text-gray-500">
                접수일: {new Date(item.created_at).toLocaleString("ko-KR")}
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 font-black text-green-700">
              {item.status ?? "신규접수"}
            </span>
          </div>
        </Card>

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

        <Card className="mt-6 p-6">
          <form action={updateConsultationDetail} className="space-y-5">
            <input type="hidden" name="id" value={item.id} />

            <div className="grid gap-4 md:grid-cols-2">
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

              <label className="font-black">
                희망 TV
                <input
                  name="desired_tv_plan"
                  defaultValue={item.desired_tv_plan ?? ""}
                  placeholder="베이직 TV"
                  className="mt-2 w-full rounded-2xl border p-4 font-bold"
                />
              </label>

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
            </div>

            <Button type="submit" className="w-full">
              기본 정보 저장
            </Button>
          </form>
        </Card>

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

          <div className="mt-8 space-y-4">
            {logs?.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100"
              >
                <p className="font-black text-gray-950">{log.content}</p>
                <p className="mt-3 text-sm font-bold text-gray-500">
                  {log.created_by ?? "관리자"} ·{" "}
                  {new Date(log.created_at).toLocaleString("ko-KR")}
                </p>
              </div>
            ))}

            {logs?.length === 0 && (
              <p className="font-bold text-gray-500">
                아직 상담 이력이 없습니다.
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}