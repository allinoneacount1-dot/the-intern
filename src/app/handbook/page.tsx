import Link from "next/link";
import { HANDBOOK_PAGES } from "@/lib/lore";

export default function HandbookPage() {
  return (
    <main className="min-h-screen bg-[#f5f0e6] text-[#0a0a0c]">
      <header className="border-b border-[#0a0a0c]/20 bg-[#ebe5d9] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[#0a0a0c]/50 hover:text-[#0a0a0c]">← RETURN TO DESK</Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[#0a0a0c]/50">MCS/87 · HANDBOOK</span>
      </header>
      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[#0a0a0c]/20 pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none text-[#0a0a0c]">MARKET OPERATIONS FOR INTERNS</h1>
          <p className="mono text-[9px] text-[#0a0a0c]/40 mt-2">NO AUTHOR · NO DATE · MULTIPLE HANDWRITING STYLES</p>
        </div>
        <div className="mt-8 space-y-0">
          {HANDBOOK_PAGES.map((page) => (
            <div key={page.page} className={`border-b border-[#0a0a0c]/10 py-5 ${page.page === 17 ? "opacity-30" : ""}`}>
              <div className="flex items-baseline gap-4">
                <span className="mono text-[9px] text-[#0a0a0c]/30 w-[50px] shrink-0">PAGE {page.page}</span>
                <p className={`text-[15px] flex-1 ${page.page === 17 ? "mono text-[var(--red)] line-through" : "text-[#0a0a0c]"}`}>{page.text}</p>
                {page.annotation && <span className="mono text-[8px] text-[#0a0a0c]/30 italic max-w-[120px] text-right">{page.annotation}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border border-[var(--red)] bg-[rgba(139,58,58,0.06)] p-5">
          <p className="mono text-[9px] text-[var(--red)] tracking-[0.2em]">NOTICE</p>
          <p className="text-[13px] text-[#0a0a0c]/70 mt-2 leading-relaxed">Page 17 is missing from every known copy of this handbook. References to it exist throughout the archives. Research has been notified. Please stop asking.</p>
        </div>
      </div>
    </main>
  );
}
