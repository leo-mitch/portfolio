// Real GitHub contribution graph. Data comes from the public (no-token)
// contributions API, cached for an hour. If the fetch fails for any reason,
// it falls back to a decorative graph so the page never breaks.

import { socials } from "@/data/profile";

const LEVEL_CLASSES = [
  "bg-[#0d1a10]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
];

const GITHUB_USER = (() => {
  const gh = socials.find((s) => s.icon === "github");
  if (!gh) return null;
  try {
    return new URL(gh.url).pathname.replace(/\//g, "") || null;
  } catch {
    return null;
  }
})();

type Day = { date: string; count: number; level: number };

async function fetchContributions(user: string): Promise<Day[] | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { contributions?: Day[] };
    return data.contributions?.length ? data.contributions : null;
  } catch {
    return null;
  }
}

// Group a flat, date-ascending list of days into GitHub-style week columns,
// padding the first column so each day lands on its correct weekday row.
function toWeeks(days: Day[]): (number | null)[][] {
  const pad = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (number | null)[] = [
    ...Array<null>(pad).fill(null),
    ...days.map((d) => d.level),
  ];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

// Decorative fallback (used only if the live fetch fails).
function decorative(): { weeks: (number | null)[][]; total: number } {
  let s = 42;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const weeks = Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d): number => {
      const weekend = d === 0 || d === 6;
      const trend = 0.35 + 0.4 * Math.sin(w / 8);
      const r = rand() * (weekend ? 0.6 : 1) + trend * 0.5;
      return r < 0.45 ? 0 : r < 0.65 ? 1 : r < 0.8 ? 2 : r < 0.92 ? 3 : 4;
    }),
  );
  const total = weeks.flat().reduce<number>((a, l) => a + l * 3, 0);
  return { weeks, total };
}

export async function Contributions() {
  const days = GITHUB_USER ? await fetchContributions(GITHUB_USER) : null;

  let weeks: (number | null)[][];
  let total: number;
  if (days) {
    weeks = toWeeks(days);
    total = days.reduce((a, d) => a + d.count, 0);
  } else {
    ({ weeks, total } = decorative());
  }

  // Trailing 12 month labels, ending at the current month.
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(now.getFullYear(), now.getMonth() - 11 + i, 1).toLocaleString("en-US", {
      month: "short",
    }),
  );

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <div className="w-max">
          <div className="mb-1 flex justify-between pr-2 font-mono text-[10px] text-muted">
            {months.map((m, i) => (
              <span key={`${m}-${i}`}>{m}</span>
            ))}
          </div>
          <div data-graph className="flex gap-[3px]">
            {weeks.map((week, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {week.map((l, d) =>
                  l === null ? (
                    <div key={d} className="size-[10px] rounded-[2px]" />
                  ) : (
                    <div
                      key={d}
                      data-cell
                      className={`size-[10px] rounded-[2px] ${LEVEL_CLASSES[l]}`}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
        <span>
          <span data-count={total} className="text-accent tabular-nums">
            {total.toLocaleString("en-US")}
          </span>{" "}
          contributions in the last year
        </span>
        <span className="flex items-center gap-1">
          Less
          {LEVEL_CLASSES.map((c) => (
            <span key={c} className={`size-[10px] rounded-[2px] ${c}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
