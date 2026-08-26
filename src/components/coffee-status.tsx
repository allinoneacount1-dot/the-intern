"use client";

export function CoffeeStatus({
  level,
  status,
}: {
  level: number;
  status: { label: string; color: string };
}) {
  return (
    <div className="border border-[var(--line)] bg-[var(--ink-2)] p-3">
      <h4 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-3">
        OPERATOR CAFFEINE
      </h4>

      <div className="flex items-center justify-between mb-2">
        <span className="mono text-[9px] text-[var(--muted)]">CUP</span>
        <span className="mono text-[9px] text-[var(--bone)]">{level}%</span>
      </div>

      {/* progress bar */}
      <div className="h-2 bg-[var(--void)] border border-[var(--line)] relative overflow-hidden">
        <div
          className="h-full transition-all duration-1000"
          style={{
            width: `${level}%`,
            background: status.color,
            opacity: 0.6,
          }}
        />
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--line)]">
        <p className="mono text-[8px] text-[var(--dim)]">MARKET STABILITY</p>
        <p
          className="mono text-[9px] mt-1"
          style={{ color: status.color }}
        >
          {status.label}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-[var(--line)]">
        <p className="mono text-[8px] text-[var(--dim)]">THE COFFEE THEORY</p>
        <p className="text-[9px] text-[var(--muted)] mt-1 leading-relaxed">
          Coffee level explains 73% of observed market nonsense.
        </p>
        <p className="mono text-[7px] text-[var(--dim)] mt-1">
          — Research Department
        </p>
      </div>
    </div>
  );
}
