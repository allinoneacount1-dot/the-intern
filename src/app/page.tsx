"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { INCIDENTS, MANAGER_MESSAGES, COFFEE_LEVELS } from "@/lib/lore";
import { StatusRail } from "@/components/status-rail";
import { MarketControls } from "@/components/market-controls";
import { ManagerInbox } from "@/components/manager-inbox";
import { CoffeeStatus } from "@/components/coffee-status";
import { gsap } from "gsap";

export default function DeskPage() {
  const [loaded, setLoaded] = useState(false);
  const [incidentCount, setIncidentCount] = useState(0);
  const [coffeeLevel, setCoffeeLevel] = useState(81);

  useEffect(() => {
    setLoaded(true);
    setIncidentCount(INCIDENTS.length);
  }, []);

  const coffeeStatus =
    COFFEE_LEVELS.find((c) => coffeeLevel >= c.level) ?? COFFEE_LEVELS[COFFEE_LEVELS.length - 1];

  return (
    <main className="min-h-screen flex flex-col">
      {/* TOP STATUS RAIL */}
      <StatusRail incidentCount={incidentCount} coffeeLevel={coffeeLevel} />

      {/* MAIN GRID */}
      <div className="flex-1 grid grid-cols-[200px_1fr_240px] lg:grid-cols-[240px_1fr_280px] border-t border-[var(--line)]">
        {/* LEFT NAVIGATION */}
        <nav className="border-r border-[var(--line)] p-4 hidden md:block">
          <div className="space-y-6">
            <div>
              <h3 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-2">OPERATIONS</h3>
              <NavItem href="/desk" label="THE DESK" active />
              <NavItem href="/incidents" label="MARKET LOG" badge={incidentCount} />
            </div>
            <div>
              <h3 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-2">RECORDS</h3>
              <NavItem href="/incidents" label="INCIDENTS" />
              <NavItem href="/archives" label="ARCHIVES" />
              <NavItem href="/handbook" label="HANDBOOK" />
            </div>
            <div>
              <h3 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-2">PERSONNEL</h3>
              <NavItem href="/employee" label="EMPLOYEE FILE" />
              <NavItem href="/office" label="DIRECTORY" />
            </div>
            <div>
              <h3 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-2">SYSTEM</h3>
              <NavItem href="/asset" label="ASSET" />
              <NavItem href="/comms" label="COMMS" />
              <NavItem href="/unknown" label="???" />
            </div>
          </div>
        </nav>

        {/* CENTER — MARKET CONTROL PANEL */}
        <div className="p-4 lg:p-6">
          <div className="border border-[var(--line)] rounded-sm bg-[var(--ink)] p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-condensed text-[28px] lg:text-[36px] tracking-[-0.02em] leading-none">
                  MARKET CONTROL
                </h2>
                <p className="mono text-[9px] text-[var(--dim)] mt-2">
                  TERMINAL 01 — DESK 01 — OPERATIONS
                </p>
              </div>
              <div className="mono text-[9px] text-[var(--dim)] text-right">
                <div>STATUS: LIVE</div>
                <div>SHIFT: ONGOING</div>
              </div>
            </div>

            <MarketControls />
          </div>

          {/* INCIDENT STRIP */}
          <div className="mt-4 border border-[var(--line)] rounded-sm bg-[var(--ink)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="mono text-[9px] text-[var(--dim)]">LATEST INCIDENT</span>
                <span className="mono text-[11px] text-[var(--bone)]">
                  {INCIDENTS[INCIDENTS.length - 1].id}
                </span>
              </div>
              <span className="mono text-[9px] text-[var(--red)]">
                {INCIDENTS[INCIDENTS.length - 1].title}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — CONTEXT PANEL */}
        <aside className="border-l border-[var(--line)] p-4 space-y-4 hidden lg:block">
          <CoffeeStatus level={coffeeLevel} status={coffeeStatus} />
          <ManagerInbox messages={MANAGER_MESSAGES.slice(0, 5)} />
        </aside>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden border-t border-[var(--line)] flex">
        <MobileNavItem href="/desk" label="DESK" active />
        <MobileNavItem href="/incidents" label="LOG" />
        <MobileNavItem href="/asset" label="ASSET" />
        <MobileNavItem href="/unknown" label="???" />
      </div>
    </main>
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
        active ? "text-[var(--bone)]" : "text-[var(--muted)] hover:text-[var(--bone)]"
      }`}
    >
      <span>{label}</span>
      {badge !== undefined && (
        <span className="mono text-[8px] text-[var(--dim)]">{badge}</span>
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
        active ? "text-[var(--bone)]" : "text-[var(--dim)]"
      }`}
    >
      {label}
    </Link>
  );
}
