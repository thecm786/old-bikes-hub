"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CalendarClock, CirclePlus, ClipboardList, ExternalLink, LogOut, MessageSquareText, Phone, Search, UserRound } from "lucide-react";
import { auth, db } from "@/firebase/firebase";

const STATUSES = ["New", "Contacted", "Follow-up", "Qualified", "Won", "Lost"] as const;
const SOURCES = ["WhatsApp", "Phone call", "Walk-in", "Website", "Other"] as const;
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
  createdAt?: Timestamp;
};

type Remark = { id: string; text: string; createdByUid: string; createdAt?: Timestamp };
type CrmUser = { uid: string; name: string; email: string; active: boolean };

const blankLead = { name: "", phone: "", email: "", source: "WhatsApp" as LeadSource, assignedTo: "" };

function dateValue(value: Timestamp | null) {
  if (!value) return "";
  const date = value.toDate();
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 10);
}

function displayDate(value?: Timestamp) {
  return value ? value.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export default function CrmPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [members, setMembers] = useState<CrmUser[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("Calling team");
  const [leadForm, setLeadForm] = useState(blankLead);
  const [remarkText, setRemarkText] = useState("");

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

  const selectedId = selected?.id;
  useEffect(() => {
    if (!selectedId) return;
    return onSnapshot(query(collection(db, "crmLeads", selectedId, "remarks"), orderBy("createdAt", "desc")), (snapshot) => {
      setRemarks(snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<Remark, "id">) })));
    }, (error) => console.error("CRM remark listener error:", error));
  }, [selectedId]);

  const visibleLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => (filter === "All" || lead.status === filter) && (!term || [lead.name, lead.phone, lead.email, lead.assignedName].join(" ").toLowerCase().includes(term)));
  }, [filter, leads, search]);

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
        nextFollowUpAt: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      setLeadForm(blankLead);
      setShowForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lead could not be saved.");
    } finally { setSaving(false); }
  };

  const updateLead = async (field: "status" | "nextFollowUpAt", value: LeadStatus | string) => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "crmLeads", selected.id), {
        [field]: field === "nextFollowUpAt" ? (value ? Timestamp.fromDate(new Date(`${value}T00:00:00`)) : null) : value,
        updatedAt: serverTimestamp(),
      });
      setSelected((current) => current ? { ...current, [field]: field === "nextFollowUpAt" ? (value ? Timestamp.fromDate(new Date(`${value}T00:00:00`)) : null) : value } : null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lead could not be updated.");
    } finally { setSaving(false); }
  };

  const addRemark = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !remarkText.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "crmLeads", selected.id, "remarks"), { text: remarkText.trim(), createdByUid: userId, createdAt: serverTimestamp() });
      await updateDoc(doc(db, "crmLeads", selected.id), { updatedAt: serverTimestamp() });
      setRemarkText("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Remark could not be saved.");
    } finally { setSaving(false); }
  };

  const logout = async () => { await signOut(auth); router.replace("/crm/login"); };

  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-7">
    <header className="mx-auto flex max-w-7xl flex-col gap-4 rounded-3xl bg-slate-950 px-5 py-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Old Bikes Hub</p><h1 className="mt-1 text-3xl font-black">Calling CRM</h1><p className="mt-1 text-sm text-slate-300">Every follow-up is recorded against the customer lead.</p></div>
      <div className="flex gap-2"><a href="/admin/dashboard" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/10">Admin</a><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/20"><LogOut size={16} /> Sign out</button></div>
    </header>

    <section className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div>
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1"><Search size={18} className="absolute left-3 top-3.5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or caller" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 outline-none focus:border-orange-500" /></div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as LeadStatus | "All")} className="rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-orange-500"><option value="All">All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
          <button onClick={() => setShowForm((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-black text-white hover:bg-orange-600"><CirclePlus size={18} /> Add lead</button>
        </div>
        {showForm && <form onSubmit={createLead} className="mt-4 grid gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 sm:grid-cols-2"><input required value={leadForm.name} onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Customer name" /><input required value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Phone / WhatsApp number" /><input type="email" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3" placeholder="Email (optional)" /><select value={leadForm.source} onChange={(event) => setLeadForm({ ...leadForm, source: event.target.value as LeadSource })} className="rounded-xl border border-orange-100 bg-white px-3 py-3">{SOURCES.map((source) => <option key={source}>{source}</option>)}</select>{isAdmin && <select value={leadForm.assignedTo} onChange={(event) => setLeadForm({ ...leadForm, assignedTo: event.target.value })} className="rounded-xl border border-orange-100 bg-white px-3 py-3 sm:col-span-2"><option value="">Assign to me</option>{members.map((member) => <option key={member.uid} value={member.uid}>{member.name} {member.email ? `(${member.email})` : ""}</option>)}</select>}<div className="flex gap-2 sm:col-span-2"><button disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60">Save lead</button><button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-5 py-3 font-bold text-slate-600">Cancel</button></div></form>}
        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? <p className="p-8 text-center font-semibold text-slate-500">Loading leads...</p> : visibleLeads.length === 0 ? <div className="p-12 text-center"><ClipboardList className="mx-auto text-slate-300" size={40} /><h2 className="mt-3 text-xl font-black">No leads here yet</h2><p className="mt-1 text-sm text-slate-500">Add the first customer enquiry to start the calling workflow.</p></div> : <div className="divide-y divide-slate-100">{visibleLeads.map((lead) => <button key={lead.id} onClick={() => { setRemarks([]); setSelected(lead); }} className={`flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-orange-50 ${selected?.id === lead.id ? "bg-orange-50" : ""}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-black text-slate-600">{lead.name.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate font-black">{lead.name}</p><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${lead.status === "Won" ? "bg-emerald-100 text-emerald-700" : lead.status === "Lost" ? "bg-rose-100 text-rose-700" : "bg-orange-100 text-orange-700"}`}>{lead.status}</span></div><p className="mt-1 truncate text-sm text-slate-500">{lead.phone} · {lead.source} · {lead.assignedName}</p></div></button>)}</div>}
        </div>
      </div>
      <aside className="min-h-[340px] rounded-2xl bg-white p-5 shadow-sm">
        {!selected ? <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"><UserRound size={40} className="text-slate-300" /><h2 className="mt-3 text-lg font-black">Select a lead</h2><p className="mt-1 text-sm text-slate-500">Open a customer to update the calling status and leave a remark.</p></div> : <div><div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-black">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">Added {displayDate(selected.createdAt)} · {selected.source}</p></div><button onClick={() => { setRemarks([]); setSelected(null); }} className="text-sm font-bold text-slate-500">Close</button></div><div className="mt-5 grid gap-2"><a href={`tel:${selected.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-bold text-white"><Phone size={17} /> Call {selected.phone}</a><a target="_blank" rel="noreferrer" href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-bold text-emerald-800"><ExternalLink size={17} /> Open WhatsApp</a></div><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs font-bold text-slate-600">Calling status<select disabled={saving} value={selected.status} onChange={(event) => updateLead("status", event.target.value as LeadStatus)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold"><>{STATUSES.map((status) => <option key={status}>{status}</option>)}</></select></label><label className="text-xs font-bold text-slate-600">Next follow-up<input disabled={saving} type="date" value={dateValue(selected.nextFollowUpAt)} onChange={(event) => updateLead("nextFollowUpAt", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label></div><p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarClock size={14} /> Assigned to {selected.assignedName}</p><div className="mt-6 border-t border-slate-100 pt-5"><h3 className="inline-flex items-center gap-2 font-black"><MessageSquareText size={18} /> Calling remarks</h3><form onSubmit={addRemark} className="mt-3"><textarea maxLength={2000} value={remarkText} onChange={(event) => setRemarkText(event.target.value)} placeholder="Example: Called at 3 PM; customer wants inspection tomorrow." className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500" /><button disabled={saving || !remarkText.trim()} className="mt-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60">Save remark</button></form><div className="mt-4 space-y-3">{remarks.length === 0 ? <p className="text-sm text-slate-500">No remarks yet.</p> : remarks.map((remark) => <article key={remark.id} className="rounded-xl bg-slate-50 p-3"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{remark.text}</p><p className="mt-2 text-xs font-semibold text-slate-400">{displayDate(remark.createdAt)} · recorded securely</p></article>)}</div></div></div>}
      </aside>
    </section>
  </main>;
}
