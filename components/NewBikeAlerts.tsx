"use client";

import { BellRing, CheckCircle2, MessageCircle } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FormEvent, useState } from "react";

import { db } from "@/firebase/firebase";

export default function NewBikeAlerts() {
  const [whatsapp, setWhatsapp] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const enablePush = async () => {
    if (!("Notification" in window)) {
      setMessage("Browser notifications are not supported on this device.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setMessage("Please allow notifications in your browser settings to receive website alerts.");
      return;
    }

    localStorage.setItem("obh-new-bike-alerts", "enabled");
    setPushEnabled(true);
    setMessage("Website alerts are enabled.");
  };

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!whatsapp && !pushEnabled) {
      setMessage("Choose WhatsApp alerts or enable website notifications first.");
      return;
    }
    if (whatsapp && !/^[0-9]{10,15}$/.test(cleanPhone)) {
      setMessage("Enter a valid WhatsApp number.");
      return;
    }

    if (!whatsapp) {
      setMessage("Website alerts are enabled. You will see new listings while Old Bikes Hub is open.");
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, "newBikeAlertSubscribers"), {
        phone: cleanPhone,
        whatsappOptIn: true,
        websitePushOptIn: pushEnabled,
        consent: true,
        status: "Active",
        createdAt: serverTimestamp(),
      });
      setPhone("");
      setMessage("You are subscribed. We will alert you when fresh bikes are listed.");
    } catch {
      setMessage("We could not save your alert request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white px-5 py-10 text-white sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-7 rounded-3xl bg-black p-6 shadow-2xl sm:p-8 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-bold text-orange-300"><BellRing size={16} /> Fresh listings</div>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">New Bike Alerts</h2>
          <p className="mt-3 max-w-xl leading-7 text-gray-300">Be the first to see fresh listings. Get a quick alert when a new used bike becomes available.</p>
        </div>

        <form onSubmit={subscribe} className="rounded-2xl bg-white p-5 text-gray-900 sm:p-6">
          <div className="flex flex-wrap gap-3">
            <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${whatsapp ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200"}`}>
              <input type="checkbox" checked={whatsapp} onChange={(event) => setWhatsapp(event.target.checked)} className="accent-green-600" />
              <MessageCircle size={18} /> WhatsApp alerts
            </label>
            <button type="button" onClick={enablePush} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${pushEnabled ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-400"}`}>
              {pushEnabled ? <CheckCircle2 size={18} /> : <BellRing size={18} />}
              {pushEnabled ? "Website alerts on" : "Enable website alerts"}
            </button>
          </div>

          {whatsapp && <label className="mt-4 block text-sm font-bold text-gray-700">WhatsApp number<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" maxLength={16} placeholder="Enter your WhatsApp number" className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 font-medium outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>}
          <p className="mt-3 text-xs leading-5 text-gray-500">By subscribing, you agree to receive new-bike alerts from Old Bikes Hub. You can opt out anytime.</p>
          <button disabled={saving} type="submit" className="mt-4 w-full rounded-xl bg-orange-500 px-5 py-3 font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Notify Me"}</button>
          {message && <p role="status" className="mt-3 text-sm font-semibold text-gray-700">{message}</p>}
        </form>
      </div>
    </section>
  );
}
