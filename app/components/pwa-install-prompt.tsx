"use client";

import { useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "pwa-install-prompt-dismissed";

function isStandaloneMode() {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

function detectMobile(ua: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
}

function detectIOS(ua: string) {
  return /iPad|iPhone|iPod/i.test(ua);
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const ua = window.navigator.userAgent;
    const mobile = detectMobile(ua);
    const ios = detectIOS(ua);
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === "true";

    return mobile && ios && !dismissed && !isStandaloneMode();
  });
  const isIOS = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return detectIOS(window.navigator.userAgent);
  }, []);

  const isInstallButtonVisible = useMemo(() => {
    return shouldShow && !isIOS && Boolean(deferredPrompt);
  }, [deferredPrompt, isIOS, shouldShow]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .catch(() => {
          // Ignore registration errors silently and let the app run normally.
        });
    }

    const ua = navigator.userAgent;
    const mobile = detectMobile(ua);
    const isDismissed = localStorage.getItem(DISMISS_KEY) === "true";

    if (!mobile || isStandaloneMode() || isDismissed) {
      return;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShouldShow(true);
    };

    const onAppInstalled = () => {
      setShouldShow(false);
      setDeferredPrompt(null);
      localStorage.setItem(DISMISS_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const dismissPrompt = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setShouldShow(false);
  };

  const onInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      localStorage.setItem(DISMISS_KEY, "true");
      setShouldShow(false);
    }

    setDeferredPrompt(null);
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:right-4 sm:w-[380px]">
      <div className="rounded-2xl border border-indigo-400/30 bg-zinc-900/95 p-4 text-zinc-100 shadow-2xl shadow-indigo-900/30 backdrop-blur-md">
        <div className="mb-1 text-sm font-semibold tracking-tight">Install Mess Management</div>
        <p className="text-xs leading-relaxed text-zinc-300">
          {isIOS
            ? "On iPhone, tap Share, then choose Add to Home Screen for quick access."
            : "Add this app to your home screen for faster access and an app-like experience."}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {isInstallButtonVisible ? (
            <button
              type="button"
              onClick={onInstallClick}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
            >
              Install App
            </button>
          ) : null}

          <button
            type="button"
            onClick={dismissPrompt}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}