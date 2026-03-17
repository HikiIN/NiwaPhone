"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 rounded-full border-2 border-red-DEFAULT border-t-transparent animate-spin" />
      </div>
    );
  }

  const user = session.user as any;
  const role = user?.role || "Продавець";
  const isAdmin = role === "Адміністратор";

  return (
    <main className="max-w-[1200px] mx-auto px-5 py-8">
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl text-white mb-1">Кабінет</h1>
        <p className="text-sm text-zinc-500">Інформація вашого облікового запису</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center text-center">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-20 h-20 rounded-full border-2 border-white/10 mb-4 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-white/10 flex items-center justify-center mb-4">
              <User size={32} className="text-zinc-500" />
            </div>
          )}
          <h2 className="font-display font-semibold text-lg text-white mb-1">
            {session.user?.name || "Користувач"}
          </h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isAdmin
              ? "bg-red-dim text-red-DEFAULT"
              : "bg-white/[0.06] text-zinc-400"
          }`}>
            <Shield size={11} className="mr-1.5" />
            {role}
          </span>
        </div>

        <div className="lg:col-span-2 bg-zinc-900 border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-display font-medium text-sm text-zinc-400 mb-5 uppercase tracking-wider">Дані акаунта</h3>
          <div className="space-y-4">
            <InfoRow icon={<User size={15} />} label="Ім'я" value={session.user?.name || "—"} />
            <InfoRow icon={<Mail size={15} />} label="Email" value={session.user?.email || "—"} />
            <InfoRow icon={<Shield size={15} />} label="Роль" value={role} />
            <InfoRow icon={<Calendar size={15} />} label="Вхід через" value="Google" />
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <h3 className="font-display font-medium text-sm text-zinc-400 mb-4 uppercase tracking-wider">Можливості</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PermCard label="Перегляд каталогу" allowed />
              <PermCard label="Пошук та фільтрація" allowed />
              <PermCard label="Зміна статусу товару" allowed={isSeller(role)} />
              <PermCard label="Додавання товарів" allowed={isAdmin} />
              <PermCard label="Редагування товарів" allowed={isAdmin} />
              <PermCard label="Видалення товарів" allowed={isAdmin} />
              <PermCard label="Доступ до дашборду" allowed={isAdmin} />
              <PermCard label="Аналітика продажів" allowed={isAdmin} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function isSeller(role: string) {
  return role === "Продавець" || role === "Адміністратор";
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-zinc-500 shrink-0">
        {icon}
      </div>
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
      allowed
        ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400"
        : "border-white/[0.05] bg-transparent text-zinc-600"
    }`}>
      <span className={`text-base leading-none ${allowed ? "text-emerald-400" : "text-zinc-700"}`}>
        {allowed ? "✓" : "✕"}
      </span>
      {label}
    </div>
  );
}