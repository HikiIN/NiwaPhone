import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const urbanist = Urbanist({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'] 
});

export const metadata: Metadata = {
  title: "NiwaPhone | Облік товарів",
  description: "Сучасна система обліку для магазину телефонів",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${urbanist.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}