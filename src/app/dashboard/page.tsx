"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { TrendingUp, Package, ShoppingBag, Wallet, ChevronDown, Search, Calendar, Smartphone, Filter } from "lucide-react";
import type { IProduct } from "@/components/ProductCard";
import { useLang } from "@/components/LangContext";

const BRAND_COLORS: Record<string, string> = {
  Apple: "#B03D3D", Samsung: "#2563eb", Google: "#16a34a",
  OnePlus: "#ea580c", Xiaomi: "#7c3aed", Nothing: "#0891b2", Motorola: "#6b7280",
};
function getBrandColor(b: string) { return BRAND_COLORS[b] || "#6b7280"; }

const MONTHS_UK = ["Січ","Лют","Бер","Кві","Тра","Чер","Лип","Сер","Вер","Жов","Лис","Гру"];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const WHOLESALE_DISCOUNT: Record<string, number> = {
  Apple: 0.28, Samsung: 0.32, Google: 0.30,
  OnePlus: 0.35, Xiaomi: 0.38, Nothing: 0.33, Motorola: 0.36,
};
function getPurchasePrice(salePrice: number, brand: string): number {
  const discount = WHOLESALE_DISCOUNT[brand] ?? 0.30;
  return Math.round(salePrice * (1 - discount));
}

function SalesTable({ products }: { products: IProduct[] }) {
  const { t, lang } = useLang();
  const l = t.salesTable;

  const [search, setSearch]       = useState("");
  const [yearFilter, setYear]     = useState("all");
  const [monthFilter, setMonth]   = useState("all");
  const [dayFilter, setDay]       = useState("all");
  const [brandFilter, setBrand]   = useState("all");
  const [sortBy, setSort]         = useState<"date" | "price" | "brand">("date");
  const [sortDir, setSortDir]     = useState<"desc" | "asc">("desc");
  const [page, setPage]           = useState(1);
  const PER_PAGE = 8;

  const sold = products.filter(p => p.status === "проданий" && p.soldAt);

  const years  = Array.from(new Set(sold.map(p => new Date(p.soldAt!).getFullYear()))).sort((a,b)=>b-a);
  const brands = Array.from(new Set(sold.map(p => p.brand))).sort();

  const filtered = useMemo(() => {
    let list = sold;
    if (yearFilter  !== "all") list = list.filter(p => new Date(p.soldAt!).getFullYear() === +yearFilter);
    if (monthFilter !== "all") list = list.filter(p => new Date(p.soldAt!).getMonth()    === +monthFilter);
    if (dayFilter   !== "all") list = list.filter(p => new Date(p.soldAt!).getDate()     === +dayFilter);
    if (brandFilter !== "all") list = list.filter(p => p.brand === brandFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.model.toLowerCase().includes(q) || p.imei.includes(q));
    }
    return [...list].sort((a, b) => {
      let diff = 0;
      if (sortBy === "date")  diff = new Date(a.soldAt!).getTime() - new Date(b.soldAt!).getTime();
      if (sortBy === "price") diff = a.price - b.price;
      if (sortBy === "brand") diff = a.brand.localeCompare(b.brand);
      return sortDir === "desc" ? -diff : diff;
    });
  }, [sold, yearFilter, monthFilter, dayFilter, brandFilter, search, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSort(col); setSortDir("desc"); }
    setPage(1);
  };

  const selectCls = "h-9 pl-3 pr-7 rounded-lg border border-white/[0.06] text-xs appearance-none cursor-pointer focus:outline-none";
  const selectStyle = { background: "#19191c", color: "#a1a1aa" };

  const SortBtn = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold transition-colors ${
        sortBy === col ? "text-zinc-200" : "text-zinc-600 hover:text-zinc-400"
      }`}
    >
      {label}
      <span className="text-[9px]">{sortBy === col ? (sortDir === "desc" ? "↓" : "↑") : "↕"}</span>
    </button>
  );

  return (
    <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={14} className="text-zinc-500" />
          <h2 className="font-display font-medium text-sm text-zinc-300">{l.title}</h2>
          <span className="ml-auto text-[11px] text-zinc-600">
            {filtered.length} {l.results}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={l.search}
              className="w-full h-9 pl-8 pr-3 rounded-lg bg-black/20 border border-white/[0.06] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#B03D3D]/40 transition-colors"
            />
          </div>
          <div className="relative">
            <select value={yearFilter} onChange={e => { setYear(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
              <option value="all">{l.allYears}</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={monthFilter} onChange={e => { setMonth(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
              <option value="all">{l.allMonths}</option>
              {MONTHS_UK.map((m, i) => (
                <option key={i} value={i}>{lang === "uk" ? m : MONTHS_EN[i]}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={dayFilter} onChange={e => { setDay(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
              <option value="all">{l.allDays}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={brandFilter} onChange={e => { setBrand(e.target.value); setPage(1); }} className={selectCls} style={selectStyle}>
              <option value="all">{l.allBrands}</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left px-5 py-3"><SortBtn col="date"  label={l.date} /></th>
              <th className="text-left px-3 py-3"><span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-600">{l.model}</span></th>
              <th className="text-left px-3 py-3"><SortBtn col="brand" label={l.brand} /></th>
              <th className="text-left px-3 py-3 hidden sm:table-cell"><span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-600">{l.imei}</span></th>
              <th className="text-right px-5 py-3"><SortBtn col="price" label={l.price} /></th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm text-zinc-600">{l.empty}</td>
              </tr>
            ) : paged.map(p => {
              const d = new Date(p.soldAt!);
              const MONTHS = lang === "uk" ? MONTHS_UK : MONTHS_EN;
              const dateStr = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
              return (
                <tr key={p._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-zinc-600 shrink-0" />
                      <span className="text-xs text-zinc-400 whitespace-nowrap">{dateStr}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Smartphone size={13} className="text-zinc-600 shrink-0" />
                      <span className="text-sm text-zinc-200 truncate max-w-[140px]">{p.model}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: getBrandColor(p.brand) + "20",
                        color: getBrandColor(p.brand),
                      }}
                    >
                      {p.brand}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="font-mono text-[11px] text-zinc-600">{p.imei}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-display font-semibold text-sm text-[#e05555] whitespace-nowrap">
                        {p.price.toLocaleString("uk-UA")} ₴
                      </span>
                      <span className="text-[10px] text-zinc-600 whitespace-nowrap">
                        {l.purchase}{getPurchasePrice(p.price, p.brand).toLocaleString("uk-UA")} ₴
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
          <span className="text-[11px] text-zinc-600">
            {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} {l.of} {filtered.length}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  n === page
                    ? "bg-[#B03D3D] text-white"
                    : "text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, lang } = useLang();

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

  const MONTHS = lang === "en" ? MONTHS_EN : MONTHS_UK;

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-5 py-8">
        <div className="h-8 w-48 bg-[#19191c] rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#19191c] rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-72 bg-[#19191c] rounded-2xl animate-pulse" />
          <div className="h-72 bg-[#19191c] rounded-2xl animate-pulse" />
        </div>
        <div className="h-96 bg-[#19191c] rounded-2xl animate-pulse" />
      </main>
    );
  }

  const inStock  = products.filter(p => p.status === "в наявності");
  const sold     = products.filter(p => p.status === "проданий");
  const revenue  = sold.reduce((s, p) => s + p.price, 0);
  const avgPrice = products.length ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length) : 0;

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
    const m = d.getMonth(), y = d.getFullYear();
    const count = sold.filter(p => {
      if (!p.soldAt) return false;
      const pd = new Date(p.soldAt);
      return pd.getMonth() === m && pd.getFullYear() === y;
    }).length;
    return { month: MONTHS[m], count };
  });

  const topModels = [...products].sort((a, b) => b.price - a.price).slice(0, 5);

  const dp = t.dashboardPage;

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-white mb-1">{t.dashboard}</h1>
        <p className="text-sm text-zinc-500">{dp.analyticsSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<Package size={18} />}     label={dp.inStock}    value={inStock.length} />
        <MetricCard icon={<ShoppingBag size={18} />} label={dp.soldMetric} value={sold.length} accent />
        <MetricCard icon={<Wallet size={18} />}      label={dp.revenue}    value={`${revenue.toLocaleString("uk-UA")} ₴`} />
        <MetricCard icon={<TrendingUp size={18} />}  label={dp.avgPrice}   value={`${avgPrice.toLocaleString("uk-UA")} ₴`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-[#19191c] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-display font-medium text-sm text-zinc-300 mb-5">{dp.salesChart}</h2>
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
              <Tooltip contentStyle={{ background: "#19191c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }} cursor={{ stroke: "rgba(255,255,255,0.08)" }} />
              <Area type="monotone" dataKey="count" stroke="#B03D3D" strokeWidth={2} fill="url(#redGrad)" name={dp.soldLabel} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="font-display font-medium text-sm text-zinc-300 mb-5">{dp.byBrand}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byBrand} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="brand" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ background: "#19191c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13 }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="total" name={dp.totalLabel} radius={[0, 4, 4, 0]}>
                {byBrand.map(entry => <Cell key={entry.brand} fill={getBrandColor(entry.brand)} opacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl p-5 mb-6">
        <h2 className="font-display font-medium text-sm text-zinc-300 mb-4">{dp.top5}</h2>
        <div className="space-y-2">
          {topModels.map((p, i) => (
            <div key={p._id} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
              <span className="font-display text-zinc-600 text-sm w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{p.model}</p>
                <p className="text-[11px] text-zinc-500">{p.brand} · {p.year}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "в наявності" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                {p.status === "в наявності" ? t.inStock : t.sold}
              </span>
              <span className="font-display font-medium text-sm text-red-DEFAULT whitespace-nowrap">
                {p.price.toLocaleString("uk-UA")} ₴
              </span>
            </div>
          ))}
          {topModels.length === 0 && <p className="text-sm text-zinc-600 py-4 text-center">{dp.noProducts}</p>}
        </div>
      </div>

      <SalesTable products={products} />
    </main>
  );
}

function MetricCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-[#19191c] border border-white/[0.06] rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent ? "bg-red-dim text-red-DEFAULT" : "bg-white/[0.05] text-zinc-400"}`}>{icon}</div>
      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display font-semibold text-xl text-white">{value}</p>
    </div>
  );
}