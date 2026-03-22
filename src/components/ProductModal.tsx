"use client";
import { useEffect, useState } from "react";
import { X, ImagePlus, ChevronDown } from "lucide-react";
import type { IProduct } from "./ProductCard";

interface Props {
  open: boolean;
  product?: IProduct | null;
  onClose: () => void;
  onSave: (data: Partial<IProduct>) => Promise<void>;
}

const BRANDS = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Nothing", "Motorola", "Інший"];
const EMPTY = {
  model: "",
  brand: "Apple",
  year: new Date().getFullYear(),
  price: "",
  imei: "",
  images: ["", "", ""],
  status: "в наявності" as const,
};

function ModalSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 pl-4 pr-10 rounded-xl text-sm font-medium transition-all outline-none appearance-none cursor-pointer"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#f0f0f0",
        }}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
      />
    </div>
  );
}

export function ProductModal({ open, product, onClose, onSave }: Props) {
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (product) {
        const existingImages = product.images?.length
          ? [...product.images]
          : product.imageUrl ? [product.imageUrl] : [];
        while (existingImages.length < 3) existingImages.push("");
        setForm({ ...product, images: existingImages });
      } else {
        setForm(EMPTY);
      }
      setError("");
    }
  }, [open, product]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleImageChange = (index: number, val: string) => {
    const newImages = form.images?.length ? [...form.images] : ["", "", ""];
    newImages[index] = val;
    set("images", newImages);
  };

  const submit = async () => {
    if (!form.model || !form.imei || !form.price || !form.brand) {
      setError("Заповніть всі обов'язкові поля");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const cleanImages = (form.images || []).filter((img: string) => img && img.trim() !== "");
      await onSave({ ...form, price: Number(form.price), images: cleanImages });
      onClose();
    } catch (e: any) {
      setError(e.message || "Помилка збереження");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#19191c] border border-white/[0.08] rounded-3xl p-7 animate-fadeUp shadow-2xl shadow-black/60">

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-white">
            {product ? "Редагувати товар" : "Новий товар"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Бренд *</label>
              <ModalSelect value={form.brand} onChange={v => set("brand", v)}>
                {BRANDS.map(b => (
                  <option key={b} value={b} style={{ background: "#19191c", color: "#f0f0f0" }}>{b}</option>
                ))}
              </ModalSelect>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Рік *</label>
              <input
                type="number"
                value={form.year}
                onChange={e => set("year", Number(e.target.value))}
                className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B03D3D]/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Модель *</label>
            <input
              value={form.model}
              onChange={e => set("model", e.target.value)}
              placeholder="Наприклад: iPhone 15 Pro Max"
              className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B03D3D]/60 transition-colors placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 ml-1">IMEI *</label>
              <input
                value={form.imei}
                onChange={e => set("imei", e.target.value)}
                maxLength={15}
                placeholder="15 цифр"
                className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm font-mono text-white focus:outline-none focus:border-[#B03D3D]/60 transition-colors placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Ціна (₴) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                placeholder="0"
                className="w-full h-12 px-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-[#B03D3D]/60 transition-colors placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Images */}
          <div className="p-4 rounded-2xl bg-black/10 border border-white/5">
            <div className="flex items-center gap-2 mb-3 text-sm text-zinc-300 font-medium">
              <ImagePlus size={16} className="text-[#B03D3D]" /> Фотографії (до 3 шт.)
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  value={(form.images && form.images[i]) || ""}
                  onChange={e => handleImageChange(i, e.target.value)}
                  placeholder={`URL зображення ${i + 1}`}
                  className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-white/[0.05] text-xs text-white focus:outline-none focus:border-[#B03D3D]/40 transition-colors placeholder:text-zinc-700"
                />
              ))}
            </div>
          </div>

          {product && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5 ml-1">Статус</label>
              <ModalSelect value={form.status} onChange={v => set("status", v)}>
                <option value="в наявності" style={{ background: "#19191c", color: "#f0f0f0" }}>В наявності</option>
                <option value="проданий" style={{ background: "#19191c", color: "#f0f0f0" }}>Проданий</option>
              </ModalSelect>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-5 text-sm text-red-400 bg-red-950/30 p-3 rounded-xl border border-red-500/20">
            {error}
          </p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-6 h-12 rounded-xl bg-[#B03D3D] hover:bg-[#8A2D2D] text-white font-semibold transition-all disabled:opacity-50 shadow-lg shadow-[#B03D3D]/20"
        >
          {loading ? "Збереження..." : "Зберегти товар"}
        </button>
      </div>
    </div>
  );
}