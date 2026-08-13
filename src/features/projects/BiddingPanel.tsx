import { AlertTriangle, Gavel, ExternalLink } from "lucide-react";
import type { Bidding } from "../../data/types";
import { getEntity } from "../../data";
import { pesoCompact } from "../../lib/format";
import { PROCUREMENT_META, BID_FLAG_META } from "../../lib/bidMeta";
import { VETTING_META } from "../../lib/vettingMeta";
import { useSelection } from "../linking/SelectionContext";

export function BiddingPanel({ bidding }: { bidding: Bidding }) {
  const { openEntity } = useSelection();
  const p = PROCUREMENT_META[bidding.status];
  const winner = bidding.winnerId ? getEntity(bidding.winnerId) : undefined;

  // Bid-to-ABC ratio: how close the winning bid was to the budget ceiling.
  // A ratio at/near 100% means little to no savings for the government.
  const ratio =
    bidding.abc && bidding.contractAmount
      ? Math.round((bidding.contractAmount / bidding.abc) * 100)
      : null;

  return (
    <section className="rounded-md border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
          <Gavel size={14} className="text-slate-500" />
          Bidding &amp; procurement
        </h4>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${p.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
          {p.label}
        </span>
      </div>

      {(bidding.abc != null ||
        bidding.contractAmount != null ||
        bidding.bidders != null ||
        bidding.method) && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {bidding.abc != null && (
            <div>
              <dt className="text-slate-400">Approved budget (ABC)</dt>
              <dd className="text-slate-700">{pesoCompact(bidding.abc)}</dd>
            </div>
          )}
          {bidding.contractAmount != null && (
            <div>
              <dt className="text-slate-400">Contract amount</dt>
              <dd className="text-slate-700">
                {pesoCompact(bidding.contractAmount)}
              </dd>
            </div>
          )}
          {bidding.bidders != null && (
            <div>
              <dt className="text-slate-400">Bidders</dt>
              <dd className="text-slate-700">
                {bidding.bidders}
                {bidding.bidders === 1 && (
                  <span className="ml-1 text-red-600">(single bidder)</span>
                )}
              </dd>
            </div>
          )}
          {bidding.method && (
            <div className="col-span-2">
              <dt className="text-slate-400">Method</dt>
              <dd className="text-slate-700">{bidding.method}</dd>
            </div>
          )}
        </dl>
      )}

      {ratio != null && (
        <p
          className={`mt-2 text-xs ${ratio >= 99 ? "text-red-600" : "text-slate-500"}`}
        >
          Winning bid was <strong>{ratio}%</strong> of the approved budget
          {ratio >= 99 && " — full ceiling, no savings for the government"}.
        </p>
      )}

      {winner && (
        <div className="mt-3">
          <p className="mb-1 text-xs text-slate-400">Winning contractor</p>
          <button
            type="button"
            onClick={() => openEntity(winner.id)}
            className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-left hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="truncate text-xs text-slate-800">
              {winner.name}
            </span>
            {winner.track && (
              <span
                className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${VETTING_META[winner.track.vetting].badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${VETTING_META[winner.track.vetting].dot}`}
                />
                {VETTING_META[winner.track.vetting].label}
              </span>
            )}
          </button>
        </div>
      )}

      {bidding.flags.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertTriangle size={12} />
            Procurement red flags
          </p>
          <ul className="space-y-1.5">
            {bidding.flags.map((f, i) => (
              <li
                key={i}
                className="rounded-md border border-red-100 bg-red-50/60 px-2.5 py-1.5"
              >
                <span className="text-[11px] font-medium text-red-700">
                  {BID_FLAG_META[f.kind].label}
                </span>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                  {f.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {bidding.note && (
        <p className="mt-3 text-[11px] leading-snug text-slate-500">
          {bidding.note}
        </p>
      )}

      {bidding.philgeps && (
        <a
          href={bidding.philgeps}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          PhilGEPS record <ExternalLink size={11} />
        </a>
      )}

      <p className="mt-3 text-[10px] leading-snug text-slate-400">
        ABC = Approved Budget for the Contract. A single bidder, a bid near the
        ABC, or related firms bidding together are signals of weak competition —
        worth checking before an award. Compiled from public records; not a
        verdict.
      </p>
    </section>
  );
}
