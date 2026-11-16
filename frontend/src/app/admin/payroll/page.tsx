"use client";

import Image from "next/image";
import {
  Wallet, Plus, X, Check, User, Calendar, FileText, Trash2, Settings2,
  AlertCircle, RefreshCw, Clock, Edit2, PlusCircle, MinusCircle,
} from "lucide-react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import {
  usePayroll,
  type Invoice,
  type StylistPayrollSummary,
  type ManualAdjustment,
} from "@/hooks/usePayroll";
import { ToastContainer, useToast } from "@/components/ui/Toast";

// ── Human-readable invoice number ─────────────────────────────────────────────
// Converts UUID/DB id to INV-YYYY-NNNN format using the creation date + last 4 chars
function formatInvoiceNo(id: string, createdAt?: string): string {
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  // Use last 4 alphanumeric chars of the id as the serial, uppercased
  const serial = id.replace(/-/g, "").slice(-4).toUpperCase();
  return `INV-${year}-${serial}`;
}
const STATUS_STYLE: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  paid:    { color: "var(--status-confirmed)", bg: "var(--status-confirmed-bg)", border: "var(--status-confirmed-border)", dot: "var(--status-confirmed)" },
  pending: { color: "var(--status-pending)",   bg: "var(--status-pending-bg)",   border: "var(--status-pending-border)",   dot: "var(--status-pending)" },
  overdue: { color: "var(--status-cancelled)", bg: "var(--status-cancelled-bg)", border: "var(--status-cancelled-border)", dot: "var(--status-cancelled)" },
};
function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: s.bg, border: `1px solid ${s.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.color, textTransform: "capitalize" }}>{status}</span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const skel = (w: string | number, h: number, r = 8) => ({
  width: w, height: h, borderRadius: r,
  background: "var(--border-light)",
  animation: "pulse 1.4s ease-in-out infinite",
} as React.CSSProperties);

// ── Field label helper ────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 7 }}>
      {children}
    </label>
  );
}
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ fontSize: "0.7rem", color: "#f87171", marginTop: 4 }}>{msg}</p>;
}
const inputStyle = (err?: string): React.CSSProperties => ({
  width: "100%", padding: "10px 12px", borderRadius: 10, outline: "none", fontSize: "0.85rem",
  border: `1.5px solid ${err ? "#f87171" : "var(--border-light)"}`,
  background: "var(--bg-secondary)", color: "var(--text-primary)", boxSizing: "border-box",
});

// ── Modal shell ───────────────────────────────────────────────────────────────
function ModalShell({ title, sub, onClose, width = 520, children }: {
  title: string; sub?: string; onClose: () => void; width?: number; children: React.ReactNode;
}) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,9,7,0.65)", backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        zIndex: 1001, width: `min(94vw,${width}px)`,
        background: "var(--bg-secondary)", border: "1px solid var(--border-light)",
        borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.6)", overflow: "hidden",
        maxHeight: "92vh", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border-light)", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>{title}</h2>
            {sub && <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{sub}</p>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <X style={{ width: 14, height: 14 }} />
          </button>
        </div>
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {children}
        </div>
      </div>
    </>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return <span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(13,12,10,0.3)", borderTopColor: "#0d0c0a", animation: "spin 0.7s linear infinite", display: "inline-block" }} />;
}

// ── StylistMini card inside modals ────────────────────────────────────────────
function StylistMini({ s }: { s: StylistPayrollSummary }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
      <div style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", flexShrink: 0 }}>
        {s.avatar
          ? <Image src={s.avatar} alt={s.name} fill sizes="38px" style={{ objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 14 }} /></div>}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</p>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.role}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Completed</p>
        <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>{s.completedBookings} bookings</p>
      </div>
    </div>
  );
}

// ── Generate Invoice Modal ────────────────────────────────────────────────────
function GenerateModal({ stylists, form, setForm, errors, generating, onGenerate, onClose }: {
  stylists: StylistPayrollSummary[];
  form: { stylistId: string; periodStart: string; periodEnd: string; notes: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  generating: boolean;
  onGenerate: () => void;
  onClose: () => void;
}) {
  const sel = stylists.find((s) => s.id === form.stylistId);
  return (
    <ModalShell title="Generate Invoice" sub="Auto-calculate from completed bookings" onClose={onClose}>
      {errors.general && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", fontSize: "0.78rem", color: "#f87171" }}>{errors.general}</div>}

      <div>
        <Label>Stylist</Label>
        <select value={form.stylistId} onChange={(e) => setForm({ ...form, stylistId: e.target.value })} style={inputStyle(errors.stylistId)}>
          <option value="">Select stylist…</option>
          {stylists.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
        </select>
        <FieldError msg={errors.stylistId} />
      </div>

      {sel && (
        <div style={{ background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-light)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", flexShrink: 0 }}>
              {sel.avatar ? <Image src={sel.avatar} alt={sel.name} fill sizes="40px" style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 16 }} /></div>}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{sel.name}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{sel.role}</p>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 99, background: sel.payRate ? "rgba(201,151,59,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${sel.payRate ? "rgba(201,151,59,0.2)" : "rgba(239,68,68,0.2)"}`, fontSize: "0.7rem", fontWeight: 600, color: sel.payRate ? "var(--gold-light)" : "var(--status-cancelled)" }}>
              {sel.payRate
                ? sel.payRate.rateType === "FLAT"
                  ? `${formatPrice(sel.payRate.flatAmount ?? 0)} / booking`
                  : `${sel.payRate.commissionPct}% commission`
                : "No rate set"}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { label: "Completed", value: sel.completedBookings },
              { label: "Revenue",   value: formatPrice(sel.totalRevenue) },
              { label: "Earnings",  value: formatPrice(sel.earnedAmount), gold: true },
            ].map((item, i, arr) => (
              <div key={item.label} style={{ padding: "12px 16px", borderRight: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <p style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>{item.label}</p>
                <p style={{ fontSize: "1rem", fontWeight: 800, color: (item as any).gold ? "var(--gold)" : "var(--text-primary)", marginTop: 4 }}>{item.value}</p>
              </div>
            ))}
          </div>
          {sel.payRate?.baseSalary ? (
            <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Base Salary</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{formatPrice(sel.payRate.baseSalary)}</span>
            </div>
          ) : null}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Period Start</Label>
          <input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} style={inputStyle(errors.periodStart)} />
          <FieldError msg={errors.periodStart} />
        </div>
        <div>
          <Label>Period End</Label>
          <input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} style={inputStyle(errors.periodEnd)} />
          <FieldError msg={errors.periodEnd} />
        </div>
      </div>

      <div>
        <Label>Notes (optional)</Label>
        <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this invoice…" style={{ ...inputStyle(), resize: "none", fontFamily: "inherit" }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onGenerate} disabled={generating} style={{ flex: 2, padding: "10px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          {generating ? <><Spinner />Generating…</> : <><FileText style={{ width: 13, height: 13 }} />Generate Invoice</>}
        </button>
      </div>
    </ModalShell>
  );
}

// ── Configure Pay Rate Modal ──────────────────────────────────────────────────
function RateModal({ stylist, form, setForm, errors, saving, onSave, onClose }: {
  stylist: StylistPayrollSummary | null;
  form: { rateType: "FLAT" | "COMMISSION"; flatAmount: string; commissionPct: string; baseSalary: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!stylist) return null;
  return (
    <ModalShell title="Configure Pay Rate" sub={`${stylist.name} · ${stylist.role}`} onClose={onClose} width={480}>
      <Label>Rate Type</Label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {(["COMMISSION", "FLAT"] as const).map((rt) => (
          <button key={rt} onClick={() => setForm({ ...form, rateType: rt })} style={{ padding: "12px", borderRadius: 10, border: `1.5px solid ${form.rateType === rt ? "#c9973b" : "var(--border-light)"}`, background: form.rateType === rt ? "rgba(201,151,59,0.08)" : "var(--bg-secondary)", color: form.rateType === rt ? "#c9973b" : "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
            {rt === "COMMISSION" ? "Commission (%)" : "Flat Amount"}
          </button>
        ))}
      </div>

      {form.rateType === "COMMISSION" ? (
        <div>
          <Label>Commission Percentage (0 – 100)</Label>
          <div style={{ position: "relative" }}>
            <input type="number" min="0" max="100" value={form.commissionPct} onChange={(e) => setForm({ ...form, commissionPct: e.target.value })} placeholder="e.g. 50" style={{ ...inputStyle(errors.commissionPct), paddingRight: 30 }} />
            <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>%</span>
          </div>
          <FieldError msg={errors.commissionPct} />
        </div>
      ) : (
        <div>
          <Label>Flat Amount Per Booking</Label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>Rs</span>
            <input type="number" min="0" value={form.flatAmount} onChange={(e) => setForm({ ...form, flatAmount: e.target.value })} placeholder="e.g. 500" style={{ ...inputStyle(errors.flatAmount), paddingLeft: 36 }} />
          </div>
          <FieldError msg={errors.flatAmount} />
        </div>
      )}

      <div style={{ height: 1, background: "var(--border-light)" }} />

      {/* Base Salary */}
      <div>
        <Label>Base Salary (optional)</Label>
        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 8 }}>Fixed monthly salary added on top of the commission / flat rate.</p>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>Rs</span>
          <input type="number" min="0" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} placeholder="e.g. 30000" style={{ ...inputStyle(errors.baseSalary), paddingLeft: 36 }} />
        </div>
        <FieldError msg={errors.baseSalary} />
      </div>

      {/* Salary summary preview */}
      {(form.baseSalary || form.commissionPct || form.flatAmount) && (
        <div style={{ background: "rgba(201,151,59,0.06)", border: "1px solid rgba(201,151,59,0.18)", borderRadius: 12, padding: "12px 16px" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold)", marginBottom: 8 }}>Salary Structure Preview</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {form.baseSalary && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}><span style={{ color: "var(--text-muted)" }}>Base Salary</span><span style={{ color: "var(--text-primary)", fontWeight: 700 }}>Rs {parseFloat(form.baseSalary || "0").toLocaleString()}</span></div>}
            {form.rateType === "COMMISSION" && form.commissionPct && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}><span style={{ color: "var(--text-muted)" }}>Commission Rate</span><span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{form.commissionPct}% of service revenue</span></div>}
            {form.rateType === "FLAT" && form.flatAmount && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}><span style={{ color: "var(--text-muted)" }}>Per Booking</span><span style={{ color: "var(--text-primary)", fontWeight: 700 }}>Rs {parseFloat(form.flatAmount || "0").toLocaleString()}</span></div>}
            {form.baseSalary && stylist.completedBookings > 0 && (
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(201,151,59,0.15)", display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Est. this period ({stylist.completedBookings} bookings)</span>
                <span style={{ color: "var(--gold)", fontWeight: 800 }}>
                  Rs {(
                    (parseFloat(form.baseSalary || "0")) +
                    (form.rateType === "FLAT"
                      ? stylist.completedBookings * parseFloat(form.flatAmount || "0")
                      : stylist.earnedAmount)
                  ).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onSave} disabled={saving} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          {saving ? <><Spinner />Saving…</> : <><Check style={{ width: 13, height: 13 }} />Save Rate</>}
        </button>
      </div>
    </ModalShell>
  );
}

// ── Manual Adjustment Modal ───────────────────────────────────────────────────
function AdjustmentModal({ stylist, form, setForm, errors, onSave, onClose }: {
  stylist: StylistPayrollSummary | null;
  form: { type: "bonus" | "deduction"; amount: string; reason: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!stylist) return null;
  return (
    <ModalShell title="Add Adjustment" sub="Manually add bonus or deduction" onClose={onClose} width={440}>
      <StylistMini s={stylist} />

      <div>
        <Label>Type</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(["bonus", "deduction"] as const).map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })} style={{ padding: "11px", borderRadius: 10, border: `1.5px solid ${form.type === t ? (t === "bonus" ? "var(--status-confirmed)" : "var(--status-cancelled)") : "var(--border-light)"}`, background: form.type === t ? (t === "bonus" ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)") : "var(--bg-secondary)", color: form.type === t ? (t === "bonus" ? "var(--status-confirmed)" : "var(--status-cancelled)") : "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {t === "bonus" ? <PlusCircle style={{ width: 14, height: 14 }} /> : <MinusCircle style={{ width: 14, height: 14 }} />}
              {t === "bonus" ? "Bonus" : "Deduction"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Amount (Rs)</Label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.85rem" }}>Rs</span>
          <input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 1000" style={{ ...inputStyle(errors.amount), paddingLeft: 36 }} />
        </div>
        <FieldError msg={errors.amount} />
      </div>

      <div>
        <Label>Reason</Label>
        <textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Performance bonus for exceeding monthly target…" style={{ ...inputStyle(errors.reason), resize: "none", fontFamily: "inherit" }} />
        <FieldError msg={errors.reason} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onSave} style={{ flex: 1, padding: "10px", borderRadius: 10, background: form.type === "bonus" ? "var(--grad-gold-btn)" : "rgba(239,68,68,0.9)", border: "none", color: form.type === "bonus" ? "#0d0c0a" : "#fff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          {form.type === "bonus" ? <PlusCircle style={{ width: 13, height: 13 }} /> : <MinusCircle style={{ width: 13, height: 13 }} />}
          Add {form.type === "bonus" ? "Bonus" : "Deduction"}
        </button>
      </div>
    </ModalShell>
  );
}

// ── Edit Invoice Modal ────────────────────────────────────────────────────────
function EditInvoiceModal({ invoice, form, setForm, errors, saving, onSave, onClose }: {
  invoice: Invoice | null;
  form: { periodStart: string; periodEnd: string; notes: string; status: string };
  setForm: (f: any) => void;
  errors: Record<string, string>;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  if (!invoice) return null;
  return (
    <ModalShell title="Edit Invoice" sub={`${formatInvoiceNo(invoice.id, invoice.createdAt)}`} onClose={onClose} width={480}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-light)" }}>
        <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)", flexShrink: 0 }}>
          {invoice.stylist.avatar ? <Image src={invoice.stylist.avatar} alt={invoice.stylist.name} fill sizes="36px" style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 14 }} /></div>}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{invoice.stylist.name}</p>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{invoice.stylist.role}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Amount</p>
          <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(invoice.totalAmount)}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Period Start</Label>
          <input type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} style={inputStyle(errors.periodStart)} />
          <FieldError msg={errors.periodStart} />
        </div>
        <div>
          <Label>Period End</Label>
          <input type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} style={inputStyle(errors.periodEnd)} />
          <FieldError msg={errors.periodEnd} />
        </div>
      </div>

      <div>
        <Label>Status</Label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle()}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div>
        <Label>Notes</Label>
        <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes…" style={{ ...inputStyle(), resize: "none", fontFamily: "inherit" }} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={onSave} disabled={saving} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.85rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          {saving ? <><Spinner />Saving…</> : <><Check style={{ width: 13, height: 13 }} />Save Changes</>}
        </button>
      </div>
    </ModalShell>
  );
}

// ── View Invoice Details Modal ────────────────────────────────────────────────
function DetailModal({ invoice, updatingId, onUpdateStatus, onDelete, onEdit, onClose }: {
  invoice: Invoice | null;
  updatingId: string | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (inv: Invoice) => void;
  onClose: () => void;
}) {
  if (!invoice) return null;
  return (
    <ModalShell title="Invoice Details" sub={`${formatInvoiceNo(invoice.id, invoice.createdAt)}`} onClose={onClose} width={640}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, padding: 16, background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)" }}>
            {invoice.stylist.avatar ? <Image src={invoice.stylist.avatar} alt={invoice.stylist.name} fill sizes="44px" style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 18 }} /></div>}
          </div>
          <div>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{invoice.stylist.name}</h3>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{invoice.stylist.role}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", borderLeft: "1px solid var(--border-light)", paddingLeft: 20 }}>
          {[
            { label: "Period", value: `${invoice.periodStart} to ${invoice.periodEnd}` },
            { label: "Created", value: formatDateShort(invoice.createdAt) },
            ...(invoice.paidAt ? [{ label: "Paid At", value: invoice.paidAt, gold: true }] : []),
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
              <span style={{ color: "var(--text-muted)" }}>{r.label}:</span>
              <span style={{ color: (r as any).gold ? "var(--status-confirmed)" : "var(--text-primary)", fontWeight: 600 }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items table */}
      <div>
        <Label>Invoice Items</Label>
        <div style={{ border: "1px solid var(--border-light)", borderRadius: 12, overflow: "hidden", background: "var(--bg-secondary)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid var(--border-light)" }}>
                {["Date", "Description", "Amount"].map((h) => <th key={h} style={{ padding: "10px 14px", fontWeight: 600, color: "var(--text-muted)", textAlign: h === "Amount" ? "right" : "left" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {invoice.items.length === 0
                ? <tr><td colSpan={3} style={{ padding: "20px 14px", textAlign: "center", color: "var(--text-muted)" }}>No items in this invoice.</td></tr>
                : invoice.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{item.date}</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-primary)", fontWeight: 500 }}>{item.description}</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-primary)", fontWeight: 700, textAlign: "right" }}>{formatPrice(item.amount)}</td>
                  </tr>
                ))}
              <tr style={{ background: "rgba(255,255,255,0.02)", borderTop: "1.5px solid var(--border-light)" }}>
                <td colSpan={2} style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-primary)" }}>Total Amount Due</td>
                <td style={{ padding: "12px 14px", fontWeight: 800, color: "var(--gold)", fontSize: "0.88rem", textAlign: "right" }}>{formatPrice(invoice.totalAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {invoice.notes && (
        <div>
          <Label>Notes</Label>
          <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-light)", borderRadius: 12, fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{invoice.notes}</div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-light)", paddingTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Status:</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { onEdit(invoice); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}>
            <Edit2 style={{ width: 12, height: 12 }} />Edit
          </button>
          <button disabled={updatingId != null} onClick={() => { if (confirm("Delete this invoice?")) onDelete(invoice.id); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "var(--status-cancelled)", fontSize: "0.76rem", fontWeight: 600, cursor: updatingId ? "not-allowed" : "pointer" }}>
            <Trash2 style={{ width: 13, height: 13 }} />Delete
          </button>
          {invoice.status !== "paid" && (
            <button disabled={updatingId != null} onClick={() => onUpdateStatus(invoice.id, "paid")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "var(--status-confirmed)", border: "none", color: "#062312", fontSize: "0.76rem", fontWeight: 700, cursor: updatingId ? "not-allowed" : "pointer" }}>
              {updatingId === invoice.id ? <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(6,35,18,0.3)", borderTopColor: "#062312", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> : <Check style={{ width: 13, height: 13 }} />}
              Mark Paid
            </button>
          )}
          {invoice.status === "paid" && (
            <button disabled={updatingId != null} onClick={() => onUpdateStatus(invoice.id, "pending")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.76rem", fontWeight: 600, cursor: updatingId ? "not-allowed" : "pointer" }}>
              Mark Unpaid
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminPayrollPage() {
  const {
    stylists, invoices, loading,
    activeTab, setActiveTab,
    filterStylist, setFilterStylist,
    filterStatus,  setFilterStatus,
    totalPaid, totalPending, totalOverdue,
    genModal, openGenModal, closeGenModal,
    genForm, setGenForm, genErrors, generating, generateInvoice,
    rateModal, openRateModal, closeRateModal,
    rateStylist, rateForm, setRateForm, rateErrors, rateSaving, savePayRate,
    adjustments, adjModal, openAdjModal, closeAdjModal,
    adjStylist, adjForm, setAdjForm, adjErrors, saveAdjustment, removeAdjustment,
    editInvoice, openEditInvoice, closeEditInvoice,
    editForm, setEditForm, editErrors, editSaving, saveEditInvoice,
    detailInvoice, setDetailInvoice,
    updatingId, updateInvoiceStatus, deleteInvoice,
    refresh,
  } = usePayroll();

  const { toasts, toast, remove } = useToast();

  const handleSavePayRate = async () => {
    const r = await savePayRate();
    r.ok ? toast("success", "Rate Saved", "Pay rate updated.") : toast("error", "Error", r.error ?? "Could not save rate.");
    if (r.ok) refresh();
  };

  const handleGenerateInvoice = async () => {
    const r = await generateInvoice();
    r.ok ? toast("success", "Invoice Generated", "New invoice created.") : toast("error", "Error", r.error ?? "Could not generate invoice.");
    if (r.ok) refresh();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const r = await updateInvoiceStatus(id, status);
    r.ok ? toast("success", `Marked ${status}`, "Status updated.") : toast("error", "Error", r.error ?? "Could not update status.");
    if (r.ok) refresh();
  };

  const handleDeleteInvoice = async (id: string) => {
    const r = await deleteInvoice(id);
    r.ok ? toast("success", "Deleted", "Invoice deleted.") : toast("error", "Error", r.error ?? "Could not delete invoice.");
    if (r.ok) refresh();
  };

  const handleSaveAdj = () => {
    const r = saveAdjustment();
    r.ok ? toast("success", "Adjustment Added", "Manual adjustment saved.") : toast("error", "Error", r.error ?? "Invalid input.");
  };

  const handleSaveEdit = async () => {
    const r = await saveEditInvoice();
    r.ok ? toast("success", "Invoice Updated", "Changes saved.") : toast("error", "Error", r.error ?? "Could not save.");
  };

  // Adjustments per stylist (for overview)
  const adjByStylist = (stylistId: string) => adjustments.filter((a) => a.stylistId === stylistId);
  const adjNetByStylist = (stylistId: string) =>
    adjustments.filter((a) => a.stylistId === stylistId).reduce((sum, a) => sum + (a.type === "bonus" ? a.amount : -a.amount), 0);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", animation: "fadeIn 0.3s ease-out" }}>
      <ToastContainer toasts={toasts} onRemove={remove} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>Payroll Management</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Configure pay structures, track earnings, manage invoices, and add manual adjustments.</p>
        </div>
        <button onClick={() => openGenModal()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 11, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(201,151,59,0.3)" }}>
          <Plus style={{ width: 15, height: 15 }} /> Generate Invoice
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginBottom: 32 }}>
        {[
          { label: "Total Paid",        value: totalPaid,    icon: Wallet,       color: "var(--status-confirmed)", bg: "rgba(52,211,153,0.1)" },
          { label: "Pending Invoices",  value: totalPending, icon: Clock,        color: "var(--status-pending)",   bg: "rgba(245,158,11,0.1)" },
          { label: "Overdue Invoices",  value: totalOverdue, icon: AlertCircle,  color: "var(--status-cancelled)", bg: "rgba(239,68,68,0.1)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", padding: "20px 24px", borderRadius: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
              <Icon style={{ width: 22, height: 22 }} />
            </div>
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>{label}</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 4 }}>
                {loading ? <div style={skel(110, 24)} /> : formatPrice(value)}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.03)", padding: 4, borderRadius: 12, border: "1px solid var(--border-light)" }}>
          {(["overview", "invoices"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", background: activeTab === tab ? "rgba(255,255,255,0.06)" : "transparent", color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)", transition: "all 0.2s" }}>
              {tab === "overview" ? "Stylists Overview" : "Payroll Invoices"}
            </button>
          ))}
        </div>
        <button onClick={refresh} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 11, background: "var(--bg-card)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          <RefreshCw style={{ width: 13, height: 13, animation: loading ? "spin 1.7s linear infinite" : undefined }} /> Refresh
        </button>
      </div>

      {/* ── Stylists Overview ── */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {Array.from({ length: 3 }).map((_, i) => <div key={i} style={skel("100%", 72, 12)} />)}
            </div>
          ) : stylists.length === 0 ? (
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>No stylists found.</div>
          ) : (
            stylists.map((s) => {
              const adjs = adjByStylist(s.id);
              const adjNet = adjNetByStylist(s.id);
              const totalEarnings = s.earnedAmount + (s.payRate?.baseSalary ?? 0) + adjNet;

              return (
                <div key={s.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>

                  {/* ── Row 1: Identity + pay rate badge ── */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "18px 24px", borderBottom: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ position: "relative", width: 46, height: 46, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "2px solid var(--border-light)", flexShrink: 0 }}>
                        {s.avatar
                          ? <Image src={s.avatar} alt={s.name} fill sizes="46px" style={{ objectFit: "cover" }} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 18 }} /></div>}
                      </div>
                      <div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{s.role}</p>
                      </div>
                    </div>

                    {/* Pay rate pill */}
                    {s.payRate ? (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(201,151,59,0.1)", border: "1px solid rgba(201,151,59,0.25)", fontSize: "0.74rem", fontWeight: 700, color: "var(--gold-light)" }}>
                        <Wallet style={{ width: 11, height: 11 }} />
                        {s.payRate.rateType === "FLAT"
                          ? `Rs ${(s.payRate.flatAmount ?? 0).toLocaleString()} / booking`
                          : `${s.payRate.commissionPct}% commission`}
                        {s.payRate.baseSalary ? <span style={{ opacity: 0.6, fontWeight: 500 }}>+ Rs {s.payRate.baseSalary.toLocaleString()} base</span> : null}
                      </div>
                    ) : (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: "0.74rem", fontWeight: 700, color: "var(--status-cancelled)" }}>
                        <AlertCircle style={{ width: 11, height: 11 }} />No rate configured
                      </div>
                    )}
                  </div>

                  {/* ── Row 2: Stats grid ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "1px solid var(--border-light)" }}>
                    {[
                      { label: "Completed Bookings", value: s.completedBookings.toString(),   valueColor: "var(--text-primary)" },
                      { label: "Total Revenue",       value: formatPrice(s.totalRevenue),       valueColor: "var(--text-primary)" },
                      { label: "Booking Earnings",    value: formatPrice(s.earnedAmount),       valueColor: "var(--text-primary)" },
                      { label: "Base Salary",         value: s.payRate?.baseSalary ? formatPrice(s.payRate.baseSalary) : "—", valueColor: "var(--text-primary)" },
                      { label: "Adjustments",         value: adjNet !== 0 ? `${adjNet > 0 ? "+" : ""}${formatPrice(Math.abs(adjNet))}` : "—", valueColor: adjNet > 0 ? "var(--status-confirmed)" : adjNet < 0 ? "var(--status-cancelled)" : "var(--text-muted)" },
                      { label: "Total Payable",       value: formatPrice(totalEarnings),        valueColor: "var(--gold)" },
                    ].map((stat, i, arr) => (
                      <div key={stat.label} style={{ padding: "14px 20px", borderRight: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                        <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: 6, whiteSpace: "nowrap" }}>{stat.label}</p>
                        <p style={{ fontSize: "0.92rem", fontWeight: 800, color: stat.valueColor }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* ── Row 3: Actions ── */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "14px 24px" }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => openRateModal(s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                        <Settings2 style={{ width: 13, height: 13 }} />Configure Rate
                      </button>
                      <button onClick={() => openAdjModal(s)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.22)", color: "var(--gold-light)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                        <PlusCircle style={{ width: 13, height: 13 }} />Add Adjustment
                      </button>
                      <button onClick={() => openGenModal(s.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: "var(--grad-gold-btn)", border: "none", color: "#0d0c0a", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 10px rgba(201,151,59,0.2)" }}>
                        <FileText style={{ width: 13, height: 13 }} />Generate Invoice
                      </button>
                    </div>

                    {/* Adjustments chips */}
                    {adjs.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Adjustments:</span>
                        {adjs.map((a) => (
                          <div key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, background: a.type === "bonus" ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${a.type === "bonus" ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`, fontSize: "0.71rem", fontWeight: 600, color: a.type === "bonus" ? "var(--status-confirmed)" : "var(--status-cancelled)" }}>
                            {a.type === "bonus" ? "+" : "−"}{formatPrice(a.amount)}
                            <span style={{ opacity: 0.7, fontWeight: 400 }}>· {a.reason}</span>
                            <button onClick={() => removeAdjustment(a.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", opacity: 0.55, display: "flex", marginLeft: 2 }}>
                              <X style={{ width: 9, height: 9 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Payroll Invoices ── */}
      {activeTab === "invoices" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: 18, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16 }}>
            {[
              { label: "Filter by Stylist", value: filterStylist, onChange: setFilterStylist, options: [{ label: "All Stylists", value: "all" }, ...stylists.map((s) => ({ label: s.name, value: s.id }))] },
              { label: "Filter by Status",  value: filterStatus,  onChange: setFilterStatus,  options: [{ label: "All Statuses", value: "all" }, { label: "Pending", value: "pending" }, { label: "Paid", value: "paid" }, { label: "Overdue", value: "overdue" }] },
            ].map((f) => (
              <div key={f.label} style={{ flex: 1, minWidth: 200 }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 6 }}>{f.label}</label>
                <select value={f.value} onChange={(e) => f.onChange(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-light)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem", outline: "none" }}>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Invoices table */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 24, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {["Invoice ID", "Stylist", "Billing Period", "Amount Due", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: h === "Actions" ? "right" : "left", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        {[90, 120, 150, 70, 65, 100].map((w, j) => <td key={j} style={{ padding: "16px 20px" }}><div style={skel(w, 14)} /></td>)}
                      </tr>
                    ))
                  ) : invoices.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>No invoices found.</td></tr>
                  ) : (
                    invoices.map((inv, idx) => (
                      <tr key={inv.id} style={{ borderBottom: idx < invoices.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{formatInvoiceNo(inv.id, inv.createdAt)}</span>
                            <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "var(--text-muted)", opacity: 0.6 }}>{inv.id.slice(0, 8)}…</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-light)" }}>
                              {inv.stylist.avatar ? <Image src={inv.stylist.avatar} alt={inv.stylist.name} fill sizes="28px" style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}><User style={{ width: 12 }} /></div>}
                            </div>
                            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{inv.stylist.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px", color: "var(--text-secondary)", fontSize: "0.8rem" }}>{inv.periodStart} to {inv.periodEnd}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gold)" }}>{formatPrice(inv.totalAmount)}</span>
                        </td>
                        <td style={{ padding: "16px 20px" }}><StatusBadge status={inv.status} /></td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 8 }}>
                            <button onClick={() => setDetailInvoice(inv)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>
                              View
                            </button>
                            <button onClick={() => openEditInvoice(inv)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8, background: "rgba(201,151,59,0.08)", border: "1px solid rgba(201,151,59,0.2)", color: "var(--gold-light)", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer" }}>
                              <Edit2 style={{ width: 11, height: 11 }} />Edit
                            </button>
                            <button disabled={updatingId != null} onClick={() => { if (confirm("Delete this invoice?")) handleDeleteInvoice(inv.id); }} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(239,68,68,0.08)", color: "var(--status-cancelled)", cursor: updatingId ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Trash2 style={{ width: 13, height: 13 }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {genModal    && <GenerateModal stylists={stylists} form={genForm} setForm={setGenForm} errors={genErrors} generating={generating} onGenerate={handleGenerateInvoice} onClose={closeGenModal} />}
      {rateModal   && <RateModal stylist={rateStylist} form={rateForm} setForm={setRateForm} errors={rateErrors} saving={rateSaving} onSave={handleSavePayRate} onClose={closeRateModal} />}
      {adjModal    && <AdjustmentModal stylist={adjStylist} form={adjForm} setForm={setAdjForm} errors={adjErrors} onSave={handleSaveAdj} onClose={closeAdjModal} />}
      {editInvoice && <EditInvoiceModal invoice={editInvoice} form={editForm} setForm={setEditForm} errors={editErrors} saving={editSaving} onSave={handleSaveEdit} onClose={closeEditInvoice} />}
      {detailInvoice && <DetailModal invoice={detailInvoice} updatingId={updatingId} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteInvoice} onEdit={openEditInvoice} onClose={() => setDetailInvoice(null)} />}
    </div>
  );
}
