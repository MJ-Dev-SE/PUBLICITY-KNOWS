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
