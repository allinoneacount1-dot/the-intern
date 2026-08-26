"use client";

import { useState, useEffect } from "react";

export function ManagerInbox({ messages }: { messages: { time: string; text: string }[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => (v < messages.length ? v + 1 : v));
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="border border-[var(--line)] bg-[var(--ink-2)] p-3">
      <h4 className="mono text-[9px] tracking-[0.2em] text-[var(--dim)] mb-3">
        MANAGER INBOX
      </h4>
      <div className="space-y-2">
        {messages.slice(0, visible).map((msg, i) => (
          <div key={i} className="border-l border-[var(--dim)] pl-2">
            <span className="mono text-[8px] text-[var(--dim)]">{msg.time}</span>
            <p className="mono text-[10px] text-[var(--bone-dim)] mt-0.5">{msg.text}</p>
          </div>
        ))}
        {visible < messages.length && (
          <div className="mono text-[8px] text-[var(--dim)] animate-blink">▌</div>
        )}
      </div>
    </div>
  );
}
