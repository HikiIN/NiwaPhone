"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, Package, MapPin, Phone, Mail, Globe, TrendingUp,
  ChevronRight, Search, Star, Clock, CheckCircle2, ShoppingCart
} from "lucide-react";
import { useLang } from "@/components/LangContext";
import type { IProduct } from "@/components/ProductCard";

// Зроблю поки таку заглушку "заготовку" замість окремої бази для закупок та відшкодую логікою % ціни продажу
// Оптові знижки по бренду (% від ціни продажу)
// Закупівельна ціна = ціна продажу * (1 - WHOLESALE_DISCOUNT[brand])
const WHOLESALE_DISCOUNT: Record<string, number> = {
  Apple:    0.28,   // Apple купуємо за 72% від ціни → маржа ~28%
  Samsung:  0.32,
  Google:   0.30,
  OnePlus:  0.35,
  Xiaomi:   0.38,
  Nothing:  0.33,
  Motorola: 0.36,
};
const DEFAULT_DISCOUNT = 0.30;

function getPurchasePrice(salePrice: number, brand: string): number {
  const discount = WHOLESALE_DISCOUNT[brand] ?? DEFAULT_DISCOUNT;
  return Math.round(salePrice * (1 - discount));
}

const SUPPLIERS = [
  {
    id: "apple-ua",
    brand: "Apple",
    company: "Apple Premium Reseller UA",
    country: "США → Україна",
    city: "Київ",
    route: ["Купертіно", "Франкфурт", "Варшава", "Київ"],
    contact: "+38 044 123-45-67",
    email: "supply@apple-ua.com",
    website: "apple-ua.com",
    rating: 5,
    deliveryDays: 7,
    status: "active" as const,
    color: "#B03D3D",
    since: "2021",
  },
  {
    id: "samsung-eu",
    brand: "Samsung",
    company: "Samsung Electronics CEE",
    country: "Корея → Польща → Україна",
    city: "Варшава / Київ",
    route: ["Сеул", "Варшава", "Львів", "Київ"],
    contact: "+48 22 555-0199",
    email: "b2b@samsung-cee.pl",
    website: "samsung-cee.pl",
    rating: 4,
    deliveryDays: 10,
    status: "active" as const,
    color: "#2563eb",
    since: "2020",
  },
  {
    id: "google-de",
    brand: "Google",
    company: "Google Devices GmbH",
    country: "США → Німеччина → Україна",
    city: "Мюнхен",
    route: ["Маунтін-В'ю", "Мюнхен", "Відень", "Київ"],
    contact: "+49 89 3456-7890",
    email: "devices@google-de.com",
    website: "store.google.com",
    rating: 5,
    deliveryDays: 12,
    status: "active" as const,
    color: "#16a34a",
    since: "2022",
  },
  {
    id: "xiaomi-pl",
    brand: "Xiaomi",
    company: "Xiaomi Poland Sp. z o.o.",
    country: "Китай → Польща → Україна",
    city: "Варшава",
    route: ["Пекін", "Варшава", "Краків", "Львів"],
    contact: "+48 12 987-6543",
    email: "wholesale@xiaomi.pl",
    website: "xiaomi.pl",
    rating: 4,
    deliveryDays: 14,
    status: "active" as const,
    color: "#7c3aed",
    since: "2021",
  },
  {
    id: "oneplus-nl",
    brand: "OnePlus",
    company: "OnePlus Europe B.V.",
    country: "Китай → Нідерланди → Україна",
    city: "Амстердам",
    route: ["Шеньчжень", "Амстердам", "Берлін", "Київ"],
    contact: "+31 20 888-0123",
    email: "eu-supply@oneplus.com",
    website: "oneplus.com/eu",
    rating: 3,
    deliveryDays: 18,
    // "Неактивний" = співпраця тимчасово призупинена (контракт на паузі / переговори)
    status: "inactive" as const,
    color: "#ea580c",
    since: "2022",
  },
  {
    id: "nothing-uk",
    brand: "Nothing",
    company: "Nothing Technology Ltd",
    country: "Велика Британія → Україна",
    city: "Лондон",
    route: ["Лондон", "Варшава", "Київ"],
    contact: "+44 20 7946-0000",
    email: "wholesale@nothing.tech",
    website: "nothing.tech",
    rating: 4,
    deliveryDays: 9,
    status: "active" as const,
    color: "#0891b2",
    since: "2023",
  },
];

function RouteViz({ route, color }: { route: string[]; color: string }) {
  return (
    <div className="flex items-center gap-1 flex-wrap mt-3">
      {route.map((city, i) => (
        <div key={i} className="flex items-center gap-1">
          <MapPin size={10} style={{ color }} className="shrink-0 opacity-80" />
          <span className="text-[11px] text-zinc-400">{city}</span>
          {i < route.length - 1 && <ChevronRight size={10} className="text-zinc-700 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"} />
      ))}
    </div>
  );
}

function WholesaleBlock({
  supplier,
  inStockProducts,
}: {
  supplier: typeof SUPPLIERS[0];
  inStockProducts: IProduct[];
}) {
  const { t } = useLang();
  const s = t.suppliers;
  const discount = WHOLESALE_DISCOUNT[supplier.brand] ?? DEFAULT_DISCOUNT;
  const totalPurchaseCost = inStockProducts.reduce(
    (sum, p) => sum + getPurchasePrice(p.price, p.brand), 0
  );
  const count = inStockProducts.length;

  if (count === 0) return null;

  return (
    <div
      className="mt-3 px-3 py-2.5 rounded-xl border flex items-center gap-3"
      style={{
        borderColor: supplier.color + "30",
        background: supplier.color + "08",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: supplier.color + "18", color: supplier.color }}
      >
        <ShoppingCart size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
          {s.wholesalePaidFor}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-bold text-white">
            {totalPurchaseCost.toLocaleString("uk-UA")} ₴
          </span>
          <span className="text-[11px] text-zinc-600">
            {count} {s.pcs} · {s.wholesale} -{Math.round(discount * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function SupplierCard({
  supplier, stats, inStockProducts, onClick,
}: {
  supplier: typeof SUPPLIERS[0];
  stats: { total: number; sold: number; revenue: number };
  inStockProducts: IProduct[];
  onClick: () => void;
}) {
  const { t } = useLang();
  const s = t.suppliers;
  const isActive = supplier.status === "active";

  return (
    <div
      onClick={onClick}
      className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-5 cursor-pointer hover:border-white/[0.12] hover:bg-zinc-900/80 transition-all duration-200"
    >
      {/* Шапка */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm"
            style={{ background: supplier.color + "18", color: supplier.color, border: `1px solid ${supplier.color}30` }}
          >
            {supplier.brand.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-white leading-tight">{supplier.brand}</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5 truncate max-w-[140px]">{supplier.company}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${
          isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
        }`}>
          {isActive ? <CheckCircle2 size={9} /> : <Clock size={9} />}
          {isActive ? s.statusActive : s.statusPaused}
        </span>
      </div>

      {/* Маршрут */}
      <RouteViz route={supplier.route} color={supplier.color} />

      {/* Вартість закупки (тільки якщо є товари в наявності) */}
      <WholesaleBlock supplier={supplier} inStockProducts={inStockProducts} />

      {/* Метрики */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.04]">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
            {s.items}
          </p>
          <p className="text-sm font-semibold text-white">{stats.total}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
            {s.soldCount}
          </p>
          <p className="text-sm font-semibold text-white">{stats.sold}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">
            {s.revenue}
          </p>
          <p className="text-sm font-semibold" style={{ color: supplier.color }}>
            {stats.revenue > 0 ? `${Math.round(stats.revenue / 1000)}k ₴` : "—"}
          </p>
        </div>
      </div>

      {/* Футер */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        <Stars rating={supplier.rating} />
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
          <Truck size={11} />
          <span>{supplier.deliveryDays} {s.days}</span>
        </div>
      </div>
    </div>
  );
}

function SupplierDetail({
  supplier, stats, inStockProducts, onClose,
}: {
  supplier: typeof SUPPLIERS[0];
  stats: { total: number; sold: number; revenue: number };
  inStockProducts: IProduct[];
  onClose: () => void;
}) {
  const { t } = useLang();
  const s = t.suppliers;
  const isActive = supplier.status === "active";
  const discount = WHOLESALE_DISCOUNT[supplier.brand] ?? DEFAULT_DISCOUNT;

  const totalPurchaseCost = inStockProducts.reduce(
    (sum, p) => sum + getPurchasePrice(p.price, p.brand), 0
  );
  const avgPurchasePrice = inStockProducts.length > 0
    ? Math.round(totalPurchaseCost / inStockProducts.length)
    : 0;
  const soldRevenue = stats.revenue;
  const soldPurchaseCost = Math.round(soldRevenue * (1 - discount));
  const grossProfit = soldRevenue - soldPurchaseCost;

  return (
    <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Шапка */}
      <div
        className="p-6 border-b border-white/[0.06]"
        style={{ background: `linear-gradient(135deg, ${supplier.color}12 0%, transparent 60%)` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-lg"
              style={{ background: supplier.color + "20", color: supplier.color, border: `1.5px solid ${supplier.color}40` }}
            >
              {supplier.brand.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">{supplier.company}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{supplier.country}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Stars rating={supplier.rating} />
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                  isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {isActive ? <CheckCircle2 size={9} /> : <Clock size={9} />}
                  {isActive ? s.statusActive : s.statusPausedFull}
                </span>
                <span className="text-[11px] text-zinc-600">
                  {s.since} {supplier.since}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors p-1">✕</button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div>
            <h3 className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">
              {s.contacts}
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: <Phone size={13} />, value: supplier.contact },
                { icon: <Mail size={13} />,  value: supplier.email },
                { icon: <Globe size={13} />, value: supplier.website },
                { icon: <MapPin size={13} />, value: supplier.city },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="text-zinc-600 shrink-0">{row.icon}</span>
                  <span className="text-zinc-300">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Маршрут */}
          <div>
            <h3 className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">
              {s.deliveryRoute}
            </h3>
            <div className="flex flex-col gap-2">
              {supplier.route.map((city, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full" style={{
                      background: i === supplier.route.length - 1 ? supplier.color : "#3f3f46"
                    }} />
                    {i < supplier.route.length - 1 && <div className="w-px h-5 bg-zinc-800 mt-1" />}
                  </div>
                  <span className={`text-sm ${i === supplier.route.length - 1 ? "text-white font-medium" : "text-zinc-500"}`}>
                    {city}
                  </span>
                  {i === supplier.route.length - 1 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                      {s.destination}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Право */}
        <div className="space-y-4">
          <h3 className="text-[11px] text-zinc-600 uppercase tracking-wider">
            {s.phonePurchasing}
          </h3>

          {/* Умови закупки */}
          <div
            className="px-4 py-3 rounded-xl border"
            style={{ borderColor: supplier.color + "30", background: supplier.color + "08" }}
          >
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
              {s.buyingCheaperBy}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-2xl" style={{ color: supplier.color }}>
                -{Math.round(discount * 100)}%
              </span>
              <span className="text-xs text-zinc-600">
                {s.offStorePrice}
              </span>
            </div>
          </div>

          {/* Цінові блоки */}
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label={s.forSaleNow}
              value={inStockProducts.length}
              icon={<Package size={13} />}
              color={supplier.color}
              hint={s.phonesInStore}
            />
            <StatBox
              label={s.eachPhoneCostUs}
              value={avgPurchasePrice > 0 ? `${avgPurchasePrice.toLocaleString("uk-UA")} ₴` : "—"}
              icon={<ShoppingCart size={13} />}
              color="#6b7280"
              hint={s.avgPricePerUnit}
            />
            <StatBox
              label={s.spentOnPurchasing}
              value={totalPurchaseCost > 0 ? `${totalPurchaseCost.toLocaleString("uk-UA")} ₴` : "—"}
              icon={<ShoppingCart size={13} />}
              color="#f59e0b"
              hint={s.totalPaidForStock}
            />
            <StatBox
              label={s.earnedFromSold}
              value={grossProfit > 0 ? `${grossProfit.toLocaleString("uk-UA")} ₴` : "—"}
              icon={<TrendingUp size={13} />}
              color="#10b981"
              hint={s.revenueMinusCost}
            />
          </div>

          {/* Прогрес-бар продажів */}
          {stats.total > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
                <span>{s.salesRate}</span>
                <span>{Math.round((stats.sold / stats.total) * 100)}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(stats.sold / stats.total) * 100}%`, background: supplier.color }}
                />
              </div>
            </div>
          )}

          {/* Час доставки */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.05] bg-black/10">
            <Truck size={14} className="text-zinc-500 shrink-0" />
            <div>
              <p className="text-[11px] text-zinc-600">{s.deliveryTime}</p>
              <p className="text-sm font-semibold text-white">{supplier.deliveryDays} {s.deliveryDays}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color, hint }: { label: string; value: string | number; icon: React.ReactNode; color: string; hint?: string }) {
  return (
    <div className="bg-black/10 border border-white/[0.04] rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color }}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-semibold leading-tight">{label}</span>
      </div>
      <p className="font-display font-bold text-base text-white">{value}</p>
      {hint && <p className="text-[10px] text-zinc-600 mt-0.5 leading-snug">{hint}</p>}
    </div>
  );
}

export default function SuppliersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLang();
  const s = t.suppliers;

  const [products, setProducts]         = useState<IProduct[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<typeof SUPPLIERS[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status === "authenticated" && role !== "Адміністратор") { router.push("/"); return; }
  }, [status, role, router]);

  useEffect(() => {
    if (role === "Адміністратор") {
      fetch("/api/products")
        .then(r => r.json())
        .then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false); });
    }
  }, [role]);

  const statsMap = useMemo(() => {
    const map: Record<string, { total: number; sold: number; revenue: number }> = {};
    for (const s of SUPPLIERS) {
      const branded  = products.filter(p => p.brand === s.brand);
      const soldOnes = branded.filter(p => p.status === "проданий");
      map[s.id] = {
        total:   branded.length,
        sold:    soldOnes.length,
        revenue: soldOnes.reduce((sum, p) => sum + p.price, 0),
      };
    }
    return map;
  }, [products]);

  const inStockMap = useMemo(() => {
    const map: Record<string, IProduct[]> = {};
    for (const sup of SUPPLIERS) {
      map[sup.id] = products.filter(p => p.brand === sup.brand && p.status === "в наявності");
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => SUPPLIERS.filter(sup => {
    const q = search.toLowerCase();
    const matchSearch = !search || sup.brand.toLowerCase().includes(q) || sup.company.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || sup.status === statusFilter;
    return matchSearch && matchStatus;
  }), [search, statusFilter]);

  if (status !== "authenticated") return null;

  const activeCount    = SUPPLIERS.filter(sup => sup.status === "active").length;
  const totalDelivered = Object.values(statsMap).reduce((acc, v) => acc + v.total, 0);
  const totalRevenue   = Object.values(statsMap).reduce((acc, v) => acc + v.revenue, 0);
  const totalStockCost = products
    .filter(p => p.status === "в наявності")
    .reduce((sum, p) => sum + getPurchasePrice(p.price, p.brand), 0);

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-white mb-1">{s.title}</h1>
        <p className="text-sm text-zinc-500">{s.subtitle}</p>
      </div>

      {/* Метрики */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MiniMetric label={s.metricSupp} value={SUPPLIERS.length}                         color="#B03D3D" />
          <MiniMetric label={s.metricAct}  value={activeCount}                              color="#10b981" />
          <MiniMetric label={s.metricDel}  value={totalDelivered}                           color="#6b7280" />
          <MiniMetric label={s.metricCost} value={`${Math.round(totalStockCost / 1000)}k ₴`} color="#f59e0b" />
        </div>
      )}

      {/* Фільтри */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={s.search}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-zinc-900 border border-white/[0.06] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#B03D3D]/40 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 bg-zinc-900 border border-white/[0.06] rounded-xl p-1">
          {(["all", "active", "inactive"] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 h-8 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f ? "bg-[#B03D3D] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f === "all" ? s.all : f === "active" ? s.active : s.paused}
            </button>
          ))}
        </div>
      </div>

      {/* Розгорнута деталь */}
      {selected && (
        <div className="mb-6">
          <SupplierDetail
            supplier={selected}
            stats={statsMap[selected.id]}
            inStockProducts={inStockMap[selected.id]}
            onClose={() => setSelected(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-zinc-900 rounded-2xl animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Truck size={48} className="mb-4 text-zinc-800" />
          <p className="text-zinc-500">{s.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(sup => (
            <SupplierCard
              key={sup.id}
              supplier={sup}
              stats={statsMap[sup.id]}
              inStockProducts={inStockMap[sup.id]}
              onClick={() => setSelected(selected?.id === sup.id ? null : sup)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-zinc-900 border border-white/[0.06] rounded-xl p-4">
      <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="font-display font-bold text-2xl" style={{ color }}>{value}</p>
    </div>
  );
}