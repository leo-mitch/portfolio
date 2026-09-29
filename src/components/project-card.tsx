import Link from "next/link";
import type { Project } from "@/data/profile";
import { ProjectLogo } from "./layout";

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      data-reveal
      data-spotlight
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_0_30px_-10px_var(--accent)]"
    >
      <span className="spotlight" />
      <ProjectLogo title={p.title} label={p.logo} image={p.image} imageFit={p.imageFit} />
      <div className="relative min-w-0">
        <h3 className="font-semibold tracking-tight group-hover:text-accent">{p.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{p.tagline}</p>
      </div>
      <span className="absolute top-3 right-3 font-mono text-[10px] text-muted opacity-0 transition group-hover:opacity-100">
        ↗
      </span>
    </Link>
  );
}
