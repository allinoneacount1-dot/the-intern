"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

const BOOT_LINES = [
  { text: "MARKET CONTROL SYSTEM", delay: 0 },
  { text: "MCS 19.87", delay: 200 },
  { text: "", delay: 400 },
  { text: "INITIALIZING...", delay: 600 },
  { text: "GLOBAL MARKETS ........ ONLINE", delay: 900 },
  { text: "SETTLEMENT ............ ONLINE", delay: 1100 },
  { text: "GLOBAL LIQUIDITY ...... ONLINE", delay: 1300 },
  { text: "RATES .................. ONLINE", delay: 1500 },
  { text: "CRYPTO ................. ONLINE", delay: 1700 },
  { text: "PRINTER ................ ERROR", delay: 1900 },
  { text: "RISK MANAGEMENT ........ NOT FOUND", delay: 2100 },
  { text: "", delay: 2400 },
  { text: "AUTHENTICATING...", delay: 2600 },
  { text: "USER: INTERN", delay: 2900 },
  { text: "EMPLOYEE STATUS: TEMPORARY", delay: 3100 },
  { text: "ACCESS LEVEL: ████████████████████", delay: 3300 },
  { text: "", delay: 3600 },
  { text: "WARNING:", delay: 3800 },
  { text: "INTERN ACCOUNT SHOULD NOT", delay: 3900 },
  { text: "HAVE ADMINISTRATOR ACCESS.", delay: 4000 },
  { text: "", delay: 4300 },
  { text: "VERIFYING...", delay: 4500 },
  { text: "...", delay: 5200 },
  { text: "ACCESS GRANTED.", delay: 5600 },
  { text: "", delay: 5900 },
  { text: "1 NEW MESSAGE", delay: 6100 },
  { text: "FROM: MANAGER", delay: 6300 },
  { text: "SUBJECT: FIRST DAY", delay: 6500 },
  { text: "", delay: 6800 },
  { text: "«Do not touch anything.»", delay: 7000 },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<typeof BOOT_LINES>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLines(BOOT_LINES);
      setTimeout(onComplete, 500);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(onComplete, 1200);
        }
      }, line.delay);
      timeouts.push(t);
    });

    const blink = setInterval(() => setCursor((c) => !c), 500);
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(blink);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--void)] flex items-center justify-center">
      <div className="max-w-[640px] w-full px-6">
        <div className="font-mono text-[12px] leading-[1.8] text-[var(--bone)]">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${
                line.text.includes("ERROR") || line.text.includes("NOT FOUND")
                  ? "text-[var(--red)]"
                  : line.text.includes("WARNING") || line.text.includes("SHOULD NOT")
                    ? "text-[var(--amber)]"
                    : line.text.includes("ACCESS GRANTED")
                      ? "text-[var(--green)]"
                      : ""
              }`}
            >
              {line.text}
            </div>
          ))}
          {cursor && <span className="animate-blink">█</span>}
        </div>
      </div>
    </div>
  );
}
