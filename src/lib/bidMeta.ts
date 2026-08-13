import type { BidFlagKind, ProcurementStatus } from "../data/types";

// Display metadata for procurement status + bid red-flags (see §7 framing).
// Full class strings are spelled out so Tailwind's scanner keeps them.
export const PROCUREMENT_META: Record<
  ProcurementStatus,
  { label: string; badge: string; dot: string }
> = {
  awarded: {
    label: "Awarded",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  for_bidding: {
    label: "For bidding",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  withdrawn: {
    label: "Withdrawn from budget",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  not_procured: {
    label: "No single contract",
    badge: "bg-slate-50 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
};

export const BID_FLAG_META: Record<BidFlagKind, { label: string }> = {
  single_bidder: { label: "Single bidder" },
  near_abc: { label: "Bid hugged the budget" },
  related_party: { label: "Related-party bidding" },
  interlocking_officers: { label: "Shared officers" },
  bid_rigging_referral: { label: "Bid-rigging case referred" },
  no_public_bidding: { label: "No open bidding" },
};
