import type { Metadata } from "next";
import { Separator, Shell } from "@/components/layout";
import { ProjectCard } from "@/components/project-card";
import { profile, projects, socials } from "@/data/profile";

export const metadata: Metadata = {
  title: `Projects | ${profile.name}`,
  description: "Projects I've built and am most proud of.",
};

export default function ProjectsPage() {
  return (
    <Shell>
      <div className="dot-grid relative border-b border-line px-4 pt-16 pb-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative">
          <p data-scramble className="mb-3 font-mono text-xs text-accent">
            ~/projects
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span data-intro-title>Projects</span>
            <span data-intro className="inline-block text-accent">
              .
            </span>
          </h1>
          <p data-intro className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/80">
            I&apos;ve worked on tons of little projects over the years, but these are the ones I&apos;m
            most proud of. Many of them are open source, so if you see something that piques your
            interest, check out the code and feel free to contribute.
          </p>
          <a
            href={socials[0].url}
            target="_blank"
            rel="noreferrer"
            data-intro
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line bg-card px-3 py-1.5 font-mono text-xs transition hover:border-accent hover:text-accent"
          >
            More on GitHub ↗
          </a>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </Shell>
  );
}
