"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      setUser(res.data?.session?.user ?? null);
      setLoading(false);
    });

    const res = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => res.data?.subscription?.unsubscribe();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-50 relative overflow-hidden font-sans">
      {/* Background radial gradient decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/40 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-zinc-800/50 bg-zinc-950/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-xl tracking-tight">M</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-none tracking-tight">Mess Management</h2>
            <span className="text-xs text-zinc-400">Version 2.0</span>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-20 bg-zinc-800 rounded-lg animate-pulse" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center py-16 md:py-24 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Optimized Daily Mess Manager
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-400">
          The simple, effortless way to run your shared mess
        </h1>
        
        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
          No more complex spreadsheets, cell errors, or manual meal logs. Track daily meals, bazar spending, wifi/gas utilities, and auto-calculate month-end balances in seconds.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 text-base font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
            >
              Manage Your Mess
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-8 py-4 text-base font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/30 transform hover:-translate-y-0.5"
              >
                Get Started (Create Mess)
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-base font-medium border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-white rounded-xl transition-all backdrop-blur"
              >
                Join an Existing Mess
              </Link>
            </>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              📊
            </div>
            <h3 className="font-semibold text-lg mb-2">Automated Summary</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Auto-calculate total deposits, daily meal count, meal rate, utility bills, and individual net balances on the fly.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              ⚡
            </div>
            <h3 className="font-semibold text-lg mb-2">Optimized Entry</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Log daily meals and bazar purchases via a simple dashboard. No need for complex grid coordinate updates like in Excel.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              📅
            </div>
            <h3 className="font-semibold text-lg mb-2">History & Records</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Keep a complete historical record of previous months so you can review costs, deposits, and balances anytime.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-500">
        © 2026 Mess Management 2.0. Personal and simple utility for home messes.
      </footer>
    </div>
  );
}
