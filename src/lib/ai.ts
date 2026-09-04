/**
 * Client side of the AI features.
 *
 * This file used to be `groq.ts` and called api.groq.com straight from the
 * browser with a `VITE_GROQ_API_KEY`. Vite inlines `VITE_*` values into the
 * bundle, so that key shipped to every visitor in plain text. The key now
 * lives only on the server; everything here talks to our own `/api/analyze`
 * and never sees a credential.
 *
 * The prompt is built server-side too, so nothing here can influence it.
 */
import type { ReplyLang } from "./buildContext";

const ENDPOINT = "/api/analyze";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export class LLMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMError";
  }
}

/**
 * Whether the server has an AI key configured. Asked once per page load and
 * shared by every caller. Any failure resolves to `false`, which is also what
 * happens under a plain `vite dev` server: there is no `/api` route there, so
 * the request comes back as HTML, JSON parsing fails, and the AI UI simply
 * stays hidden instead of erroring.
 */
let enabledCheck: Promise<boolean> | null = null;

export function fetchAiEnabled(): Promise<boolean> {
  if (!enabledCheck) {
    enabledCheck = fetch(ENDPOINT)
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((data: unknown) => Boolean((data as { enabled?: boolean }).enabled))
      .catch(() => false);
  }
  return enabledCheck;
}

async function post(payload: Record<string, unknown>): Promise<string> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new LLMError("Could not reach the server. Check your connection and try again.");
  }

  const data: unknown = await res.json().catch(() => ({}));

  if (!res.ok) {
    // The server sends visitor-safe wording (including the rate-limit notice),
    // so it can be shown as-is.
    const message = (data as { error?: string }).error;
    throw new LLMError(message ?? "AI analysis is unavailable right now.");
  }

  const text = (data as { text?: string }).text;
  if (!text) throw new LLMError("AI analysis returned nothing.");
  return text;
}

export function askAnalysis(projectId: string): Promise<string> {
  return post({ mode: "analysis", projectId });
}

export function askChat(
  messages: ChatMessage[],
  lang: ReplyLang,
): Promise<string> {
  return post({ mode: "chat", messages, lang });
}
