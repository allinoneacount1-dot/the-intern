import Link from "next/link";
import { INCIDENTS } from "@/lib/lore";

export default function IncidentsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-[1200px] px-4 lg:px-8 py-8">
        <PageHead
          title="INCIDENT REPORTS"
          subtitle="MARKET OPERATIONS — FULL LOG"
        />

        <div className="mt-8 space-y-3">
          {[...INCIDENTS].reverse().map((inc) => (
            <Link
              key={inc.id}
              href={`/incidents/${inc.id}`}
              className="block border border-[var(--line)] hover:border-[var(--line-strong)] bg-[var(--ink)] p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="mono text-[9px] text-[var(--dim)]">{inc.id}</span>
                    <span
                      className="mono text-[8px] px-1.5 py-0.5"
                      style={{
                        color: severityColor(inc.severity),
                        border: `1px solid ${severityColor(inc.severity)}`,
                      }}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <h3 className="text-[15px] mt-1.5">{inc.title}</h3>
                  <p className="mono text-[9px] text-[var(--dim)] mt-1">{inc.date}</p>
                </div>
                <span className="mono text-[9px] text-[var(--muted)] shrink-0">
                  {inc.systemsAffected.join(" · ")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function severityColor(severity: string) {
  if (severity === "GLOBAL") return "var(--red)";
  if (severity === "HIGH") return "var(--amber)";
  if (severity === "MEDIUM") return "var(--blue)";
  return "var(--dim)";
}

function Header() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
      <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
        ← RETURN TO DESK
      </Link>
      <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
        MCS/87 · RECORDS
      </span>
    </header>
  );
}

function PageHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-[var(--line)] pb-4">
      <h1 className="font-condensed text-[32px] lg:text-[44px] tracking-[-0.02em] leading-none">{title}</h1>
      <p className="mono text-[9px] text-[var(--dim)] mt-2">{subtitle}</p>
    </div>
  );
}
