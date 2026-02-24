import { useState } from "react";
import {
  Bot,
  FileText,
  Upload,
  Share2,
  ShoppingCart,
  GraduationCap,
  Stethoscope,
  Check,
  Menu,
  X,
  ArrowRight,
  Play,
  MessageSquare,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
 *  INTARA — Landing Page
 *  Intelligence Nusantara
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <HowItWorks />
      <UseCases />
      <PricingSection />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* ── Navbar ──────────────────────────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Fitur", href: "#fitur" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Harga", href: "#harga" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Intara
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Masuk
          </a>
          <a
            href="#"
            className="rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground shadow-sm transition hover:opacity-90"
          >
            Mulai Gratis
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-white px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <hr className="border-border" />
            <a
              href="#"
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              Masuk
            </a>
            <a
              href="#"
              className="rounded-lg bg-cta px-5 py-2.5 text-center text-sm font-semibold text-cta-foreground shadow-sm transition hover:opacity-90"
            >
              Mulai Gratis
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ── Hero Section ────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-[400px] w-[400px] rounded-full bg-cta/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Platform AI No-Code #1 untuk UMKM Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Punya <span className="text-primary">Asisten AI</span> Sendiri untuk
            Usahamu,{" "}
            <span className="relative">
              <span className="relative z-10">Kurang dari 5 Menit</span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-cta/20 sm:bottom-2 sm:h-4" />
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Tanpa coding. Tanpa ribet. Cukup tulis instruksi, unggah dokumen
            bisnismu, dan langsung dapatkan chatbot AI yang siap melayani
            pelanggan 24/7.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-4 text-base font-semibold text-cta-foreground shadow-lg shadow-cta/25 transition hover:shadow-xl hover:shadow-cta/30 hover:brightness-105"
            >
              Buat AI Sekarang
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-8 py-4 text-base font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/5"
            >
              <Play className="h-4 w-4" />
              Lihat Demo
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="flex -space-x-2">
              {[
                "bg-blue-400",
                "bg-green-400",
                "bg-amber-400",
                "bg-rose-400",
              ].map((bg, i) => (
                <span
                  key={i}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${bg}`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
              ))}
            </span>
            Dipercaya <strong className="text-foreground">500+</strong> pelaku
            usaha di Indonesia
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-border bg-white p-2 shadow-2xl shadow-primary/10">
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-10">
              {/* Mock header bar */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="h-6 w-48 rounded-md bg-slate-200" />
              </div>

              {/* Mock content */}
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Stat cards */}
                {[
                  {
                    label: "Total Chat",
                    value: "1,284",
                    color: "text-primary",
                  },
                  {
                    label: "Response Rate",
                    value: "98.5%",
                    color: "text-green-600",
                  },
                  {
                    label: "Dokumen Terlatih",
                    value: "24",
                    color: "text-cta",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mock chat preview */}
              <div className="mt-6 rounded-xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-64 rounded bg-slate-200" />
                    <div className="h-3 w-48 rounded bg-slate-200" />
                    <div className="h-3 w-56 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Logo Cloud ──────────────────────────────── */

function LogoCloud() {
  const names = [
    "TokoPedia",
    "Grab Merchant",
    "BukuWarung",
    "GoFood",
    "Shopee",
  ];

  return (
    <section className="border-y border-border/60 bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Terintegrasi dengan platform yang sudah Anda gunakan
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {names.map((n) => (
            <span
              key={n}
              className="text-base font-bold tracking-tight text-slate-300"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Beri Instruksi",
      description:
        'Tulis peran dan kepribadian AI Anda. Misalnya: "Kamu adalah asisten toko kue Ibu Ani, ramah dan suka pakai emoji."',
    },
    {
      icon: Upload,
      step: "02",
      title: "Unggah Pengetahuan",
      description:
        "Upload katalog produk, FAQ, daftar harga, atau dokumen bisnis Anda dalam format PDF atau TXT. AI akan belajar dari situ.",
    },
    {
      icon: Share2,
      step: "03",
      title: "Bagikan & Gunakan",
      description:
        "Dapatkan link chatbot yang bisa langsung dibagikan ke pelanggan lewat WhatsApp, Instagram, atau website Anda.",
    },
  ];

  return (
    <section id="cara-kerja" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tiga Langkah Mudah, Chatbot AI Siap Jalan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tidak perlu keahlian teknis. Siapapun bisa membuat AI chatbot
            profesional dalam hitungan menit.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={idx} className="group relative">
              {/* Connector line (hidden on last) */}
              {idx < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-8 translate-x-full bg-border md:block" />
              )}

              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm transition hover:shadow-md">
                {/* Icon */}
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>

                {/* Step number */}
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cta">
                  Langkah {s.step}
                </p>

                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Use Cases ───────────────────────────────── */

function UseCases() {
  const cases = [
    {
      icon: ShoppingCart,
      title: "Toko Online",
      description:
        "Otomasi layanan pelanggan: jawab pertanyaan produk, cek ongkir, dan proses pesanan 24/7 tanpa harus standby.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: GraduationCap,
      title: "Dosen & Pengajar",
      description:
        "Buat asisten belajar untuk mahasiswa. Upload materi kuliah dan biarkan AI menjawab pertanyaan mereka kapan saja.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Stethoscope,
      title: "Klinik & Praktik Dokter",
      description:
        "Jawab pertanyaan umum pasien, informasi jadwal praktik, dan prosedur pendaftaran secara otomatis.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: MessageSquare,
      title: "Agensi & Freelancer",
      description:
        "Sediakan asisten AI di website portofolio untuk menjawab pertanyaan klien dan menangkap leads secara otomatis.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="fitur" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Siapa yang Cocok?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dibuat untuk Berbagai Jenis Usaha
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Dari toko online hingga klinik, Intara membantu siapa saja yang
            ingin memberikan pelayanan pelanggan terbaik.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-border bg-background p-6 transition hover:border-primary/30 hover:shadow-lg"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.color}`}
              >
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
              >
                Pelajari
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────── */

function PricingSection() {
  const plans = [
    {
      name: "Paket Pemula",
      price: "Gratis",
      priceSuffix: "",
      description: "Cocok untuk yang baru mau coba dan eksplorasi AI chatbot.",
      highlighted: false,
      badge: null,
      features: [
        "1 Chatbot AI",
        "Maks. 50 pesan / bulan",
        "Upload 3 dokumen (PDF/TXT)",
        "Link chatbot publik",
        "Branding Intara",
      ],
      cta: "Mulai Gratis",
    },
    {
      name: "Paket Bisnis",
      price: "Rp149.000",
      priceSuffix: " / bulan",
      description:
        "Untuk usaha yang serius meningkatkan pelayanan pelanggan dengan AI.",
      highlighted: true,
      badge: "Paling Populer",
      features: [
        "5 Chatbot AI",
        "Pesan unlimited",
        "Upload 50 dokumen",
        "Custom branding (logo & warna)",
        "Integrasi website (embed widget)",
        "Analitik percakapan",
        "Prioritas dukungan via WhatsApp",
      ],
      cta: "Langganan Sekarang",
    },
  ];

  return (
    <section id="harga" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Harga
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Harga Transparan, Tanpa Biaya Tersembunyi
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis Anda.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition ${
                plan.highlighted
                  ? "border-primary bg-white shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border bg-white shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1 rounded-full bg-cta px-4 py-1 text-xs font-bold text-cta-foreground shadow-sm">
                  <Star className="h-3 w-3" />
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {plan.price}
                </span>
                {plan.priceSuffix && (
                  <span className="text-base text-muted-foreground">
                    {plan.priceSuffix}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={`mt-8 block rounded-xl py-3.5 text-center text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-cta text-cta-foreground shadow-md shadow-cta/20 hover:brightness-105"
                    : "border-2 border-primary/30 text-primary hover:bg-primary/5"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA Banner ──────────────────────────────── */

function CTABanner() {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Siap Punya Asisten AI untuk Bisnismu?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
          Bergabung dengan ratusan pelaku usaha Indonesia yang sudah menggunakan
          Intara untuk meningkatkan pelayanan pelanggan mereka.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-4 text-base font-semibold text-cta-foreground shadow-lg transition hover:brightness-105"
          >
            Buat AI Sekarang — Gratis
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 px-8 py-4 text-base font-semibold text-primary-foreground transition hover:bg-white/10"
          >
            Hubungi Tim Kami
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────── */

function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Intara</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Intelligence Nusantara — Platform AI chatbot no-code untuk UMKM
              Indonesia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Produk</h4>
            <ul className="mt-3 space-y-2">
              {["Fitur", "Harga", "Integrasi", "Changelog"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Perusahaan
            </h4>
            <ul className="mt-3 space-y-2">
              {["Tentang Kami", "Blog", "Karir", "Kontak"].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              {["Kebijakan Privasi", "Syarat & Ketentuan", "Keamanan Data"].map(
                (l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Intara (Intelligence Nusantara).
            Hak cipta dilindungi.
          </p>
          <div className="flex gap-4">
            {["Twitter", "Instagram", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;
