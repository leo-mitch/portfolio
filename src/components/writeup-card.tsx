import Link from "next/link";
import type { Writeup } from "@/data/writeups";
import { difficultyColor } from "@/data/writeups";
import { ProjectLogo } from "./layout";

export function WriteupCard({ writeup: w }: { writeup: Writeup }) {
  return (
    <Link
      href={`/writeups/${w.slug}`}
      data-reveal
      data-spotlight
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--accent)]"
    >
      <span className="spotlight" />
      <ProjectLogo title={w.title} label={w.logo} image={w.image} imageFit={w.imageFit} />
      <div className="relative min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold tracking-tight group-hover:text-accent">{w.title}</h3>
          <span className={`font-mono text-[10px] font-semibold ${difficultyColor[w.difficulty]}`}>
            {w.difficulty}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{w.tagline}</p>
      </div>
      <span className="absolute top-3 right-3 font-mono text-[10px] text-muted opacity-0 transition group-hover:opacity-100">
        ↗
      </span>
    </Link>
  );
}
