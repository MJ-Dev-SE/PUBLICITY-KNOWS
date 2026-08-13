import type { Source } from "./types";

// 2026 national budget headline (RA 12314, signed Jan 5, 2026). See CLAUDE.md §9.

export const NATIONAL_BUDGET_2026 = 6_793_000_000_000; // ₱6.793 trillion

export interface SectorAllocation {
  sector: string;
  amount: number; // PHP
}

// Top sector allocations from the 2026 GAA (figures per §9 headline).
// Note: the calamity line shows the §9 figure (₱15B); the full NDRRMF for 2026
// is larger (~₱39.8B across NDRRMP/DRRAP/PSF).
export const sectorAllocations: SectorAllocation[] = [
  { sector: "Education", amount: 1_345_000_000_000 },
  { sector: "Health", amount: 448_000_000_000 },
  { sector: "Agriculture", amount: 297_000_000_000 },
  { sector: "Social services", amount: 270_000_000_000 },
  { sector: "Disaster response", amount: 15_000_000_000 },
];

export const budgetSources: Source[] = [
  {
    outlet: "Philstar",
    url: "https://www.philstar.com/headlines/2026/01/06/2499073/marcos-signs-p6793-trillion-national-budget-2026",
    date: "2026-01-06",
  },
  {
    outlet: "GMA News",
    url: "https://www.gmanetwork.com/news/topstories/nation/971648/marcos-signs-2026-national-budget/story/",
    date: "2026-01-05",
  },
];
