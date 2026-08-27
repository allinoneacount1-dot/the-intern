import Link from "next/link";

export default function EmployeePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--paper-dark)] hover:text-[var(--paper)]">← RETURN TO DESK</Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--paper-dark)]">MCS/87 · PERSONNEL</span>
      </header>
      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">EMPLOYEE FILE</h1>
          <p className="mono text-[9px] text-[var(--paper-dark)] mt-2">PERSONNEL RECORD — CONFIDENTIAL</p>
        </div>
        <div className="mt-8 border border-[var(--line)] bg-[var(--ink)] p-8 text-center">
          <div className="inline-block border-2 border-[var(--line-strong)] p-6 bg-[#1a1a1e]">
            <p className="mono text-[9px] tracking-[0.3em] text-[var(--paper-dark)] mb-3">MARKETS EMPLOYEE</p>
            <div className="w-20 h-24 bg-[var(--ink-2)] mx-auto mb-3 border border-[var(--line)] flex items-center justify-center"><span className="mono text-[30px] text-[var(--paper-dark)]">?</span></div>
            <p className="text-[18px] font-medium tracking-[-0.02em]">████████████</p>
            <p className="mono text-[9px] text-[var(--paper-muted)] mt-1">KNOWN AS: THE INTERN</p>
            <p className="mono text-[8px] text-[var(--paper-dark)] mt-3">ID: ████████</p>
          </div>
        </div>
        <div className="mt-8 space-y-5">
          <Field label="POSITION" value="INTERN" /><Field label="TENURE" value="CONCERNING" /><Field label="STATUS" value="TEMPORARY — PENDING REVIEW" /><Field label="SECURITY CLEARANCE" value="SOMEHOW ALL" /><Field label="DEPARTMENT" value="OPERATIONS / UNASSIGNED" />
          <div className="border-t border-[var(--line)] pt-6 mt-6"><p className="mono text-[9px] tracking-[0.2em] text-[var(--paper-dark)] mb-4">PERFORMANCE METRICS</p>
            <div className="space-y-3"><Metric label="Coffee preparation" value="B+" /><Metric label="Excel proficiency" value="C-" /><Metric label="Market operations" value="???" /><Metric label="Incidents caused" value="47" /><Metric label="Salary adjustment" value="DENIED" /></div>
          </div>
        </div>
      </div>
    </main>
  );
}
function Field({ label, value }: { label: string; value: string }) { return (<div className="flex items-start justify-between gap-4"><span className="mono text-[9px] tracking-[0.2em] text-[var(--paper-dark)] shrink-0">{label}</span><span className="text-[14px] text-[var(--paper)] text-right">{value}</span></div>); }
function Metric({ label, value }: { label: string; value: string }) { return (<div className="flex items-center justify-between"><span className="mono text-[10px] text-[var(--paper-muted)]">{label}</span><span className="mono text-[10px] text-[var(--paper)]">{value}</span></div>); }
