import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://hdzrsuvjoobmgbhnhsap.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkenJzdXZqb29ibWdiaG5oc2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5Mjg3MjQsImV4cCI6MjEwMDUwNDcyNH0.6NmXSYSoQQpbjC2Dhr9NifZiy0_F60kD0NLLJMXEoMo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ASSISTANT_URL = `${supabaseUrl}/functions/v1/medical-assistant`;
export const ASSISTANT_HEADERS = {
  Authorization: `Bearer ${supabaseAnonKey}`,
  "Content-Type": "application/json",
};

