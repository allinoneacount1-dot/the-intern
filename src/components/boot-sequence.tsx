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

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? BOOT_LINES.length
      : 0
  );
  const container = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  // Reduced-motion: skip animation, complete after short delay
  useEffect(() => {
    if (visible === BOOT_LINES.length) {
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
      className="fixed inset-0 z-[100] bg-[var(--void)] flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      <div className="max-w-[680px] w-full px-6">
        <div className="font-mono text-[12px] leading-[1.85]">
          {BOOT_LINES.slice(0, visible).map((line, i) => (
            <div
              key={i}
              className={line.includes("ERROR") || line.includes("NOT FOUND")
                ? "text-[var(--red)]"
                : line.includes("WARNING") || line.includes("SHOULD NOT")
                  ? "text-[var(--amber)]"
                  : line.includes("ACCESS GRANTED")
                    ? "phosphor"
                    : line.includes("MANAGER") || line.includes("«")
                      ? "text-[var(--paper)]"
                      : "text-[var(--paper-dim)]"
              }
            >
              {line || "\u00A0"}
            </div>
          ))}
          {visible < BOOT_LINES.length + 1 && (
            <span className="animate-blink text-[var(--paper)]">█</span>
          )}
        </div>
      </div>
    </div>
  );
}
