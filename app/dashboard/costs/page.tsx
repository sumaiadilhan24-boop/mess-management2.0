"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CostsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Form states
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [buyerId, setBuyerId] = useState("");
  const [category, setCategory] = useState("meal_bazar");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  
  // List states
  const [costs, setCosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const categories = [
    { value: "meal_bazar", name: "Meal Bazar (Regular Daily)" },
    { value: "global_bazar", name: "Monthly Global Bazar (Shared)" },
    { value: "wifi", name: "Wifi Bill" },
    { value: "gas", name: "Gas Bill" },
    { value: "electricity", name: "Electricity Bill" },
    { value: "other", name: "Other Cost" },
  ];

  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  const fetchCosts = async (messId: string) => {
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${lastDay}`;

    // Get profiles in the mess to map IDs to names
    const { data: costsData } = await supabase
      .from("costs")
      .select(`
        id,
        date,
        cost_category,
        items,
        amount,
        profile_id,
        added_by,
        profiles!costs_profile_id_fkey(full_name)
      `)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    setCosts(costsData || []);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileData || !profileData.mess_id) return;
      setProfile(profileData);
      setBuyerId(profileData.id); // Default spender to logged-in user

      const { data: membersData } = await supabase
        .from("profiles")
        .select("*")
        .eq("mess_id", profileData.mess_id);
      
      setMembers(membersData || []);
      await fetchCosts(profileData.mess_id);
      setLoading(false);
    };

    init();
  }, [selectedMonth, selectedYear]);

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatusMsg("Please enter a valid positive amount.");
      return;
    }
    setSaving(true);
    setStatusMsg("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from("costs").insert({
        profile_id: buyerId,
        date,
        cost_category: category,
        items,
        amount: Number(amount),
        added_by: session.user.id,
      });

      if (error) throw error;

      setAmount("");
      setItems("");
      setStatusMsg("Cost logged successfully!");
      if (profile?.mess_id) {
        await fetchCosts(profile.mess_id);
      }
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setStatusMsg("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    if (!confirm("Are you sure you want to delete this cost entry?")) return;
    try {
      const { error } = await supabase.from("costs").delete().eq("id", costId);
      if (error) throw error;
      if (profile?.mess_id) {
        await fetchCosts(profile.mess_id);
      }
    } catch (err: any) {
      alert("Error deleting cost: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center bg-zinc-950 text-zinc-50 py-12">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-zinc-400 text-sm">Loading Cost Books...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 bg-zinc-950 text-zinc-50 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bazar & Costs Log</h1>
          <p className="text-xs text-zinc-400">Log out-of-pocket bazar shopping and utility bill payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Cost Input Form */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6 backdrop-blur">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Record a Cost</h2>
            <p className="text-[11px] text-zinc-500">Record spending for foods, utilities or others</p>
          </div>

          <form onSubmit={handleAddCost} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Spender (Who Paid)</label>
              <select
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name || m.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Items / Description</label>
              <input
                type="text"
                required
                value={items}
                onChange={(e) => setItems(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                placeholder="e.g. Rice, Potatoes, Onions, Wifi Bill"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Amount (TK)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 px-3.5 py-2 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                placeholder="e.g. 1500"
              />
            </div>

            {statusMsg && (
              <p className={`text-xs ${statusMsg.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}>
                {statusMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Log Cost"}
            </button>
          </form>
        </div>

        {/* Right Column: Cost Entries Table */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur flex flex-col h-[560px]">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/55 flex justify-between items-center shrink-0">
            <div>
              <h2 className="font-semibold text-sm text-zinc-200">Cost Register</h2>
              <p className="text-[10px] text-zinc-500">Record logs for the current month view</p>
            </div>

            {/* Date Filters */}
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-zinc-950 text-xs border border-zinc-800 focus:ring-0 text-zinc-300 py-1.5 px-2 rounded-lg cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-zinc-950 text-xs border border-zinc-800 focus:ring-0 text-zinc-300 py-1.5 px-2 rounded-lg cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs text-zinc-300 border-collapse">
              <thead className="bg-zinc-950/80 text-[10px] text-zinc-400 border-b border-zinc-800 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 bg-zinc-950">Date</th>
                  <th className="px-4 py-3">Spender</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {costs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500">
                      No costs logged for this month yet.
                    </td>
                  </tr>
                ) : (
                  costs.map((c) => {
                    const mappedSpender = c.profiles?.full_name || "Unknown";
                    const isOwner = c.added_by === profile?.id || profile?.role === "super_admin";
                    const catName = categories.find((cat) => cat.value === c.cost_category)?.name || c.cost_category;
                    return (
                      <tr key={c.id} className="hover:bg-zinc-900/10 transition-colors">
                        <td className="px-4 py-3 text-zinc-400 font-medium">{c.date}</td>
                        <td className="px-4 py-3 text-zinc-200">{mappedSpender}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                            {catName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300 max-w-[150px] truncate" title={c.items}>
                          {c.items}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{c.amount.toFixed(2)} TK</td>
                        <td className="px-4 py-3 text-right">
                          {isOwner && (
                            <button
                              onClick={() => handleDeleteCost(c.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
