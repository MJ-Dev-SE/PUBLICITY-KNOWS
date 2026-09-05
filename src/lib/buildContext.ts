import { projects, entities, DATA_AS_OF } from "../data/index.js";
import { formatDate } from "./format.js";
import { statusOf } from "./status.js";

export function buildProjectContext(): string {
  const projectLines = projects
    .map((p) => {
      const status = statusOf(p);
      const flags = [p.ghost && "GHOST PROJECT", p.misreported && "MISREPORTED"]
        .filter(Boolean)
        .join(", ");
      return `Project: ${p.name}
  ID: ${p.id}
  Location: ${p.location}
  Category: ${p.category}
  Status: ${status}${flags ? ` [${flags}]` : ""}
  Allocated: ₱${p.allocated.toLocaleString()}
  Spent: ₱${p.spent.toLocaleString()}
  Progress: ${p.progress}%
  Timeline: ${p.proposedStart} → ${p.proposedEnd}
  Actual start: ${p.actualStart ?? "Not started"}
  ${p.note ? `Note: ${p.note}` : ""}
  People: ${p.peopleIds.join(", ")}`;
    })
    .join("\n\n");

  const entityLines = entities
    .map(
      (e) =>
        `Entity: ${e.name} (${e.id})
  Role: ${e.role}
  Kind: ${e.kind}
  Accountability status: ${e.status}
  Summary: ${e.summary}
  Linked projects: ${e.projectIds.join(", ")}`,
    )
    .join("\n\n");

  return `=== PROJECTS ===\n${projectLines}\n\n=== ENTITIES (people & organizations) ===\n${entityLines}`;
}

export function buildSingleProjectContext(projectId: string): string {
  const p = projects.find((x) => x.id === projectId);
  if (!p) return "";
  const status = statusOf(p);
  const people = entities.filter((e) => p.peopleIds.includes(e.id));

  return `Project: ${p.name}
Location: ${p.location}
Category: ${p.category}
Status: ${status}
Ghost project: ${p.ghost ? "YES" : "no"}
Misreported: ${p.misreported ? "YES" : "no"}
Allocated: ₱${p.allocated.toLocaleString()}
Spent: ₱${p.spent.toLocaleString()}
Progress: ${p.progress}%
Proposed timeline: ${p.proposedStart} → ${p.proposedEnd}
Actual start: ${p.actualStart ?? "Not started"}
Note: ${p.note ?? "None"}

People & organizations involved:
${people.length ? people.map((e) => `- ${e.name} (${e.kind}): status=${e.status} — ${e.summary}`).join("\n") : "None linked"}`;
}

export type ReplyLang = "auto" | "en" | "fil";

// Returns a language directive appended to the system prompt.
export function languageDirective(lang: ReplyLang): string {
  switch (lang) {
    case "en":
      return "\n\nLANGUAGE: Always reply in clear, simple English.";
    case "fil":
      return "\n\nLANGUAGE: Always reply in conversational Filipino/Taglish (the natural mix of Filipino and English that Filipinos use). Keep proper nouns, agency names, and technical procurement terms (e.g. ABC, PhilGEPS) as-is.";
    case "auto":
    default:
      return "\n\nLANGUAGE: Reply in the same language the user used — English if they wrote in English, Filipino/Taglish if they wrote in Filipino/Taglish.";
  }
}

export const CHAT_SYSTEM_PROMPT = (context: string) => `You are a civic-education assistant for Budget Watch PH, a public-interest transparency app tracking the Philippine 2026 national budget (₱6.793 trillion, RA 12314).

Answer questions based ONLY on the data below. Keep answers concise and readable.
Write in plain flowing text. No markdown formatting, no tables, no bullet lists, no special characters like em-dashes or bold markers.

GUARDRAILS — follow these strictly:
- This app is a civic-education demo, not a legal record.
- Never say anyone is "guilty" — only refer to their official accountability status (charged, dismissed, etc.) and frame it as such.
- Always distinguish between alleged/filed/charged vs. proven/convicted.
- Do not give legal, financial, or investment advice.
- If a question is outside the provided data, say so clearly.
- Data is as of ${formatDate(DATA_AS_OF)}. Anything that happened after that date is outside the data; say so rather than guessing.

${context}`;

export const ANALYSIS_SYSTEM_PROMPT = `You are analyzing a Philippine government project for Budget Watch PH, a civic-education transparency app.

Provide a concise structured analysis in plain text. Use plain language for a general audience.

FORMAT RULES (strict):
- Write in plain flowing text with short paragraphs. No markdown, no tables, no bullet lists, no headers with # symbols.
- Separate sections with a blank line and a bold section name followed by a colon (e.g. "Timeline issues:").
- Do not use special characters like em-dashes, smart quotes, or other typographic symbols. Use regular dashes, quotes, and commas instead.
- Keep the total response under 300 words.

GUARDRAILS:
- Frame allegations as allegations ("allegedly", "charged with", not "guilty of")
- Accountability statuses are official records, not verdicts
- Do not give legal advice
- Be factual and specific`;
