"use client";
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { AlertTriangle, Trash2, ShoppingBag, X } from "lucide-react";

type DialogVariant = "danger" | "warning" | "info";

interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  icon?: "trash" | "sell" | "warning";
}

interface ConfirmContextValue {
  confirm: (options: DialogOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const ICON_MAP = {
  trash: Trash2,
  sell: ShoppingBag,
  warning: AlertTriangle,
};

const VARIANT_STYLES = {
  danger: {
    icon: "text-[#e05555] bg-[#B03D3D]/15 border-[#B03D3D]/20",
    confirm: "bg-[#B03D3D] hover:bg-[#8A2D2D] shadow-[#B03D3D]/30",
    glow: "from-[#B03D3D]/5 to-transparent",
  },
  warning: {
    icon: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    confirm: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30",
    glow: "from-amber-500/5 to-transparent",
  },
  info: {
    icon: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    confirm: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30",
    glow: "from-blue-500/5 to-transparent",
  },
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<DialogOptions>({ title: "", message: "" });
  const [visible, setVisible] = useState(false);
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback((options: DialogOptions): Promise<boolean> => {
    setOpts(options);
    setOpen(true);
    setTimeout(() => setVisible(true), 10);
    return new Promise(resolve => { resolveRef.current = resolve; });
  }, []);

  const close = (result: boolean) => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      resolveRef.current?.(result);
    }, 250);
  };

  const variant = opts.variant ?? "danger";
  const s = VARIANT_STYLES[variant];
  const IconComp = ICON_MAP[opts.icon ?? "warning"];

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-250"
            style={{ opacity: visible ? 1 : 0 }}
            onClick={() => close(false)}
          />

          <div
            className="relative w-full max-w-sm bg-[#19191c] border border-white/[0.08] rounded-3xl p-7 shadow-2xl shadow-black/60"
            style={{
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(12px)",
            }}
          >
            <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${s.glow} rounded-t-3xl pointer-events-none`} />

            <button onClick={() => close(false)} className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-colors">
              <X size={16} />
            </button>

            <div className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${s.icon}`}>
              <IconComp size={26} />
            </div>

            <h3 className="font-display font-bold text-lg text-white mb-2">{opts.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-7">{opts.message}</p>

            <div className="flex gap-3">
              <button
                onClick={() => close(false)}
                className="flex-1 h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-zinc-300 text-sm font-semibold transition-colors border border-white/[0.06]"
              >
                {opts.cancelText ?? "Скасувати"}
              </button>
              <button
                onClick={() => close(true)}
                className={`flex-1 h-11 rounded-xl text-white text-sm font-semibold transition-all shadow-lg ${s.confirm}`}
              >
                {opts.confirmText ?? "Підтвердити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx.confirm;
}