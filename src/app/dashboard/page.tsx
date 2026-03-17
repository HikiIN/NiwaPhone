"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { TrendingUp, Package, ShoppingBag, Wallet } from "lucide-react";
import type { IProduct } from "@/components/ProductCard";

const BRAND_COLORS: Record<string, string> = {
  Apple: "#B03D3D", Samsung: "#2563eb", Google: "#16a34a",
  OnePlus: "#ea580c", Xiaomi: "#7c3aed", Sony: "#0891b2",
};

function getBrandColor(brand: string) {
  return BRAND_COLORS[brand] || "#6b7280";
}

const MONTHS_UK = ["Січ","Лют","Бер","Кві","Тра","Чер","Лип","Сер","Вер","Жов","Лис","Гру"];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status === "authenticated" && role !== "Адміністратор") { router.push("/"); return; }
  }, [status, role, router]);

  useEffect(() => {
    if (role === "Адміністратор") {
      fetch("/api/products")
        .then(r => r.json())
        .then(d => { setProducts(d); setLoading(false); });
    }
  }, [role]);

  if (status !== "authenticated") return null;

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="h-8 w-48 bg-[#19191c] rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#19191c] rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-[#19191c] rounded-2xl animate-pulse" />
          <div className="h-72 bg-[#19191c] rounded-2xl animate-pulse" />
        </div>
      </main>
    );
  }

  const inStock   = products.filter((p: IProduct) => p.status === "в наявності");
  const sold      = products.filter((p: IProduct) => p.status === "проданий");
  const revenue   = sold.reduce((s, p) => s + p.price, 0);
  const avgPrice  = products.length ?
    Math.round(products.reduce((s, p) => s + p.price, 0) / products.length) : 0;

  const byBrand = Object.entries(
    products.reduce<Record<string, { total: number; sold: number }>>((acc, p) => {
      if (!acc[p.brand]) acc[p.brand] = { total: 0, sold: 0 };
      acc[p.brand].total++;
      if (p.status === "проданий") acc[p.brand].sold++;
      return acc;
    }, {})
  ).map(([brand, v]) => ({ brand, ...v })).sort((a, b) => b.total - a.total);

  const salesByMonth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const count = sold.filter((p: IProduct) => {
      if (!p.soldAt) return false;
      const pd = new Date(p.soldAt);
      return pd.getMonth() === m && pd.getFullYear() === y;
    }).length;
    return { month: MONTHS_UK[m], count };
  });

  const topModels = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">Дашборд</h1>
        <p className="text-sm text-zinc-500">Аналітика магазину в реальному часі</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<Package size={18} />} label="В наявності" value={inStock.length} />
        <MetricCard icon={<ShoppingBag size={18} />} label="Продано" value={sold.length} accent />
        <MetricCard icon={<Wallet size={18} />} label="Виручка" value={`${revenue.toLocaleString("uk-UA")} ₴`} />
        <MetricCard icon={<TrendingUp size={18} />} label="Сер. ціна" value={`${avgPrice.toLocaleString("uk-UA")} ₴`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#19191c] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-display font-medium text-sm text-zinc-300 mb-5">Продажі (6 місяців)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesByMonth} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#B03D3D" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#B03D3D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#19191c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                cursor={{ stroke: "rgba(255,255,255,0.08)" }}
              />
              <Area type="monotone" dataKey="count" stroke="#B03D3D" strokeWidth={2} fill="url(#redGrad)" name="Продано" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-display font-medium text-sm text-zinc-300 mb-5">По брендах</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byBrand} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="brand" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                contentStyle={{ background: "#19191c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="total" name="Всього" radius={[0, 4, 4, 0]}>
                {byBrand.map((entry) => (
                  <Cell key={entry.brand} fill={getBrandColor(entry.brand)} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="font-display font-medium text-sm text-zinc-300 mb-4">Топ-5 за ціною</h2>
        <div className="space-y-2">
          {topModels.map((p, i) => (
            <div key={p._id} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
              <span className="font-display text-zinc-600 text-sm w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{p.model}</p>
                <p className="text-[11px] text-zinc-500">{p.brand} · {p.year}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                p.status === "в наявності"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}>
                {p.status}
              </span>
              <span className="font-display font-medium text-sm text-red-DEFAULT whitespace-nowrap">
                {p.price.toLocaleString("uk-UA")} ₴
              </span>
            </div>
          ))}
          {topModels.length === 0 && (
            <p className="text-sm text-zinc-600 py-4 text-center">Немає товарів</p>
          )}
        </div>
      </div>
    </main>
  );
}

function MetricCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-[#19191c] border border-white/[0.06] rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent ? "bg-red-dim text-red-DEFAULT" : "bg-white/[0.05] text-zinc-400"}`}>
        {icon}
      </div>
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display font-semibold text-xl text-white">{value}</p>
    </div>
  );
}