"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";

import { db } from "@/firebase/firebase";

type Listing = { brand?: string; name?: string; price?: number | string; slug?: string };

export default function NewBikeAlertListener() {
  useEffect(() => {
    if (localStorage.getItem("obh-new-bike-alerts") !== "enabled" || Notification.permission !== "granted") return;

    let ready = false;
    const knownIds = new Set<string>();
    const unsubscribe = onSnapshot(query(collection(db, "bikes"), where("status", "==", "Available")), (snapshot) => {
      if (!ready) {
        snapshot.docs.forEach((item) => knownIds.add(item.id));
        ready = true;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type !== "added" || knownIds.has(change.doc.id)) return;
        knownIds.add(change.doc.id);
        const bike = change.doc.data() as Listing;
        const name = [bike.brand, bike.name].filter(Boolean).join(" ") || "a new used bike";
        const notification = new Notification("New bike listed", { body: `${name} is now available on Old Bikes Hub.` });
        notification.onclick = () => {
          window.focus();
          window.location.href = bike.slug ? `/bike/${bike.slug}` : "/buy-bikes";
          notification.close();
        };
      });
    });

    return unsubscribe;
  }, []);

  return null;
}
