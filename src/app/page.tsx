import Link from "next/link";
import type { ReactNode } from "react";
import {
  awards,
  certifications,
  experience,
  posts,
  profile,
  projects,
  socials,
  stack,
  stackIcons,
} from "@/data/profile";
import { writeups } from "@/data/writeups";
import { Contributions } from "@/components/contributions";
import { ProjectCard } from "@/components/project-card";
import { WriteupCard } from "@/components/writeup-card";
import { Section, Separator, Shell, Tag } from "@/components/layout";
import { CopyEmail, LocalTime } from "@/components/client";
import { ScrambleSentences } from "@/components/motion";
import {
  ArrowUpRightIcon,
  AwardIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  GlobeIcon,
  MailIcon,
  PinIcon,
  UserIcon,
  VerifiedIcon,
  socialIcons,
} from "@/components/icons";

export default function Home() {
  return (
    <Shell>
        <Cover />
        <Profile />
        <Separator />
        <Overview />
        <Separator />
        <Socials />
        <Separator />
        <Section id="about" title="About">
          <div className="space-y-3 p-4 text-[15px] leading-relaxed text-foreground/85">
            {profile.about.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </Section>
        <Separator />
        <Section id="stack" title="Stack">
          <div className="flex flex-wrap gap-2 p-4">
            {stack.map((s) => (
              <Tag key={s} reveal icon={stackIcons[s]}>
                {s}
              </Tag>
            ))}
          </div>
        </Section>
        <Separator />
        {/* <Section id="activity" title="GitHub Activity">
          <Contributions />
        </Section>
        <Separator /> */}
        <Section id="experience" title="Experience">
          <Experience />
        </Section>
        <Separator />
        <Section
          id="projects"
          title="Projects"
          count={projects.length}
          action={
            <Link href="/projects" className="font-mono text-xs text-muted hover:text-accent">
              View all →
            </Link>
          }
        >
          <Projects />
        </Section>
        {writeups.length > 0 && (
          <>
            <Separator />
            <Section
              id="writeups"
              title="HTB - Write-ups"
              count={writeups.length}
              action={
                <Link href="/writeups" className="font-mono text-xs text-muted hover:text-accent">
                  View all →
                </Link>
              }
            >
              <Writeups />
            </Section>
          </>
        )}
        {awards.length > 0 && (
          <>
            <Separator />
            <Section id="awards" title="Honors & Awards" count={awards.length}>
              <SimpleList items={awards} />
            </Section>
          </>
        )}
        {certifications.length > 0 && (
          <>
            <Separator />
            <Section id="certs" title="Certifications" count={certifications.length}>
              <SimpleList items={certifications} />
            </Section>
          </>
        )}
        {posts.length > 0 && (
          <>
            <Separator />
            <Section id="blog" title="Blog">
              <Blog />
            </Section>
          </>
        )}
    </Shell>
  );
}

/* ---------- Sections ---------- */

function Cover() {
  return (
    <div
      data-spotlight
      className="dot-grid relative flex aspect-[2/1] items-center justify-center overflow-hidden border-b border-line sm:aspect-[3/1]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />
      <span className="cover-glow" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      <div data-parallax="45" className="relative">
        <p
          data-typewriter
          className="glow-text flex select-none items-center whitespace-nowrap font-mono text-5xl font-bold tracking-tighter text-accent sm:text-7xl"
        >
          <span aria-hidden className="mr-3 text-accent/40">
            ~$
          </span>
          <span data-typewriter-text>{`${profile.handle}`}</span>
          <span
            data-typewriter-caret
            className="animate-blink ml-1 inline-block h-[0.9em] w-[0.55em] translate-y-[0.06em] bg-accent"
          />
        </p>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="flex border-b border-line">
      <div className="shrink-0 border-r border-line p-1">
        <div data-intro className="size-28 overflow-hidden rounded-full border border-accent/40 ring-1 ring-line ring-offset-2 ring-offset-background sm:size-36">
          <img
            src={profile.avatar}
            alt={profile.name}
            width={144}
            height={144}
            className="size-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <h1 className="flex grow items-end gap-2 pb-1.5 pl-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          <span data-intro-title>{profile.name}</span>
          {profile.verified && (
            <span data-intro className="inline-flex">
              <VerifiedIcon className="text-accent" />
            </span>
          )}
        </h1>
        <div data-intro className="separator h-8 border-t border-line" />
        <div data-intro className="h-11 border-t border-line py-2.5 pl-4">
          <ScrambleSentences sentences={profile.flipSentences} />
        </div>
      </div>
    </div>
  );
}

function OverviewRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li data-intro className="flex items-center gap-4 font-mono text-sm">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-accent">
        {icon}
      </span>
      <span className="min-w-0 truncate">{children}</span>
    </li>
  );
}

function Overview() {
  const link = "underline-offset-4 hover:text-accent hover:underline";
  return (
    <ul className="space-y-2.5 p-4">
      <OverviewRow icon={<BriefcaseIcon />}>
        {profile.job.title}
        {profile.job.company && (
          <>
            {" @ "}
            {profile.job.url ? (
              <a href={profile.job.url} className={link} target="_blank" rel="noreferrer">
                {profile.job.company}
              </a>
            ) : (
              profile.job.company
            )}
          </>
        )}
      </OverviewRow>
      <OverviewRow icon={<PinIcon />}>{profile.location}</OverviewRow>
      <OverviewRow icon={<ClockIcon />}>
        <LocalTime timeZone={profile.timeZone} />
      </OverviewRow>
      <li data-intro className="flex items-center gap-4 font-mono text-sm">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-accent">
          <MailIcon />
        </span>
        <a href={`mailto:${profile.email}`} className={link}>
          {profile.email}
        </a>
        {/* <CopyEmail email={profile.email} /> */}
      </li>
      <OverviewRow icon={<GlobeIcon />}>
        <a href={profile.website} className={link} target="_blank" rel="noreferrer">
          {profile.website.replace(/^https?:\/\//, "")}
        </a>
      </OverviewRow>
      {/* <OverviewRow icon={<UserIcon />}>{profile.pronouns}</OverviewRow> */}
    </ul>
  );
}

function Socials() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3">
      {socials.map((s, i) => {
        const Icon = socialIcons[s.icon];
        return (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            data-reveal
            data-spotlight
            className={`group relative flex items-center gap-3 overflow-hidden border-line p-4 transition hover:bg-card ${
              i < socials.length - 1 ? "border-b sm:border-r sm:border-b-0" : ""
            }`}
          >
            <span className="spotlight" />
            <span
              data-magnetic="0.35"
              className="relative flex size-10 items-center justify-center rounded-lg border border-line bg-card text-foreground transition-colors group-hover:border-accent group-hover:text-accent"
            >
              <Icon width={18} height={18} />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block text-sm font-medium">{s.name}</span>
              <span className="block truncate font-mono text-xs text-muted">{s.handle}</span>
            </span>
            <ArrowUpRightIcon className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
          </a>
        );
      })}
    </div>
  );
}

function Experience() {
  return (
    <div>
      {experience.map((c) => (
        <div key={c.company} data-reveal className="border-b border-line p-4 last:border-b-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded-md border border-line bg-card font-mono text-[10px] font-bold text-accent">
              {c.company[0]}
            </span>
            <h3 className="font-medium">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {c.company}
                </a>
              ) : (
                c.company
              )}
            </h3>
            {c.current && (
              <span className="relative ml-1 flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
            )}
          </div>
          <div className="relative space-y-3">
            <span data-line className="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-accent/70 via-line to-line" />
            {c.positions.map((p, i) => (
              <details key={p.title} data-accordion open={i === 0} className="group relative pl-9">
                <summary className="cursor-pointer select-none">
                  <span className="absolute top-1 left-0 flex size-6 items-center justify-center rounded-md border border-line bg-background text-muted">
                    <CodeIcon width={12} height={12} />
                  </span>
                  <div className="flex items-center gap-2">
                    <h4 className="flex-1 font-medium group-hover:text-accent">{p.title}</h4>
                    <ChevronDownIcon className="chevron text-muted transition-transform" />
                  </div>
                  <p className="font-mono text-xs text-muted">
                    {p.type && <>{p.type} · </>}
                    {p.period}
                  </p>
                </summary>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-foreground/80 marker:text-accent">
                  {p.description.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => (
                    <Tag key={s} icon={stackIcons[s]}>{s}</Tag>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Projects() {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {projects.filter((p) => p.featured).slice(0, 6).map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}

function Writeups() {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {writeups.map((w) => (
        <WriteupCard key={w.slug} writeup={w} />
      ))}
    </div>
  );
}

function SimpleList({
  items,
}: {
  items: { title: string; issuer: string; date: string; url?: string }[];
}) {
  return (
    <ul>
      {items.map((a) => (
        <li key={a.title} data-reveal className="flex items-center gap-3 border-b border-line p-4 last:border-b-0">
          <span className="flex size-6 items-center justify-center rounded-md border border-line bg-card text-accent">
            <AwardIcon width={12} height={12} />
          </span>
          <div className="flex-1">
            {a.url ? (
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 font-medium hover:text-accent"
              >
                {a.title}
                <ArrowUpRightIcon className="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
              </a>
            ) : (
              <p className="font-medium">{a.title}</p>
            )}
            <p className="font-mono text-xs text-muted">
              {a.issuer} · {a.date}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Blog() {
  const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      {posts.map((p, i) => (
        <a
          key={p.title}
          href={p.slug}
          data-reveal
          data-spotlight
          className={`group relative flex flex-col gap-3 overflow-hidden border-line p-4 transition hover:bg-card ${
            i < posts.length - 1 ? "border-b" : ""
          } ${i % 2 === 0 ? "sm:border-r" : ""} ${
            i >= posts.length - 2 ? "sm:border-b-0" : "sm:border-b"
          }`}
        >
          <span className="spotlight" />
          <div className="dot-grid relative flex aspect-[16/9] items-end rounded-lg border border-line bg-card p-3">
            <span className="font-mono text-xs text-accent">#{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="relative font-medium leading-snug text-balance group-hover:text-accent">{p.title}</h3>
          <time className="relative font-mono text-xs text-muted">{fmt.format(new Date(p.date))}</time>
        </a>
      ))}
    </div>
  );
}
