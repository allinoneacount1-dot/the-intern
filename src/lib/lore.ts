// LORE CANON — THE INTERN universe
// Source of truth for all in-universe content.
// CORE CANON must not be contradicted by future lore.

export type Incident = {
  id: string;
  number: number;
  date: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "GLOBAL";
  operator: string;
  systemsAffected: string[];
  cause: string;
  resolution: string;
  status: string;
  managerComment: string;
  internComment: string;
};

export const INCIDENTS: Incident[] = [
  {
    id: "INC-00842",
    number: 842,
    date: "2024-03-14 08:43:17",
    title: "PRINTER ACTIVATED",
    severity: "GLOBAL",
    operator: "INTERN",
    systemsAffected: ["GLOBAL MONEY SUPPLY", "OFFICE PRINTER"],
    cause: "Intern attempted to print resume. Pressed PRINT on THE TERMINAL instead.",
    resolution: "Expansion could not be reversed. Classified as monetary event.",
    status: "RESOLVED — UNAVOIDABLE",
    managerComment: "again?",
    internComment: "i thought it was the office printer",
  },
  {
    id: "INC-00843",
    number: 843,
    date: "2024-03-14 11:39:22",
    title: "UNAUTHORIZED DOUBLE CLICK",
    severity: "HIGH",
    operator: "INTERN",
    systemsAffected: ["NASDAQ", "BTC", "ETH"],
    cause: "Double-click on BUY button.",
    resolution: "Markets rallied. Analysts debated for weeks.",
    status: "BLAME MACRO",
    managerComment: "Do not double-click.",
    internComment: "maybe don't put double-click on buy",
  },
  {
    id: "INC-00844",
    number: 844,
    date: "2024-03-14 12:01:03",
    title: "LUNCH CRASH",
    severity: "HIGH",
    operator: "INTERN",
    systemsAffected: ["S&P 500", "GOLD", "OIL"],
    cause: "Operator left without saving session.",
    resolution: "Markets dropped 4.2%. Operator returned. Markets partially recovered.",
    status: "RESOLVED",
    managerComment: "SAVE BEFORE LUNCH.",
    internComment: "i was hungry",
  },
  {
    id: "INC-00845",
    number: 845,
    date: "2024-03-15 09:15:41",
    title: "COFFEE SPILL",
    severity: "GLOBAL",
    operator: "INTERN",
    systemsAffected: ["CORRELATIONS", "ALL MARKETS"],
    cause: "Coffee dropped on keyboard at 9:15 AM.",
    resolution: "Correlations went to one. Compliance removed disclaimer.",
    status: "MONITORED",
    managerComment: "THE COFFEE THEORY CONFIRMED",
    internComment: "it was an accident",
  },
  {
    id: "INC-00846",
    number: 846,
    date: "2024-03-15 14:33:09",
    title: "ROW 341 DELETED",
    severity: "MEDIUM",
    operator: "INTERN",
    systemsAffected: ["UNKNOWN"],
    cause: "Row deleted from spreadsheet final_final_REAL_v7_USE_THIS.xlsx",
    resolution: "Row restored. Markets normalized. Row 341 locked.",
    status: "LOCKED",
    managerComment: "never touch row 341",
    internComment: "what does row 341 do",
  },
  {
    id: "INC-00847",
    number: 847,
    date: "2024-03-16 08:02:55",
    title: "RED PHONE ANSWERED",
    severity: "LOW",
    operator: "INTERN",
    systemsAffected: ["YEN"],
    cause: "Operator answered red phone despite DO NOT ANSWER warning.",
    resolution: "Caller asked operator to 'stop doing that.' Yen reversed.",
    status: "MONITORED",
    managerComment: "We discussed this.",
    internComment: "it rang for a really long time",
  },
  {
    id: "INC-00848",
    number: 848,
    date: "2024-03-16 16:45:12",
    title: "RETAIL REQUEST IGNORED",
    severity: "LOW",
    operator: "INTERN",
    systemsAffected: ["REPUTATION"],
    cause: "Retail requested pump. Operator tried to mute.",
    resolution: "System: RETAIL CANNOT BE MUTED. Operator muted anyway. Did not work.",
    status: "INEVITABLE",
    managerComment: "Stop muting retail.",
    internComment: "they're so loud",
  },
];

export const MANAGER_MESSAGES = [
  { time: "05:42", text: "Please stop moving the bond market." },
  { time: "05:39", text: "Switzerland called again." },
  { time: "05:36", text: "The PRINT button is not connected to the office printer." },
  { time: "05:33", text: "Do not touch Japan today." },
  { time: "05:28", text: "Whatever you did yesterday, undo it." },
  { time: "05:24", text: "Stop testing buttons during FOMC." },
  { time: "05:18", text: "Lunch is not a monetary instrument." },
  { time: "05:12", text: "We discussed this." },
  { time: "05:07", text: "You cannot put GLOBAL LIQUIDITY on your résumé." },
  { time: "04:58", text: "Please stop replying to retail requests." },
  { time: "04:47", text: "THE RAT IS NOT AN APPROVED INDICATOR." },
  { time: "04:33", text: "Why is Bitcoin doing that?" },
];

export const HANDBOOK_PAGES = [
  { page: 1, text: "Never panic.", annotation: "" },
  { page: 2, text: "Markets can smell fear.", annotation: "" },
  { page: 3, text: "Never press both green buttons simultaneously.", annotation: "" },
  { page: 4, text: "Coffee first.", annotation: "handwritten: always" },
  { page: 5, text: "Do not trust a quiet market.", annotation: "" },
  { page: 9, text: "Do not trust a quiet market.", annotation: "different handwriting" },
  { page: 12, text: "Retail is watching.", annotation: "underlined twice" },
  { page: 16, text: "If the rat leaves, leave.", annotation: "stained" },
  { page: 17, text: "[REMOVED]", annotation: "MISSING — see also Page 18" },
  { page: 18, text: "If you are reading this, Page 17 is still missing.", annotation: "" },
  { page: 27, text: "The red phone is not for you.", annotation: "" },
  { page: 34, text: "In the event of complete financial collapse, restart THE TERMINAL.", annotation: "" },
  { page: 52, text: "There is always another shift.", annotation: "different pen" },
  { page: 99, text: "Whatever happens, blame macro.", annotation: "final page" },
];

export const ARCHIVE_RECORDS = [
  {
    year: "1987",
    title: "OPERATOR LOG",
    operator: "INTERN #03",
    status: "TRANSFERRED",
    note: "DO NOT PRESS SELL TWICE.",
    details: "Last operator before THE SHIFT was formalized. Log ends mid-sentence on October 19.",
  },
  {
    year: "1998",
    title: "OPERATOR LOG",
    operator: "INTERN #05",
    status: "TRANSFERRED",
    note: "LEVERAGE ISSUE.",
    details: "Three buttons labeled LEVERAGE. Only one was real. Operator pressed the real one.",
  },
  {
    year: "2000",
    title: "OPERATOR LOG",
    operator: "INTERN #06",
    status: "UNKNOWN",
    note: "TOO MANY DOTS.",
    details: "Refers to dot-com bubble. Final entry: 'everything is dots now.'",
  },
  {
    year: "2008",
    title: "OPERATOR LOG",
    operator: "INTERN #08",
    status: "MISSING",
    note: "DON'T TOUCH LEHMAN.",
    details: "Last known operator before THE INTERN. Employee badge found under desk. Mug reads: WORLD'S OKAYEST INTERN — 2008.",
  },
  {
    year: "2020",
    title: "OPERATOR LOG",
    operator: "INTERN #09",
    status: "REMOTE",
    note: "THIS IS NOT A DRILL.",
    details: "Pandemic remote operation. System adapted. Operator notes: 'the desk still knows i'm here.'",
  },
  {
    year: "CURRENT",
    title: "OPERATOR LOG",
    operator: "THE INTERN",
    status: "ACTIVE",
    note: "DAY 1 — ONGOING",
    details: "Current operator. Status: TEMPORARY. Access: SOMEHOW ALL. Coffee: 81%.",
  },
];

export const INTERN_NOTES = [
  { day: 1, text: "don't touch red things" },
  { day: 4, text: "PRINT ≠ printer" },
  { day: 11, text: "japan apparently important" },
  { day: 23, text: "rat maybe knows something" },
  { day: 41, text: "save before lunch" },
  { day: 72, text: "manager still weird" },
  { day: 119, text: "find page 17" },
  { day: 241, text: "who was #08" },
  { day: 365, text: "still intern" },
  { day: 412, text: "desk doesn't let me leave" },
  { day: 445, text: "$INTERN still trading" },
  { day: 467, text: "someone was here before me" },
  { day: 500, text: "someone will be here after me" },
];

export const COFFEE_LEVELS = [
  { level: 100, label: "MARKETS CALM", color: "var(--green)" },
  { level: 75, label: "MOMENTUM INCREASES", color: "var(--green)" },
  { level: 50, label: "VOLATILITY RISING", color: "var(--amber)" },
  { level: 25, label: "RISK MANAGEMENT NERVOUS", color: "var(--amber)" },
  { level: 10, label: "FEAR SPREADS", color: "var(--red)" },
  { level: 0, label: "GLOBAL RISK ELEVATED", color: "var(--red)" },
];
