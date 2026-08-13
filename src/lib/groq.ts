const MODEL = "llama-3.3-70b-versatile";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

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

export function isKeyConfigured(): boolean {
  const key = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  return Boolean(key && key.startsWith("gsk_"));
}

export async function askLLM(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const key = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  if (!key || !key.startsWith("gsk_")) {
    throw new LLMError(
      "Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file and restart the dev server.",
    );
  }

  // Groq uses the OpenAI chat format: system + user/assistant turns.
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text,
    })),
    { role: "user", content: userMessage },
  ];

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new LLMError(
      (err as { error?: { message?: string } })?.error?.message ??
        `Groq API error ${res.status}`,
    );
  }

  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (!text) throw new LLMError("Empty response from Groq.");
  return text;
}
