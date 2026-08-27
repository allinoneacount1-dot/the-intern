"use client";

import Link from "next/link";
import { INCIDENTS, MANAGER_MESSAGES, COFFEE_LEVELS } from "@/lib/lore";
import { StatusRail } from "@/components/status-rail";
import { MarketControls } from "@/components/market-controls";
import { ManagerInbox } from "@/components/manager-inbox";
import { CoffeeStatus } from "@/components/coffee-status";

const COFFEE_LEVEL = 81;

export default function DeskPage() {
  const coffeeStatus =
    COFFEE_LEVELS.find((c) => COFFEE_LEVEL >= c.level) ?? COFFEE_LEVELS[COFFEE_LEVELS.length - 1];

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <StatusRail incidentCount={INCIDENTS.length} coffeeLevel={COFFEE_LEVEL} />
      <div className="flex-1 grid grid-cols-[220px_1fr_260px] lg:grid-cols-[260px_1fr_300px] border-t border-[var(--line)] min-h-0">
        <nav className="border-r border-[var(--line)] p-4 overflow-y-auto hidden md:block">
          <div className="space-y-6">
            <div>
              <NavHeading>OPERATIONS</NavHeading>
              <NavItem href="/" label="THE DESK" active />
              <NavItem href="/incidents" label="MARKET LOG" badge={INCIDENTS.length} />
            </div>
            <div>
              <NavHeading>RECORDS</NavHeading>
              <NavItem href="/incidents" label="INCIDENTS" />
              <NavItem href="/archives" label="ARCHIVES" />
              <NavItem href="/handbook" label="HANDBOOK" />
            </div>
            <div>
              <NavHeading>PERSONNEL</NavHeading>
              <NavItem href="/employee" label="EMPLOYEE FILE" />
              <NavItem href="/office" label="DIRECTORY" />
            </div>
            <div>
              <NavHeading>SYSTEM</NavHeading>
              <NavItem href="/asset" label="ASSET" />
              <NavItem href="/comms" label="COMMS" />
              <NavItem href="/unknown" label="???" />
            </div>
          </div>
        </nav>
        <div className="p-4 lg:p-6 overflow-y-auto">
          <div className="border border-[var(--line)] bg-[var(--ink)] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-condensed text-[28px] lg:text-[36px] tracking-[-0.02em] leading-none">
                  MARKET CONTROL
                </h2>
                <p className="mono text-[9px] text-[var(--paper-dark)] mt-2">
                  TERMINAL 01 · DESK 01 · OPERATIONS
                </p>
              </div>
              <div className="mono text-[9px] text-[var(--paper-dark)] text-right">
                <div>STATUS: LIVE</div>
                <div>SHIFT: ONGOING</div>
              </div>
            </div>
            <MarketControls />
          </div>
          <div className="mt-4 border border-[var(--line)] bg-[var(--ink)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="mono text-[9px] text-[var(--paper-dark)]">LATEST INCIDENT</span>
                <span className="mono text-[11px] text-[var(--paper)]">
                  {INCIDENTS[INCIDENTS.length - 1].id}
                </span>
              </div>
              <span className="mono text-[9px] text-[var(--red)]">
                {INCIDENTS[INCIDENTS.length - 1].title}
              </span>
            </div>
          </div>
        </div>
        <aside className="border-l border-[var(--line)] p-4 space-y-4 overflow-y-auto hidden lg:block">
          <CoffeeStatus level={COFFEE_LEVEL} status={coffeeStatus} />
          <ManagerInbox messages={MANAGER_MESSAGES.slice(0, 5)} />
        </aside>
      </div>
      <div className="md:hidden border-t border-[var(--line)] flex">
        <MobileNavItem href="/" label="DESK" active />
        <MobileNavItem href="/incidents" label="LOG" />
        <MobileNavItem href="/asset" label="ASSET" />
        <MobileNavItem href="/unknown" label="???" />
      </div>
    </main>
  );
}

function NavHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mono text-[9px] tracking-[0.2em] text-[var(--paper-dark)] mb-2">
      {children}
    </h3>
  );
}

function NavItem({
  href,
  label,
  active,
  badge,
}: {
  href: string;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-2 py-1.5 text-[11px] mono tracking-wider transition-colors ${
        active ? "text-[var(--paper)]" : "text-[var(--paper-muted)] hover:text-[var(--paper)]"
      }`}
    >
      <span>{label}</span>
      {badge !== undefined && (
        <span className="mono text-[8px] text-[var(--paper-dark)]">{badge}</span>
      )}
    </Link>
  );
}

function MobileNavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex-1 text-center py-3 mono text-[9px] tracking-[0.15em] transition-colors ${
        active ? "text-[var(--paper)]" : "text-[var(--paper-dark)]"
      }`}
    >
      {label}
    </Link>
  );
}
