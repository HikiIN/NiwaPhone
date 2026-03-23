"use client";
import { useEffect, useState } from "react";
import { Database, WifiOff, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "./LangContext";

type DbStatus = "checking" | "online" | "offline";

function NiwatrixLogo({ size = 20 }: { size?: number }) {
  const scale = size / 295;
  const w = Math.round(528 * scale);
  return (
    <svg width={w} height={size} viewBox="0 0 528 295" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M525.991 86.3027C351.33 113.23 176.669 113.23 2.00781 86.3027L56.6113 66.5166C194.87 93.8265 333.129 93.8264 471.388 66.5166L525.991 86.3027Z" fill="currentColor" stroke="currentColor"/>
      <path d="M264 4.5C313.58 4.5 363.195 24.6113 412.856 64.8994C313.62 38.1444 214.379 38.1442 115.143 64.8994C164.804 24.6109 214.42 4.5 264 4.5Z" fill="currentColor" stroke="currentColor"/>
      <path d="M75 107C201 134.259 327 134.259 453 107L415.2 250.111C314.4 304.63 213.6 304.63 112.8 250.111L75 107Z" stroke="currentColor" strokeWidth="10"/>
      <path d="M225.1 188.235L152.646 168.432L206.986 148.627L225.1 188.235Z" fill="currentColor" stroke="currentColor"/>
      <path d="M375.353 168.432L302.899 188.235L321.013 148.627L375.353 168.432Z" fill="currentColor" stroke="currentColor"/>
      <path d="M264 148V230" stroke="currentColor" strokeWidth="3"/>
      <path d="M113 209C213.667 263.667 314.333 263.667 415 209" stroke="currentColor" strokeWidth="4"/>
    </svg>
  );
}

export function Footer() {
  const [dbStatus, setDbStatus]   = useState<DbStatus>("checking");
  const [latency, setLatency]     = useState<number | null>(null);
  const { t } = useLang();

  useEffect(() => {
    const check = async () => {
      const start = Date.now();
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (res.ok) { setDbStatus("online"); setLatency(Date.now() - start); }
        else          setDbStatus("offline");
      } catch { setDbStatus("offline"); }
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  const isOnline   = dbStatus === "online";
  const isChecking = dbStatus === "checking";

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#0f0f10]">
      <div className="max-w-[1200px] mx-auto px-5 pt-6 pb-5">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo-wh.svg" alt="NiwaPhone" width={24} height={24} className="opacity-70" />
              <span className="font-display text-base text-dark-gray tracking-wide">NiwaPhone</span>
            </div>
            <p className="text-[11px] text-zinc-600 max-w-[220px] leading-relaxed">
              {t.madeBy === "Розроблено"
                ? "Система обліку магазину телефонів"
                : "Phone store management system"}
            </p>
          </div>

          {/* Право: статус-панель */}
          <div className="flex flex-col gap-2 min-w-0 sm:items-end">

            {/* Система активна */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.07] border border-emerald-500/15">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-emerald-500">{t.systemActive}</span>
            </div>

            {/* БД статус */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-500 ${
              isChecking
                ? "bg-zinc-800/40 border-white/[0.05]"
                : isOnline
                ? "bg-[#B03D3D]/[0.07] border-[#B03D3D]/20"
                : "bg-red-500/[0.07] border-red-500/20"
            }`}>
              {isChecking ? (
                <Database size={12} className="text-zinc-600 animate-pulse shrink-0" />
              ) : isOnline ? (
                <Database size={12} className="text-[#B03D3D] shrink-0" />
              ) : (
                <WifiOff size={12} className="text-red-400 shrink-0" />
              )}

              <span className="text-[11px] font-medium">
                {isChecking && (
                  <span className="text-zinc-600">{t.dbChecking}</span>
                )}
                {!isChecking && isOnline && (
                  <span className="text-zinc-400">
                    DB:{" "}
                    <span className="text-emerald-400 font-semibold">{t.dbOnline}</span>
                    {latency !== null && (
                      <span className="ml-1.5 font-mono text-zinc-600">{latency}ms</span>
                    )}
                  </span>
                )}
                {!isChecking && !isOnline && (
                  <span className="text-zinc-400">
                    DB: <span className="text-red-400 font-semibold">{t.dbOffline}</span>
                  </span>
                )}
              </span>
            </div>

          </div>
        </div>

        <div className="h-px bg-white/[0.05] mb-4" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <span className="text-[11px] text-zinc-700">
            © 2026 NiwaPhone. {t.rights}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-700">{t.madeBy}</span>
            <Zap size={11} className="text-[#B03D3D] opacity-60" />
            <div className="flex items-center gap-1.5 group">
              <NiwatrixLogo size={14} />
              <span className="font-display font-bold tracking-[0.18em] text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                Niwatrix
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}