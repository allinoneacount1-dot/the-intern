import Link from "next/link";
import { notFound } from "next/navigation";
import { INCIDENTS } from "@/lib/lore";

export default function IncidentDetail({ params }: { params: { id: string } }) {
  const incident = INCIDENTS.find((i) => i.id === params.id);
  if (!incident) notFound();

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[var(--ink)] px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/incidents" className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] hover:text-[var(--bone)]">
          ← BACK TO LOG
        </Link>
        <span className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">
          {incident.id}
        </span>
      </header>

      <div className="mx-auto max-w-[800px] px-4 lg:px-8 py-8">
        <div className="border-b border-[var(--line)] pb-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="mono text-[9px] px-2 py-1"
              style={{
                color: severityColor(incident.severity),
                border: `1px solid ${severityColor(incident.severity)}`,
              }}
            >
              {incident.severity}
            </span>
            <span className="mono text-[9px] text-[var(--dim)]">{incident.date}</span>
          </div>
          <h1 className="font-condensed text-[36px] lg:text-[48px] tracking-[-0.02em] leading-none">
            {incident.title}
          </h1>
        </div>

        <div className="mt-8 space-y-6">
          <Field label="INCIDENT ID" value={incident.id} />
          <Field label="OPERATOR" value={incident.operator} />
          <Field label="SYSTEMS AFFECTED" value={incident.systemsAffected.join(", ")} />
          <Field label="ROOT CAUSE" value={incident.cause} />
          <Field label="RESOLUTION" value={incident.resolution} />
          <Field label="STATUS" value={incident.status} />

          <div className="border-t border-[var(--line)] pt-6 space-y-4">
            <Comment label="MANAGER" text={incident.managerComment} />
            <Comment label="INTERN" text={incident.internComment} />
          </div>
        </div>
      </div>
    </main>
  );
}

function severityColor(severity: string) {
  if (severity === "GLOBAL") return "var(--red)";
  if (severity === "HIGH") return "var(--amber)";
  if (severity === "MEDIUM") return "var(--blue)";
  return "var(--dim)";
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">{label}</p>
      <p className="text-[14px] text-[var(--bone)] mt-1">{value}</p>
    </div>
  );
}

function Comment({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-2 border-[var(--dim)] pl-4">
      <p className="mono text-[9px] tracking-[0.2em] text-[var(--dim)]">{label}</p>
      <p className="text-[13px] text-[var(--bone-dim)] mt-1">{text}</p>
    </div>
  );
}
