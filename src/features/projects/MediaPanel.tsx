import { Film, ExternalLink } from "lucide-react";
import type { MediaItem } from "../../data/types";

export function MediaPanel({ media }: { media: MediaItem[] }) {
  const videos = media.filter((m) => m.kind === "video" && m.youtubeId);
  const links = media.filter((m) => m.kind !== "video" || !m.youtubeId);

  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
        <Film size={14} className="text-slate-500" />
        Photos &amp; video
      </h4>

      {videos.map((m) => (
        <figure key={m.youtubeId} className="space-y-1">
          <div className="aspect-video overflow-hidden rounded-md border border-slate-200 bg-slate-100">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}`}
              title={m.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <figcaption className="text-[11px] leading-snug text-slate-500">
            {m.title}
            {m.outlet && <span className="text-slate-400"> · {m.outlet}</span>}
          </figcaption>
        </figure>
      ))}

      {links.length > 0 && (
        <ul className="space-y-1.5">
          {links.map((m) => (
            <li key={m.url}>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-1.5 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink size={12} className="mt-0.5 shrink-0" />
                <span>
                  {m.title}
                  {m.outlet && (
                    <span className="text-slate-400"> · {m.outlet}</span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[10px] leading-snug text-slate-400">
        Videos are embedded from the outlet's official channel; links open the
        original report. Media is not hosted or altered by this app.
      </p>
    </section>
  );
}
