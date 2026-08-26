import Link from "next/link";
import { ARCHIVE_RECORDS, INTERN_NOTES } from "@/lib/lore";

export default function ArchivesPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← RETURN TO DESK
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          MCS/87 · ARCHIVES
        </span>
      </header>

      <div className="mx-auto max-w-[1000px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            ARCHIVES
          </h1>
          <p className="mono text-[9px] text-[var(--dim)] mt-2">MARKET OPERATIONS ARCHIVE — CLASSIFIED</p>
        </div>

        {/* THE SHIFT quote */}
        <div className="my-8 border-l-2 border-[var(--bone)] pl-6">
          <p className="font-condensed text-[24px] lg:text-[32px] tracking-[-0.02em] leading-tight">
            SOMEONE ALWAYS SITS AT THE DESK.
          </p>
          <p className="mono text-[8px] text-[var(--dim)] mt-2">source: unknown operator</p>
        </div>

        {/* Archive records */}
        <div className="mt-8 space-y-4">
          {ARCHIVE_RECORDS.map((rec) => (
            <div
              key={rec.year}
              className="border border-[var(--line)] bg-[var(--ink)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="mono text-[11px] text-[var(--bone)]">{rec.year}</span>
                    <span
                      className="mono text-[8px] px-1.5 py-0.5"
                      style={{
                        color: statusColor(rec.status),
                        border: `1px solid ${statusColor(rec.status)}`,
                      }}
                    >
                      {rec.status}
                    </span>
                  </div>
                  <h3 className="text-[16px] mt-1.5">{rec.title}</h3>
                  <p className="mono text-[9px] text-[var(--muted)] mt-1">
                    OPERATOR: {rec.operator}
                  </p>
                </div>
                <span className="mono text-[8px] text-[var(--red)] shrink-0 max-w-[200px] text-right">
                  {rec.note}
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--muted)] mt-3 leading-relaxed">
                {rec.details}
              </p>
            </div>
          ))}
        </div>

        {/* Intern notes */}
        <div className="mt-12 border-t border-[var(--line)] pt-8">
          <h2 className="font-condensed text-[24px] tracking-[-0.02em] mb-6">
            PERSONAL NOTEBOOK
          </h2>
          <div className="grid gap-2">
            {INTERN_NOTES.map((note) => (
              <div key={note.day} className="flex items-start gap-3 border-b border-[var(--line)] pb-2">
                <span className="mono text-[8px] text-[var(--dim)] shrink-0 w-[60px]">
                  DAY {note.day}
                </span>
                <span className="text-[12px] text-[var(--muted)]">{note.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function statusColor(status: string) {
  if (status === "MISSING" || status === "ACTIVE") return "var(--red)";
  if (status === "TRANSFERRED" || status === "REMOTE") return "var(--amber)";
  if (status === "UNKNOWN") return "var(--blue)";
  return "var(--dim)";
}
