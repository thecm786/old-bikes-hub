"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";

function callerEmail(value: string) {
  const digits = value.replace(/\D/g, "");
  const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error("Enter a valid 10-digit mobile number.");
  return `crm-${phone}@oldbikeshub.com`;
}

export default function CrmLoginPage() {
  const router = useRouter();
  const [adminLogin, setAdminLogin] = useState(false);
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!identity || !password) return alert(adminLogin ? "Enter your admin email and password." : "Enter your mobile number and calling-team code.");
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, adminLogin ? identity.trim() : callerEmail(identity), password);
      const token = await credential.user.getIdTokenResult(true);
      if (adminLogin ? token.claims.admin !== true : token.claims.crmAgent !== true) { await auth.signOut(); throw new Error(adminLogin ? "This is not an admin account." : "This mobile number does not have calling-team access."); }
      router.replace("/crm");
    } catch (error) { alert(error instanceof Error ? error.message : "Login failed. Please try again."); }
    finally { setLoading(false); }
  };
  const switchMode = () => { setAdminLogin((current) => !current); setIdentity(""); setPassword(""); };
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10"><section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9"><p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Old Bikes Hub</p><h1 className="mt-3 text-3xl font-black text-slate-900">Calling CRM</h1><p className="mt-2 text-sm leading-6 text-slate-600">{adminLogin ? "Sign in with your OBH admin email and password." : "Calling team members sign in with their mobile number and calling-team code."}</p><form onSubmit={signIn} className="mt-7 space-y-4"><label className="block text-sm font-bold text-slate-700">{adminLogin ? "Admin email" : "Mobile number"}<input value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" inputMode={adminLogin ? "email" : "tel"} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" placeholder={adminLogin ? "admin@oldbikeshub.com" : "9876543210"} /></label><label className="block text-sm font-bold text-slate-700">{adminLogin ? "Password" : "Calling-team code"}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" placeholder={adminLogin ? "Enter password" : "OBH2026"} /></label><button disabled={loading} className="w-full rounded-xl bg-orange-500 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : adminLogin ? "Sign in as admin" : "Open CRM"}</button></form><button type="button" onClick={switchMode} className="mt-5 w-full text-sm font-bold text-slate-600 hover:text-orange-600">{adminLogin ? "← Back to calling team login" : "Admin login"}</button></section></main>;
}