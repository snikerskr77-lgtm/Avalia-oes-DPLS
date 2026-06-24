import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Avaliações de Agentes",
  description: "Plataforma de avaliação de desempenho de agentes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <nav className="bg-slate-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg">
                  A
                </div>
                <span className="font-bold text-lg tracking-tight">
                  Avaliações de Agentes
                </span>
              </a>
              <div className="flex gap-1">
                <a
                  href="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/avaliar"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Nova Avaliação
                </a>
                <a
                  href="/agentes"
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Agentes
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
