import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ASSISTANT_URL = `${supabaseUrl}/functions/v1/medical-assistant`;
export const ASSISTANT_HEADERS = {
  Authorization: `Bearer ${supabaseAnonKey}`,
  "Content-Type": "application/json",
};
