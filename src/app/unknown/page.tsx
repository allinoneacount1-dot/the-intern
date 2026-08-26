import Link from "next/link";

export default function UnknownPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-[500px] px-6">
        <div className="mono text-[9px] text-[var(--dim)] tracking-[0.3em] mb-8">
          AUTH REQUESTED…
        </div>
        <h1 className="font-condensed text-[48px] lg:text-[64px] tracking-[-0.02em] leading-none">
          ACCESS DENIED
        </h1>
        <p className="mt-6 text-[14px] text-[var(--muted)] leading-relaxed">
          This function has been permanently restricted by MANAGEMENT.
          Any further attempts will be logged.
        </p>
        <div className="mt-8 space-y-3">
          <p className="mono text-[9px] text-[var(--red)]">
            REQUEST LOGGED · MANAGER NOTIFIED
          </p>
          <p className="mono text-[9px] text-[var(--dim)]">
            YOUR IP HAS BEEN FLAGGED IN HR
          </p>
        </div>
        <Link
          href="/"
          className="inline-block mt-10 mono text-[9px] tracking-[0.2em] px-6 py-3 border border-[var(--line)] hover:border-[var(--bone)] transition-colors"
        >
          ← GO BACK TO WORK
        </Link>
      </div>
    </main>
  );
}
