import Link from "next/link";

const COMMS = [
  { source: "MANAGER", time: "05:42", text: "Please stop moving the bond market." },
  { source: "MANAGER", time: "05:39", text: "Switzerland called again." },
  { source: "MANAGER", time: "05:36", text: "The PRINT button is not connected to the office printer." },
  { source: "HR", time: "09:14", text: "We are unable to locate an employee under that name." },
  { source: "RESEARCH", time: "10:33", text: "PROBABLY BULLISH." },
  { source: "IT", time: "11:02", text: "Have you tried turning the economy off and on again?" },
  { source: "COMPLIANCE", time: "14:27", text: "Correlation does not imply causation." },
  { source: "MANAGER", time: "15:44", text: "Do not touch Japan today." },
  { source: "MANAGER", time: "16:01", text: "Whatever you did yesterday, undo it." },
  { source: "HR", time: "17:30", text: "Your employee record cannot be found. Please contact your manager." },
];

export default function CommsPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← RETURN TO DESK
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          MCS/87 · COMMS
        </span>
      </header>

      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            OFFICE COMMUNICATIONS
          </h1>
          <p className="mono text-[9px] text-[var(--dim)] mt-2">
            ALL CHANNELS · DECRYPTED
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {COMMS.map((msg, i) => (
            <div key={i} className="border border-[var(--line)] bg-[var(--ink)] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="mono text-[9px] tracking-[0.2em] text-[var(--bone)]">
                  {msg.source}
                </span>
                <span className="mono text-[8px] text-[var(--dim)]">{msg.time}</span>
              </div>
              <p className="text-[13px] text-[var(--bone-dim)]">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
