import { createClient } from "@/lib/supabase/server";

const INTERNAL_DOMAIN = "crm.wooteacher.local";

export function toInternalEmail(loginId: string) {
  return `${loginId}@${INTERNAL_DOMAIN}`;
}

export async function signIn(loginId: string, password: string) {
  const supabase = await createClient();

  return await supabase.auth.signInWithPassword({
    email: toInternalEmail(loginId),
    password,
  });
}

export async function signOut() {
  const supabase = await createClient();
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}