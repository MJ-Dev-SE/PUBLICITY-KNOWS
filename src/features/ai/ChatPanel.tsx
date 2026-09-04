import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, AlertCircle, Sparkles } from "lucide-react";
import { askChat, type ChatMessage as LLMMessage } from "../../lib/ai";
import { useAiEnabled } from "../../lib/useAiEnabled";
import type { ReplyLang } from "../../lib/buildContext";

interface Message {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "Which projects are ghost projects?",
  "Who has been charged in connection with flood control?",
  "How much has been spent vs. allocated?",
  "What are the most flagged projects?",
];

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState<ReplyLang>("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiEnabled = useAiEnabled();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError("");
    const userMsg: Message = { role: "user", text: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // The whole turn goes to the server, which owns the system prompt and
      // reads the last message as the question.
      const history: LLMMessage[] = next.map((m) => ({
        role: m.role,
        text: m.text,
      }));
      const reply = await askChat(history, lang);
      setMessages([...next, { role: "model", text: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setMessages(next); // keep the user message
    } finally {
      setLoading(false);
    }
  }

  // No key on the server: no chat button, no panel. Offering the chat and then
  // explaining inside it that AI is not enabled is worse than not offering it —
  // the visitor cannot do anything about a missing key. (Early return sits
  // below every hook so the hook order stays constant.)
  if (!aiEnabled) return null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI chat" : "Ask AI about the budget"}
        className="fixed bottom-6 right-6 z-[2000] flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-colors"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-22 right-6 z-[1999] flex w-80 flex-col rounded-xl border border-slate-200 bg-white shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center gap-2 rounded-t-xl border-b border-slate-100 bg-violet-50 px-4 py-3">
            <Sparkles size={16} className="text-violet-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                Budget Watch AI
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Powered by AI · Civic Education only
              </p>
            </div>
            <div
              role="group"
              aria-label="Reply language"
              className="flex shrink-0 overflow-hidden rounded-md border border-violet-200 text-[11px]"
            >
              {(
                [
                  ["auto", "Auto"],
                  ["en", "EN"],
                  ["fil", "FIL"],
                ] as [ReplyLang, string][]
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={
                    "px-1.5 py-0.5 transition-colors focus-visible:outline-none " +
                    (lang === code
                      ? "bg-violet-600 text-white"
                      : "bg-white text-violet-700 hover:bg-violet-50")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 max-h-80">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">Try asking:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-md border border-slate-200 px-3 py-1.5 text-left text-xs text-slate-600 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-1.5 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                <AlertCircle size={12} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about the budget…"
                disabled={loading}
                className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Send size={13} />
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">
              Not legal advice · answers based on public data only
            </p>
          </div>
        </div>
      )}
    </>
  );
}
