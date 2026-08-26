"use client";

import { useEffect, useState } from "react";

export function StatusRail({
  incidentCount,
  coffeeLevel,
}: {
  incidentCount: number;
  coffeeLevel: number;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="border-b border-[var(--line)] bg-[var(--ink)] px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--bone)]">
          MCS/87
        </span>
        <span className="mono text-[9px] tracking-[0.15em] text-[var(--dim)] hidden sm:inline">
          GLOBAL MARKET OPERATIONS
        </span>
      </div>
      <div className="flex items-center gap-6 mono text-[9px] tracking-wider">
        <StatusItem label="STATUS" value="LIVE" tone="green" />
        <StatusItem label="SHIFT" value="ONGOING" />
        <StatusItem label="OPERATOR" value="INTERN" />
        <StatusItem label="DESK" value="OCCUPIED" />
        <StatusItem label="INCIDENTS" value={String(incidentCount)} />
        <StatusItem label="COFFEE" value={`${coffeeLevel}%`} tone={coffeeLevel < 25 ? "red" : coffeeLevel < 50 ? "amber" : "green"} />
        <span className="mono text-[9px] text-[var(--dim)] tabular-nums w-[60px] text-right">
          {time}
        </span>
      </div>
    </div>
  );
}

function StatusItem({
  label,
  value,
  tone = "dim",
}: {
  label: string;
  value: string;
  tone?: "dim" | "green" | "amber" | "red";
}) {
  const color =
    tone === "green"
      ? "var(--green)"
      : tone === "amber"
        ? "var(--amber)"
        : tone === "red"
          ? "var(--red)"
          : "var(--dim)";
  return (
    <span className="hidden md:flex items-center gap-1.5">
      <span style={{ color: "var(--dim)" }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </span>
  );
}
