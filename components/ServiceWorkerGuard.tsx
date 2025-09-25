"use client";

import { useEffect } from "react";

// Unregister any active Service Workers in dev to avoid intercepting POST requests (Pinata/Solana RPC)
export default function ServiceWorkerGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const isDev = process.env.NODE_ENV !== "production";
    if (!isDev) return;

    let unregistered = false;

    const unregisterAll = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
          unregistered = true;
        }
        // Clear caches optionally
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        if (unregistered) {
          // Reload once controller changes to fully detach SW
          const onControllerChange = () => {
            window.removeEventListener("controllerchange", onControllerChange);
            window.location.reload();
          };
          window.addEventListener("controllerchange", onControllerChange);
          // Fallback reload after short delay if no controller change fires
          setTimeout(() => {
            try {
              window.location.reload();
            } catch {}
          }, 500);
        }
      } catch (e) {
        console.warn("ServiceWorkerGuard: unregister failed", e);
      }
    };

    unregisterAll();
  }, []);

  return null;
}
