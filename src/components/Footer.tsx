"use client";
import { useEffect, useState } from "react";
import { Database, WifiOff, Code2 } from "lucide-react";
import Image from "next/image";
import { useLang } from "./LangContext";

type DbStatus = "checking" | "online" | "offline";

export function Footer() {
  const [dbStatus, setDbStatus] = useState<DbStatus>("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const { t } = useLang();

  useEffect(() => {
    const check = async () => {
      const start = Date.now();
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const ms = Date.now() - start;
        if (res.ok) { setDbStatus("online"); setLatency(Date.now() - start); }
        else setDbStatus("offline");
      } catch { setDbStatus("offline"); }
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  const isOnline = dbStatus === "online";
  const isChecking = dbStatus === "checking";

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#0f0f10]">
      <div className="max-w-[1200px] mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="NiwaPhone" width={22} height={22} className="opacity-60" />
            <span className="font-display font-bold text-sm text-zinc-500 tracking-wider">NiwaPhone</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t.systemActive}
          </div>
          <div className={`flex items-center gap-1.5 text-xs transition-colors duration-500 ${isChecking ? "text-zinc-600" : isOnline ? "text-zinc-400" : "text-red-400"}`}>
            {isChecking ? <Database size={13} className="text-zinc-600 animate-pulse" /> : isOnline ? <Database size={13} className="text-[#B03D3D]" /> : <WifiOff size={13} className="text-red-400" />}
            {isChecking && t.dbChecking}
            {!isChecking && isOnline && <span>DB: <span className="text-emerald-400 font-semibold">{t.dbOnline}</span>{latency !== null && <span className="ml-1 text-zinc-600 font-mono">{latency}ms</span>}</span>}
            {!isChecking && !isOnline && <span>DB: <span className="text-red-400 font-semibold">{t.dbOffline}</span></span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <span>{t.madeBy}</span>
          <Code2 size={12} className="text-[#B03D3D] opacity-70" />
          <span className="font-display font-bold tracking-widest text-zinc-400">NIWATRIX</span>
          <span className="text-zinc-700">© 2026</span>
        </div>
      </div>
    </footer>
  );
}