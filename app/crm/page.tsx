"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from "firebase/firestore";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CalendarClock, CirclePlus, ClipboardList, Download, ExternalLink, FileUp, LogOut, MessageSquareText, Phone, Search, UserRound } from "lucide-react";
import { auth, db } from "@/firebase/firebase";

const STATUSES = ["New", "No Answer", "Contacted", "Follow-up", "Qualified", "Won", "Lost"] as const;
const SOURCES = ["WhatsApp", "Phone call", "Walk-in", "Website", "Other"] as const;
const BRANDS = ["Any brand", "Royal Enfield", "Honda", "Hero", "TVS", "Bajaj", "Yamaha", "Suzuki", "KTM", "Jawa", "Other"] as const;
const BUDGETS = ["Not discussed", "Under ₹50,000", "₹50,000–₹80,000", "₹80,000–₹1.2 lakh", "₹1.2–₹2 lakh", "Above ₹2 lakh"] as const;
type LeadStatus = (typeof STATUSES)[number];
type LeadSource = (typeof SOURCES)[number];

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  assignedName: string;
  nextFollowUpAt: Timestamp | null;
  agencyVisitAt?: Timestamp | null;
  interestBrand?: string;
  interestModel?: string;
  budgetRange?: string;
  whatsappDetailsShared?: boolean | null;
  createdAt?: Timestamp;
};

type Remark = { id: string; text: string; createdByUid: string; createdAt?: Timestamp };
type CrmUser = { uid: string; name: string; email: string; active: boolean };
type Bike = { id: string; name: string; brand: string; price: number; status: string; slug?: string; location?: string; year?: string };

const blankLead = { name: "", phone: "", email: "", source: "WhatsApp" as LeadSource, assignedTo: "" };
const IMPORT_BATCH_SIZE = 450;
const QUICK_OUTCOMES = [
  { label: "No Answer", status: "No Answer", note: "No answer. Try calling again.", whatsapp: "Not yet" },
  { label: "Interested", status: "Qualified", note: "Customer is interested.", whatsapp: "Not yet" },
  { label: "Visit Scheduled", status: "Qualified", note: "Agency visit scheduled.", whatsapp: "Not yet" },
  { label: "Details Shared", status: "Contacted", note: "Bike details shared on WhatsApp.", whatsapp: "Yes" },
  { label: "Not Interested", status: "Lost", note: "Customer is not interested.", whatsapp: "Not yet" },
  { label: "Bought Elsewhere", status: "Lost", note: "Customer has bought a bike elsewhere.", whatsapp: "Not yet" },
] as const;

type CallForm = { status: LeadStatus; nextFollowUpAt: string; agencyVisitAt: string; interestBrand: string; interestModel: string; budgetRange: string; whatsappDetailsShared: "Yes" | "No" | "Not yet"; remark: string };

function callFormFor(lead: Lead): CallForm {
  return {
    status: lead.status,
    nextFollowUpAt: dateValue(lead.nextFollowUpAt),
    agencyVisitAt: dateValue(lead.agencyVisitAt ?? null),
    interestBrand: lead.interestBrand || "Any brand",
    interestModel: lead.interestModel || "",
    budgetRange: lead.budgetRange || "Not discussed",
    whatsappDetailsShared: lead.whatsappDetailsShared === true ? "Yes" : lead.whatsappDetailsShared === false ? "No" : "Not yet",
    remark: "",
  };
}

function comparablePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

function importDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const standard = /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? new Date(`${trimmed}T00:00:00`) : (() => {
    const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    return match ? new Date(`${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}T00:00:00`) : new Date("invalid");
  })();
  return Number.isNaN(standard.getTime()) ? undefined : Timestamp.fromDate(standard);
}

function dateValue(value: Timestamp | null) {
  if (!value) return "";
  const date = value.toDate();
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

function displayDate(value?: Timestamp) {
  return value ? value.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

function budgetMaximum(range: string) {
  if (range === "Under ₹50,000") return 50000;
  if (range === "₹50,000–₹80,000") return 80000;
  if (range === "₹80,000–₹1.2 lakh") return 120000;
  if (range === "₹1.2–₹2 lakh") return 200000;
  return Number.POSITIVE_INFINITY;
}

export default function CrmPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [members, setMembers] = useState<CrmUser[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "All">("All");
  const [visitFrom, setVisitFrom] = useState("");
  const [visitTo, setVisitTo] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [bulkAssignee, setBulkAssignee] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerPhone, setCallerPhone] = useState("");
  const [callerMessage, setCallerMessage] = useState("");
  const [callerError, setCallerError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("Calling team");
  const [leadForm, setLeadForm] = useState(blankLead);
  const [importMessage, setImportMessage] = useState("");
  const [duplicateLeads, setDuplicateLeads] = useState<Array<{ name: string; phone: string; reason: string }>>([]);
  const [callForm, setCallForm] = useState<CallForm | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stopLeads: (() => void) | undefined;
    let stopMembers: (() => void) | undefined;
    const stopAuth = onIdTokenChanged(auth, async (user) => {
      stopLeads?.();
      stopMembers?.();
      if (!user) return;
      const token = await user.getIdTokenResult();
      const owner = token.claims.admin === true;
      setIsAdmin(owner);
      setUserId(user.uid);
      setUserName(user.displayName || user.email || "Calling team");
      const leadQuery = owner
        ? query(collection(db, "crmLeads"), orderBy("updatedAt", "desc"))
        : query(collection(db, "crmLeads"), where("assignedTo", "==", user.uid));
      stopLeads = onSnapshot(leadQuery, (snapshot) => {
        const items = snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Lead, "id">) }));
        setLeads(items.sort((first, second) => (second.createdAt?.toMillis() ?? 0) - (first.createdAt?.toMillis() ?? 0)));
        setLoading(false);
      }, (error) => {
        console.error("CRM lead listener error:", error);
        setLoading(false);
      });
      if (owner) {
        stopMembers = onSnapshot(query(collection(db, "crmUsers"), where("active", "==", true)), (snapshot) => {
          setMembers(snapshot.docs.map((item) => item.data() as CrmUser));
        });
      }
    });
    return () => {
      stopAuth();
      stopLeads?.();
      stopMembers?.();
    };
  }, []);

  useEffect(() => onSnapshot(collection(db, "bikes"), (snapshot) => {
    setBikes(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Bike, "id">) })));
  }, (error) => console.error("CRM bike listener error:", error)), []);

  const selectedId = selected?.id;
  useEffect(() => {
    if (!selectedId) return;
    return onSnapshot(query(collection(db, "crmLeads", selectedId, "remarks"), orderBy("createdAt", "desc")), (snapshot) => {
      setRemarks(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Remark, "id">) })));
    }, (error) => console.error("CRM remark listener error:", error));
  }, [selectedId]);

  const visibleLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const visitDate = dateValue(lead.agencyVisitAt ?? null);
      const matchesVisitRange = (!visitFrom || (visitDate && visitDate >= visitFrom)) && (!visitTo || (visitDate && visitDate <= visitTo));
      return (filter === "All" || lead.status === filter) && matchesVisitRange && (!term || [lead.name, lead.phone, lead.email, lead.assignedName].join(" ").toLowerCase().includes(term));
    });
  }, [filter, leads, search, visitFrom, visitTo]);

  const assignableMembers = useMemo(() => {
    if (!isAdmin || !userId) return members;
    return [{ uid: userId, name: userName, email: "" }, ...members.filter((member) => member.uid !== userId)];
  }, [isAdmin, members, userId, userName]);
  const todaysFollowUps = useMemo(() => {
    const today = new Date();
    const key = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    return leads.filter((lead) => dateValue(lead.nextFollowUpAt) === key);
  }, [leads]);

  const relatedBikes = useMemo(() => {
    if (!callForm) return [];
    const preferredBrand = callForm.interestBrand.toLowerCase();
    const preferredModel = callForm.interestModel.trim().toLowerCase();
    return bikes.filter((bike) => bike.status === "Available" && (preferredBrand === "any brand" || bike.brand.toLowerCase() === preferredBrand) && Number(bike.price) <= budgetMaximum(callForm.budgetRange)).sort((first, second) => Number(second.name.toLowerCase().includes(preferredModel)) - Number(first.name.toLowerCase().includes(preferredModel))).slice(0, 6);
  }, [bikes, callForm]);

  const openLead = (lead: Lead) => {
    setRemarks([]);
    setSelected(lead);
    setCallForm(callFormFor(lead));
  };

  const applyQuickOutcome = (outcome: (typeof QUICK_OUTCOMES)[number]) => {
    setCallForm((current) => current ? { ...current, status: outcome.status as LeadStatus, whatsappDetailsShared: outcome.whatsapp, remark: current.remark || outcome.note } : current);
  };

  const addCaller = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true); setCallerMessage(""); setCallerError(false);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/crm/users", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` }, body: JSON.stringify({ name: callerName, phone: callerPhone }) });
      const responseText = await response.text();
      let result: { name?: string; error?: string } = {};
      try { result = responseText ? JSON.parse(responseText) as typeof result : {}; }
      catch { result = { error: responseText || `The server returned ${response.status}.` }; }
      if (!response.ok) throw new Error(result.error || "Caller could not be added.");
      setCallerName(""); setCallerPhone(""); setCallerMessage(`${result.name} added. They can sign in with their mobile number and the calling-team code.`);
    } catch (error) { setCallerError(true); setCallerMessage(error instanceof Error ? error.message : "Caller could not be added."); }
    finally { setSaving(false); }
  };
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds((current) => {
      const next = new Set(current);
      next.has(leadId) ? next.delete(leadId) : next.add(leadId);
      return next;
    });
  };

  const assignSelectedLeads = async () => {
    const assignee = assignableMembers.find((member) => member.uid === bulkAssignee);
    if (!assignee || selectedLeadIds.size === 0) return;
    setSaving(true);
    try {
      const ids = [...selectedLeadIds];
      for (let start = 0; start < ids.length; start += IMPORT_BATCH_SIZE) {
        const batch = writeBatch(db);
        ids.slice(start, start + IMPORT_BATCH_SIZE).forEach((id) => batch.update(doc(db, "crmLeads", id), { assignedTo: assignee.uid, assignedName: assignee.name, updatedAt: serverTimestamp() }));
        await batch.commit();
      }
      setSelectedLeadIds(new Set());
      setBulkAssignee("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Selected leads could not be assigned.");
    } finally { setSaving(false); }
  };
  const createLead = async (event: FormEvent) => {
    event.preventDefault();
    const phone = leadForm.phone.replace(/\s+/g, "");
    if (!leadForm.name.trim() || !/^[+]?[0-9]{10,15}$/.test(phone)) {
      alert("Enter the customer name and a valid phone number.");
      return;
    }
    const assignee = isAdmin ? members.find((member) => member.uid === leadForm.assignedTo) : undefined;
    const assignedTo = isAdmin ? (leadForm.assignedTo || userId) : userId;
    const assignedName = isAdmin ? (assignee?.name || userName) : userName;
    setSaving(true);
    try {
      await addDoc(collection(db, "crmLeads"), {
        name: leadForm.name.trim(), phone, email: leadForm.email.trim(), source: leadForm.source,
        status: "New", assignedTo, assignedName, createdByUid: userId,
        nextFollowUpAt: null, agencyVisitAt: null, interestBrand: "Any brand", interestModel: "", budgetRange: "Not discussed", whatsappDetailsShared: null,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setLeadForm(blankLead);
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lead could not be saved.");
    } finally { setSaving(false); }
  };

  const saveCallUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !callForm) return;
    setSaving(true);
    try {
      const parent = doc(db, "crmLeads", selected.id);
      const batch = writeBatch(db);
      const nextFollowUpAt = callForm.nextFollowUpAt ? Timestamp.fromDate(new Date(`${callForm.nextFollowUpAt}T00:00:00`)) : null;
      const agencyVisitAt = callForm.agencyVisitAt ? Timestamp.fromDate(new Date(`${callForm.agencyVisitAt}T00:00:00`)) : null;
      batch.update(parent, { status: callForm.status, nextFollowUpAt, agencyVisitAt, interestBrand: callForm.interestBrand, interestModel: callForm.interestModel.trim(), budgetRange: callForm.budgetRange, whatsappDetailsShared: callForm.whatsappDetailsShared === "Yes" ? true : callForm.whatsappDetailsShared === "No" ? false : null, updatedAt: serverTimestamp() });
      if (callForm.remark.trim()) batch.set(doc(collection(db, "crmLeads", selected.id, "remarks")), { text: callForm.remark.trim(), createdByUid: userId, createdAt: serverTimestamp() });
      await batch.commit();
      setCallForm((current) => current ? { ...current, remark: "" } : current);
    } catch (error) {
      alert(error instanceof Error ? error.message : "After-call update could not be saved.");
    } finally { setSaving(false); }
  };

  const downloadTemplate = async (type: "csv" | "xlsx") => {
    const XLSX = await import("xlsx");
    const sheet = XLSX.utils.json_to_sheet([{ Name: "Ravi Kumar", Phone: "9876543210", Email: "", Source: "WhatsApp", "Follow-up Date": "2026-10-20" }]);
    sheet["!cols"] = [{ wch: 24 }, { wch: 18 }, { wch: 30 }, { wch: 16 }, { wch: 18 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "CRM Leads");
    XLSX.writeFile(workbook, `old-bikes-hub-lead-format.${type}`, { bookType: type });
  };

  const importLeads = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/\.(csv|xlsx|xls)$/i.test(file.name)) {
      setImportMessage("Use a CSV, XLSX or XLS file.");
      return;
    }
    setSaving(true);
    setImportMessage("Reading file...");
    setDuplicateLeads([]);
    try {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: "", raw: false });
      if (!rows.length) throw new Error("The first sheet has no lead rows.");
      const knownPhones = new Set(leads.map((lead) => comparablePhone(lead.phone)));
      const duplicates: Array<{ name: string; phone: string; reason: string }> = [];
      const parsed = rows.flatMap((row, index) => {
        const fields = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.trim().toLowerCase().replace(/[^a-z]/g, ""), String(value ?? "").trim()]));
        const name = fields.name || fields.customername;
        const phone = (fields.phone || fields.mobile || fields.whatsapp || "").replace(/\s+/g, "");
        const email = fields.email || "";
        const source = (SOURCES.includes(fields.source as LeadSource) ? fields.source : "Other") as LeadSource;
        const followUp = importDate(fields.followupdate || fields.nextfollowup || "");
        if (!name || !/^[+]?[0-9]{10,15}$/.test(phone)) throw new Error(`Row ${index + 2}: name and valid phone are required.`);
        if (email && !/^[^ @]+@[^ @]+[.][^ @]+$/.test(email)) throw new Error(`Row ${index + 2}: email is not valid.`);
        if (followUp === undefined) throw new Error(`Row ${index + 2}: use YYYY-MM-DD for Follow-up Date.`);
        const comparable = comparablePhone(phone);
        if (knownPhones.has(comparable)) {
          duplicates.push({ name, phone, reason: "Already available in CRM" });
          return [];
        }
        knownPhones.add(comparable);
        return [{ name, phone, email, source, nextFollowUpAt: followUp }];
      });
      setDuplicateLeads(duplicates);
      if (!parsed.length) {
        setImportMessage(duplicates.length ? `No new leads added. ${duplicates.length} duplicate number${duplicates.length === 1 ? "" : "s"} skipped.` : "No valid lead rows found.");
        return;
      }
      for (let start = 0; start < parsed.length; start += IMPORT_BATCH_SIZE) {
        const batch = writeBatch(db);
        parsed.slice(start, start + IMPORT_BATCH_SIZE).forEach((lead) => batch.set(doc(collection(db, "crmLeads")), {
        ...lead, status: "New", assignedTo: userId, assignedName: userName, createdByUid: userId,
        agencyVisitAt: null, interestBrand: "Any brand", interestModel: "", budgetRange: "Not discussed", whatsappDetailsShared: null,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        }));
        await batch.commit();
      }
      setImportMessage(`${parsed.length} lead${parsed.length === 1 ? "" : "s"} added successfully.${duplicates.length ? ` ${duplicates.length} duplicate number${duplicates.length === 1 ? "" : "s"} skipped.` : ""}`);
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Lead import could not be completed.");
    } finally { setSaving(false); }
  };

  const logout = async () => { await signOut(auth); router.replace("/crm/login"); };

  return <main className="min-h-screen overflow-x-hidden bg-slate-50 p-3 text-slate-900 sm:p-7">
    <header className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl bg-slate-950 px-4 py-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-8 sm:py-6">
      <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-xs">Old Bikes Hub</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Calling CRM</h1><p className="mt-1 break-words text-xs leading-5 text-slate-300 sm:text-sm">Every follow-up is recorded against the customer lead.</p></div>
      <div className="flex flex-wrap gap-2">{isAdmin ? <a href="/admin/dashboard" className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold hover:bg-white/10 sm:px-4 sm:py-2.5 sm:text-sm">Admin panel</a> : <span className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm">{userName}</span>}<button onClick={logout} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"><LogOut size={15} /> Sign out</button></div>
    </header>

    <section className="mx-auto mt-4 max-w-7xl rounded-2xl border border-orange-100 bg-orange-50 p-3 sm:mt-6 sm:p-4">
      <div className="flex items-center justify-between"><div><h2 className="font-black text-slate-900">Today&apos;s Follow-ups</h2><p className="mt-1 text-sm text-slate-600">{todaysFollowUps.length} customer{todaysFollowUps.length === 1 ? "" : "s"} scheduled for today</p></div><CalendarClock className="text-orange-500" /></div>
      {todaysFollowUps.length > 0 ? <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{todaysFollowUps.map((lead) => <button key={lead.id} onClick={() => openLead(lead)} className="shrink-0 rounded-xl border border-orange-200 bg-white px-3 py-2 text-left text-sm shadow-sm hover:border-orange-400"><span className="block font-black">{lead.name}</span><span className="text-slate-500">{lead.phone}</span></button>)}</div> : <p className="mt-3 text-sm text-slate-500">No follow-up calls are scheduled for today.</p>}
    </section>

    <section className="mx-auto mt-4 grid max-w-7xl gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-3 shadow-sm sm:p-4">
          <div className="relative col-span-2"><Search size={18} className="absolute left-3 top-3.5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or caller" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 outline-none focus:border-orange-500" /></div>
          <label className="col-span-2 text-xs font-bold text-slate-600 sm:col-auto">Agency Visit From<input type="date" value={visitFrom} onChange={(event) => setVisitFrom(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-500" /></label>
          <label className="col-span-2 text-xs font-bold text-slate-600 sm:col-auto">Agency Visit To<input type="date" value={visitTo} min={visitFrom || undefined} onChange={(event) => setVisitTo(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-orange-500" /></label>
          <select value={filter} onChange={(event) => setFilter(event.target.value as LeadStatus | "All")} className="w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-orange-500"><option value="All">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
          <button onClick={() => setShowForm((current) => !current)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-3 font-black text-white hover:bg-orange-600"><CirclePlus size={18} /> Add lead</button>
        </div>
        {isAdmin && <form onSubmit={addCaller} className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 sm:p-4"><p className="font-black text-slate-900">Add calling team member</p><p className="mt-1 text-sm text-slate-600">They will log in with their mobile number and the shared calling-team code.</p><div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><input required value={callerName} onChange={(event) => setCallerName(event.target.value)} placeholder="Caller name" className="rounded-xl border border-emerald-100 bg-white px-3 py-2.5" /><input required value={callerPhone} onChange={(event) => setCallerPhone(event.target.value)} inputMode="tel" placeholder="10-digit mobile number" className="rounded-xl border border-emerald-100 bg-white px-3 py-2.5" /><button disabled={saving} className="rounded-xl bg-emerald-700 px-4 py-2.5 font-bold text-white disabled:opacity-60">{saving ? "Adding..." : "Add user"}</button></div>{callerMessage && <p className={`mt-3 rounded-xl px-3 py-2 text-sm font-bold ${callerError ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>{callerError ? `Could not add user: ${callerMessage}` : callerMessage}</p>}</form>}        <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="font-black text-slate-900">Bulk add leads</p><p className="mt-1 text-sm text-slate-600">Upload any number of leads. Large files are safely saved in automatic batches.</p></div><div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"><button type="button" onClick={() => downloadTemplate("xlsx")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><Download size={16} /> Excel format</button><button type="button" onClick={() => downloadTemplate("csv")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><Download size={16} /> CSV format</button><button type="button" disabled={saving} onClick={() => fileInput.current?.click()} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white disabled:opacity-60 sm:col-auto"><FileUp size={16} /> Upload file</button><input ref={fileInput} onChange={importLeads} accept=".csv,.xlsx,.xls" type="file" className="hidden" /></div></div>
          <p className="mt-3 text-xs font-semibold text-slate-500">Required: Name, Phone. Optional: Email, Source (WhatsApp, Phone call, Walk-in, Website, Other), Follow-up Date (YYYY-MM-DD). Duplicate phone numbers are skipped automatically.</p>{importMessage && <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${importMessage.includes("successfully") ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>{importMessage}</p>}{duplicateLeads.length > 0 && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3"><p className="font-black text-amber-900">Skipped duplicate numbers ({duplicateLeads.length})</p><div className="mt-2 max-h-44 space-y-1 overflow-y-auto text-sm text-amber-900">{duplicateLeads.map((lead, index) => <p key={`${lead.phone}-${index}`}><span className="font-bold">{lead.name}</span> · {lead.phone} <span className="text-amber-700">({lead.reason})</span></p>)}</div></div>}
        </div>
        {showForm && <form onSubmit={createLead} className="mt-4 grid gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 sm:grid-cols-2"><input required value={leadForm.name} onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Customer name" /><input required value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Phone / WhatsApp number" /><input type="email" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Email (optional)" /><select value={leadForm.source} onChange={(event) => setLeadForm({ ...leadForm, source: event.target.value as LeadSource })} className="rounded-xl border border-orange-100 bg-white px-3 py-3">{SOURCES.map((source) => <option key={source}>{source}</option>)}</select>{isAdmin && <select value={leadForm.assignedTo} onChange={(event) => setLeadForm({ ...leadForm, assignedTo: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3 sm:col-span-2"><option value="">Assign to me</option>{assignableMembers.filter((member) => member.uid !== userId).map((member) => <option key={member.uid} value={member.uid}>{member.name} {member.email ? `(${member.email})` : ""}</option>)}</select>}<div className="flex gap-2 sm:col-span-2"><button disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60">Save lead</button><button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-5 py-3 font-bold text-slate-600">Cancel</button></div></form>}
        {isAdmin && visibleLeads.length > 0 && <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={visibleLeads.length > 0 && visibleLeads.every((lead) => selectedLeadIds.has(lead.id))} onChange={() => setSelectedLeadIds((current) => current.size === visibleLeads.length ? new Set() : new Set(visibleLeads.map((lead) => lead.id)))} className="h-4 w-4 accent-orange-500" /> Select all shown</label><span className="text-sm font-semibold text-slate-500">{selectedLeadIds.size} selected</span><div className="flex min-w-0 flex-1 gap-2"><select value={bulkAssignee} onChange={(event) => setBulkAssignee(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"><option value="">Assign selected leads to…</option>{assignableMembers.map((member) => <option key={member.uid} value={member.uid}>{member.name || member.email}</option>)}</select><button type="button" disabled={saving || !bulkAssignee || selectedLeadIds.size === 0} onClick={assignSelectedLeads} className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Assign</button></div></div></div>}        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? <p className="p-8 text-center font-semibold text-slate-500">Loading leads...</p> : visibleLeads.length === 0 ? <div className="p-12 text-center"><ClipboardList className="mx-auto text-slate-300" size={40} /><h2 className="mt-3 text-xl font-black">No leads here yet</h2><p className="mt-1 text-sm text-slate-500">Add the first customer enquiry to start the calling workflow.</p></div> : <div className="divide-y divide-slate-100">{visibleLeads.map((lead) => <div key={lead.id} className={`flex items-center gap-2 px-3 py-3 sm:px-4 ${selected?.id === lead.id ? "bg-orange-50" : ""}`}>{isAdmin && <label className="flex shrink-0 items-center p-1"><input aria-label={`Select ${lead.name}`} type="checkbox" checked={selectedLeadIds.has(lead.id)} onChange={() => toggleLeadSelection(lead.id)} className="h-4 w-4 accent-orange-500" /></label>}<button onClick={() => openLead(lead)} className="flex min-w-0 flex-1 items-center gap-3 text-left transition hover:bg-orange-50 sm:gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-black text-slate-600">{lead.name.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate font-black">{lead.name}</p><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${lead.status === "Won" ? "bg-emerald-100 text-emerald-700" : lead.status === "Lost" ? "bg-rose-100 text-rose-700" : "bg-orange-100 text-orange-700"}`}>{lead.status}</span></div><p className="mt-1 truncate text-sm text-slate-500">{lead.phone} · {lead.source} · {lead.assignedName}</p></div></button></div>)}</div>}
        </div>
      </div>
      <aside className="min-h-[340px] rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        {!selected || !callForm ? <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><UserRound size={40} className="text-slate-300" /><h2 className="mt-3 text-lg font-black">Select a lead</h2><p className="mt-1 text-sm text-slate-500">Open a customer to record the call outcome.</p></div> : <div>
          <div className="flex items-start justify-between gap-3"><div><h2 className="break-words text-xl font-black sm:text-2xl">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">Added {displayDate(selected.createdAt)} · {selected.source}</p></div><button onClick={() => { setRemarks([]); setCallForm(null); setSelected(null); }} className="text-sm font-bold text-slate-500">Close</button></div>
          <div className="mt-5 grid gap-2"><a href={`tel:${selected.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white"><Phone size={17} /> Call {selected.phone}</a><a target="_blank" rel="noreferrer" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-bold text-emerald-800"><ExternalLink size={17} /> Open WhatsApp</a></div>
          <form onSubmit={saveCallUpdate} className="mt-6 border-t border-slate-100 pt-5"><h3 className="font-black">After-call update</h3><p className="mt-1 text-xs text-slate-500">Fill only what was discussed, then save once.</p><div className="mt-3 flex flex-wrap gap-2">{QUICK_OUTCOMES.map((outcome) => <button type="button" key={outcome.label} onClick={() => applyQuickOutcome(outcome)} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-orange-400 hover:bg-orange-50">{outcome.label}</button>)}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600">Lead Status<select value={callForm.status} onChange={(event) => setCallForm({ ...callForm, status: event.target.value as LeadStatus })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold">{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><label className="text-xs font-bold text-slate-600">Next Follow-up Date<input type="date" value={callForm.nextFollowUpAt} onChange={(event) => setCallForm({ ...callForm, nextFollowUpAt: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label><label className="text-xs font-bold text-slate-600">Agency Visit Date<input type="date" value={callForm.agencyVisitAt} onChange={(event) => setCallForm({ ...callForm, agencyVisitAt: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label><label className="text-xs font-bold text-slate-600">Preferred Brand<select value={callForm.interestBrand} onChange={(event) => setCallForm({ ...callForm, interestBrand: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">{BRANDS.map((brand) => <option key={brand}>{brand}</option>)}</select></label></div>
            <label className="mt-3 block text-xs font-bold text-slate-600">Preferred Model<input value={callForm.interestModel} onChange={(event) => setCallForm({ ...callForm, interestModel: event.target.value })} maxLength={100} placeholder="Example: Classic 350, Shine 125" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-slate-600">Budget Range<select value={callForm.budgetRange} onChange={(event) => setCallForm({ ...callForm, budgetRange: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">{BUDGETS.map((budget) => <option key={budget}>{budget}</option>)}</select></label><label className="text-xs font-bold text-slate-600">Details Shared on WhatsApp?<select value={callForm.whatsappDetailsShared} onChange={(event) => setCallForm({ ...callForm, whatsappDetailsShared: event.target.value as CallForm["whatsappDetailsShared"] })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option>Not yet</option><option>Yes</option><option>No</option></select></label></div>
            <label className="mt-3 block text-xs font-bold text-slate-600">Call Notes<textarea value={callForm.remark} onChange={(event) => setCallForm({ ...callForm, remark: event.target.value })} maxLength={2000} placeholder="Example: Customer wants a black Classic 350. Details sent on WhatsApp; will visit Saturday." className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500" /></label><button disabled={saving} className="mt-3 w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-white disabled:opacity-60">{saving ? "Saving..." : "Save after-call update"}</button>
          </form>
          <div className="mt-5 border-t border-slate-100 pt-4"><div className="flex items-center justify-between gap-3"><h3 className="font-black">Related Listed Bikes</h3><span className="text-xs font-bold text-slate-500">{relatedBikes.length} available</span></div>{relatedBikes.length > 0 ? <div className="mt-3 space-y-2">{relatedBikes.map((bike) => <a key={bike.id} href={bike.slug ? `/bike/${bike.slug}` : "/buy-bikes"} target="_blank" rel="noreferrer" className="block rounded-xl border border-slate-200 p-3 transition hover:border-orange-400 hover:bg-orange-50"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-bold">{bike.name || bike.brand}</p><p className="mt-1 text-xs text-slate-500">{bike.location || "Bihar"}{bike.year ? ` · ${bike.year}` : ""}</p></div><p className="shrink-0 whitespace-nowrap font-black text-orange-600">₹{Number(bike.price).toLocaleString("en-IN")}</p></div></a>)}</div> : <p className="mt-2 text-sm text-slate-500">No matching available bike found. Update preferred brand or budget to widen results.</p>}</div>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarClock size={14} /> Assigned to {selected.assignedName}</p><div className="mt-5 border-t border-slate-100 pt-4"><h3 className="inline-flex items-center gap-2 font-black"><MessageSquareText size={18} /> Previous remarks</h3><div className="mt-3 space-y-3">{remarks.length === 0 ? <p className="text-sm text-slate-500">No remarks yet.</p> : remarks.map((remark) => <article key={remark.id} className="rounded-xl bg-slate-50 p-3"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{remark.text}</p><p className="mt-2 text-xs font-semibold text-slate-400">{displayDate(remark.createdAt)} · recorded securely</p></article>)}</div></div>
        </div>}
      </aside>
    </section>
  </main>;
}
