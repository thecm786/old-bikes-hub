
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onIdTokenChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Download,
  PhoneCall,
  Users,
  Trophy,
  Clock3,
  UserCheck,
  RefreshCw,
} from "lucide-react";

import { auth, db } from "@/firebase/firebase";

type LeadStatus =
  | "New"
  | "No Answer"
  | "Contacted"
  | "Follow-up"
  | "Qualified"
  | "Won"
  | "Lost";

type DateFilter =
  | "today"
  | "yesterday"
  | "7days"
  | "month"
  | "custom";

type Activity = {
  id: string;
  leadId: string;
  agentUid: string;
  agentName: string;
  status: LeadStatus;
  createdAt?: Timestamp | null;
};

type Lead = {
  id: string;
  name?: string;
  phone?: string;
  assignedTo?: string;
  assignedName?: string;
  status?: LeadStatus;
  agencyVisitAt?: Timestamp | null;
  nextFollowUpAt?: Timestamp | null;
  createdAt?: Timestamp | null;
};

type Caller = {
  uid: string;
  name: string;
  phone?: string;
  email?: string;
  active?: boolean;
};

type CallerStats = {
  uid: string;
  name: string;
  totalCalls: number;
  assignedLeads: number;
  contacted: number;
  followUps: number;
  qualified: number;
  won: number;
  lost: number;
  noAnswer: number;
  agencyVisits: number;
};

const DATE_OPTIONS: {
  value: DateFilter;
  label: string;
}[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7days", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "custom", label: "Custom Range" },
];

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function timestampDate(
  value: Timestamp | null | undefined
): Date | null {
  if (!value) return null;

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate();
  }

  return null;
}

function formatDateTime(
  value: Timestamp | null | undefined
): string {
  const date = timestampDate(value);

  if (!date) return "—";

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getDateRange(
  filter: DateFilter,
  customFrom: string,
  customTo: string
): {
  from: string;
  to: string;
} {
  const today = new Date();
  const end = dateKey(today);

  if (filter === "today") {
    return { from: end, to: end };
  }

  if (filter === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const key = dateKey(yesterday);

    return { from: key, to: key };
  }

  if (filter === "7days") {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);

    return {
      from: dateKey(start),
      to: end,
    };
  }

  if (filter === "month") {
    return {
      from: dateKey(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
      ),
      to: end,
    };
  }

  return {
    from: customFrom,
    to: customTo,
  };
}

function withinRange(
  value: Timestamp | null | undefined,
  from: string,
  to: string
): boolean {
  const date = timestampDate(value);

  if (!date) return false;

  const key = dateKey(date);

  return (!from || key >= from) && (!to || key <= to);
}

function csvCell(value: unknown): string {
  const text = String(value ?? "");

  // Prevent spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(text)
    ? `'${text}`
    : text;

  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadCsv(
  filename: string,
  rows: Array<Array<string | number>>
) {
  const content = rows
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF", content],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: typeof PhoneCall;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>

        <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-3 text-3xl font-black text-slate-950">
        {value.toLocaleString("en-IN")}
      </p>

      {description && (
        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default function CrmReportsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [callers, setCallers] = useState<Caller[]>([]);

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("today");

  const [customFrom, setCustomFrom] = useState(
    dateKey(new Date())
  );

  const [customTo, setCustomTo] = useState(
    dateKey(new Date())
  );

  const [selectedCaller, setSelectedCaller] =
    useState("all");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          router.replace("/crm/login");
          return;
        }

        try {
          const token = await currentUser.getIdTokenResult();
          const admin = token.claims.admin === true;

          setUser(currentUser);
          setIsAdmin(admin);

          if (!admin) {
            router.replace("/crm");
            return;
          }
        } catch (err) {
          console.error("Report authentication error:", err);
          setError("Could not verify admin access.");
        } finally {
          setAuthLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    let activitiesReady = false;
    let leadsReady = false;
    let callersReady = false;

    const checkReady = () => {
      if (
        activitiesReady &&
        leadsReady &&
        callersReady
      ) {
        setDataLoading(false);
      }
    };

    const unsubscribeActivities = onSnapshot(
      collection(db, "crmCallActivities"),
      (snapshot) => {
        setActivities(
          snapshot.docs.map((item) => ({
            ...(item.data() as Omit<Activity, "id">),
            id: item.id,
          }))
        );

        activitiesReady = true;
        checkReady();
      },
      (err) => {
        console.error("Activities error:", err);
        setError(
          "Could not load call activities. Check Firestore permissions."
        );
        setDataLoading(false);
      }
    );

    const unsubscribeLeads = onSnapshot(
      collection(db, "crmLeads"),
      (snapshot) => {
        setLeads(
          snapshot.docs.map((item) => ({
            ...(item.data() as Omit<Lead, "id">),
            id: item.id,
          }))
        );

        leadsReady = true;
        checkReady();
      },
      (err) => {
        console.error("Leads error:", err);
        setError("Could not load CRM leads.");
        setDataLoading(false);
      }
    );

    const unsubscribeCallers = onSnapshot(
      query(
        collection(db, "crmUsers"),
        where("active", "==", true)
      ),
      (snapshot) => {
        setCallers(
          snapshot.docs.map((item) => ({
            ...(item.data() as Omit<Caller, "uid">),
            uid:
              (item.data().uid as string | undefined) ||
              item.id,
          }))
        );

        callersReady = true;
        checkReady();
      },
      (err) => {
        console.error("Callers error:", err);
        setError("Could not load calling team.");
        setDataLoading(false);
      }
    );

    return () => {
      unsubscribeActivities();
      unsubscribeLeads();
      unsubscribeCallers();
    };
  }, [isAdmin]);

  const range = useMemo(
    () =>
      getDateRange(
        dateFilter,
        customFrom,
        customTo
      ),
    [dateFilter, customFrom, customTo]
  );

  const filteredActivities = useMemo(() => {
    return activities
      .filter(
        (activity) =>
          withinRange(
            activity.createdAt,
            range.from,
            range.to
          ) &&
          (selectedCaller === "all" ||
            activity.agentUid === selectedCaller)
      )
      .sort(
        (a, b) =>
          (timestampDate(b.createdAt)?.getTime() || 0) -
          (timestampDate(a.createdAt)?.getTime() || 0)
      );
  }, [
    activities,
    range.from,
    range.to,
    selectedCaller,
  ]);

  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (lead) =>
          selectedCaller === "all" ||
          lead.assignedTo === selectedCaller
      ),
    [leads, selectedCaller]
  );

  const stats = useMemo(() => {
    const count = (status: LeadStatus) =>
      filteredActivities.filter(
        (activity) => activity.status === status
      ).length;

    const visits = filteredLeads.filter(
      (lead) =>
        withinRange(
          lead.agencyVisitAt,
          range.from,
          range.to
        )
    ).length;

    const followUpDates = filteredLeads.filter(
      (lead) =>
        withinRange(
          lead.nextFollowUpAt,
          range.from,
          range.to
        )
    ).length;

    return {
      totalCalls: filteredActivities.length,
      assignedLeads: filteredLeads.length,
      contacted: count("Contacted"),
      qualified: count("Qualified"),
      won: count("Won"),
      lost: count("Lost"),
      noAnswer: count("No Answer"),
      followUpOutcomes: count("Follow-up"),
      agencyVisits: visits,
      scheduledFollowUps: followUpDates,
    };
  }, [
    filteredActivities,
    filteredLeads,
    range.from,
    range.to,
  ]);

  const callerStats = useMemo<CallerStats[]>(() => {
    const allCallers = new Map<string, string>();

    callers.forEach((caller) => {
      allCallers.set(caller.uid, caller.name);
    });

    // Include inactive or removed callers with historical activity.
    activities.forEach((activity) => {
      if (!allCallers.has(activity.agentUid)) {
        allCallers.set(
          activity.agentUid,
          activity.agentName || "Former caller"
        );
      }
    });

    leads.forEach((lead) => {
      if (
        lead.assignedTo &&
        !allCallers.has(lead.assignedTo)
      ) {
        allCallers.set(
          lead.assignedTo,
          lead.assignedName || "Unknown caller"
        );
      }
    });

    const result: CallerStats[] = [];

    allCallers.forEach((name, uid) => {
      if (
        selectedCaller !== "all" &&
        selectedCaller !== uid
      ) {
        return;
      }

      const calls = filteredActivities.filter(
        (activity) => activity.agentUid === uid
      );

      const assigned = leads.filter(
        (lead) => lead.assignedTo === uid
      );

      const count = (status: LeadStatus) =>
        calls.filter(
          (activity) => activity.status === status
        ).length;

      result.push({
        uid,
        name,
        totalCalls: calls.length,
        assignedLeads: assigned.length,
        contacted: count("Contacted"),
        followUps: count("Follow-up"),
        qualified: count("Qualified"),
        won: count("Won"),
        lost: count("Lost"),
        noAnswer: count("No Answer"),
        agencyVisits: assigned.filter(
          (lead) =>
            withinRange(
              lead.agencyVisitAt,
              range.from,
              range.to
            )
        ).length,
      });
    });

    return result
      .filter((caller) =>
        caller.name
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
      .sort(
        (a, b) =>
          b.totalCalls - a.totalCalls ||
          a.name.localeCompare(b.name)
      );
  }, [
    callers,
    activities,
    leads,
    filteredActivities,
    selectedCaller,
    range.from,
    range.to,
    search,
  ]);

  const exportPerformance = () => {
    downloadCsv(
      `obh-caller-performance-${range.from}-${range.to}.csv`,
      [
        [
          "Caller",
          "Total Calls",
          "Assigned Leads",
          "Contacted",
          "Follow-ups",
          "Qualified",
          "Won",
          "Lost",
          "No Answer",
          "Agency Visits",
        ],
        ...callerStats.map((caller) => [
          caller.name,
          caller.totalCalls,
          caller.assignedLeads,
          caller.contacted,
          caller.followUps,
          caller.qualified,
          caller.won,
          caller.lost,
          caller.noAnswer,
          caller.agencyVisits,
        ]),
      ]
    );
  };

  const exportActivities = () => {
    downloadCsv(
      `obh-call-activities-${range.from}-${range.to}.csv`,
      [
        [
          "Date & Time",
          "Caller",
          "Lead ID",
          "Customer",
          "Phone",
          "Saved Status",
        ],
        ...filteredActivities.map((activity) => {
          const lead = leads.find(
            (item) => item.id === activity.leadId
          );

          return [
            formatDateTime(activity.createdAt),
            activity.agentName,
            activity.leadId,
            lead?.name || "Unknown",
            lead?.phone || "",
            activity.status,
          ];
        }),
      ]
    );
  };

  if (authLoading || (!isAdmin && !error)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="font-semibold text-slate-500">
          Verifying admin access...
        </p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="font-black">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error || "You cannot view this report."}
          </p>
          <Link
            href="/crm"
            className="mt-4 inline-block font-bold text-orange-600"
          >
            Back to CRM
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-7">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg sm:rounded-3xl sm:p-7">
          <Link
            href="/crm"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Calling CRM
          </Link>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
                Old Bikes Hub
              </p>

              <h1 className="mt-2 flex items-center gap-3 text-2xl font-black sm:text-3xl">
                <BarChart3 className="text-orange-400" />
                Performance Report
              </h1>

              <p className="mt-2 text-sm text-slate-300">
                Caller-wise activity, follow-ups and conversions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportPerformance}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
              >
                <Download size={16} />
                Export Performance
              </button>

              <button
                type="button"
                onClick={exportActivities}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold hover:bg-white/10"
              >
                <Download size={16} />
                Export Calls
              </button>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-bold text-slate-600">
              Date Range
              <select
                value={dateFilter}
                onChange={(event) =>
                  setDateFilter(
                    event.target.value as DateFilter
                  )
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                {DATE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-bold text-slate-600">
              Calling Team Member
              <select
                value={selectedCaller}
                onChange={(event) =>
                  setSelectedCaller(event.target.value)
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
              >
                <option value="all">All Callers</option>

                {[
                  ...new Map(
                    [
                      ...callers.map(
                        (caller) =>
                          [caller.uid, caller.name] as const
                      ),
                      ...activities.map(
                        (activity) =>
                          [
                            activity.agentUid,
                            activity.agentName,
                          ] as const
                      ),
                    ]
                  ),
                ].map(([uid, name]) => (
                  <option key={uid} value={uid}>
                    {name || "Unknown caller"}
                  </option>
                ))}
              </select>
            </label>

            {dateFilter === "custom" && (
              <>
                <label className="text-xs font-bold text-slate-600">
                  From
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(event) =>
                      setCustomFrom(event.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                  />
                </label>

                <label className="text-xs font-bold text-slate-600">
                  To
                  <input
                    type="date"
                    min={customFrom}
                    value={customTo}
                    onChange={(event) =>
                      setCustomTo(event.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"
                  />
                </label>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
            <CalendarDays size={15} />
            {range.from} to {range.to}
          </div>
        </section>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {dataLoading ? (
          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-white p-12">
            <RefreshCw
              size={20}
              className="animate-spin text-orange-500"
            />
            Loading performance data...
          </div>
        ) : (
          <>
            <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                title="Total Saved Calls"
                value={stats.totalCalls}
                icon={PhoneCall}
                description="Each saved after-call update"
              />

              <StatCard
                title="Assigned Leads"
                value={stats.assignedLeads}
                icon={Users}
                description="Current assigned lead count"
              />

              <StatCard
                title="Contacted Outcomes"
                value={stats.contacted}
                icon={UserCheck}
                description="Calls saved as Contacted"
              />

              <StatCard
                title="Qualified Outcomes"
                value={stats.qualified}
                icon={Trophy}
                description="Calls saved as Qualified"
              />

              <StatCard
                title="Won Outcomes"
                value={stats.won}
                icon={Trophy}
                description="Calls saved as Won"
              />

              <StatCard
                title="No Answer Outcomes"
                value={stats.noAnswer}
                icon={PhoneCall}
              />

              <StatCard
                title="Agency Visits"
                value={stats.agencyVisits}
                icon={CalendarDays}
                description="Current visit dates in selected range"
              />

              <StatCard
                title="Scheduled Follow-ups"
                value={stats.scheduledFollowUps}
                icon={Clock3}
                description="Current follow-up dates in selected range"
              />
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
                <div>
                  <h2 className="text-lg font-black">
                    Caller-wise Performance
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Sorted by total saved calls
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search caller name"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 sm:w-64"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      {[
                        "Caller",
                        "Calls",
                        "Leads",
                        "Contacted",
                        "Follow-ups",
                        "Qualified",
                        "Won",
                        "Lost",
                        "No Answer",
                        "Visits",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-3 font-bold"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {callerStats.map((caller) => (
                      <tr
                        key={caller.uid}
                        className="hover:bg-orange-50"
                      >
                        <td className="px-4 py-4 font-bold">
                          {caller.name}
                        </td>

                        <td className="px-4 py-4 font-black text-orange-600">
                          {caller.totalCalls}
                        </td>

                        <td className="px-4 py-4">
                          {caller.assignedLeads}
                        </td>

                        <td className="px-4 py-4">
                          {caller.contacted}
                        </td>

                        <td className="px-4 py-4">
                          {caller.followUps}
                        </td>

                        <td className="px-4 py-4">
                          {caller.qualified}
                        </td>

                        <td className="px-4 py-4 font-bold text-emerald-700">
                          {caller.won}
                        </td>

                        <td className="px-4 py-4 text-rose-600">
                          {caller.lost}
                        </td>

                        <td className="px-4 py-4">
                          {caller.noAnswer}
                        </td>

                        <td className="px-4 py-4">
                          {caller.agencyVisits}
                        </td>
                      </tr>
                    ))}

                    {callerStats.length === 0 && (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No caller records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4 sm:p-5">
                <h2 className="text-lg font-black">
                  Recent Saved Call Activities
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredActivities.length} saved call records in the selected date range
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Caller</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredActivities
                      .slice(0, 100)
                      .map((activity) => {
                        const lead = leads.find(
                          (item) =>
                            item.id === activity.leadId
                        );

                        return (
                          <tr key={activity.id}>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {formatDateTime(
                                activity.createdAt
                              )}
                            </td>

                            <td className="px-4 py-3 font-semibold">
                              {activity.agentName}
                            </td>

                            <td className="px-4 py-3">
                              <p className="font-bold">
                                {lead?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-slate-500">
                                {lead?.phone || ""}
                              </p>
                            </td>

                            <td className="px-4 py-3">
                              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}

                    {filteredActivities.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No saved call activities found for this date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredActivities.length > 100 && (
                <p className="border-t border-slate-100 p-4 text-xs text-slate-500">
                  Showing the latest 100 activities. Use
                  Export Calls to download all filtered
                  records.
                </p>
              )}
            </section>

            <p className="my-6 text-xs leading-5 text-slate-500">
              Reporting note: Calls and status outcomes
              represent saved call activities during the
              selected date range. Assigned Leads shows
              current assignments, not historical
              assignments. Visits and scheduled follow-ups
              are based on dates currently stored on leads;
              they do not confirm attendance or completed
              follow-up calls. Won outcomes are not
              necessarily unique sales.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
