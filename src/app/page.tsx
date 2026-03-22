"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Search, Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard, type IProduct } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { ProductViewModal } from "@/components/ProductViewModal";
import { useToast } from "@/components/Toast";
import { useConfirm } from "@/components/ConfirmDialog";

const BRANDS = ["Всі", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Nothing", "Motorola"];

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-12 pl-4 pr-10 rounded-xl border text-sm font-medium cursor-pointer appearance-none transition-all outline-none"
        style={{
          background: "#19191c",
          borderColor: "rgba(255,255,255,0.08)",
          color: "#d1d5db",
        }}
      >
        {options.map(o => (
          <option
            key={o.value}
            value={o.value}
            style={{ background: "#19191c", color: "#f0f0f0" }}
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
    </div>
  );
}

export default function HomePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "Адміністратор";
  const isSeller = role === "Продавець" || isAdmin;

  const toast = useToast();
  const confirm = useConfirm();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("Всі");

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [viewProduct, setViewProduct] = useState<IProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter === "in" ? "в наявності" : "проданий");
    if (brandFilter !== "Всі") params.set("brand", brandFilter);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, brandFilter]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const handleSave = async (data: Partial<IProduct>) => {
    const method = editProduct ? "PATCH" : "POST";
    const url = editProduct ? `/api/products/${editProduct._id}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      toast.error("Помилка збереження", err.error || "Щось пішло не так");
      throw new Error(err.error);
    }
    toast.success(editProduct ? "Товар оновлено" : "Товар додано", data.model as string);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Видалити товар?",
      message: "Цю дію неможливо скасувати. Товар буде назавжди видалено з бази даних.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      variant: "danger",
      icon: "trash",
    });
    if (!ok) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    toast.success("Товар видалено", "Запис успішно видалено з бази");
    fetchProducts();
    setViewProduct(null);
  };

  const handleSell = async (id: string) => {
    const ok = await confirm({
      title: "Позначити як проданий?",
      message: "Товар буде переміщено до архіву продажів. Цей статус можна змінити пізніше.",
      confirmText: "Так, продано",
      cancelText: "Скасувати",
      variant: "warning",
      icon: "sell",
    });
    if (!ok) return;

    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "проданий" }),
    });
    toast.success("Статус оновлено", "Товар позначено як проданий");
    fetchProducts();
    setViewProduct(null);
  };

  const statusOptions = [
    { value: "all", label: "Всі статуси" },
    { value: "in", label: "В наявності" },
    { value: "sold", label: "Продані" },
  ];

  const brandOptions = BRANDS.map(b => ({ value: b, label: b }));

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Каталог</h1>
          <p className="text-sm text-zinc-400">Керуйте асортиментом магазину NiwaPhone</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditProduct(null); setModalOpen(true); }}
            className="flex justify-center items-center gap-2 px-5 h-11 rounded-xl bg-[#B03D3D] hover:bg-[#8A2D2D] text-white text-sm font-semibold transition-all shadow-lg shadow-[#B03D3D]/20"
          >
            <Plus size={18} /> Додати товар
          </button>
        )}
      </div>

      <div className="bg-[#19191c] border border-white/[0.06] rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук за моделлю, IMEI..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B03D3D]/60 transition-colors placeholder:text-zinc-600"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <StyledSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
          <StyledSelect value={brandFilter} onChange={setBrandFilter} options={brandOptions} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[360px] rounded-2xl bg-[#19191c] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
          <SlidersHorizontal size={48} className="mb-5 opacity-20" />
          <p className="text-lg font-medium text-zinc-400">Нічого не знайдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onClick={() => setViewProduct(p)} />
          ))}
        </div>
      )}

      {/* Модалки */}
      <ProductModal
        open={modalOpen}
        product={editProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          isAdmin={isAdmin}
          isSeller={isSeller}
          onEdit={(p: IProduct) => { setViewProduct(null); setEditProduct(p); setModalOpen(true); }}
          onDelete={handleDelete}
          onSell={handleSell}
        />
      )}
    </main>
  );
}