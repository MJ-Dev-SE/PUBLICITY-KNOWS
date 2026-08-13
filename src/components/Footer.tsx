import { formatDate } from "../lib/format";
import { DATA_AS_OF } from "../data";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl space-y-2 px-6 py-6 text-xs text-slate-500">
        <p>
          Budget Watch PH is a civic-education demo built from public reporting.
          It is not an official record, legal advice, or a finding of guilt
          against anyone named. People are listed with their public role and
          official status only; allegations are framed as such and cases are
          ongoing.
        </p>
        <p>Data as of {formatDate(DATA_AS_OF)}. Figures are rounded.</p>
      </div>
    </footer>
  );
}
