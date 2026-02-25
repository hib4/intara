import { Bot, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left: Branding & Trust Panel ─────────── */}
      <div className="relative hidden w-[480px] shrink-0 flex-col justify-between overflow-hidden bg-primary p-10 lg:flex xl:w-[520px]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />

        {/* Logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Intara
            </span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold leading-snug text-white xl:text-3xl">
              Kelola Bisnis &amp; Layani Pelanggan Lebih Cerdas dengan AI
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              Otomasi layanan pelanggan dan pahami keuangan bisnismu dalam satu
              platform — tanpa coding, tanpa ribet.
            </p>
          </div>

          {/* Trust: testimonial */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              "Sejak pakai Intara, saya bisa fokus ke produksi. Chatbot-nya
              jawab pertanyaan pelanggan 24 jam, dan dashboard keuangannya bikin
              saya paham mana produk yang paling untung."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                RA
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Rina Andayani
                </p>
                <p className="text-xs text-white/60">
                  Pemilik Toko Kue Manis Nusantara
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Intara (Intelligence Nusantara)
        </p>
      </div>

      {/* ── Right: Form Panel ────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-10">
        {/* Mobile logo (hidden on lg) */}
        <div className="mb-8 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Intara
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
