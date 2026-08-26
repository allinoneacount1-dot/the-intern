import Link from "next/link";

export default function AssetPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← RETURN TO DESK
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          MCS/87 · ASSET RECORD
        </span>
      </header>

      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            UNKNOWN ASSET DETECTED
          </h1>
          <p className="mono text-[9px] text-[var(--dim)] mt-2">
            ASSET CLASSIFICATION PENDING
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Field label="TICKER" value="$INTERN" large />
          <Field label="ISSUER" value="████████████" redacted />
          <Field label="DEPLOYMENT RECORD" value="NOT FOUND" redacted />
          <Field label="OWNER" value="████████████" redacted />
          <Field label="STATUS" value="TRADING" />
          <Field label="CHAIN" value="ETHEREUM" />
          <Field label="RISK RATING" value="LOL" />
        </div>

        <div className="mt-8 border border-[var(--line)] bg-[var(--ink)] p-5">
          <p className="mono text-[9px] text-[var(--amber)] tracking-[0.2em] mb-3">
            SYSTEM QUERY
          </p>
          <p className="text-[13px] text-[var(--muted)]">
            WHAT IS $INTERN?
          </p>
          <div className="mt-4 border-t border-[var(--line)] pt-4">
            <p className="mono text-[9px] text-[var(--dim)] mb-2">SYSTEM RESPONSE</p>
            <p className="text-[16px] text-[var(--bone)]">
              YOU ARE THE ASSET.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <DisabledButton label="DELETE ASSET" />
          <DisabledButton label="HIDE ASSET" />
          <DisabledButton label="TRANSFER OWNERSHIP" />
          <DisabledButton label="SELL" />
        </div>

        <div className="mt-8 border-t border-[var(--line)] pt-6">
          <p className="text-[12px] text-[var(--muted)] leading-relaxed">
            $INTERN has no deployment record, no creation event, no identifiable
            issuer. It simply <em>appeared</em> one night. THE INTERN did not
            create it. THE OFFICE cannot delete it. Research has no explanation.
            The Terminal says the asset is <strong>the intern himself</strong>.
          </p>
          <p className="mono text-[8px] text-[var(--dim)] mt-4">
            Last updated: 2024-03-16 · Source: THE TERMINAL · Verified: NO
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  redacted,
  large,
}: {
  label: string;
  value: string;
  redacted?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
      <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] shrink-0">
        {label}
      </span>
      <span
        className={`${large ? "text-[20px]" : "text-[13px]"} ${
          redacted ? "mono text-[var(--red)]" : "text-[var(--bone]"
        } text-right`}
      >
        {value}
      </span>
    </div>
  );
}

function DisabledButton({ label }: { label: string }) {
  return (
    <button
      disabled
      className="border border-[var(--line)] bg-[var(--ink)] py-3 mono text-[9px] tracking-[0.15em] text-[var(--dim)] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label} — DISABLED
    </button>
  );
}
