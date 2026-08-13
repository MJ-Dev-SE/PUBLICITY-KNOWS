import type { ContractorTrack as Track } from "../../data/types";
import { pesoCompact } from "../../lib/format";
import { VETTING_META, OUTCOME_META } from "../../lib/vettingMeta";

export function ContractorTrack({ track }: { track: Track }) {
  const v = VETTING_META[track.vetting];

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-900">
          Contractor track record
        </h4>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${v.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
          {v.label}
        </span>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        {track.vettingNote}
      </p>

      {(track.accreditation ||
        track.experience ||
        track.govProjects != null ||
        track.govValue != null) && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {track.accreditation && (
            <div className="col-span-2">
              <dt className="text-slate-400">Accreditation</dt>
              <dd className="text-slate-700">{track.accreditation}</dd>
            </div>
          )}
          {track.experience && (
            <div>
              <dt className="text-slate-400">Experience</dt>
              <dd className="text-slate-700">{track.experience}</dd>
            </div>
          )}
          {track.govProjects != null && (
            <div>
              <dt className="text-slate-400">Gov't projects</dt>
              <dd className="text-slate-700">
                {track.govProjects.toLocaleString()}
              </dd>
            </div>
          )}
          {track.govValue != null && (
            <div>
              <dt className="text-slate-400">Known value</dt>
              <dd className="text-slate-700">{pesoCompact(track.govValue)}</dd>
            </div>
          )}
        </dl>
      )}

      {track.notable.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-slate-500">
            Notable projects
          </p>
          <ul className="space-y-1.5">
            {track.notable.map((n, i) => {
              const o = OUTCOME_META[n.outcome];
              return (
                <li
                  key={i}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-xs text-slate-800">
                      {n.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${o.chip}`}
                    >
                      {o.label}
                    </span>
                  </div>
                  {n.note && (
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                      {n.note}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="mt-3 text-[10px] leading-snug text-slate-400">
        Compiled from public records (PCAB, COA, court filings, news reporting).
        A transparency signal to check before a bid — not a verdict or an
        endorsement.
      </p>
    </section>
  );
}
