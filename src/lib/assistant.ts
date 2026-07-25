import { ASSISTANT_HEADERS, ASSISTANT_URL } from "./supabase";
import type { AssistantResponse } from "./types";
import { getSessionId } from "./utils";

export async function askAssistant(
  query: string,
  lat?: number | null,
  lng?: number | null
): Promise<AssistantResponse> {
  const res = await fetch(ASSISTANT_URL, {
    method: "POST",
    headers: ASSISTANT_HEADERS,
    body: JSON.stringify({
      query,
      lat: lat ?? null,
      lng: lng ?? null,
      session_id: getSessionId(),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Assistant error (${res.status}). ${text}`);
  }
  const data = await res.json();
  if (data?.error) throw new Error(data.error);
  if (!data?.reply) throw new Error("Assistant returned an unexpected response.");
  return data as AssistantResponse;
}
