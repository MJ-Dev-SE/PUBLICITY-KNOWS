import type { Project } from "./types";

// Projects (see CLAUDE.md §9 seed). Figures and dates are sourced from public
// reporting on the 2026 GAA (RA 12314) and the 2025–2026 DPWH flood control
// investigation.
//
// DEVIATIONS FROM THE §9 SEED (corrected against current sourced reporting,
// because the app's premise is factual accuracy — see §10):
//   • p-subway  — seed said "verified complete"; DOTr/PNA reporting shows the
//                 subway is only ~18% built, with partial operations targeted
//                 for 2028 and full operations ~2031. Set to in_progress.
//   • p-fmr     — seed allocated ₱297.102B; the actual 2026 DA allocation for
//                 farm-to-market roads is ₱33B (1,605 projects). Corrected.
//   • p-classrooms — seed allocated ₱1.345T, which is the whole Education sector
//                 total, not the classroom program; using DepEd's record ₱65B
//                 classroom-construction allocation instead.
//   • p-ndrrm   — recategorized from "Health" to "Other" (disaster rehab/
//                 reconstruction). The ₱15.33B figure matches the real DRRAP
//                 allocation and is kept.
//
// REFRESH — Aug 11, 2026 (previous stamp: Jun 16, 2026). Added from reporting
// published after the last stamp:
//   • p-pandi   — the ₱92.8-M Pandi, Bulacan project already named in the
//                 Revilla entity now exists as its own project. Sandiganbayan
//                 granted Revilla ₱1-M bail on Jul 31, 2026 (freed Aug 1).
//   • p-davao1  — Davao City 1st District flood control, 2019–2022. Recorded by
//                 DPWH as implemented; 80 of 121 contracts red-flagged in a
//                 party-list review, Ombudsman probe REQUESTED (May 19, 2026,
//                 pressed again Jul 26). No findings, no charges — so no `ghost`
//                 or `misreported` flag is set. See the note on that entry.
//   • p-flood26 — appended the FY2027 DPWH budget proposal (Aug 10, 2026).
// Checked and left unchanged: p-classrooms, p-zbb, p-fmr, p-ndrrm, p-subway had
// no post-Jun-16 reporting that moves their figures.
//
// REFRESH — Sep 5, 2026 (previous stamp: Aug 11, 2026).
//   • p-bulacan4 — DPWH Sec. Dizon inspected ghost projects in Paombong and
//                  Hagonoy (Aug 22, 2026), flagging "faulty design" on seawalls.
//   • p-pandi   — Ombudsman filed MR against Sandiganbayan bail ruling; Justice
//                  Miranda dissented, calling Revilla "indispensable." Added sources.
//   • p-davao1  — Ombudsman called Davao "epicenter of flood control corruption"
//                  at House hearing (Aug 26, 2026); Duterte challenged for proof.
//   • p-flood26 — 2027 flood control budget set at ₱107.4B, lowest since 2019.
//   • p-classrooms — ₱49.8B mobilized for 14,601 classrooms; Aquino urged fast-
//                  tracking (Jul 23). Updated spent and progress.
//   • p-zbb     — DBM released ₱10.38B for ZBB (Sep 2, 2026); 2.1M patients
//                  served as of Mar 2026. Updated allocated, spent, and progress.
//   • p-fmr     — Construction delayed to Q4 2026; SARO received end-Aug.
//   • p-subway  — Marcos says project "ahead of schedule"; Ortigas demolition
//                  88%, Shaw excavation 41%. Demo run targeted Q1 2028.

export const projects: Project[] = [
  {
    id: "p-sipat",
    name: "Sipat Dike Flood Control",
    location: "Brgy. Sipat, Plaridel, Bulacan",
    coords: { lat: 14.8869, lng: 120.856, precision: "approximate" },
    category: "Flood Control",
    allocated: 96_500_000,
    spent: 96_500_000,
    proposedStart: "2023-09-01",
    proposedEnd: "2024-06-30",
    actualStart: "2025-08-01",
    progress: 60,
    misreported: true,
    note: "Reported 100% complete on June 11, 2024, but COA found construction only began around August 2025; satellite imagery showed no structure as of April 2025.",
    bidding: {
      status: "awarded",
      abc: 96_500_000,
      contractAmount: 96_500_000,
      winnerId: "e-wawao",
      method: "Public bidding (DPWH)",
      flags: [
        {
          kind: "near_abc",
          note: "Contract was awarded at the full Approved Budget for the Contract (₱96.5M) — no savings for the government.",
        },
      ],
      note: "The winning contractor, Wawao Builders, was later perpetually disqualified (blacklisted) by DPWH over ghost flood control projects.",
    },
    media: [
      {
        kind: "video",
        title: "DPWH inspects the ₱96.5-M 'ghost' flood control project in Plaridel, Bulacan",
        outlet: "Rappler",
        url: "https://www.youtube.com/watch?v=YFYLcE4apOE",
        youtubeId: "YFYLcE4apOE",
      },
      {
        kind: "coverage",
        title: "Rappler recap: DPWH flags ₱96.5-M ghost project in Plaridel",
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/recap-video-ghost-flood-control-project-plaridel-bulacan/",
      },
    ],
    peopleIds: ["e-wawao", "e-dizon", "e-alcantara"],
    sources: [
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/recap-video-ghost-flood-control-project-plaridel-bulacan/",
        date: "2025-08-22",
      },
      {
        outlet: "Manila Times",
        url: "https://www.manilatimes.net/2025/09/05/regions/ghost-project-comes-to-life-in-bulacan/2179101",
        date: "2025-09-05",
      },
    ],
  },
  {
    id: "p-bulacan4",
    name: "Bulacan flood control (4 sites)",
    location: "Bulacan",
    coords: { lat: 14.9176, lng: 120.7636, precision: "approximate" },
    category: "Flood Control",
    allocated: 330_000_000,
    spent: 330_000_000,
    proposedStart: "2023-01-01",
    proposedEnd: "2024-06-30",
    actualStart: null,
    progress: 0,
    ghost: true,
    note: "COA fraud audits found these Bulacan sites were ghost projects, relocated, or built over pre-existing structures; reports were filed with the Ombudsman. On August 22, 2026, DPWH Sec. Dizon and Cabinet Sec. Abalos inspected ghost projects in Paombong and Hagonoy, flagging 'faulty design' on seawalls that face the open sea instead of protecting communities inland.",
    bidding: {
      status: "awarded",
      contractAmount: 330_000_000,
      winnerId: "e-sttimothy",
      method: "Public bidding (DPWH)",
      flags: [
        {
          kind: "related_party",
          note: "Sarah Discaya admitted at a Senate hearing (Sept 1, 2025) that her family's firms bid for the same flood control projects ('nagbiding-bidingan').",
        },
        {
          kind: "interlocking_officers",
          note: "The NBI found 7–8 of the top 15 flood control contractors share the same officers, raising bid-rigging suspicion.",
        },
        {
          kind: "bid_rigging_referral",
          note: "DPWH referred bid-rigging cases vs the Discayas and 4 other contractors to the Philippine Competition Commission (Oct 3, 2025).",
        },
      ],
      note: "Per DPWH, Discaya-owned firms cornered 1,214 flood control contracts (2016–2025) worth ₱77.9B.",
    },
    media: [
      {
        kind: "video",
        title: "DPWH Sec. Dizon inspects Bulacan sites with ghost flood control projects",
        outlet: "ANC (ABS-CBN)",
        url: "https://www.youtube.com/watch?v=hyxQCunUA8w",
        youtubeId: "hyxQCunUA8w",
      },
      {
        kind: "video",
        title: "Sarah Discaya, top contractors take oath at Senate Blue Ribbon probe",
        outlet: "ANC (ABS-CBN)",
        url: "https://www.youtube.com/watch?v=9G6e4tZZM08",
        youtubeId: "9G6e4tZZM08",
      },
    ],
    peopleIds: [
      "e-sttimothy",
      "e-syms",
      "e-im",
      "e-alcantara",
      "e-hernandez",
      "e-mendoza",
    ],
    sources: [
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2111265/coa-flags-4-more-ghost-flood-control-projects-files-new-raps",
        date: "2025-10-02",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/959619/coa-dpwh-bulacan-flood-control-projects-p390-million/story/",
        date: "2025-09-18",
      },
      {
        outlet: "Rappler",
        url: "https://www.rappler.com/philippines/sarah-discaya-admits-family-firms-bid-same-flood-projects/",
        date: "2025-09-01",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2025/10/03/2477257/dpwh-files-multiple-bid-rigging-cases-vs-discayas-4-other-contractors",
        date: "2025-10-03",
      },
      {
        outlet: "Tribune",
        url: "https://tribune.net.ph/2026/08/23/dpwh-checks-ghost-flood-control-projects-in-paombong-and-hagonoy",
        date: "2026-08-23",
      },
    ],
  },
  {
    id: "p-pandi",
    name: "Pandi Flood Control (Brgy. Bunsuran)",
    location: "Brgy. Bunsuran, Pandi, Bulacan",
    coords: {
      lat: 14.8646,
      lng: 120.9556,
      precision: "approximate",
      note: "Town-level pin for Pandi, Bulacan. Prosecutors say no structure was built at the site.",
    },
    category: "Flood Control",
    allocated: 92_800_000,
    spent: 92_800_000,
    proposedStart: "2024-07-01",
    proposedEnd: "2025-05-31",
    actualStart: null,
    progress: 0,
    ghost: true,
    note: "Ombudsman prosecutors allege the project was declared complete and paid for though nothing was built; a Sandiganbayan site inspection found no structure and DPWH reported zero accomplishment. Former senator Bong Revilla and six former DPWH Bulacan officials face malversation through falsification of public documents. The Sandiganbayan Third Division granted Revilla ₱1-M bail on July 31, 2026 (released August 1) after ruling the prosecution had not shown strong evidence of guilt — a finding the court said is limited to bail and does not decide guilt or innocence. Bail was denied to his co-accused. Third Division Chairperson Justice Karl Miranda dissented, calling Revilla 'indispensable' in the alleged malversation. The Ombudsman filed a motion for reconsideration, asserting the court ignored prosecution evidence. The allegations remain unproven.",
    bidding: {
      status: "awarded",
      contractAmount: 92_800_000,
      winnerId: "e-syms",
      method: "DPWH contract (Bulacan 1st district engineering office)",
      flags: [],
      note: "SYMS Construction Trading — since perpetually disqualified by DPWH — was allegedly paid ₱76.9M of the ₱92.8M released.",
    },
    peopleIds: ["e-revilla", "e-syms", "e-hernandez", "e-mendoza"],
    sources: [
      {
        outlet: "Philstar",
        url: "https://philstar.com/headlines/2026/07/31/2546067/sandiganbayan-grants-bong-revilla-p1-million-bail-p928-m-bulacan-project-case",
        date: "2026-07-31",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/08/01/2546274/bong-revilla-freed-after-posting-p1-million-bail-flood-control-case",
        date: "2026-08-01",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/regions/983970/dpwh-zero-accomplishment-for-pandi-bulacan-flood-project-in-revilla-graft-case/story/",
        date: "2026-03-11",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/997578/ombudsman-sandiganbayan-ignored-evidence-vs-revilla-in-flood-control-case/story/",
        date: "2026-08-20",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/997023/sandiganbayan-justice-miranda-bong-revilla-indispensable-in-alleged-flood-control-fund-misuse/story/",
        date: "2026-08-18",
      },
    ],
  },
  {
    id: "p-davao1",
    name: "Davao City 1st District flood control (2019–2022)",
    location: "Davao City · Davao and Matina rivers",
    coords: {
      lat: 7.0731,
      lng: 125.6128,
      precision: "approximate",
      note: "District-level pin. The review covers 121 separate contracts along the Davao and Matina rivers, not one site.",
    },
    category: "Flood Control",
    allocated: 4_440_000_000,
    spent: 4_440_000_000,
    proposedStart: "2019-01-01",
    proposedEnd: "2022-12-31",
    actualStart: "2019-01-01",
    progress: 100,
    note: "DPWH records these 121 contracts as implemented. A review by the ACT Teachers party-list red-flagged 80 of them, worth ₱4.44B: overlapping contracts on the same river sections (₱135M), the same projects funded twice in appropriations bills (₱115M), work built in unauthorized locations or shorter than approved (₱425M), contracts missing station numbers and other specifications (₱3.56B), projects with no budget authorization (₱623M) and work unfinished years past deadline (₱713M); 49 were congressional insertions. Rep. Antonio Tinio asked the Ombudsman to investigate on May 19, 2026 and pressed it to fast-track on July 26, 2026 after fresh flooding in the city. At an August 26, 2026 House hearing, Ombudsman Jesus Crispin Remulla called Davao City an 'epicenter of flood control corruption' but quickly walked it back, saying he would not conclude without ground validation; 1st District Rep. Paolo Duterte challenged him to present complete records. Nothing has been audited, found or charged — this is a requested probe, so the entry carries no ghost or misreported flag.",
    peopleIds: ["e-tinio"],
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
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/05/19/2529093/ombudsman-urged-probe-alleged-irregularities-davao-flood-control-projects",
        date: "2026-05-19",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/08/26/2551968/davao-city-epicenter-flood-control-projects-marcos-admin-ombudsman",
        date: "2026-08-26",
      },
      {
        outlet: "MindaNews",
        url: "https://mindanews.com/top-stories/2026/08/ombudsman-calls-davao-city-epicenter-of-flood-control-corruption-prove-it-pulong-says/",
        date: "2026-08-26",
      },
    ],
  },
  {
    id: "p-flood26",
    name: "National Flood Control Program 2026",
    location: "Nationwide · DPWH, Manila",
    coords: { lat: 14.5857, lng: 120.9798, precision: "office" },
    category: "Flood Control",
    allocated: 0,
    spent: 0,
    proposedStart: "2026-01-01",
    proposedEnd: "2026-12-31",
    actualStart: null,
    progress: 0,
    note: "Locally funded flood control (~₱255B) was removed from the 2026 budget after 421 ghost, duplicate, or substandard projects were uncovered; only ~₱15.7B in foreign-assisted projects remained. The FY2027 proposal restores flood control at ₱107.4B — the lowest allocation since 2019 — focused on flood control masterplans and repairs in Metro Manila, Cavite, Laguna, Bulacan and Cebu. Releases now pass through cash programming, fiscal safeguards and presidential approval.",
    bidding: {
      status: "withdrawn",
      abc: 255_000_000_000,
      method: "Locally funded — removed before procurement",
      flags: [],
      note: "A transparency win: ₱255B in locally funded flood control was scrapped from the 2026 budget before any contracts were awarded, after the ghost-project scandal.",
    },
    peopleIds: ["e-dizon", "e-lacson"],
    sources: [
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2025/09/17/2473500/dpwh-scraps-p255-billion-flood-control-budget-2026",
        date: "2025-09-17",
      },
      {
        outlet: "Inquirer",
        url: "https://newsinfo.inquirer.net/2110818/dpwh-cuts-budget-by-p255b-drops-locally-funded-flood-control-projects",
        date: "2025-09-17",
      },
      {
        outlet: "SunStar",
        url: "https://www.sunstar.com.ph/manila/dpwh-budget-proposal-for-2027-involves-funds-for-flood-control-projects",
        date: "2026-08-10",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/08/12/2548719/p107-billion-flood-control-budget-2027-lowest-2019",
        date: "2026-08-12",
      },
    ],
  },
  {
    id: "p-classrooms",
    name: "Public school classroom construction",
    location: "Nationwide · sample: Pila, Laguna",
    coords: {
      lat: 14.2326,
      lng: 121.3653,
      precision: "sample",
      note: "Representative site: DepEd's first leased facility, the Don Manuel Rivera Memorial Integrated NHS annex in Pila, Laguna. The program is nationwide.",
    },
    category: "Education",
    allocated: 84_700_000_000,
    spent: 49_800_000_000,
    proposedStart: "2026-01-01",
    proposedEnd: "2026-12-31",
    actualStart: "2026-01-15",
    progress: 35,
    note: "Record classroom-construction allocation (₱84.7B total including LGU and CSO channels) targeting 24,964 new classrooms in 2026; for the first time DepEd, LGUs, and CSOs may build directly, not only DPWH. As of mid-2026, ₱49.8B has been mobilized for an initial batch of 14,601 classrooms. Sen. Bam Aquino urged DepEd to fast-track delivery in the second half of 2026.",
    peopleIds: ["e-deped"],
    sources: [
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/01/06/2498951/deped-gets-record-p65b-build-25000-classrooms-it-enough",
        date: "2026-01-06",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1266272",
        date: "2026-01-05",
      },
      {
        outlet: "Manila Bulletin",
        url: "https://mb.com.ph/2026/07/23/bam-aquino-urges-deped-fast-track-classroom-construction-in-last-half-of-2026",
        date: "2026-07-23",
      },
    ],
  },
  {
    id: "p-zbb",
    name: "Zero Balance Billing Program",
    location: "LGU hospitals · DOH, Manila",
    coords: { lat: 14.6101, lng: 120.9921, precision: "office" },
    category: "Health",
    allocated: 10_377_000_000,
    spent: 10_377_000_000,
    proposedStart: "2026-01-01",
    proposedEnd: "2026-12-31",
    actualStart: "2026-02-01",
    progress: 40,
    note: "DBM approved the release of ₱10.38B for Zero Balance Billing (Sep 2, 2026): ₱9.38B for DOH hospitals nationwide and ₱1B for six pilot LGU hospitals (Benguet, Batangas, Laguna, Quezon, Aklan, Sarangani). As of March 2026, over 2.1 million patients had benefited, covering ₱134.88B in hospital bills. DOH plans to expand to shared pay wards for PhilHealth direct contributors.",
    peopleIds: ["e-doh"],
    sources: [
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/969526/zero-balance-billing-may-cover-some-lgu-hospitals-by-2026-doh/story/",
        date: "2025-12-18",
      },
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1265266",
        date: "2025-12-10",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/09/02/2553396/dbm-oks-p1038-billion-zero-balance-billing",
        date: "2026-09-02",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/money/economy/1000740/dbm-approves-release-of-p10-377-billion-for-zero-balance-billing/story/",
        date: "2026-09-02",
      },
    ],
  },
  {
    id: "p-fmr",
    name: "Farm-to-Market Roads",
    location: "Rural nationwide · sample: Laak, Davao de Oro",
    coords: {
      lat: 7.8275,
      lng: 126.05,
      precision: "sample",
      note: "Representative site: a ₱245-M farm-to-market road (Kilagding–Recenia–Kibaguio) that broke ground in Laak, Davao de Oro on April 20, 2026. The program is nationwide.",
    },
    category: "Transport",
    allocated: 33_000_000_000,
    spent: 0,
    proposedStart: "2026-04-01",
    proposedEnd: "2026-12-31",
    actualStart: null,
    progress: 0,
    note: "The Department of Agriculture took over farm-to-market roads from DPWH for 2026 (₱33B for 1,605 projects / ~2,300 km). Construction, originally targeted for April 2026, has been delayed to Q4 2026; DA Sec. Tiu Laurel said the special allotment release order (SARO) was received only at end-August, with bidding starting in September. DA estimates it can deliver FMR at roughly 20% lower cost than DPWH's average. An FMR Watch portal was launched for public monitoring.",
    peopleIds: ["e-da"],
    sources: [
      {
        outlet: "Inquirer",
        url: "https://business.inquirer.net/593460/da-budgets-p33-b-for-farm-to-market-roads",
        date: "2026-01-08",
      },
      {
        outlet: "GMA News",
        url: "https://www.gmanetwork.com/news/topstories/nation/974755/da-eyes-to-start-construction-of-farm-to-market-roads-by-april/story/",
        date: "2026-02-12",
      },
      {
        outlet: "BusinessMirror",
        url: "https://businessmirror.com.ph/2026/09/04/farm-to-market-roads-to-start-only-in-q4/",
        date: "2026-09-04",
      },
    ],
  },
  {
    id: "p-ndrrm",
    name: "Disaster Rehabilitation & Reconstruction",
    location: "Calamity areas · OCD, QC",
    coords: { lat: 14.616, lng: 121.0483, precision: "office" },
    category: "Other",
    allocated: 15_330_000_000,
    spent: 2_000_000_000,
    proposedStart: "2026-01-01",
    proposedEnd: "2026-12-31",
    actualStart: "2026-03-01",
    progress: 15,
    note: "Disaster Rehabilitation and Reconstruction Assistance Program (DRRAP) under the 2026 calamity fund; little had been disbursed early in the year.",
    peopleIds: ["e-ocd"],
    sources: [
      {
        outlet: "BusinessWorld",
        url: "https://bworldonline.com/economy/2026/06/04/754721/disaster-fund-balance-tops-p34-billion-as-of-may/",
        date: "2026-06-04",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/03/11/2513477/calamity-fund-can-be-used-subsidies",
        date: "2026-03-11",
      },
    ],
  },
  {
    id: "p-subway",
    name: "Metro Manila Subway (tunnel section)",
    location: "Quezon City",
    coords: { lat: 14.676, lng: 121.0437, precision: "approximate" },
    category: "Transport",
    allocated: 50_000_000_000,
    spent: 9_000_000_000,
    proposedStart: "2019-02-01",
    proposedEnd: "2031-12-31",
    actualStart: "2019-02-27",
    progress: 22,
    note: "President Marcos says the project is 'ahead of schedule.' As of early 2026, Ortigas Avenue Station demolition is 88% complete and Shaw Boulevard Station excavation is at 41%. A demonstration run covering the initial northern section (East Valenzuela to Quirino Avenue) is targeted for Q1 2028, with full passenger operations by 2031.",
    bidding: {
      status: "awarded",
      contractAmount: 50_000_000_000,
      winnerId: "e-eei",
      bidders: 4,
      method: "International competitive bidding (JICA-assisted ODA)",
      flags: [],
      note: "Tunnel packages were awarded to Japanese-led joint ventures (EEI is a local JV partner) under JICA-funded competitive bidding — a contrast to the locally funded flood control awards.",
    },
    peopleIds: ["e-dotr"],
    sources: [
      {
        outlet: "PNA",
        url: "https://www.pna.gov.ph/articles/1271930",
        date: "2026-03-20",
      },
      {
        outlet: "Philstar",
        url: "https://www.philstar.com/headlines/2026/02/14/2507894/metro-manila-subway-project-moving-quickly-president-marcos",
        date: "2026-02-14",
      },
    ],
  },
];
