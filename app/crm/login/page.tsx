"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";

export default function CrmLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.admin !== true && token.claims.crmAgent !== true) {
        await auth.signOut();
        throw new Error("This account does not have CRM access.");
      }
      router.replace("/crm");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Old Bikes Hub</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Calling CRM</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Use your individual team account. Do not share passwords or customer details outside this workspace.</p>
        <form onSubmit={signIn} className="mt-7 space-y-4">
          <label className="block text-sm font-bold text-slate-700">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" placeholder="team@example.com" />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" placeholder="Enter password" />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-orange-500 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Signing in..." : "Open CRM"}
          </button>
        </form>
      </section>
    </main>
  );
}
