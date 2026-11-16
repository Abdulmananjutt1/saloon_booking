"use client";

import { useState, useEffect, useCallback } from "react";
import { payrollApi } from "@/lib/api";
import { getToken } from "@/lib/session";

export type PaymentStatus = "pending" | "paid" | "overdue";

export interface PayRate {
  id:            string;
  stylistId:     string;
  rateType:      "FLAT" | "COMMISSION";
  flatAmount:    number | null;
  commissionPct: number | null;
  baseSalary:    number | null;
}

export interface StylistPayrollSummary {
  id:                string;
  name:              string;
  role:              string;
  avatar:            string;
  completedBookings: number;
  totalRevenue:      number;
  earnedAmount:      number;
  payRate:           PayRate | null;
}

export interface InvoiceItem {
  id:          string;
  bookingId:   string | null;
  description: string;
  amount:      number;
  date:        string;
}

export interface Invoice {
  id:          string;
  stylistId:   string;
  periodStart: string;
  periodEnd:   string;
  totalAmount: number;
  status:      PaymentStatus;
  notes:       string | null;
  paidAt:      string | null;
  createdAt:   string;
  stylist:     { id: string; name: string; role: string; avatar: string };
  items:       InvoiceItem[];
}

// Manual adjustment added by admin (bonus / deduction)
export interface ManualAdjustment {
  id:          string;
  stylistId:   string;
  type:        "bonus" | "deduction";
  amount:      number;
  reason:      string;
  date:        string;
}

interface ApiResponse<T> { success: boolean; data: T; error?: string; errors?: Record<string, string> }

export function usePayroll() {
  const [stylists,      setStylists]      = useState<StylistPayrollSummary[]>([]);
  const [invoices,      setInvoices]      = useState<Invoice[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [activeTab,     setActiveTab]     = useState<"overview" | "invoices">("overview");
  const [filterStylist, setFilterStylist] = useState("all");
  const [filterStatus,  setFilterStatus]  = useState("all");

  // ── Generate invoice modal ────────────────────────────────────────────────
  const [genModal,    setGenModal]    = useState(false);
  const [genForm,     setGenForm]     = useState({ stylistId: "", periodStart: "", periodEnd: "", notes: "" });
  const [genErrors,   setGenErrors]   = useState<Record<string, string>>({});
  const [generating,  setGenerating]  = useState(false);

  // ── Configure pay-rate modal ──────────────────────────────────────────────
  const [rateModal,   setRateModal]   = useState(false);
  const [rateStylist, setRateStylist] = useState<StylistPayrollSummary | null>(null);
  const [rateForm,    setRateForm]    = useState({
    rateType:      "COMMISSION" as "FLAT" | "COMMISSION",
    flatAmount:    "",
    commissionPct: "",
    baseSalary:    "",
    // bonus tiers — stored as "minBookings:bonusAmount" pairs, comma-separated
    tiers:         "",
  });
  const [rateErrors,  setRateErrors]  = useState<Record<string, string>>({});
  const [rateSaving,  setRateSaving]  = useState(false);

  // ── Manual adjustment modal ───────────────────────────────────────────────
  const [adjModal,    setAdjModal]    = useState(false);
  const [adjStylist,  setAdjStylist]  = useState<StylistPayrollSummary | null>(null);
  const [adjForm,     setAdjForm]     = useState({ type: "bonus" as "bonus" | "deduction", amount: "", reason: "" });
  const [adjErrors,   setAdjErrors]   = useState<Record<string, string>>({});
  // All adjustments live here (per session; could be persisted to localStorage if needed)
  const [adjustments, setAdjustments] = useState<ManualAdjustment[]>([]);

  // ── Invoice detail / edit modal ───────────────────────────────────────────
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [editInvoice,   setEditInvoice]   = useState<Invoice | null>(null);
  const [editForm,      setEditForm]      = useState({ periodStart: "", periodEnd: "", notes: "", status: "" });
  const [editErrors,    setEditErrors]    = useState<Record<string, string>>({});
  const [editSaving,    setEditSaving]    = useState(false);
  const [updatingId,    setUpdatingId]    = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    try {
      const [styRes, invRes] = await Promise.all([
        payrollApi.getStylists(token ?? "")                              as Promise<ApiResponse<StylistPayrollSummary[]>>,
        payrollApi.getInvoices(undefined, undefined, token ?? "")        as Promise<ApiResponse<Invoice[]>>,
      ]);
      if (styRes.success) setStylists(styRes.data);
      if (invRes.success) setInvoices(invRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStylist !== "all" && inv.stylistId !== filterStylist) return false;
    if (filterStatus  !== "all" && inv.status    !== filterStatus)  return false;
    return true;
  });

  // ── Generate invoice ──────────────────────────────────────────────────────
  const openGenModal = (stylistId = "") => {
    setGenForm({ stylistId, periodStart: "", periodEnd: "", notes: "" });
    setGenErrors({});
    setGenModal(true);
  };

  const generateInvoice = async (): Promise<{ ok: boolean; error?: string }> => {
    const errors: Record<string, string> = {};
    if (!genForm.stylistId)   errors.stylistId   = "Select a stylist";
    if (!genForm.periodStart) errors.periodStart = "Select start date";
    if (!genForm.periodEnd)   errors.periodEnd   = "Select end date";
    if (genForm.periodStart && genForm.periodEnd && genForm.periodStart > genForm.periodEnd)
      errors.periodEnd = "End date must be after start date";
    setGenErrors(errors);
    if (Object.keys(errors).length) return { ok: false, error: "Validation failed" };

    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    setGenerating(true);
    try {
      const res = await payrollApi.generate(genForm, token) as ApiResponse<Invoice>;
      if (res.success) {
        setInvoices((prev) => [res.data, ...prev]);
        setGenModal(false);
        setActiveTab("invoices");
        return { ok: true };
      }
      if (res.errors) setGenErrors(res.errors);
      else setGenErrors({ general: res.error ?? "Failed to generate invoice" });
      return { ok: false, error: res.error ?? "Failed to generate invoice" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setGenerating(false);
    }
  };

  // ── Pay rate ──────────────────────────────────────────────────────────────
  const openRateModal = (stylist: StylistPayrollSummary) => {
    setRateStylist(stylist);
    setRateErrors({});
    setRateForm({
      rateType:      stylist.payRate?.rateType      ?? "COMMISSION",
      flatAmount:    stylist.payRate?.flatAmount?.toString()    ?? "",
      commissionPct: stylist.payRate?.commissionPct?.toString() ?? "",
      baseSalary:    stylist.payRate?.baseSalary?.toString()    ?? "",
      tiers:         "",
    });
    setRateModal(true);
  };

  const savePayRate = async (): Promise<{ ok: boolean; error?: string }> => {
    if (!rateStylist) return { ok: false, error: "No stylist selected" };
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };

    const errs: Record<string, string> = {};
    if (rateForm.rateType === "COMMISSION") {
      const pct = parseFloat(rateForm.commissionPct);
      if (!rateForm.commissionPct) errs.commissionPct = "Commission percentage is required";
      else if (isNaN(pct) || pct < 0 || pct > 100) errs.commissionPct = "Must be between 0 and 100";
    }
    if (rateForm.rateType === "FLAT") {
      const amt = parseFloat(rateForm.flatAmount);
      if (!rateForm.flatAmount) errs.flatAmount = "Flat amount is required";
      else if (isNaN(amt) || amt < 0) errs.flatAmount = "Must be 0 or more";
    }
    if (rateForm.baseSalary) {
      const sal = parseFloat(rateForm.baseSalary);
      if (isNaN(sal) || sal < 0) errs.baseSalary = "Base salary must be 0 or more";
    }
    setRateErrors(errs);
    if (Object.keys(errs).length) return { ok: false, error: "Validation failed" };

    setRateSaving(true);
    try {
      const body = {
        rateType:      rateForm.rateType,
        flatAmount:    rateForm.rateType === "FLAT"       ? parseFloat(rateForm.flatAmount)    : undefined,
        commissionPct: rateForm.rateType === "COMMISSION" ? parseFloat(rateForm.commissionPct) : undefined,
        baseSalary:    rateForm.baseSalary ? parseFloat(rateForm.baseSalary) : undefined,
      };
      const res = await payrollApi.setPayRate(rateStylist.id, body, token) as ApiResponse<PayRate>;
      if (res.success) {
        setStylists((prev) => prev.map((s) => s.id === rateStylist.id ? { ...s, payRate: res.data } : s));
        setRateModal(false);
        return { ok: true };
      }
      if (res.errors) setRateErrors(res.errors);
      return { ok: false, error: res.error ?? "Failed to save pay rate" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setRateSaving(false);
    }
  };

  // ── Manual adjustments ────────────────────────────────────────────────────
  const openAdjModal = (stylist: StylistPayrollSummary) => {
    setAdjStylist(stylist);
    setAdjForm({ type: "bonus", amount: "", reason: "" });
    setAdjErrors({});
    setAdjModal(true);
  };

  const saveAdjustment = (): { ok: boolean; error?: string } => {
    if (!adjStylist) return { ok: false, error: "No stylist selected" };
    const errs: Record<string, string> = {};
    const amt = parseFloat(adjForm.amount);
    if (!adjForm.amount || isNaN(amt) || amt <= 0) errs.amount = "Enter a valid positive amount";
    if (!adjForm.reason.trim()) errs.reason = "Reason is required";
    setAdjErrors(errs);
    if (Object.keys(errs).length) return { ok: false, error: "Validation failed" };

    const adj: ManualAdjustment = {
      id:        `adj_${Date.now()}`,
      stylistId: adjStylist.id,
      type:      adjForm.type,
      amount:    amt,
      reason:    adjForm.reason.trim(),
      date:      new Date().toISOString().split("T")[0],
    };
    setAdjustments((prev) => [adj, ...prev]);
    setAdjModal(false);
    return { ok: true };
  };

  const removeAdjustment = (id: string) => setAdjustments((prev) => prev.filter((a) => a.id !== id));

  // ── Edit invoice ──────────────────────────────────────────────────────────
  const openEditInvoice = (inv: Invoice) => {
    setEditInvoice(inv);
    setEditForm({
      periodStart: inv.periodStart,
      periodEnd:   inv.periodEnd,
      notes:       inv.notes ?? "",
      status:      inv.status,
    });
    setEditErrors({});
  };

  const saveEditInvoice = async (): Promise<{ ok: boolean; error?: string }> => {
    if (!editInvoice) return { ok: false, error: "No invoice selected" };
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };

    const errs: Record<string, string> = {};
    if (!editForm.periodStart) errs.periodStart = "Required";
    if (!editForm.periodEnd)   errs.periodEnd   = "Required";
    if (editForm.periodStart && editForm.periodEnd && editForm.periodStart > editForm.periodEnd)
      errs.periodEnd = "End must be after start";
    setEditErrors(errs);
    if (Object.keys(errs).length) return { ok: false, error: "Validation failed" };

    setEditSaving(true);
    try {
      // Update status first (existing endpoint)
      if (editForm.status !== editInvoice.status) {
        const statusRes = await payrollApi.updateStatus(editInvoice.id, editForm.status, token) as ApiResponse<Invoice>;
        if (statusRes.success) {
          setInvoices((prev) => prev.map((inv) => inv.id === editInvoice.id ? statusRes.data : inv));
        }
      }
      setEditInvoice(null);
      await fetchAll();
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setEditSaving(false);
    }
  };

  // ── Invoice status / delete ───────────────────────────────────────────────
  const updateInvoiceStatus = async (id: string, status: string): Promise<{ ok: boolean; error?: string }> => {
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    setUpdatingId(id);
    try {
      const res = await payrollApi.updateStatus(id, status, token) as ApiResponse<Invoice>;
      if (res.success) {
        setInvoices((prev) => prev.map((inv) => inv.id === id ? res.data : inv));
        if (detailInvoice?.id === id) setDetailInvoice(res.data);
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Failed to update status" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteInvoice = async (id: string): Promise<{ ok: boolean; error?: string }> => {
    const token = getToken();
    if (!token) return { ok: false, error: "No session token found" };
    try {
      const res = await payrollApi.deleteInvoice(id, token) as { success: boolean; error?: string };
      if (res.success) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        if (detailInvoice?.id === id) setDetailInvoice(null);
        if (editInvoice?.id  === id) setEditInvoice(null);
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Failed to delete invoice" };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Network error" };
    }
  };

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0);
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.totalAmount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.totalAmount, 0);

  return {
    stylists, invoices: filteredInvoices, allInvoices: invoices, loading,
    activeTab, setActiveTab,
    filterStylist, setFilterStylist,
    filterStatus,  setFilterStatus,
    totalPaid, totalPending, totalOverdue,
    // generate
    genModal, openGenModal, closeGenModal: () => setGenModal(false),
    genForm, setGenForm, genErrors, generating, generateInvoice,
    // pay rate
    rateModal, openRateModal, closeRateModal: () => setRateModal(false),
    rateStylist, rateForm, setRateForm, rateErrors, setRateErrors, rateSaving, savePayRate,
    // adjustments
    adjustments, adjModal, openAdjModal, closeAdjModal: () => setAdjModal(false),
    adjStylist, adjForm, setAdjForm, adjErrors, saveAdjustment, removeAdjustment,
    // edit invoice
    editInvoice, openEditInvoice, closeEditInvoice: () => setEditInvoice(null),
    editForm, setEditForm, editErrors, editSaving, saveEditInvoice,
    // detail / status / delete
    detailInvoice, setDetailInvoice,
    updatingId, updateInvoiceStatus, deleteInvoice,
    refresh: fetchAll,
  };
}
