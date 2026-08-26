import Link from "next/link";
import { HANDBOOK_PAGES } from "@/lib/lore";

export default function HandbookPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← RETURN TO DESK
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          MCS/87 · HANDBOOK
        </span>
      </header>

      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            THE HANDBOOK
          </h1>
          <p className="mono text-[9px] text-[var(--dim)] mt-2">
            MARKET OPERATIONS FOR INTERNS — NO AUTHOR, NO DATE
          </p>
        </div>

        {/* Handbook pages */}
        <div className="mt-8 space-y-0">
          {HANDBOOK_PAGES.map((page) => (
            <div
              key={page.page}
              className={`border-b border-[var(--line)] py-5 ${
                page.page === 17 ? "opacity-30" : ""
              }`}
            >
              <div className="flex items-baseline gap-4">
                <span className="mono text-[9px] text-[var(--dim)] w-[50px] shrink-0">
                  PAGE {page.page}
                </span>
                <p
                  className={`text-[15px] flex-1 ${
                    page.page === 17
                      ? "mono text-[var(--red)] line-through"
                      : "text-[var(--bone]"
                  }`}
                >
                  {page.text}
                </p>
                {page.annotation && (
                  <span className="mono text-[8px] text-[var(--dim)] italic max-w-[120px] text-right">
                    {page.annotation}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Page 17 mystery callout */}
        <div className="mt-8 border border-[var(--red)] bg-[rgba(139,58,58,0.08)] p-5">
          <p className="mono text-[9px] text-[var(--red)] tracking-[0.2em]">
            NOTICE
          </p>
          <p className="text-[13px] text-[var(--bone-dim)] mt-2 leading-relaxed">
            Page 17 is missing from every known copy of this handbook. References
            to it exist throughout the archives. If you have information regarding
            its contents, please contact Research. Research has been notified.
            Research is looking into it. Please stop asking.
          </p>
        </div>
      </div>
    </main>
  );
}
