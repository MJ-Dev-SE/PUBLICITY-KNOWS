import { Info } from "lucide-react";
import { formatDate } from "../../lib/format";
import { DATA_AS_OF } from "../../data";

// Persistent presumption-of-innocence disclaimer (see CLAUDE.md §7.2, §7.6).
// Must stay visible on the accountability view.
export function Disclaimer() {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Info size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
      <p>
        Being named, charged, subpoenaed, or investigated is not a finding of
        guilt — these cases are ongoing and everyone is presumed innocent. This
        is a civic-education demo built from public reporting, not an official or
        legal record. Statuses reflect what was reported as of{" "}
        {formatDate(DATA_AS_OF)}.
      </p>
    </div>
  );
}
