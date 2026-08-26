"use client";

import { useState } from "react";

const CONTROLS = [
  { label: "PUMP", hover: "FUNCTION UNKNOWN", color: "var(--green)" },
  { label: "DUMP", hover: "FUNCTION UNKNOWN", color: "var(--red)" },
  { label: "PRINT", hover: "NOT THE OFFICE PRINTER", color: "var(--amber)" },
  { label: "RATES", hover: "CAREFUL", color: "var(--blue)" },
  { label: "LIQUIDATE", hover: "SURE?", color: "var(--red)" },
  { label: "REVERSE", hover: "TOO LATE", color: "var(--blue)" },
  { label: "UNDO", hover: "TRYING", color: "var(--amber)" },
  { label: "SEND IT", hover: "ABSOLUTELY NOT", color: "var(--green)" },
  { label: "???", hover: "NOT RECOMMENDED", color: "var(--bone)" },
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
            onMouseEnter={() => setActiveControl(c.hover)}
            onMouseLeave={() => setActiveControl(null)}
            disabled={locked}
            className="group relative h-16 lg:h-20 border border-[var(--line)] bg-[var(--ink-2)] hover:border-[var(--line-strong)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <span
              className="mono text-[10px] lg:text-[11px] tracking-[0.15em]"
              style={{ color: c.color }}
            >
              {c.label}
            </span>
            <span className="absolute inset-x-0 bottom-1.5 mono text-[7px] text-[var(--dim)] opacity-0 group-hover:opacity-100 transition-opacity">
              {c.hover}
            </span>
          </button>
        ))}
      </div>

      {/* status readout */}
      <div className="mt-4 min-h-[32px] border border-[var(--line)] bg-[var(--void)] p-3 flex items-center justify-between">
        <span className="mono text-[9px] text-[var(--dim)]">
          {activeControl ?? "AWAITING INPUT…"}
        </span>
        <span className="mono text-[8px] text-[var(--dim)]">
          {locked ? "LOCKED" : "READY"}
        </span>
      </div>
    </div>
  );
}
