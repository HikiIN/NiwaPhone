"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);

  const role = (session?.user as any)?.role;
  const isAdmin = role === "Адміністратор";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f0f10]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="NiwaPhone" width={32} height={32} />
          <span className="font-display text-lg text-white">
            NiwaPhone
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <NavLink href="/" label="Каталог" active={pathname === "/"} />
          {isAdmin && <NavLink href="/dashboard" label="Дашборд" active={pathname === "/dashboard"} />}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {role && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-dim text-red-DEFAULT uppercase tracking-wider">
                  {role}
                </span>
              )}
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border border-white/10 object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User size={16} className="text-zinc-400" />
                  </div>
                )}
              </Link>
              <button onClick={() => signOut()} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="px-5 h-10 rounded-xl bg-red-DEFAULT bg-[#B03D3D] hover:bg-[#8A2D2D] text-white text-sm font-semibold transition-colors">
              Увійти
            </button>
          )}
        </div>

        {/* Мобільна кнопка */}
        <button className="md:hidden p-2 text-zinc-400" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Мобільне меню */}
      {mobileMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#19191c] border-b border-white/10 p-5 flex flex-col gap-4 shadow-2xl animate-fadeUp">
          <Link href="/" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/" ? "bg-white/10 text-white" : "text-zinc-400"}`}>Каталог</Link>
          {isAdmin && <Link href="/dashboard" onClick={() => setMobileMenu(false)} className={`p-3 rounded-xl ${pathname === "/dashboard" ? "bg-white/10 text-white" : "text-zinc-400"}`}>Дашборд</Link>}
          
          <hr className="border-white/5 my-2" />
          
          {session ? (
            <div className="flex items-center justify-between">
              <Link href="/profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-3">
                 {session.user?.image && <img src={session.user.image} alt="Avatar" className="w-10 h-10 rounded-full" />}
                 <div>
                   <p className="text-sm text-white font-medium">{session.user?.name}</p>
                   <p className="text-xs text-red-DEFAULT">{role}</p>
                 </div>
              </Link>
              <button onClick={() => signOut()} className="p-3 text-zinc-400"><LogOut size={20} /></button>
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="w-full h-12 rounded-xl bg-[#B03D3D] bg-red-DEFAULT text-white font-semibold">Увійти</button>
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