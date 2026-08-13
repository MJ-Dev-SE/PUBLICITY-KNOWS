// Budget Watch PH — core data model (see CLAUDE.md §5).
// No backend in v1: data lives in typed seed files in this folder.
// Keep this layer free of React so a real API/DB can replace it later.

export type ProjectStatus =
  | "completed"
  | "in_progress"
  | "planning"
  | "overdue"
  | "no_progress"
  | "ghost";

export interface Source {
  outlet: string; // e.g. "GMA News", "Philstar", "Rappler", "Inquirer"
  url: string; // direct article URL
  date?: string; // ISO, when reported
}

// How precisely a map pin represents the real project (see §7 honesty).
export type PinPrecision =
  | "exact" // pinned on the actual structure
  | "approximate" // near the site, at town/barangay level
  | "sample" // one real reported site of a nationwide program
  | "office"; // the implementing agency's office — NOT a project site

export interface Coords {
  lat: number;
  lng: number;
  precision?: PinPrecision; // defaults to "approximate" when omitted
  note?: string; // e.g. "Representative site; program is nationwide"
}

// Photos / video for a project. We never copy copyrighted media — we either
// link to the source or embed an official YouTube video (embed is permitted).
export type MediaKind =
  | "video" // embeddable (YouTube) clip
  | "coverage"; // link out to an article / report (may contain photos)

export interface MediaItem {
  kind: MediaKind;
  title: string;
  url: string; // source URL, or YouTube watch URL
  outlet?: string; // e.g. "ANC", "Rappler"
  youtubeId?: string; // set for kind "video" to embed
}

// Procurement / bidding transparency (see §7 framing: documented facts only).
export type ProcurementStatus =
  | "awarded" // a contract was awarded
  | "for_bidding" // open / upcoming procurement
  | "withdrawn" // removed from the budget before award
  | "not_procured"; // no discrete procurement (program-level)

export type BidFlagKind =
  | "single_bidder" // one bidder / no real competition
  | "near_abc" // winning bid hugs the Approved Budget (little savings)
  | "related_party" // related firms bidding the same project
  | "interlocking_officers" // bidders share officers/directors
  | "bid_rigging_referral" // referred to PCC / charged for bid-rigging
  | "no_public_bidding"; // awarded without open competitive bidding

export interface BidFlag {
  kind: BidFlagKind;
  note: string; // factual, sourced description
}

export interface Bidding {
  status: ProcurementStatus;
  abc?: number; // Approved Budget for the Contract (PHP)
  contractAmount?: number; // awarded amount (PHP)
  winnerId?: string; // contractor Entity id, if awarded
  bidders?: number; // number of bidders, if disclosed
  method?: string; // e.g. "Public bidding (DPWH)"
  philgeps?: string; // PhilGEPS reference or URL
  flags: BidFlag[]; // documented procurement concerns
  note?: string; // short factual context
}

export interface Project {
  id: string;
  name: string;
  location: string;
  // Optional map pin. Carries a precision so the UI can be honest about what
  // the pin actually represents (exact site vs. agency office, etc.).
  coords?: Coords;
  category:
    | "Flood Control"
    | "Education"
    | "Health"
    | "Transport"
    | "Agriculture"
    | "Other";
  allocated: number; // PHP
  spent: number; // PHP
  proposedStart: string; // ISO
  proposedEnd: string; // ISO
  actualStart: string | null; // ISO, null if not started
  progress: number; // 0–100
  ghost?: boolean; // confirmed non-existent by auditors
  misreported?: boolean; // reported complete but evidence says otherwise
  note?: string; // short factual note
  bidding?: Bidding; // procurement / bidding transparency (optional)
  media?: MediaItem[]; // photos / video for richer context (optional)
  peopleIds: string[]; // links to Entity.id
  sources: Source[];
}

export type EntityKind =
  | "contractor"
  | "agency_official"
  | "lawmaker"
  | "oversight";

export type AccountabilityStatus =
  | "blacklisted" // official: perpetually disqualified
  | "charged" // official: criminal/graft complaint filed
  | "dismissed" // official: removed from post
  | "subpoenaed" // official: summoned in a probe
  | "under_investigation" // named/flagged, probe ongoing
  | "leading_cleanup" // running the investigation / oversight
  | "no_adverse_findings"; // nothing reported against them (neutral, NOT an endorsement)

// Public-record vetting signal for a contractor — a transparency indicator
// derived ONLY from documented public record (PCAB rating, COA findings, court
// status, news reporting). It is NOT a verdict and NOT an endorsement; it is a
// "check the record before the bid" signal in the spirit of §7.
export type VettingSignal =
  | "strong" // completed flagship projects, recognized, no adverse findings
  | "mixed" // legitimate credentials but documented delays / scrutiny
  | "adverse"; // blacklisted, charged, or confirmed ghost/substandard findings

export type ProjectOutcome =
  | "success"
  | "ongoing"
  | "delayed"
  | "flagged"
  | "ghost";

export interface ContractorTrack {
  accreditation?: string; // e.g. "PCAB Quadruple-A (AAAA)"
  experience?: string; // e.g. "90+ years", "since 2009"
  govProjects?: number; // known government projects awarded
  govValue?: number; // PHP value of those awards
  vetting: VettingSignal;
  vettingNote: string; // one-line factual basis for the signal
  notable: { name: string; outcome: ProjectOutcome; note?: string }[];
}

export interface Entity {
  id: string;
  name: string;
  role: string; // public role only, e.g. "GM, Wawao Builders"
  kind: EntityKind;
  status: AccountabilityStatus;
  summary: string; // one line, factual, framed as allegation where unproven
  // Contractor-only: documented public-record track record (see §7 framing).
  track?: ContractorTrack;
  projectIds: string[];
  sources: Source[];
}
