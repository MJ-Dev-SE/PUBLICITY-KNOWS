import {
  buildProjectContext,
  buildSingleProjectContext,
  CHAT_SYSTEM_PROMPT,
  ANALYSIS_SYSTEM_PROMPT,
  languageDirective,
  type ReplyLang,
} from "../src/lib/buildContext";

const MODEL = "openai/gpt-oss-120b";
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const MAX_HISTORY = 12;
const MAX_TEXT_LEN = 2000;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

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
  res.setHeader("Cache-Control", "no-store");

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
      "Analyze this project. Cover: timeline issues, budget utilization, red flags, and people involved with their accountability status. End with a one-sentence civic takeaway. Write everything in plain text - no markdown, no tables, no bullet points, no special characters like em-dashes or bold markers.";
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
