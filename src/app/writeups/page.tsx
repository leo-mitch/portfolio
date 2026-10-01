import type { Metadata } from "next";
import { Separator, Shell } from "@/components/layout";
import { WriteupCard } from "@/components/writeup-card";
import { profile } from "@/data/profile";
import { writeups } from "@/data/writeups";

export const metadata: Metadata = {
  title: `Write-ups | ${profile.name}`,
  description: "Hack The Box machine write-ups — recon, exploitation and privilege escalation.",
};

export default function WriteupsPage() {
  return (
    <Shell>
      <div className="dot-grid relative border-b border-line px-4 pt-16 pb-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative">
          <p data-scramble className="mb-3 font-mono text-xs text-accent">
            ~/writeups
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span data-intro-title>Write-ups</span>
            <span data-intro className="inline-block text-accent">
              .
            </span>
          </h1>
          <p data-intro className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/80">
            Detailed walkthroughs of Hack The Box machines I&apos;ve rooted — recon, exploitation
            and privilege escalation, with the commands and reasoning behind each step. All boxes
            are retired; live secrets are redacted.
          </p>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        {writeups.map((w) => (
          <WriteupCard key={w.slug} writeup={w} />
        ))}
      </div>
    </Shell>
  );
}
