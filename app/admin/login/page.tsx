import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-gray-100">
        <div className="text-center">
          <p className="font-black text-green-600">WooTeacher Platform</p>
          <h1 className="mt-3 text-4xl font-black text-gray-950">
            우선생 CRM
          </h1>
          <p className="mt-3 font-bold text-gray-500">
            직원 아이디와 비밀번호로 로그인하세요.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center font-bold text-red-600">
            {error === "empty" && "아이디와 비밀번호를 입력해주세요."}
            {error === "invalid" && "아이디 또는 비밀번호가 올바르지 않습니다."}
            {error === "staff" && "활성화된 직원 계정이 아닙니다."}
          </div>
        )}

        <form action={login} className="mt-8 space-y-4">
          <input
            name="login_id"
            placeholder="아이디 예: admin"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
          />

          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-600 px-6 py-5 text-lg font-black text-white transition hover:bg-green-700"
          >
            로그인
          </button>
        </form>
      </div>
    </main>
  );
}