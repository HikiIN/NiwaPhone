"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Moon, Sun, Smartphone, User, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors">
          <Smartphone size={28} strokeWidth={2.5} />
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            NiwaPhone
          </span>
        </Link>

        {/* Права частина: Тема + Авторизація */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-colors"
              >
                <User size={18} />
                <span className="hidden sm:inline">Кабінет</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 text-zinc-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Вийти"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Увійти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}