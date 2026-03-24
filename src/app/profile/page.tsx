"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Download, Upload, Languages, Check, Eye, AlertCircle } from "lucide-react";
import { useLang } from "@/components/LangContext";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, lang, toggleLang } = useLang();

  const [exportState, setExportState] = useState<"idle" | "loading" | "done">("idle");
  const [importState, setImportState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-red-DEFAULT border-t-transparent animate-spin" />
      </div>
    );
  }

  const user = session.user as any;
  const role: string = user?.role || "Гість";
  const isAdmin  = role === "Адміністратор";
  const isSeller = role === "Продавець" || isAdmin;
  const isGuest  = role === "Гість";

  const roleBadgeClass = isAdmin
    ? "bg-red-dim text-red-DEFAULT"
    : isSeller
    ? "bg-amber-500/10 text-amber-400"
    : "bg-white/[0.06] text-zinc-500";

  const handleExport = async () => {
    if (exportState !== "idle") return;
    setExportState("loading");
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `niwaphone-db-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportState("done");
      setTimeout(() => setExportState("idle"), 2500);
    } catch {
      setExportState("idle");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImportState("loading");
    setImportResult(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setImportResult({ imported: data.imported, skipped: data.skipped });
      setImportState("done");
      setTimeout(() => { setImportState("idle"); setImportResult(null); }, 4000);
    } catch {
      setImportState("error");
      setTimeout(() => setImportState("idle"), 3000);
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">{t.cabinet}</h1>
        <p className="text-sm text-zinc-500">{t.cabinetSub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/*Ліва колонка*/}
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center text-center gap-4">

          {session.user?.image ? (
            <img src={session.user.image} alt="avatar" className="w-20 h-20 rounded-full border-2 border-white/10 object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center">
              <User size={32} className="text-zinc-500" />
            </div>
          )}

          <div>
            <h2 className="font-display font-semibold text-lg text-white mb-1.5">
              {session.user?.name || "Користувач"}
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadgeClass}`}>
              {isAdmin ? <Shield size={11} className="mr-1.5" /> : isGuest ? <Eye size={11} className="mr-1.5" /> : null}
              {role}
            </span>
          </div>

          {/* Гостьовий банер */}
          {isGuest && (
            <div className="w-full px-3 py-2.5 rounded-xl border border-zinc-700/50 bg-zinc-800/50 text-xs text-zinc-500 leading-relaxed text-left">
              <p className="font-semibold text-zinc-400 mb-0.5">
                {lang === "uk" ? "Обліковий запис гостя" : "Guest Account"}
              </p>
              {t.roleDescription.guest}
            </div>
          )}

          <div className="w-full flex flex-col gap-2.5 pt-1">

            {isSeller && (
              <button
                onClick={handleExport}
                disabled={exportState !== "idle"}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                  exportState === "done"
                    ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-400"
                    : exportState === "loading"
                    ? "border-white/[0.08] bg-white/[0.03] text-zinc-500 cursor-wait"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-red-DEFAULT/40 hover:bg-red-dim hover:text-white cursor-pointer"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  exportState === "done" ? "bg-emerald-500/15 text-emerald-400"
                  : exportState === "loading" ? "bg-white/[0.05] text-zinc-500"
                  : "bg-white/[0.06] text-zinc-400 group-hover:bg-red-dim group-hover:text-red-DEFAULT"
                }`}>
                  {exportState === "loading" ? (
                    <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  ) : exportState === "done" ? (
                    <Check size={16} />
                  ) : (
                    <Download size={16} />
                  )}
                </span>
                <span className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-semibold leading-tight">
                    {exportState === "loading" ? t.exporting : exportState === "done" ? t.exported : t.exportDb}
                  </span>
                  <span className={`text-[11px] leading-tight mt-0.5 ${exportState === "done" ? "text-emerald-500/70" : "text-zinc-600"}`}>
                    {t.exportDbSub}
                  </span>
                </span>
              </button>
            )}

            {/* Завантажити БД — тільки адмін */}
            {isAdmin && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={() => importState === "idle" && fileInputRef.current?.click()}
                  disabled={importState !== "idle"}
                  className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                    importState === "done"
                      ? "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-400"
                      : importState === "error"
                      ? "border-red-500/30 bg-red-500/[0.08] text-red-400"
                      : importState === "loading"
                      ? "border-white/[0.08] bg-white/[0.03] text-zinc-500 cursor-wait"
                      : "border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-amber-500/40 hover:bg-amber-500/[0.06] hover:text-white cursor-pointer"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    importState === "done"   ? "bg-emerald-500/15 text-emerald-400"
                    : importState === "error"  ? "bg-red-500/15 text-red-400"
                    : importState === "loading" ? "bg-white/[0.05] text-zinc-500"
                    : "bg-white/[0.06] text-zinc-400 group-hover:bg-amber-500/10 group-hover:text-amber-400"
                  }`}>
                    {importState === "loading" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : importState === "done" ? (
                      <Check size={16} />
                    ) : importState === "error" ? (
                      <AlertCircle size={16} />
                    ) : (
                      <Upload size={16} />
                    )}
                  </span>
                  <span className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold leading-tight">
                      {importState === "loading" ? (lang === "uk" ? "Завантаження..." : "Uploading...")
                       : importState === "done"    ? (lang === "uk" ? "Імпортовано!" : "Imported!")
                       : importState === "error"   ? (lang === "uk" ? "Помилка файлу" : "File error")
                       : (lang === "uk" ? "Завантажити БД" : "Import Database")}
                    </span>
                    <span className={`text-[11px] leading-tight mt-0.5 ${
                      importState === "done"  ? "text-emerald-500/70"
                      : importState === "error" ? "text-red-400/70"
                      : "text-zinc-600"
                    }`}>
                      {importState === "done" && importResult
                        ? (lang === "uk"
                            ? `${importResult.imported} додано · ${importResult.skipped} пропущено`
                            : `${importResult.imported} added · ${importResult.skipped} skipped`)
                        : importState === "error"
                        ? (lang === "uk" ? "Перевірте формат JSON" : "Check JSON format")
                        : (lang === "uk" ? "Відновити з файлу .json" : "Restore from .json file")}
                    </span>
                  </span>
                </button>
              </>
            )}

            <button
              onClick={toggleLang}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-left text-zinc-300 hover:border-sky-500/40 hover:bg-sky-500/[0.06] hover:text-white transition-all duration-200 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 text-zinc-400 group-hover:bg-sky-500/15 group-hover:text-sky-400 transition-all duration-200">
                <Languages size={16} />
              </span>
              <span className="flex flex-col items-start min-w-0">
                <span className="text-sm font-semibold leading-tight">{t.switchLang}</span>
                <span className="text-[11px] text-zinc-600 leading-tight mt-0.5">{t.switchLangSub}</span>
              </span>
              <span className="ml-auto shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.07] text-zinc-500 uppercase tracking-wider">
                {lang}
              </span>
            </button>

          </div>
        </div>

        {/*Права колонка*/}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-display font-medium text-sm text-zinc-400 mb-5 uppercase tracking-wider">
            {t.accountData}
          </h3>
          <div className="space-y-4">
            <InfoRow icon={<User size={15} />}     label={t.fieldName}     value={session.user?.name || "—"} />
            <InfoRow icon={<Mail size={15} />}     label={t.fieldEmail}    value={session.user?.email || "—"} />
            <InfoRow icon={<Shield size={15} />}   label={t.fieldRole}     value={role} />
            <InfoRow icon={<Calendar size={15} />} label={t.fieldLoginVia} value="Google" />
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="font-display font-medium text-sm text-zinc-400 mb-4 uppercase tracking-wider">
              {t.permissions}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PermCard label={t.perms.view}      allowed />
              <PermCard label={t.perms.search}    allowed />
              <PermCard label={t.perms.status}    allowed={isSeller} />
              <PermCard label={t.perms.add}       allowed={isAdmin} />
              <PermCard label={t.perms.edit}      allowed={isAdmin} />
              <PermCard label={t.perms.delete}    allowed={isAdmin} />
              <PermCard label={t.perms.dashboard} allowed={isAdmin} />
              <PermCard label={t.perms.analytics} allowed={isAdmin} />
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.04]">
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">
                {lang === "uk" ? "Рівні доступу" : "Access Levels"}
              </p>
              <div className="flex flex-col gap-2">
                <RoleRow icon={<Eye size={13} />}    color="text-zinc-500"    bg="bg-zinc-800"     label={t.roleGuest}  desc={t.roleDescription.guest}  active={isGuest} />
                <RoleRow icon={null}                 color="text-amber-400"  bg="bg-amber-500/10" label={t.roleSeller} desc={t.roleDescription.seller} active={isSeller && !isAdmin} />
                <RoleRow icon={<Shield size={13} />} color="text-red-DEFAULT" bg="bg-red-dim"      label={t.roleAdmin}  desc={t.roleDescription.admin}  active={isAdmin} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-zinc-500 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-zinc-600 mb-0.5 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-zinc-200 truncate">{value}</p>
      </div>
    </div>
  );
}

function PermCard({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm ${
      allowed ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400" : "border-white/[0.05] bg-transparent text-zinc-600"
    }`}>
      <span className={`text-base leading-none ${allowed ? "text-emerald-400" : "text-zinc-700"}`}>{allowed ? "✓" : "✕"}</span>
      {label}
    </div>
  );
}

function RoleRow({ icon, color, bg, label, desc, active }: {
  icon: React.ReactNode; color: string; bg: string; label: string; desc: string; active: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
      active ? "border-white/[0.1] bg-white/[0.04]" : "border-transparent opacity-40"
    }`}>
      <span className={`w-6 h-6 rounded-md ${bg} flex items-center justify-center shrink-0 ${color}`}>
        {icon ?? <span className="text-[10px] font-bold">S</span>}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold ${active ? "text-zinc-200" : "text-zinc-500"}`}>{label}</p>
        <p className="text-[11px] text-zinc-600 truncate">{desc}</p>
      </div>
      {active && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-400 uppercase tracking-wider shrink-0">
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}