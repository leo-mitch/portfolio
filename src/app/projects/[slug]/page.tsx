import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectLogo, Section, Separator, Shell, Tag } from "@/components/layout";
import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { profile, projects } from "@/data/profile";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project
    ? { title: `${project.title} | ${profile.name}`, description: project.tagline }
    : {};
}

const STATUS_COLORS = {
  Live: "bg-accent",
  "In progress": "bg-yellow-400",
  Archived: "bg-muted",
};

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <Shell>
      <div className="border-b border-line px-4 py-3">
        <Link href="/projects" className="font-mono text-xs text-muted hover:text-accent">
          ← cd ../projects
        </Link>
      </div>

      <div className="dot-grid relative border-b border-line px-4 pt-10 pb-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
          <span data-intro>
            <ProjectLogo title={p.title} label={p.logo} image={p.image} imageFit={p.imageFit} size="lg" />
          </span>
          <div className="flex-1">
            <h1 data-intro-title className="text-4xl font-bold tracking-tight">
              {p.title}
            </h1>
            <p data-intro className="mt-1 text-foreground/80">
              {p.tagline}
            </p>
          </div>
        </div>
        <div data-intro className="relative mt-6 flex flex-wrap items-center gap-2">
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              data-magnetic="0.25"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 font-mono text-xs font-semibold text-black transition hover:bg-accent-bright"
            >
              Live site <ArrowUpRightIcon width={12} height={12} />
            </a>
          )}
          {p.repo && (
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              data-magnetic="0.25"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-card px-3 py-1.5 font-mono text-xs transition hover:border-accent hover:text-accent"
            >
              <GithubIcon width={12} height={12} /> Source
            </a>
          )}
          <span className="ml-auto inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className={`size-2 rounded-full ${STATUS_COLORS[p.status]}`} />
            {p.status} · {p.period}
          </span>
        </div>
      </div>

      <Separator />
      <Section id="overview" title="Overview">
        <div className="space-y-3 p-4 text-[15px] leading-relaxed text-foreground/85">
          {p.description.map((d) => (
            <p key={d} data-reveal>
              {d}
            </p>
          ))}
        </div>
      </Section>
      <Separator />
      <Section id="tech" title="Tech Stack">
        <div className="flex flex-wrap gap-2 p-4">
          {p.skills.map((s) => (
            <Tag key={s} reveal>
              {s}
            </Tag>
          ))}
        </div>
      </Section>
      <Separator />
      <Link
        href={`/projects/${next.slug}`}
        data-reveal
        className="group flex items-center justify-between p-4 transition hover:bg-card"
      >
        <span>
          <span className="block font-mono text-xs text-muted">Next project</span>
          <span className="font-semibold group-hover:text-accent">{next.title}</span>
        </span>
        <span className="font-mono text-muted transition group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </Link>
    </Shell>
  );
}
