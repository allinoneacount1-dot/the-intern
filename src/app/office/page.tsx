import Link from "next/link";

const DEPARTMENTS = [
  { name: "DEPARTMENT OF NUMBER GOING UP", head: "UNKNOWN", status: "OPERATIONAL" },
  { name: "DEPARTMENT OF NUMBER GOING DOWN", head: "UNKNOWN", status: "OPERATIONAL" },
  { name: "GLOBAL LIQUIDITY", head: "THE INTERN", status: "CONCERNING" },
  { name: "MACRO", head: "MAYBE", status: "VACANT" },
  { name: "RISK MANAGEMENT", head: "NOT FOUND", status: "UNDERSTAFFED" },
  { name: "RESEARCH", head: "PROBABLY BULLISH", status: "CAUTIOUSLY OPTIMISTIC" },
  { name: "COMPLIANCE", head: "FORMAL", status: "BROKEN PRINTER" },
  { name: "ACCOUNTING", head: "BUREAUCRATIC", status: "PROCESSING" },
  { name: "OPERATIONS", head: "THE INTERN", status: "DESK OCCUPIED" },
  { name: "HUMAN RESOURCES", head: "DENIAL", status: "NO RECORD FOUND" },
  { name: "IT", head: "FATALISM", status: "COMPATIBILITY" },
  { name: "INTERNATIONAL", head: "UNKNOWN", status: "JAPAN CALLED" },
  { name: "OTHER", head: "—", status: "NOBODY WORKS HERE" },
];

export default function OfficePage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← RETURN TO DESK
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          MCS/87 · DIRECTORY
        </span>
      </header>

      <div className="mx-auto max-w-[1000px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            OFFICE DIRECTORY
          </h1>
          <p className="mono text-[9px] text-[var(--dim)] mt-2">
            TOTAL EMPLOYEES: UNKNOWN
          </p>
        </div>

        <div className="mt-8 border border-[var(--line)]">
          {DEPARTMENTS.map((dept, i) => (
            <div
              key={dept.name}
              className={`flex items-center justify-between px-4 py-3 ${
                i < DEPARTMENTS.length - 1 ? "border-b border-[var(--line)]" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-[var(--bone)]">{dept.name}</p>
                <p className="mono text-[8px] text-[var(--dim)] mt-0.5">
                  HEAD: {dept.head}
                </p>
              </div>
              <span className="mono text-[8px] text-[var(--muted)] shrink-0 ml-4">
                {dept.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="mono text-[9px] text-[var(--dim)]">
            TO CLOCK IN, CONNECT YOUR WALLET
          </p>
          <p className="mono text-[8px] text-[var(--dim)] mt-2">
            Employment status cannot be guaranteed.
          </p>
        </div>
      </div>
    </main>
  );
}
