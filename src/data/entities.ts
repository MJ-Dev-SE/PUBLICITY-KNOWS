import type { Entity } from "./types.js";

// Accountability entities (see CLAUDE.md §9 seed + §7 responsible framing).
//
// FRAMING RULES (hard — see §7): allegations are never stated as guilt. Statuses
// below are the official/legal status as reported (blacklisted, charged,
// dismissed, subpoenaed, under investigation), not a verdict. Every entity has
// at least one credible source URL. Public role only.
//
// Status note: statuses started from the §9 seed. Four cases were later
// escalated to "charged" to match current sourced reporting (formal charges
// filed at the Ombudsman/Sandiganbayan): Estrada, Bonoan, Revilla, and Co.
// All remain framed as allegations — "charged" is a legal status, not a verdict.
//
// REFRESH — Aug 11, 2026 (previous stamp: Jun 16, 2026):
//   • Added e-romualdez. He is at PRELIMINARY INVESTIGATION at the Ombudsman,
//     not charged in court, so his status is "under_investigation" — do not
//     escalate it to "charged" until a case is actually filed.
//   • Added e-tinio (oversight — asked the Ombudsman to probe Davao City 1st
//     District flood control).
//   • e-revilla, e-hernandez, e-mendoza, e-syms linked to the new p-pandi.
//   • e-alcantara / e-syms: backfilled the state-witness track (Jan–Mar 2026)
//     that the previous stamp had missed.
//   • Rep. Paolo Duterte is named in p-davao1's note as rejecting the
//     allegations, but is deliberately NOT an entity here: no probe has been
//     confirmed opened against him, so there is no accountability status to
//     record. Naming him with one would overstate the public record.

export const entities: Entity[] = [
  // ── Contractors ──────────────────────────────────────────────────────────
  {
    id: "e-wawao",
    name: "Wawao Builders",
    role: "Construction firm; Mark Allan Arevalo listed as a director (SEC)",
    kind: "contractor",
    status: "blacklisted",
    summary:
      "Perpetually disqualified by DPWH over alleged ghost flood control projects in Bulacan (Plaridel, Calumpit, Hagonoy).",
    track: {
      vetting: "adverse",
      vettingNote:
        "Perpetually disqualified (blacklisted) by DPWH; flagged in COA fraud audits over ghost Bulacan flood control projects.",
      notable: [
        {
          name: "Sipat Dike, Plaridel, Bulacan",
          outcome: "ghost",
          note: "Reported 100% complete in 2024; COA found construction only began ~Aug 2025.",
        },
        {
          name: "Other Bulacan flood control projects",
          outcome: "flagged",
          note: "Cited in DPWH blacklisting order.",
        },
      ],
    },
    projectIds: ["p-sipat"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/flood-control-contractor-wawao-builders-syms-perpetually-disqualified-dpwh/",
        date: "2025-09-05",
      },
      {
        outlet: "Manila Times",
        url: "https://www.manilatimes.net/2025/09/05/news/national/dpwh-secretary-dizon-orders-perpetual-ban-of-wawao-builders-syms-construction-for-ghost-projects/2179262",
        date: "2025-09-05",
      },
    ],
  },
  {
    id: "e-syms",
    name: "SYMS Construction Trading",
    role: "Construction firm; principal Sally Santos",
    kind: "contractor",
    status: "blacklisted",
    summary:
      "Perpetually disqualified by DPWH; flagged in COA fraud audits of ghost or mismatched Bulacan flood control projects. Its principal, Sally Santos, was admitted as a state witness on January 15, 2026 and dropped as a respondent from three malversation and graft cases on March 19, 2026.",
    track: {
      vetting: "adverse",
      vettingNote:
        "Perpetually disqualified (blacklisted) by DPWH alongside Wawao Builders; named in COA fraud audits.",
      notable: [
        {
          name: "Bulacan flood control projects",
          outcome: "ghost",
          note: "Part of COA-flagged ghost / mismatched projects referred to the Ombudsman.",
        },
        {
          name: "Pandi, Bulacan flood control (₱92.8M)",
          outcome: "ghost",
          note: "Allegedly paid ₱76.9M for a project prosecutors say was never built.",
        },
      ],
    },
    projectIds: ["p-bulacan4", "p-pandi"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/flood-control-contractor-wawao-builders-syms-perpetually-disqualified-dpwh/",
        date: "2025-09-05",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/965797/coa-finds-p344-m-bulacan-flood-control-projects-as-ghost-mismatched/story/",
        date: "2025-10-02",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/980568/henry-alcantara-sally-santos-dropped-in-malversation-graft-cases/story/",
        date: "2026-03-19",
      },
    ],
  },
  {
    id: "e-sttimothy",
    name: "St. Timothy Construction Corp.",
    role: "Construction firm; principal Sarah Discaya",
    kind: "contractor",
    status: "charged",
    summary:
      "Discaya couple charged with non-bailable graft and malversation over a ₱96.5-M Bulacan flood control project; the Supreme Court dismissed their bid to quash the charges.",
    track: {
      accreditation: "PCAB-accredited (license-renting allegations under probe)",
      govProjects: 421,
      govValue: 31_000_000_000,
      vetting: "adverse",
      vettingNote:
        "Discaya-linked firms secured 421 flood control projects worth ~₱31B; owners charged with graft/malversation and under immigration lookout orders.",
      notable: [
        {
          name: "₱96.5-M Bulacan flood control project",
          outcome: "ghost",
          note: "Basis of the graft and malversation charges.",
        },
        {
          name: "421 flood control projects (~₱31B)",
          outcome: "flagged",
          note: "PCIJ analysis of Discaya-linked awards, 2022–2025.",
        },
      ],
    },
    projectIds: ["p-bulacan4"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/discaya-couple-faces-graft-malversation-charges-bulacan-flood-control-project/",
        date: "2026-06-04",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/04/10/2520012/sc-dismisses-discaya-bid-quash-graft-charges-over-p965-million-flood-control-project",
        date: "2026-04-10",
      },
    ],
  },
  {
    id: "e-im",
    name: "IM Construction Corp.",
    role: "Construction firm; president Robert Imperio",
    kind: "contractor",
    status: "charged",
    summary:
      "Charged at the Ombudsman in graft complaints over riverside flood control projects; also reported to face BIR tax-evasion and PCC bid-rigging cases.",
    track: {
      vetting: "adverse",
      vettingNote:
        "Among the first contractors charged by DPWH/Ombudsman in the flood control mess; also reported to face BIR and bid-rigging cases.",
      notable: [
        {
          name: "Riverside flood control projects",
          outcome: "flagged",
          note: "Subject of the first set of DPWH-filed charges (Sept 2025).",
        },
      ],
    },
    projectIds: ["p-bulacan4"],
    sources: [
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2108052/dpwh-files-first-set-of-charges-in-flood-mess",
        date: "2025-09-12",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1258484",
        date: "2025-09-12",
      },
    ],
  },

  {
    id: "e-alphaomega",
    name: "Alpha & Omega Gen. Contractor & Dev. Corp.",
    role: "Construction firm; Discaya-owned",
    kind: "contractor",
    status: "under_investigation",
    summary:
      "Among the 15 contractors that cornered ~₱100B in flood control projects; per Sarah Discaya's testimony it bid on 491 projects in 2022 and won 71. Allegations are unproven.",
    track: {
      govProjects: 71,
      vetting: "adverse",
      vettingNote:
        "Discaya-linked; named among the top 15 flood control recipients. Bid on 491 projects in 2022, secured 71 — a concentration pattern flagged by investigators.",
      notable: [
        {
          name: "71 of 491 projects bid (2022)",
          outcome: "flagged",
          note: "Bid-concentration figure from owner testimony at the Senate probe.",
        },
      ],
    },
    projectIds: [],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/list-top-contractors-flood-control-projects-marcos-administration/",
        date: "2025-08-11",
      },
      {
        outlet: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Flood_control_projects_scandal_in_the_Philippines",
        date: "2026-06-01",
      },
    ],
  },
  {
    id: "e-sunwest",
    name: "Sunwest, Inc.",
    role: "Construction firm; family-owned, linked in reporting to former Rep. Zaldy Co",
    kind: "contractor",
    status: "under_investigation",
    summary:
      "Top-tier accredited Bicol contractor named among the 15 firms that cornered ~₱100B in flood control; many projects reported behind schedule. No official ghost finding to date. Allegations are unproven.",
    track: {
      accreditation: "PCAB Quadruple-A (AAAA) since 2019; ISO-certified since 2011; BIR Large Taxpayer",
      govProjects: 79,
      govValue: 10_150_000_000,
      vetting: "mixed",
      vettingNote:
        "Legitimate top-tier credentials and at least one completed dike road, but flagged among the top 15 flood control recipients with projects reported only 24–77% complete past deadline. No official ghost finding to date.",
      notable: [
        {
          name: "Baao Lakeshore dike road, Camarines Sur",
          outcome: "success",
          note: "Completed 2024; ₱241M.",
        },
        {
          name: "78 flood control projects (₱10.1B)",
          outcome: "delayed",
          note: "Reported 24–77% complete vs. Nov 2024–Aug 2025 deadlines.",
        },
      ],
    },
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/957676/bicol-top-contractors-flood-control-projects/story/",
        date: "2025-08-20",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/newsbreak/in-depth/leyte-zaldy-co-sunwest-bags-billions-pesos-dpwh-contracts-romualdez-district/",
        date: "2025-09-01",
      },
    ],
  },
  {
    id: "e-megawide",
    name: "Megawide Construction Corp.",
    role: "Publicly listed (PSE) engineering & construction firm",
    kind: "contractor",
    status: "no_adverse_findings",
    summary:
      "Built the award-winning Mactan-Cebu International Airport Terminal 2 (with GMR); no adverse government findings reported. Listed here as a positive track-record reference.",
    track: {
      accreditation: "PSE-listed; PCAB-accredited general contractor",
      vetting: "strong",
      vettingNote:
        "Completed and operating flagship infrastructure recognized with multiple international awards; no adverse government findings reported.",
      notable: [
        {
          name: "Mactan-Cebu International Airport Terminal 2",
          outcome: "success",
          note: "Commercial operations July 2018; won the World Architecture Festival top award for Completed Buildings – Transport.",
        },
      ],
    },
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/regions/718130/dot-lauds-team-behind-award-winning-cebu-mactan-airport-terminal/story/",
        date: "2019-12-09",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/index.php/articles/1088070",
        date: "2019-12-09",
      },
    ],
  },
  {
    id: "e-eei",
    name: "EEI Corporation",
    role: "General engineering contractor (90+ years)",
    kind: "contractor",
    status: "no_adverse_findings",
    summary:
      "One of the country's oldest builders, holding the highest PCAB rating; completed major infrastructure including the NAIA Expressway. Listed here as a positive track-record reference.",
    track: {
      accreditation: "PCAB Quadruple-A (AAAA) General Engineering Contractor",
      experience: "90+ years",
      vetting: "strong",
      vettingNote:
        "Highest PCAB rating with decades of completed landmark infrastructure and no adverse government findings reported.",
      notable: [
        {
          name: "NAIA Expressway",
          outcome: "success",
        },
        {
          name: "MRT Guadalupe Bridge",
          outcome: "success",
        },
        {
          name: "Nabas Wind Farm",
          outcome: "success",
          note: "Site development and turbine foundations.",
        },
        {
          name: "Metro Manila Subway (joint venture)",
          outcome: "ongoing",
          note: "Part of the ongoing railway works.",
        },
      ],
    },
    projectIds: [],
    sources: [
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/business/business-as-usual/2021/11/02/2137580/eei-90-years-building-better-future-next-generation",
        date: "2021-11-02",
      },
      {
        outlet: "EEI Corporation",
        url: "https://www.eei.com.ph/infrastructure",
        date: "2025-03-01",
      },
    ],
  },

  // ── DPWH officials ───────────────────────────────────────────────────────
  {
    id: "e-alcantara",
    name: "Henry Alcantara",
    role: "Former Bulacan 1st district engineer, DPWH",
    kind: "agency_official",
    status: "dismissed",
    summary:
      "Dismissed by DPWH over ghost and substandard flood control projects and had his PRC license revoked; admitted as a state witness on January 15, 2026 — he remitted ₱181M of the ₱316M returned by the four state witnesses — and was dropped as a respondent from three malversation and graft cases on March 19, 2026.",
    projectIds: ["p-sipat", "p-bulacan4"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/dpwh-former-bulacan-district-engineer-henry-alcantara-dismissed/",
        date: "2025-08-29",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/972538/henry-alcantara-flood-control-projects-prc-license/story/",
        date: "2026-01-20",
      },
      {
        outlet: "Manila Times",
        url: "https://www.manilatimes.net/2026/01/17/news/national/4-state-witnesses-in-flood-control-mess/2260145",
        date: "2026-01-17",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2198016/alcantara-dpwh-contractor-dropped-from-3-cases-doj",
        date: "2026-03-19",
      },
    ],
  },
  {
    id: "e-hernandez",
    name: "Brice Ericson Hernandez",
    role: "Former assistant district engineer, DPWH Bulacan",
    kind: "agency_official",
    status: "charged",
    summary:
      "Dismissed from DPWH and named liable in COA fraud audits over Bulacan ghost flood control projects; a co-accused of Bong Revilla in the ₱92.8-M Pandi malversation case, where the Sandiganbayan denied his petition for bail on July 31, 2026. Allegations are unproven.",
    projectIds: ["p-bulacan4", "p-pandi"],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/959619/coa-dpwh-bulacan-flood-control-projects-p390-million/story/",
        date: "2025-09-18",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/dpwh-seeks-license-revocation-engineers-accountant-bulacan-flood-control-controversy/",
        date: "2025-09-10",
      },
      {
        outlet: "Philstar",
        url: "https://philstar.com/headlines/2026/07/31/2546067/sandiganbayan-grants-bong-revilla-p1-million-bail-p928-m-bulacan-project-case",
        date: "2026-07-31",
      },
    ],
  },
  {
    id: "e-mendoza",
    name: "Jaypee Mendoza",
    role: "Former assistant district engineer, DPWH Bulacan",
    kind: "agency_official",
    status: "charged",
    summary:
      "Dismissed from DPWH and named liable in COA fraud audits over Bulacan ghost flood control projects; a co-accused of Bong Revilla in the ₱92.8-M Pandi malversation case, where the Sandiganbayan denied his petition for bail on July 31, 2026. Allegations are unproven.",
    projectIds: ["p-bulacan4", "p-pandi"],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/959619/coa-dpwh-bulacan-flood-control-projects-p390-million/story/",
        date: "2025-09-18",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/dpwh-seeks-license-revocation-engineers-accountant-bulacan-flood-control-controversy/",
        date: "2025-09-10",
      },
      {
        outlet: "Philstar",
        url: "https://philstar.com/headlines/2026/07/31/2546067/sandiganbayan-grants-bong-revilla-p1-million-bail-p928-m-bulacan-project-case",
        date: "2026-07-31",
      },
    ],
  },
  {
    id: "e-bonoan",
    name: "Manuel Bonoan",
    role: "Former DPWH Secretary",
    kind: "agency_official",
    status: "charged",
    summary:
      "Charged with plunder and graft over flood control projects after the ICI recommended cases and the Ombudsman filed complaints; he was earlier subpoenaed in the probe. Allegations are unproven.",
    projectIds: [],
    sources: [
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1262682",
        date: "2025-11-05",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/jinggoy-estrada-manuel-bonoan-plunder-graft-cases-flood-control-filed/",
        date: "2026-05-28",
      },
    ],
  },

  // ── Lawmakers (all framed as allegations / summons — not guilt) ───────────
  {
    id: "e-romualdez",
    name: "Ferdinand Martin Romualdez",
    role: "Leyte representative; former Speaker of the House",
    kind: "lawmaker",
    status: "under_investigation",
    summary:
      "Named the central figure in a complaint the Ombudsman's special panel filed on July 20, 2026, which recommends plunder, direct and indirect bribery, graft and money laundering over ₱56B allegedly received from flood control projects between 2022 and 2025; the Ombudsman ordered him on July 28 to answer within 15 days. This is a preliminary investigation — no case has been filed in court — and his counsel denies the accusations. Allegations are unproven.",
    projectIds: [],
    sources: [
      {
        outlet: "PhilSTAR Life",
        url: "https://philstarlife.com/news-and-views/717465-ombudsman-files-complaint-probe-vs-co-romualdez-plunder-bribery-graft-money-laundering",
        date: "2026-07-24",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/07/28/2545362/ombudsman-orders-romualdez-answer-plunder-graft-recommendation",
        date: "2026-07-28",
      },
      {
        outlet: "PCIJ",
        url: "https://pcij.org/2026/07/26/one-year-after-the-flood-control-speech/",
        date: "2026-07-26",
      },
    ],
  },
  {
    id: "e-co",
    name: 'Elizaldy "Zaldy" Co',
    role: "Former Ako Bicol party-list representative",
    kind: "lawmaker",
    status: "charged",
    summary:
      "Charged over flood control budget insertions and declared a fugitive by the Sandiganbayan while reportedly abroad, with an Interpol red notice sought. He has been in hiding since an arrest warrant was issued in November 2025, was briefly detained by Czech authorities in April 2026 and was last reported in Paris in May 2026. On July 20, 2026 the Ombudsman's special panel named him with Martin Romualdez in a fresh complaint recommending plunder, bribery, graft and money laundering over ₱56B allegedly amassed in 2022–2025; he has not commented. Allegations are unproven.",
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/977981/zaldy-co-bong-revilla-flood-control-projects-plunder-malversation-doj/story/",
        date: "2026-02-20",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/sandiganbayan-resolution-zaldy-co-co-accused-demurrer-evidence-malversation-case/",
        date: "2026-06-02",
      },
      {
        outlet: "PhilSTAR Life",
        url: "https://philstarlife.com/news-and-views/717465-ombudsman-files-complaint-probe-vs-co-romualdez-plunder-bribery-graft-money-laundering",
        date: "2026-07-24",
      },
    ],
  },
  {
    id: "e-revilla",
    name: 'Ramon "Bong" Revilla Jr.',
    role: "Former senator",
    kind: "lawmaker",
    status: "charged",
    summary:
      "Charged with graft and malversation over an alleged ₱92.8-M ghost flood control project in Pandi, Bulacan; the Sandiganbayan entered not-guilty pleas on his behalf. On July 31, 2026 its Third Division granted him ₱1-M bail after finding the prosecution had not established strong evidence of guilt, and he was released the next day — the court stressed the ruling covers bail only and does not decide guilt or innocence. He denies the allegations, which remain unproven.",
    projectIds: ["p-pandi"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/newsbreak/in-depth/bong-revilla-return-sandiganbayan-pork-barrel-flood-control/",
        date: "2026-01-20",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2182697/revilla-refuses-to-enter-plea-on-malversation-charge-sandigan-enters-not-guilty-plea-on-his-behalf",
        date: "2026-02-16",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/08/01/2546274/bong-revilla-freed-after-posting-p1-million-bail-flood-control-case",
        date: "2026-08-01",
      },
    ],
  },
  {
    id: "e-estrada",
    name: "Jinggoy Estrada",
    role: "Senator",
    kind: "lawmaker",
    status: "charged",
    summary:
      "Charged by the Ombudsman with plunder and graft over the flood control mess; the Sandiganbayan ordered his arrest. Allegations are unproven.",
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/973184/doj-subpoenas-vs-jinggoy-revilla-flood-control-mess-out-next-week/story/",
        date: "2026-01-15",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/06/01/2532002/jinggoy-estrada-ordered-arrested-plunder-flood-control-scandal",
        date: "2026-06-01",
      },
    ],
  },
  {
    id: "e-escudero",
    name: 'Francis "Chiz" Escudero',
    role: "Senator",
    kind: "lawmaker",
    status: "under_investigation",
    summary:
      "Named in kickback-scheme testimony over flood control projects; the Ombudsman's investigators have recommended charges, which he denies. Allegations are unproven.",
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/989200/escudero-plunder-flood-control/story/",
        date: "2026-05-26",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2025/11/15/2487323/senators-deny-getting-kickbacks-flood-projects",
        date: "2025-11-15",
      },
    ],
  },

  // ── Oversight / cleanup side ─────────────────────────────────────────────
  {
    id: "e-dizon",
    name: "Vince Dizon",
    role: "DPWH Secretary",
    kind: "oversight",
    status: "leading_cleanup",
    summary:
      "Ordered the blacklisting of contractors, filed complaints, and led the validation drive that scrapped ₱255B in flood control projects.",
    projectIds: ["p-sipat", "p-flood26"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/flood-control-contractor-wawao-builders-syms-perpetually-disqualified-dpwh/",
        date: "2025-09-05",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2025/09/17/2473500/dpwh-scraps-p255-billion-flood-control-budget-2026",
        date: "2025-09-17",
      },
    ],
  },
  {
    id: "e-lacson",
    name: 'Panfilo "Ping" Lacson',
    role: "Senator; Senate Blue Ribbon Committee chair",
    kind: "oversight",
    status: "leading_cleanup",
    summary:
      "Chairs the Senate Blue Ribbon Committee hearings into the flood control mess and authored its partial findings.",
    projectIds: ["p-flood26"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/flood-control-corruption-senate-blue-ribbon-panel-partial-findings-recommendations/",
        date: "2025-11-20",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2213211/only-3-more-signatures-needed-for-blue-ribbon-partial-flood-control-report-as-support-builds-lacson",
        date: "2025-11-25",
      },
    ],
  },
  {
    id: "e-tulfo",
    name: "Erwin Tulfo",
    role: "Senator; Senate Blue Ribbon Committee member",
    kind: "oversight",
    status: "leading_cleanup",
    summary:
      "Questioned contractors under oath at the Senate flood control hearings and served as acting Blue Ribbon chair.",
    projectIds: [],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/990167/blue-ribbon-flood-control-hearings-postponed-until-further-notice-erwin-tulfo/story/",
        date: "2026-05-29",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2239869/blue-ribbon-pia-cayetano-has-plans-but-erwin-tulfo-has-say",
        date: "2026-06-10",
      },
    ],
  },
  {
    id: "e-tinio",
    name: "Antonio Tinio",
    role: "House Deputy Minority Leader (ACT Teachers party-list)",
    kind: "oversight",
    status: "leading_cleanup",
    summary:
      "Asked the Ombudsman on May 19, 2026 to investigate ₱4.44B in red-flagged Davao City 1st District flood control contracts, based on his party-list's own review, and pressed for a faster probe on July 26, 2026 after fresh flooding in the city.",
    projectIds: ["p-davao1"],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/988130/ombudsman-probe-of-davao-flood-control-projects/story/",
        date: "2026-07-26",
      },
      {
        outlet: "BusinessMirror",
        url: "https://businessmirror.com.ph/2026/05/19/legislator-asks-ombudsman-to-probe-davao-city-first-districts-%E2%82%B14-4-billion-flood-control-projects/",
        date: "2026-05-19",
      },
    ],
  },
  {
    id: "e-singson",
    name: 'Rogelio "Babes" Singson',
    role: "Former DPWH Secretary; member, Independent Commission for Infrastructure (ICI)",
    kind: "oversight",
    status: "leading_cleanup",
    summary:
      "Appointed to the Independent Commission for Infrastructure that is probing flood control anomalies.",
    projectIds: [],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/marcos-names-members-independent-commission-for-infrastructure/",
        date: "2025-09-14",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1258644",
        date: "2025-09-15",
      },
    ],
  },

  // ── Implementing agencies (no adverse findings reported) ──────────────────
  // The lead agency responsible for each non-flagged project. Listed as the
  // accountable party with neutral status — this is who runs the program, not
  // an implication of wrongdoing. Named agencies (not officials) are used here
  // because the responsible cabinet posts change hands frequently.
  {
    id: "e-deped",
    name: "Department of Education (DepEd)",
    role: "Implementing agency — classroom construction",
    kind: "agency_official",
    status: "no_adverse_findings",
    summary:
      "Lead agency for the 2026 National Classroom Construction Program, targeting 24,964 new classrooms with DepEd, LGUs, and CSOs as builders.",
    projectIds: ["p-classrooms"],
    sources: [
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1266272",
        date: "2026-01-05",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/01/06/2498951/deped-gets-record-p65b-build-25000-classrooms-it-enough",
        date: "2026-01-06",
      },
    ],
  },
  {
    id: "e-doh",
    name: "Department of Health (DOH)",
    role: "Implementing agency — zero balance billing",
    kind: "agency_official",
    status: "no_adverse_findings",
    summary:
      "Runs the zero balance billing program, expanding coverage to Level 3 LGU hospitals under the 2026 budget.",
    projectIds: ["p-zbb"],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/969526/zero-balance-billing-may-cover-some-lgu-hospitals-by-2026-doh/story/",
        date: "2025-12-18",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1266351",
        date: "2026-01-06",
      },
    ],
  },
  {
    id: "e-da",
    name: "Department of Agriculture (DA)",
    role: "Implementing agency — farm-to-market roads",
    kind: "agency_official",
    status: "no_adverse_findings",
    summary:
      "Took over farm-to-market roads from DPWH for 2026 (₱33B / ~1,600 projects) and set up a watchdog and public monitoring portal.",
    projectIds: ["p-fmr"],
    sources: [
      {
        outlet: "Manila Times",
        url: "https://www.manilatimes.net/2025/10/29/business/da-to-take-over-implementation-of-govt-farm-to-market-road-program-in-2026/2210852",
        date: "2025-10-29",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/money/economy/959544/da-chief-tiu-laurel-orders-audit-farm-to-market-roads/story/",
        date: "2025-11-20",
      },
    ],
  },
  {
    id: "e-ocd",
    name: "Office of Civil Defense (OCD / NDRRMC)",
    role: "Implementing agency — disaster rehabilitation",
    kind: "agency_official",
    status: "no_adverse_findings",
    summary:
      "Administers the Disaster Rehabilitation and Reconstruction Assistance Program (DRRAP) under the 2026 calamity fund.",
    projectIds: ["p-ndrrm"],
    sources: [
      {
        outlet: "BusinessWorld",
        url: "https://bworldonline.com/economy/2026/06/04/754721/disaster-fund-balance-tops-p34-billion-as-of-may/",
        date: "2026-06-04",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2100693/new-ocd-chief-officially-takes-over",
        date: "2025-09-04",
      },
    ],
  },
  {
    id: "e-dotr",
    name: "Department of Transportation (DOTr)",
    role: "Implementing agency — Metro Manila Subway",
    kind: "agency_official",
    status: "no_adverse_findings",
    summary:
      "Lead agency for the Metro Manila Subway; right-of-way acquisition passed 90% by the end of 2025.",
    projectIds: ["p-subway"],
    sources: [
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1266562",
        date: "2026-01-06",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/02/14/2507894/metro-manila-subway-project-moving-quickly-president-marcos",
        date: "2026-02-14",
      },
    ],
  },
];
