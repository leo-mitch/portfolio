"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle dots that constantly drift behind the page (wrapping around the
 * edges). The centered content column has an opaque background, so they're
 * mostly visible in the side gutters. Moving the cursor near a dot pushes it
 * away (a repel effect); the push then fades and the dot keeps drifting.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const accent =
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
      "#22c55e";

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    // bvx/bvy = constant base drift; vx/vy = live velocity (base + repel).
    type P = { x: number; y: number; vx: number; vy: number; bvx: number; bvy: number; r: number; a: number };
    let particles: P[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    function build() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(200, Math.round((w * h) / 10500));
      particles = Array.from({ length: count }, () => {
        const ang = rand(0, Math.PI * 2);
        const spd = rand(0.06, 0.32);
        const bvx = Math.cos(ang) * spd;
        const bvy = Math.sin(ang) * spd;
        return { x: rand(0, w), y: rand(0, h), vx: bvx, vy: bvy, bvx, bvy, r: rand(0.6, 1.8), a: rand(0.15, 0.55) };
      });
    }

    const pointer = { x: -9999, y: -9999, active: false };
    const R = 100; // repel radius
    const maxSpeed = 3.2;
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = pointer.y = -9999;
    };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    const M = 6; // wrap margin
    let raf = 0;
    function tick() {
      for (const p of particles) {
        // Repel from the cursor.
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          if (dist < R) {
            const force = ((R - dist) / R) * 2.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        // Ease the live velocity back toward the constant drift, so the repel
        // push fades but the dot never stops moving.
        p.vx += (p.bvx - p.vx) * 0.04;
        p.vy += (p.bvy - p.vy) * 0.04;
        // Clamp top speed.
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > maxSpeed) {
          p.vx = (p.vx / sp) * maxSpeed;
          p.vy = (p.vy / sp) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around the edges for endless drift.
        if (p.x < -M) p.x = w + M;
        else if (p.x > w + M) p.x = -M;
        if (p.y < -M) p.y = h + M;
        else if (p.y > h + M) p.y = -M;
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        build();
        if (reduce) draw();
      }, 150);
    };

    build();
    if (reduce) {
      draw();
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(tick);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
