"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Page-wide animation layer. Server components opt in with data attributes:
 *   data-intro       – plays in the load timeline (staggered, in DOM order)
 *   data-split       – heading revealed word-by-word when scrolled into view
 *   data-reveal      – fades/slides in when scrolled into view (batched)
 *   data-scramble    – text scrambles in on load
 *   data-typewriter  – text types out char-by-char on load, terminal-style
 *   data-parallax    – drifts with scroll (value = yPercent at the end)
 *   data-graph       – container whose [data-cell] children ripple in
 *   data-count       – number counts up from 0 when visible
 *   data-line        – vertical line that draws down as you scroll
 *   data-magnetic    – follows the pointer slightly on hover
 *   data-spotlight   – exposes --mx/--my pointer position for a glow
 *   data-accordion   – <details> whose content animates in when opened
 */
export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      const cleanups: (() => void)[] = [];

      // Reading progress bar in the header.
      gsap.fromTo(q("[data-progress]"), { scaleX: 0 }, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });

      mm.add(MOTION_OK, () => {
        // ---- Load timeline -------------------------------------------------
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.7 } });

        q("[data-scramble]").forEach((node) => {
          tl.to(
            node,
            {
              autoAlpha: 1,
              duration: 1.1,
              scrambleText: {
                text: node.textContent ?? "",
                chars: "01<>/{}#",
                revealDelay: 0.2,
                speed: 0.6,
              },
            },
            0,
          );
        });

        q("[data-intro-title]").forEach((node) => {
          const split = SplitText.create(node, { type: "words, chars", mask: "chars" });
          tl.set(node, { autoAlpha: 1 }, 0.15).from(
            split.chars,
            { yPercent: 110, duration: 0.6, stagger: 0.025 },
            0.15,
          );
        });

        tl.fromTo(
          q("[data-intro]"),
          { autoAlpha: 0, y: 14, filter: "blur(4px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.06, clearProps: "filter" },
          0.25,
        );

        // ---- Scroll reveals ------------------------------------------------
        q("[data-split]").forEach((node) => {
          SplitText.create(node, {
            type: "words",
            mask: "words",
            ignore: "sup",
            autoSplit: true,
            onSplit(self) {
              gsap.set(node, { autoAlpha: 1 });
              return gsap.from(self.words, {
                yPercent: 100,
                duration: 0.6,
                ease: "power3.out",
                stagger: 0.06,
                scrollTrigger: { trigger: node, start: "top 90%", once: true },
              });
            },
          });
        });

        gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(q("[data-reveal]"), {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });

        q("[data-parallax]").forEach((node) => {
          gsap.to(node, {
            yPercent: Number(node.getAttribute("data-parallax")) || 20,
            ease: "none",
            scrollTrigger: {
              trigger: node.parentElement,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        q("[data-graph]").forEach((graph) => {
          gsap.from(graph.querySelectorAll("[data-cell]"), {
            scale: 0,
            autoAlpha: 0,
            duration: 0.35,
            ease: "back.out(2)",
            stagger: { grid: "auto", from: "start", amount: 1.1, axis: "x" },
            scrollTrigger: { trigger: graph, start: "top 85%", once: true },
          });
        });

        q("[data-count]").forEach((node) => {
          const end = Number(node.getAttribute("data-count"));
          const counter = { v: 0 };
          gsap.to(counter, {
            v: end,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 95%", once: true },
            onUpdate: () => {
              node.textContent = Math.round(counter.v).toLocaleString("en-US");
            },
          });
        });

        q("[data-line]").forEach((line) => {
          gsap.from(line, {
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: line.parentElement,
              start: "top 80%",
              end: "bottom 60%",
              scrub: 0.5,
            },
          });
        });

        // ---- Pointer interactions (desktop pointers only) -------------------
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          q("[data-magnetic]").forEach((node) => {
            const strength = Number(node.getAttribute("data-magnetic")) || 0.3;
            const xTo = gsap.quickTo(node, "x", { duration: 0.4, ease: "power3" });
            const yTo = gsap.quickTo(node, "y", { duration: 0.4, ease: "power3" });

            const move = contextSafe!((e: Event) => {
              const { clientX, clientY } = e as PointerEvent;
              const r = node.getBoundingClientRect();
              xTo((clientX - (r.left + r.width / 2)) * strength);
              yTo((clientY - (r.top + r.height / 2)) * strength);
            });
            const leave = contextSafe!(() => {
              gsap.to(node, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: true });
            });

            node.addEventListener("pointermove", move);
            node.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              node.removeEventListener("pointermove", move);
              node.removeEventListener("pointerleave", leave);
            });
          });
        }
      });

      mm.add(REDUCED, () => {
        gsap.set(q("[data-intro], [data-intro-title], [data-split], [data-scramble], [data-reveal]"), {
          autoAlpha: 1,
        });
      });

      // Terminal typewriter for the cover title. Driven by setTimeout (not the
      // GSAP/rAF ticker) so it always types in on load — even under reduced
      // motion or a throttled tab — then holds until the next refresh. Cleanup
      // restores the full text so the title is never left half-typed.
      q("[data-typewriter]").forEach((node) => {
        const textEl = node.querySelector<HTMLElement>("[data-typewriter-text]");
        if (!textEl) return;

        const full = textEl.textContent ?? "";
        textEl.textContent = "";
        gsap.set(node, { autoAlpha: 1 }); // gsap.set is synchronous, no ticker needed

        let i = 0;
        let timer = window.setTimeout(function type() {
          i += 1;
          textEl.textContent = full.slice(0, i);
          if (i < full.length) timer = window.setTimeout(type, 90);
        }, 300);

        cleanups.push(() => {
          clearTimeout(timer);
          textEl.textContent = full;
        });
      });

      // Spotlight glow follows the pointer (cheap: only sets two CSS vars).
      q("[data-spotlight]").forEach((node) => {
        const move = contextSafe!((e: Event) => {
          const { clientX, clientY } = e as PointerEvent;
          const r = node.getBoundingClientRect();
          gsap.set(node, { "--mx": `${clientX - r.left}px`, "--my": `${clientY - r.top}px` });
        });
        node.addEventListener("pointermove", move);
        cleanups.push(() => node.removeEventListener("pointermove", move));
      });

      // Accordion content eases in when a <details> opens.
      q("details[data-accordion]").forEach((node) => {
        const details = node as HTMLDetailsElement;
        const onToggle = contextSafe!(() => {
          if (!details.open || window.matchMedia(REDUCED).matches) return;
          gsap.fromTo(
            details.querySelectorAll(":scope > :not(summary)"),
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05, overwrite: true },
          );
        });
        details.addEventListener("toggle", onToggle);
        cleanups.push(() => details.removeEventListener("toggle", onToggle));
      });

      // Fonts can shift layout after load; recompute trigger positions.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        cleanups.forEach((fn) => fn());
        mm.revert();
      };
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}

/** Rotating tagline that scrambles between sentences. */
export function ScrambleSentences({ sentences }: { sentences: string[] }) {
  const root = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ok: MOTION_OK, reduced: REDUCED }, (ctx) => {
        const { reduced } = ctx.conditions as { ok: boolean; reduced: boolean };
        const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
        sentences.forEach((_, i) => {
          const next = sentences[(i + 1) % sentences.length];
          tl.to({}, { duration: 2.2 }).to(text.current, {
            duration: reduced ? 0 : 0.9,
            scrambleText: reduced
              ? { text: next }
              : { text: next, chars: "abcdefghijklmnopqrstuvwxyz01", speed: 0.5 },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [sentences.join("|")] },
  );

  return (
    <span ref={root} className="inline-flex items-center font-mono text-sm text-muted">
      <span className="mr-1 text-accent">&gt;</span>
      <span ref={text}>{sentences[0]}</span>
    </span>
  );
}
