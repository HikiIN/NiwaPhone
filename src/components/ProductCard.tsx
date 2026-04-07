"use client";
import Image from "next/image";

export interface IProduct {
  _id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  imei: string;
  images?: string[];
  imageUrl?: string;
  status: "в наявності" | "проданий";
  soldAt?: string;
}

export function ProductCard({ product, onClick }: { product: IProduct; onClick: () => void }) {
  const sold = product.status === "проданий";
  
  const imagesList = product.images?.length ? product.images : (product.imageUrl ? [product.imageUrl] : []);
  const mainImg = imagesList[0];

  return (
    <div onClick={onClick} className="group cursor-pointer flex flex-col bg-[#19191c] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-xl hover:shadow-[#B03D3D]/5 animate-fadeUp">
      
      <div className="relative h-[200px] bg-[#111] flex items-center justify-center hover-zoom-container overflow-hidden">
        {mainImg ? (
          <Image src={mainImg} alt={product.model} width={400} height={200} className="w-full h-full object-cover hover-zoom-img" />
        ) : (
          <div className="w-16 h-24 rounded-xl border border-white/10 flex flex-col items-center justify-end pb-2 gap-1 bg-[#19191c]">
            <div className="w-6 h-6 rounded-full border border-white/10" />
          </div>
        )}
        
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md ${
          sold ? "bg-black/60 text-zinc-400 border border-white/10" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
        }`}>
          {sold ? "ПРОДАНО" : "В НАЯВНОСТІ"}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">{product.brand} · {product.year}</p>
        <h3 className="font-display font-semibold text-base text-white mb-4 line-clamp-1 group-hover:text-[#B03D3D] transition-colors">{product.model}</h3>
        
        <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-display font-bold text-[19px] text-white">
            {product.price.toLocaleString("uk-UA")} <span className="text-zinc-500 text-sm">₴</span>
          </span>
          <span className="text-xs text-zinc-500 font-mono bg-white/[0.03] px-2 py-1 rounded-md">
            {product.imei.slice(-6)}
          </span>
        </div>
      </div>
    </div>
  );
}