import { loginAdmin } from "../loginAction";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form
        action={loginAdmin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100"
      >
        <h1 className="text-3xl font-black">우선생 관리자 로그인</h1>
        <p className="mt-2 font-bold text-gray-500">
          관리자 비밀번호를 입력해주세요.
        </p>

        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          className="mt-8 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none focus:border-green-500"
        />

        <button className="mt-4 w-full rounded-2xl bg-green-600 py-4 font-black text-white">
          로그인
        </button>
      </form>
    </main>
  );
}