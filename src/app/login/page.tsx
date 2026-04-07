"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Loader2 } from "lucide-react";
import { useLang } from "@/components/LangContext";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const { t } = useLang();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleGuest = () => {
    setLoadingGuest(true);
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-[#B03D3D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #B03D3D 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/[0.07] rounded-3xl p-8 shadow-2xl">

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/[0.08] flex items-center justify-center mb-4 shadow-lg">
              <Image src="/logo.svg" alt="NiwaPhone" width={32} height={32} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight">NiwaPhone</h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">{t.loginSubtitle}</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest">{t.loginSection}</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loadingGoogle || loadingGuest}
            style={{ height: "52px" }}
            className="group w-full flex items-center justify-center gap-3 px-5 rounded-2xl border border-white/[0.1] bg-white text-[#1a1a1a] text-sm font-semibold hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20"
          >
            {loadingGoogle ? <Loader2 size={18} className="animate-spin text-zinc-500" /> : <GoogleIcon />}
            <span>{loadingGoogle ? t.connecting : t.signInGoogle}</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="text-[11px] text-zinc-700 uppercase tracking-wider">або</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
          </div>

          <button
            onClick={handleGuest}
            disabled={loadingGoogle || loadingGuest}
            style={{ height: "48px" }}
            className="group w-full flex items-center justify-center gap-2.5 px-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-zinc-400 text-sm font-medium hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-zinc-200 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingGuest ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />}
            <span>{loadingGuest ? t.loading : t.continueGuest}</span>
          </button>

          <p className="text-center text-[11px] text-zinc-700 mt-4 leading-relaxed">{t.guestHint}</p>
        </div>

        <p className="text-center text-[11px] text-zinc-700 mt-5">
          © {new Date().getFullYear()} NiwaPhone · {t.rights}
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}