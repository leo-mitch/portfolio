import Link from "next/link";
import type { ReactNode } from "react";
import { posts, profile, socials } from "@/data/profile";
import { socialIcons } from "./icons";
import { Motion } from "./motion";

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  ...(posts.length > 0 ? [{ href: "/#blog", label: "Blog" }] : []),
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/80 backdrop-blur-md">
      <span
        data-progress
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-gradient-to-r from-accent-dim via-accent to-accent-bright"
      />
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between border-x border-line px-4">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <img
            src={profile.avatar}
            alt={profile.name}
            width={24}
            height={24}
            className="size-6 rounded-md object-cover ring-1 ring-line"
          />
          <span className="hidden sm:inline">{profile.handle}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-2 py-1 font-mono text-xs text-muted transition hover:bg-card hover:text-accent"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={socials[0].url}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            data-magnetic="0.4"
            className="ml-1 flex size-7 items-center justify-center rounded-md border border-line text-muted transition hover:border-accent hover:text-accent"
          >
            <socialIcons.github width={14} height={14} />
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <Motion>
      <Header />
      <main className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-3xl flex-col border-x border-line">
        {children}
        <div className="mt-auto">
          <Separator />
          <Footer />
        </div>
      </main>
    </Motion>
  );
}

export function Separator() {
  return <div className="separator h-8 border-y border-line" />;
}

export function Section({
  id,
  title,
  count,
  action,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-14">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <h2 data-split className="flex items-baseline gap-2 text-2xl font-semibold tracking-tight">
          {title}
          {count !== undefined && (
            <sup className="font-mono text-xs font-normal text-accent">&nbsp;({count})</sup>
          )}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tag({ children, reveal }: { children: ReactNode; reveal?: boolean }) {
  return (
    <span
      data-reveal={reveal || undefined}
      className="rounded-md border border-line bg-card px-2 py-0.5 font-mono text-xs text-foreground/80 transition hover:border-accent/60 hover:text-accent">
      {children}
    </span>
  );
}

export function ProjectLogo({
  title,
  label,
  size = "md",
}: {
  title: string;
  label?: string;
  size?: "md" | "lg";
}) {
  const letters =
    label ??
    title
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  const cls = size === "lg" ? "size-20 text-2xl rounded-2xl" : "size-14 text-lg rounded-xl";
  return (
    <span
      className={`dot-grid flex shrink-0 items-center justify-center border border-line bg-card font-mono font-bold text-accent transition group-hover:border-accent/60 ${cls}`}
    >
      {letters}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="p-4 text-center font-mono text-xs text-muted">
      <p className="mt-1">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
