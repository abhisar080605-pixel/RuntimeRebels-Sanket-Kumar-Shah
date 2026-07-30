import React from "react";
import { Check, X, Lock, AlertTriangle } from "lucide-react";
import { C } from "../theme";

export function Stepper({ stages, labels, current, deniedLabel }) {
  if (deniedLabel) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.red }}>
        <X size={13} aria-hidden="true" /> {deniedLabel}
      </div>
    );
  }
  const idx = Math.max(0, stages.indexOf(current));
  return (
    <div className="flex items-center">
      {labels.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: i <= idx ? C.accent : C.border,
              }}
            >
              {i < idx && <Check size={10} color="#fff" aria-hidden="true" />}
              {i === idx && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#fff" }} />}
            </div>
            <span
              className="text-[11px] font-semibold whitespace-nowrap"
              style={{ color: i <= idx ? C.ink : C.inkSoft }}
            >
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className="w-6 h-px mx-1.5" style={{ background: i < idx ? C.accent : C.border }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* Deterministic QR-style gate pass. This renders a QR-look pattern seeded
   from the pass id so the same visitor always gets the same pattern.
   For the hackathon prototype this is a visual stand-in for a real gate
   pass; in production this would encode an actual signed token that
   security's scanner reads and verifies against the backend. */
function seededBits(seed, count) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const bits = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    bits.push((h >> 16) & 1);
  }
  return bits;
}

export function QRPass({ seed, size = 132 }) {
  const grid = 21;
  const cell = size / grid;
  const bits = seededBits(seed, grid * grid);
  const finderAt = (r, c, br, bc) => {
    const rr = r - br, cc = c - bc;
    const onOuter = rr === 0 || rr === 6 || cc === 0 || cc === 6;
    const onInner = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
    return onOuter || onInner;
  };
  const cells = [];
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      let on;
      if (r < 7 && c < 7) on = finderAt(r, c, 0, 0);
      else if (r < 7 && c >= grid - 7) on = finderAt(r, c, 0, grid - 7);
      else if (r >= grid - 7 && c < 7) on = finderAt(r, c, grid - 7, 0);
      else on = bits[r * grid + c] === 1;
      if (on) cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#1F2430" />);
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "#fff", borderRadius: 8, border: `1px solid ${C.border}` }}>
      {cells}
    </svg>
  );
}

export function Row({ children }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-lg border"
      style={{ borderColor: C.border, background: C.surface }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ icon: Icon, children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon size={15} style={{ color: C.ink }} aria-hidden="true" />
        <h3 className="text-sm font-bold" style={{ color: C.ink }}>{children}</h3>
      </div>
      {action}
    </div>
  );
}

export function PrivacyNote({ text }) {
  return (
    <div
      className="flex items-start gap-2 text-xs rounded-lg px-3.5 py-2.5 mb-5 border"
      style={{ background: C.accentSoft, borderColor: C.border, color: C.ink }}
    >
      <Lock size={13} className="mt-0.5 shrink-0" style={{ color: C.accent }} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="text-sm py-8 text-center rounded-lg border border-dashed" style={{ color: C.inkSoft, borderColor: C.border }}>
      {text}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border p-4 flex items-center gap-3" style={{ borderColor: C.border, background: C.surface }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.accentSoft }}>
        <Icon size={16} style={{ color: C.accent }} aria-hidden="true" />
      </div>
      <div>
        <div className="text-xl font-black" style={{ color: C.ink }}>{value}</div>
        <div className="text-[11px] font-semibold" style={{ color: C.inkSoft }}>{label}</div>
      </div>
    </div>
  );
}

export function ActionBtn({ onClick, label, primary, danger }) {
  const bg = danger ? C.red : primary ? C.accent : C.bg;
  const fg = primary || danger ? "#fff" : C.ink;
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] font-bold px-3 py-1.5 rounded-md border"
      style={{ background: bg, color: fg, borderColor: primary || danger ? bg : C.border }}
    >
      {label}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: C.inkSoft }}>{label}</span>
      {children}
    </label>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-black" style={{ color: C.ink }}>{title}</h2>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: C.inkSoft }}>{subtitle}</p>}
    </div>
  );
}

export function NoticesFeed({ notices }) {
  return (
    <div className="space-y-2">
      {notices.length === 0 && <EmptyState text="No notices yet." />}
      {notices.map((n) => (
        <div key={n.id} className="rounded-lg border p-4" style={{ borderColor: n.urgent ? C.red : C.border, background: C.surface }}>
          <div className="flex items-center justify-between mb-1">
            <div className="font-bold text-sm flex items-center gap-2" style={{ color: C.ink }}>
              {n.urgent && <AlertTriangle size={13} style={{ color: C.red }} aria-hidden="true" />}
              {n.title}
            </div>
            <span className="text-[11px]" style={{ color: C.inkSoft }}>{n.when}</span>
          </div>
          <div className="text-xs" style={{ color: C.inkSoft }}>{n.body}</div>
          <div className="text-[11px] mt-2 font-semibold" style={{ color: C.inkSoft }}>— {n.by}</div>
        </div>
      ))}
    </div>
  );
}
