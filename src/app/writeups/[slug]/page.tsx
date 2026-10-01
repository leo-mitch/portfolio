import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectLogo, Section, Separator, Shell, Tag } from "@/components/layout";
import { WriteupContent } from "@/components/writeup-content";
import { profile } from "@/data/profile";
import { difficultyColor, writeups } from "@/data/writeups";

export function generateStaticParams() {
  return writeups.map((w) => ({ slug: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/writeups/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = writeups.find((x) => x.slug === slug);
  return w
    ? { title: `${w.title} — ${w.platform} | ${profile.name}`, description: w.tagline }
    : {};
}

export default async function WriteupPage({ params }: PageProps<"/writeups/[slug]">) {
  const { slug } = await params;
  const index = writeups.findIndex((w) => w.slug === slug);
  if (index === -1) notFound();
  const w = writeups[index];
  const next = writeups[(index + 1) % writeups.length];

  const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

  return (
    <Shell>
      <div className="border-b border-line px-4 py-3">
        <Link href="/writeups" className="font-mono text-xs text-muted hover:text-accent">
          ← cd ../writeups
        </Link>
      </div>

      <div className="dot-grid relative border-b border-line px-4 pt-10 pb-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end">
          <span data-intro>
            <ProjectLogo title={w.title} label={w.logo} image={w.image} imageFit={w.imageFit} size="lg" />
          </span>
          <div className="flex-1">
            <p data-intro className="font-mono text-xs text-muted">
              {w.platform}
            </p>
            <h1 data-intro-title className="text-4xl font-bold tracking-tight">
              {w.title}
            </h1>
            <p data-intro className="mt-1 text-foreground/80">
              {w.tagline}
            </p>
          </div>
        </div>
        <div data-intro className="relative mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className={`size-2 rounded-full bg-current ${difficultyColor[w.difficulty]}`} />
            <span className={difficultyColor[w.difficulty]}>{w.difficulty}</span>
          </span>
          <span>{w.os}</span>
          <span>{fmt.format(new Date(w.date))}</span>
        </div>
      </div>

      <Separator />
      <Section id="tags" title="Topics">
        <div className="flex flex-wrap gap-2 p-4">
          {w.tags.map((t) => (
            <Tag key={t} reveal>
              {t}
            </Tag>
          ))}
        </div>
      </Section>
      <Separator />
      <Section id="machine-info" title="Machine info">
        <WriteupContent blocks={[{ t: "p", text: w.info }]} />
      </Section>
      <Separator />

      <WriteupContent blocks={w.content} />

      <Separator />
      <Link
        href={`/writeups/${next.slug}`}
        data-reveal
        className="group flex items-center justify-between p-4 transition hover:bg-card"
      >
        <span>
          <span className="block font-mono text-xs text-muted">Next write-up</span>
          <span className="font-semibold group-hover:text-accent">{next.title}</span>
        </span>
        <span className="font-mono text-muted transition group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </Link>
    </Shell>
  );
}
