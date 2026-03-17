"use client";
import { useState } from "react";
import {
  X, ChevronLeft, ChevronRight, Pencil, Trash2,
  ShoppingBag, Cpu, Calendar, CreditCard, Hash,
  Tag, CheckCircle2, XCircle, ImageOff, ChevronDown,
} from "lucide-react";
import type { IProduct } from "./ProductCard";

interface Props {
  product: IProduct;
  onClose: () => void;
  isAdmin: boolean;
  isSeller: boolean;
  onEdit: (p: IProduct) => void;
  onDelete: (id: string) => void;
  onSell: (id: string) => void;
}

export function ProductViewModal({ product, onClose, isAdmin, isSeller, onEdit, onDelete, onSell }: Props) {
  const imagesList = product.images?.length
    ? product.images
    : product.imageUrl ? [product.imageUrl] : [];

  const [imgIdx, setImgIdx] = useState(0);
  const sold = product.status === "проданий";

  const prevImg = () => setImgIdx(i => (i - 1 + imagesList.length) % imagesList.length);
  const nextImg = () => setImgIdx(i => (i + 1) % imagesList.length);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#19191c] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 animate-fadeUp">

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
              {product.brand} · {product.year}
            </p>
            <h2 className="font-display font-bold text-xl text-white">{product.model}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-0">

          <div className="md:w-[280px] shrink-0 p-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center">
              {imagesList.length > 0 ? (
                <>
                  <img
                    src={imagesList[imgIdx]}
                    alt={product.model}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-md ${
                    sold
                      ? "bg-black/60 text-zinc-400 border border-white/10"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {sold ? <XCircle size={11} /> : <CheckCircle2 size={11} />}
                    {sold ? "ПРОДАНО" : "В НАЯВНОСТІ"}
                  </div>

                  {imagesList.length > 1 && (
                    <>
                      <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-700">
                  <ImageOff size={40} />
                  <p className="text-xs">Фото відсутнє</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex gap-2 mt-3 justify-center">
                {imagesList.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx ? "border-[#B03D3D]" : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="flex-1 p-5 flex flex-col">

            {/* Price */}
            <div className="mb-6 p-4 rounded-2xl bg-black/20 border border-white/[0.06]">
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5">
                <Tag size={12} /> Ціна
              </p>
              <span className="font-display font-bold text-3xl text-white">
                {product.price.toLocaleString("uk-UA")}
                <span className="text-white text-xl ml-1.5 font-semibold">₴</span>
              </span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <InfoRow icon={<Cpu size={14} />} label="Бренд" value={product.brand} />
              <InfoRow icon={<Calendar size={14} />} label="Рік" value={String(product.year)} />
              <InfoRow icon={<Hash size={14} />} label="IMEI" value={product.imei} mono />
              {sold && product.soldAt && (
                <InfoRow icon={<ShoppingBag size={14} />} label="Продано" value={formatDate(product.soldAt)} />
              )}
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold mb-6 ${
              sold
                ? "bg-zinc-800/60 text-zinc-400 border border-white/[0.06]"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}>
              {sold ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
              {sold ? "Товар продано" : "Товар в наявності"}
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2.5">
              {isAdmin && (
                <button
                  onClick={() => onEdit(product)}
                  className="w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-zinc-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/[0.06]"
                >
                  <Pencil size={15} /> Редагувати
                </button>
              )}
              {isSeller && !sold && (
                <button
                  onClick={() => onSell(product._id)}
                  className="w-full h-11 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-400 text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-amber-500/20"
                >
                  <ShoppingBag size={15} /> Позначити проданим
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => onDelete(product._id)}
                  className="w-full h-11 rounded-xl bg-[#B03D3D]/10 hover:bg-[#B03D3D]/20 text-[#e05555] text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-[#B03D3D]/20"
                >
                  <Trash2 size={15} /> Видалити товар
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="p-3 rounded-xl bg-black/10 border border-white/[0.04]">
      <p className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
        <span className="text-zinc-600">{icon}</span>
        {label}
      </p>
      <p className={`text-sm text-zinc-200 font-medium truncate ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}