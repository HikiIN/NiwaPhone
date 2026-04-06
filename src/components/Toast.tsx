"use client";
import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    bar: "bg-emerald-500",
    bg: "bg-emerald-500/10",
  },
  error: {
    border: "border-[#B03D3D]/40",
    icon: "text-[#e05555]",
    bar: "bg-[#B03D3D]",
    bg: "bg-[#B03D3D]/10",
  },
  warning: {
    border: "border-amber-500/30",
    icon: "text-amber-400",
    bar: "bg-amber-500",
    bg: "bg-amber-500/10",
  },
  info: {
    border: "border-blue-500/30",
    icon: "text-blue-400",
    bar: "bg-blue-500",
    bg: "bg-blue-500/10",
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const s = STYLES[toast.type];
  const Icon = ICONS[toast.type];

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 350);
  }, [onRemove, toast.id]);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => dismiss(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dismiss]);

  return (
    <div
      style={{
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateX(0) scale(1)" : "translateX(100%) scale(0.95)",
        maxHeight: leaving ? "0px" : "120px",
        marginBottom: leaving ? "0px" : "10px",
        overflow: "hidden",
      }}
    >
      <div className={`relative flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#19191c] border ${s.border} shadow-2xl shadow-black/50 backdrop-blur-xl min-w-[300px] max-w-[380px] overflow-hidden`}>
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar} rounded-l-2xl`} />
        <div className={`absolute inset-0 ${s.bg} rounded-2xl`} />

        <div className="relative z-10 flex items-start gap-3 w-full">
          <Icon size={18} className={`${s.icon} shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-snug">{toast.title}</p>
            {toast.message && <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>}
          </div>
          <button onClick={dismiss} className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0 mt-0.5">
            <X size={14} />
          </button>
        </div>

        <div className={`absolute bottom-0 left-0 h-[2px] ${s.bar} opacity-40 rounded-full`}
          style={{ animation: "toast-progress 4.5s linear forwards" }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ctx: ToastContextValue = {
    success: (t, m) => add("success", t, m),
    error: (t, m) => add("error", t, m),
    warning: (t, m) => add("warning", t, m),
    info: (t, m) => add("info", t, m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse" style={{ pointerEvents: "none" }}>
        <div style={{ pointerEvents: "auto" }}>
          {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
        </div>
      </div>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}