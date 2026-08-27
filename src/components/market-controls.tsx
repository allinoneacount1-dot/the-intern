"use client";

import { useState } from "react";

const CONTROLS = [
  { label: "PUMP", hover: "FUNCTION UNKNOWN", color: "var(--green)", width: "1fr" },
  { label: "DUMP", hover: "FUNCTION UNKNOWN", color: "var(--red)", width: "1fr" },
  { label: "PRINT", hover: "NOT THE OFFICE PRINTER", color: "var(--amber)", width: "1fr" },
  { label: "RATES", hover: "CAREFUL", color: "var(--blue)", width: "1fr" },
  { label: "LIQUIDATE", hover: "SURE?", color: "var(--red)", width: "1fr" },
  { label: "REVERSE", hover: "TOO LATE", color: "var(--blue)", width: "1fr" },
  { label: "UNDO", hover: "TRYING", color: "var(--amber)", width: "1fr" },
  { label: "SEND IT", hover: "ABSOLUTELY NOT", color: "var(--green)", width: "1fr" },
  { label: "???", hover: "NOT RECOMMENDED", color: "var(--paper)", width: "1fr" },
];

export function MarketControls() {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const handleClick = (label: string) => {
    if (locked) return;
    if (label === "???") {
      setLocked(true);
      setActiveControl("PERMISSION DENIED — ONLY CURRENT OPERATOR MAY ALTER GLOBAL MARKETS. CURRENT OPERATOR: INTERN");
      setTimeout(() => {
        setActiveControl(null);
        setLocked(false);
      }, 4000);
      return;
    }
    setActiveControl(`PERMISSION DENIED — ${label}`);
    setTimeout(() => setActiveControl(null), 2500);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 lg:gap-3">
        {CONTROLS.map((c) => (
          <button
            key={c.label}
            onClick={() => handleClick(c.label)}
            onMouseEnter={() => !locked && setActiveControl(c.hover)}
            onMouseLeave={() => !locked && setActiveControl(null)}
            disabled={locked}
            className="physical-btn h-16 lg:h-20 flex flex-col items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span
              className="mono text-[10px] lg:text-[11px] tracking-[0.15em]"
              style={{ color: c.color }}
            >
              {c.label}
            </span>
          </button>
        ))}
      </div>

      {/* Status readout bar */}
      <div className="mt-4 min-h-[32px] border border-[var(--line)] bg-[var(--void)] p-3 flex items-center justify-between">
        <span className="mono text-[9px] text-[var(--paper-dim)]">
          {activeControl ?? "AWAITING INPUT…"}
        </span>
        <span className="mono text-[8px] text-[var(--paper-dark)]">
          {locked ? "LOCKED" : "READY"}
        </span>
      </div>
    </div>
  );
}
