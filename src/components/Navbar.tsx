"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Menu, X, Eye, HelpCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useLang } from "./LangContext";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const { t, lang } = useLang();

  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "Адміністратор";
  const isGuest = role === "Гість";

  const roleBadgeClass = isAdmin
    ? "bg-red-dim text-red-DEFAULT"
    : isGuest
    ? "bg-zinc-800 text-zinc-500"
    : "bg-amber-500/10 text-amber-400";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0f10]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="NiwaPhone" width={32} height={32} />
          <span className="font-display text-lg text-white">NiwaPhone</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/" label={t.catalog} active={pathname === "/"} />
          {isAdmin && <NavLink href="/dashboard" label={t.dashboard} active={pathname === "/dashboard"} />}
          {isAdmin && <NavLink href="/suppliers" label={lang === "uk" ? "Постачальники" : "Suppliers"} active={pathname === "/suppliers"} />}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/help" className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
            <HelpCircle size={20} />
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              {role && (
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${roleBadgeClass}`}>
                  {isGuest && <Eye size={10} />}
                  {role}
                </span>
              )}
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {session.user?.image ? (
                  <Image src={session.user.image} alt="Avatar" width={36} height={36} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border border-white/10 object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User size={16} className="text-zinc-400" />
                  </div>
                )}
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-5 h-10 rounded-xl bg-[#B03D3D] hover:bg-[#8A2D2D] text-white text-sm font-semibold transition-colors flex items-center">
              {t.signIn}
            </Link>
          )}
        </div>

        <button className="md:hidden p-2 text-zinc-400" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#19191c] border-b border-white/10 p-5 flex flex-col gap-4 shadow-2xl animate-fadeUp">
          <Link href="/" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/" ? "bg-white/10 text-white" : "text-zinc-400"}`}>
            {t.catalog}
          </Link>
          {isAdmin && (
            <Link href="/dashboard" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/dashboard" ? "bg-white/10 text-white" : "text-zinc-400"}`}>
              {t.dashboard}
            </Link>
          )}
          {isAdmin && (
            <Link href="/suppliers" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/suppliers" ? "bg-white/10 text-white" : "text-zinc-400"}`}>
              {lang === "uk" ? "Постачальники" : "Suppliers"}
            </Link>
          )}
          
          <Link href="/help" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/help" ? "bg-white/10 text-white" : "text-zinc-400"} flex items-center gap-2`}>
            <HelpCircle size={18} /> {lang === "uk" ? "Довідка (F.A.Q.)" : "Help (F.A.Q.)"}
          </Link>

          <hr className="border-white/5 my-2" />
          {session ? (
            <div className="flex items-center justify-between">
              <Link href="/profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-3">
                {session.user?.image && <Image src={session.user.image} alt="Avatar" width={40} height={40} className="w-10 h-10 rounded-full" />}
                <div>
                  <p className="text-sm text-white font-medium">{session.user?.name}</p>
                  <p className={`text-xs ${isGuest ? "text-zinc-500" : isAdmin ? "text-red-DEFAULT" : "text-amber-400"}`}>{role}</p>
                </div>
              </Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-3 text-zinc-400">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileMenu(false)} className="w-full h-12 rounded-xl bg-[#B03D3D] text-white font-semibold flex items-center justify-center">
              {t.signIn}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${active ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"}`}>
      {label}
    </Link>
  );
}