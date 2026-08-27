"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BOOT_LINES = [
  "MARKET CONTROL SYSTEM",
  "MCS 19.87",
  "",
  "INITIALIZING...",
  "GLOBAL MARKETS ........ ONLINE",
  "SETTLEMENT ............ ONLINE",
  "GLOBAL LIQUIDITY ...... ONLINE",
  "RATES .................. ONLINE",
  "CRYPTO ................. ONLINE",
  "PRINTER ................ ERROR",
  "RISK MANAGEMENT ........ NOT FOUND",
  "",
  "AUTHENTICATING...",
  "USER: INTERN",
  "EMPLOYEE STATUS: TEMPORARY",
  "ACCESS LEVEL: ████████████████████",
  "",
  "WARNING:",
  "INTERN ACCOUNT SHOULD NOT",
  "HAVE ADMINISTRATOR ACCESS.",
  "",
  "VERIFYING...",
  "...",
  "ACCESS GRANTED.",
  "",
  "1 NEW MESSAGE",
  "FROM: MANAGER",
  "SUBJECT: FIRST DAY",
  "",
  "«Do not touch anything.»",
];

const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(() =>
    isReducedMotion() ? BOOT_LINES.length : 0
  );
  const [cursor, setCursor] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  // Reduced-motion: skip animation, complete after short delay
  useEffect(() => {
    if (isReducedMotion()) {
      gsap.delayedCall(0.4, onComplete);
    }
  }, [visible, onComplete]);

  // Normal animation
  useEffect(() => {
    if (visible === BOOT_LINES.length) return;
    if (hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline();

    BOOT_LINES.forEach((_, i) => {
      tl.call(
        () => setVisible(i + 1),
        [],
        i * 0.06 + 0.05
      );
    });

    tl.fromTo(
      container.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      0
    );

    tl.call(() => gsap.delayedCall(0.6, onComplete), [], "-=0.2");

    return () => {
      tl.kill();
    };
  }, [visible, onComplete]);

  return (
    <div
      ref={container}
      className="h-screen w-screen bg-[var(--ink)] flex items-center justify-center p-8"
    >
      <div className="font-mono text-[var(--paper)] text-[12px] sm:text-[14px] leading-[1.6] whitespace-pre-wrap max-w-[560px]">
        {BOOT_LINES.slice(0, visible).map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {visible < BOOT_LINES.length && (
          <span className="inline-block w-[8px] h-[14px] bg-[var(--paper)] ml-1 align-middle">
            {cursor && <span className="sr-only">_</span>}
          </span>
        )}
      </div>
    </div>
  );
}
