import type { AccountabilityStatus } from "../data/types";
import { ACCOUNTABILITY_META } from "../lib/accountabilityMeta";

export function AccountabilityBadge({
  status,
}: {
  status: AccountabilityStatus;
}) {
  const meta = ACCOUNTABILITY_META[status];
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs " +
        meta.badge
      }
    >
      <span className={"h-1.5 w-1.5 rounded-full " + meta.dot} />
      {meta.label}
    </span>
  );
}
