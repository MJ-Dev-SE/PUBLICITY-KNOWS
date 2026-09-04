/**
 * Server-side Groq proxy.
 *
 * WHY THIS EXISTS: the browser used to call api.groq.com directly with
 * `import.meta.env.VITE_GROQ_API_KEY`. Vite inlines every `VITE_*` variable
 * into the client bundle at build time, so that key would have shipped in
 * plain text to every visitor — readable in the JS bundle and in the Network
 * tab. The key now lives only here, as `GROQ_API_KEY` (no VITE_ prefix, so it
 * is never exposed to the client), and the browser talks to this endpoint.
 *
 *   GET  /api/analyze  -> { enabled }  is AI configured? (no secrets leak)
 *   POST /api/analyze  -> { text }     run an analysis or a chat turn
 *
 * The server also OWNS THE SYSTEM PROMPT. The client sends only a mode, a
 * project id and the conversation — never a prompt. If callers could supply
 * their own system prompt, this endpoint would be a free general-purpose LLM
 * running on someone else's quota.
 */
import {
  buildProjectContext,
  buildSingleProjectContext,
  CHAT_SYSTEM_PROMPT,
  ANALYSIS_SYSTEM_PROMPT,
  languageDirective,
  type ReplyLang,
} from "../src/lib/buildContext";

const MODEL = "llama-3.3-70b-versatile";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Request caps. These bound both cost and abuse: a caller cannot send a huge
// history to run up tokens, or a novel-length question.
const MAX_HISTORY = 12;
const MAX_TEXT_LEN = 2000;

// Best-effort rate limit. NOTE: this Map lives in one warm serverless
// instance, so it is not a hard global guarantee — Vercel may run several
// instances, and a cold start resets the counter. It stops casual hammering,
// which is what it is for. If this ever gets real traffic, move the counter to
// a shared store (Vercel KV / Upstash) so the limit holds across instances.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound across a long-lived instance.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientIp(headers: Record<string, string | string[] | undefined>) {
  const forwarded = headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return raw?.split(",")[0]?.trim() || "unknown";
}

function isKeyConfigured(): boolean {
  const key = process.env.GROQ_API_KEY;
  return Boolean(key && key.startsWith("gsk_"));
}

type Turn = { role: "user" | "model"; text: string };

type Body = {
  mode?: unknown;
  projectId?: unknown;
  messages?: unknown;
  lang?: unknown;
};

/** Validates and narrows the request body; returns an error string instead of throwing. */
function readBody(body: Body) {
  const mode = body.mode;
  if (mode !== "analysis" && mode !== "chat") {
    return { error: "Unknown request." } as const;
  }

  if (mode === "analysis" && typeof body.projectId !== "string") {
    return { error: "Unknown request." } as const;
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  if (raw.length > MAX_HISTORY) {
    return { error: "That conversation is too long to continue." } as const;
  }

  const messages: Turn[] = [];
  for (const item of raw) {
    const turn = item as Partial<Turn>;
    if (
      (turn.role !== "user" && turn.role !== "model") ||
      typeof turn.text !== "string" ||
      turn.text.length > MAX_TEXT_LEN
    ) {
      return { error: "That message could not be read." } as const;
    }
    messages.push({ role: turn.role, text: turn.text });
  }

  if (mode === "chat" && messages.length === 0) {
    return { error: "Ask a question to get started." } as const;
  }

  const lang: ReplyLang =
    body.lang === "en" || body.lang === "fil" ? body.lang : "auto";

  return {
    mode,
    projectId: typeof body.projectId === "string" ? body.projectId : "",
    messages,
    lang,
  } as const;
}

// Minimal structural types for the Vercel Node signature, so the project does
// not need to take on @vercel/node as a dependency just for two annotations.
type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: Body;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Never let a proxy or browser cache an answer keyed only by URL.
  res.setHeader("Cache-Control", "no-store");

  // The client uses this to decide whether to render the AI UI at all. It
  // reports only whether a key exists, never any part of the key itself.
  if (req.method === "GET") {
    res.status(200).json({ enabled: isKeyConfigured() });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!isKeyConfigured()) {
    res.status(503).json({ error: "AI analysis is unavailable right now." });
    return;
  }

  if (rateLimited(clientIp(req.headers))) {
    res
      .status(429)
      .json({ error: "Too many requests just now — try again in a few minutes." });
    return;
  }

  const parsed = readBody(req.body ?? {});
  if ("error" in parsed) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  // Prompts are built here, from the same seed data the app renders, so a
  // caller cannot substitute their own instructions.
  let systemPrompt: string;
  let userMessage: string;
  let history: Turn[] = [];

  if (parsed.mode === "analysis") {
    const context = buildSingleProjectContext(parsed.projectId);
    if (!context) {
      res.status(404).json({ error: "That project could not be found." });
      return;
    }
    systemPrompt = `${ANALYSIS_SYSTEM_PROMPT}\n\n${context}`;
    userMessage =
      "Analyze this project. Cover: timeline issues, budget utilization, red flags, and people involved with their accountability status. End with a one-sentence civic takeaway.";
  } else {
    systemPrompt =
      CHAT_SYSTEM_PROMPT(buildProjectContext()) + languageDirective(parsed.lang);
    history = parsed.messages.slice(0, -1);
    userMessage = parsed.messages[parsed.messages.length - 1].text;
  }

  const groqMessages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.text,
    })),
    { role: "user", content: userMessage },
  ];

  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: groqMessages,
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!upstream.ok) {
      // Upstream errors can name the model, quota or key — log them for the
      // operator, but send the visitor something plain.
      const detail = await upstream.text().catch(() => "");
      console.error("Groq error", upstream.status, detail.slice(0, 500));
      res.status(502).json({ error: "AI analysis is unavailable right now." });
      return;
    }

    const data = (await upstream.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      res.status(502).json({ error: "AI analysis returned nothing." });
      return;
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error("Groq request failed", error);
    res.status(502).json({ error: "AI analysis is unavailable right now." });
  }
}
