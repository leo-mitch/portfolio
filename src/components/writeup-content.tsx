import type { ReactNode } from "react";
import type { WriteupBlock } from "@/data/writeups";

/**
 * Minimal, safe inline renderer for the write-up text blocks.
 * Supports **bold**, `inline code` and [label](https://url).
 * Everything is built as React nodes — no dangerouslySetInnerHTML.
 */
function inline(text: string, keyPrefix = ""): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {m[1]}
        </strong>,
      );
    } else if (m[2]) {
      nodes.push(
        <code
          key={key}
          className="rounded border border-line bg-card px-1 py-0.5 font-mono text-[0.85em] text-accent"
        >
          {m[2]}
        </code>,
      );
    } else if (m[3] && m[4]) {
      const external = /^https?:\/\//.test(m[4]);
      nodes.push(
        <a
          key={key}
          href={m[4]}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="text-accent underline decoration-accent/40 underline-offset-2 transition hover:decoration-accent"
        >
          {m[3]}
        </a>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div data-reveal className="overflow-hidden rounded-lg border border-line bg-[#070b08]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5">
        <span className="size-2.5 rounded-full bg-red-500/70" />
        <span className="size-2.5 rounded-full bg-yellow-500/70" />
        <span className="size-2.5 rounded-full bg-accent/70" />
        {lang && <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-muted">{lang}</span>}
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function WriteupContent({ blocks }: { blocks: WriteupBlock[] }) {
  return (
    <div className="space-y-4 p-4">
      {blocks.map((b, i) => {
        const key = `b-${i}`;
        switch (b.t) {
          case "h":
            return (
              <h2
                key={key}
                data-reveal
                className="flex items-center gap-2 pt-2 text-lg font-semibold tracking-tight text-foreground"
              >
                <span className="font-mono text-accent">#</span>
                {b.text}
              </h2>
            );
          case "p":
            return (
              <p key={key} data-reveal className="text-[15px] leading-relaxed text-foreground/85">
                {inline(b.text, key)}
              </p>
            );
          case "code":
            return <CodeBlock key={key} code={b.code} lang={b.lang} />;
          case "img":
            return (
              <figure key={key} data-reveal className="overflow-hidden rounded-lg border border-line bg-card">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="w-full border-b border-line bg-[#070b08] object-contain"
                />
                {b.caption && (
                  <figcaption className="px-3 py-2 font-mono text-[11px] text-muted">
                    <span className="mr-1.5 text-accent">//</span>
                    {b.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "ul":
            return (
              <ul
                key={key}
                data-reveal
                className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-foreground/85 marker:text-accent"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={key}
                data-reveal
                className="list-decimal space-y-1 pl-5 text-[15px] leading-relaxed text-foreground/85 marker:font-mono marker:text-accent"
              >
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <div
                key={key}
                data-reveal
                className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-[14px] leading-relaxed text-foreground/85"
              >
                <span className="mr-1.5 font-mono text-xs font-semibold text-accent">NOTE</span>
                {inline(b.text, key)}
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
