import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bot,
  Check,
  Menu,
  X,
  ArrowRight,
  Play,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
  BarChart3,
  BrainCircuit,
  Database,
  Lightbulb,
  ShieldCheck,
  Send,
  Headphones,
} from "lucide-react";

/* ─────────────────────────────────────────────
 *  INTARA — Landing Page v2
 *  Intelligence Nusantara · Super-App AI UMKM
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Mock data ─────────────────────────────── */
const cashflowData = [
  { name: "Jan", pemasukan: 4200, pengeluaran: 2800 },
  { name: "Feb", pemasukan: 3800, pengeluaran: 2600 },
  { name: "Mar", pemasukan: 5100, pengeluaran: 3200 },
  { name: "Apr", pemasukan: 4700, pengeluaran: 2900 },
  { name: "Mei", pemasukan: 6300, pengeluaran: 3400 },
  { name: "Jun", pemasukan: 5800, pengeluaran: 3100 },
  { name: "Jul", pemasukan: 7200, pengeluaran: 3600 },
];

const productProfitData = [
  { name: "Kopi Susu", profit: 4800 },
  { name: "Matcha", profit: 3900 },
  { name: "Es Teh", profit: 3200 },
  { name: "Croissant", profit: 2800 },
  { name: "Roti Bakar", profit: 2100 },
];

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <BentoFeatures />
      <HowItWorks />
      <PricingSection />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* ── Navbar ──────────────────────────────────── */

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update URL hash without jumping
    window.history.pushState(null, "", href);
  }
}

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
              onClick={(e) => scrollToSection(e, l.href)}
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
                onClick={(e) => {
                  scrollToSection(e, l.href);
                  setOpen(false);
                }}
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ─ Left: Copy ─ */}
          <div>
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Super-App AI #1 untuk UMKM Indonesia
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
              Satu <span className="text-primary">AI Cerdas</span> untuk CS
              Otomatis &amp; Analisis Bisnis{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">UMKM Anda</span>
                <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-cta/20 sm:h-4" />
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Otomasi balasan pelanggan 24/7{" "}
              <strong className="text-foreground">dan</strong> pahami data
              keuangan bisnis Anda — arus kas, tren penjualan, hingga produk
              paling laris — cukup dengan{" "}
              <strong className="text-foreground">bertanya ke AI</strong>. Tanpa
              coding, tanpa keahlian finansial.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cta px-7 py-3.5 text-base font-semibold text-cta-foreground shadow-lg shadow-cta/25 transition hover:shadow-xl hover:shadow-cta/30 hover:brightness-105"
              >
                Coba Gratis Sekarang
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-white px-7 py-3.5 text-base font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/5"
              >
                <Play className="h-4 w-4" />
                Lihat Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex -space-x-2">
                {[
                  "bg-blue-400",
                  "bg-emerald-400",
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
              Dipercaya{" "}
              <strong className="text-foreground">500+ pelaku usaha</strong> di
              seluruh Indonesia
            </div>
          </div>

          {/* ─ Right: Visual Split — overlapping cards ─ */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            {/* Card 1: Cashflow Chart */}
            <div className="relative z-10 rounded-2xl border border-border bg-white p-5 shadow-xl shadow-primary/10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Arus Kas Bulanan
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jan — Jul 2026
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  +23%
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflowData}>
                    <defs>
                      <linearGradient
                        id="gradPemasukan"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0258A3"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0258A3"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="gradPengeluaran"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f97316"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f97316"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pemasukan"
                      stroke="#0258A3"
                      strokeWidth={2.5}
                      fill="url(#gradPemasukan)"
                      name="Pemasukan"
                    />
                    <Area
                      type="monotone"
                      dataKey="pengeluaran"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="url(#gradPengeluaran)"
                      name="Pengeluaran"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Card 2: Chat mockup (overlapping) */}
            <div className="relative -mt-6 ml-6 rounded-2xl border border-border bg-white p-5 shadow-lg sm:ml-12 lg:-mt-10 lg:ml-16">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cta/10">
                  <MessageSquare className="h-3.5 w-3.5 text-cta" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  AI Business Insight
                </p>
              </div>

              <div className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    Kenapa penjualan turun minggu ini?
                  </div>
                </div>

                {/* AI reply */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-slate-50 px-4 py-2.5 text-sm text-foreground">
                    <p>
                      📉 Penjualan turun <strong>18%</strong> karena{" "}
                      <strong>Kopi Susu</strong> kehabisan stok 2 hari.
                      Rekomendasi: restock dan jalankan promo bundling akhir
                      pekan.
                    </p>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex items-center gap-1.5 px-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-300 [animation-delay:300ms]" />
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
  const names = ["Tokopedia", "GrabMerchant", "BukuWarung", "GoFood", "Shopee"];

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

/* ── Bento Grid — Fitur Unggulan ─────────────── */

function BentoFeatures() {
  return (
    <section id="fitur" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Fitur Unggulan
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Semua yang UMKM Butuhkan, dalam Satu Platform
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Dari layanan pelanggan otomatis hingga analisis keuangan berbasis AI
            — tanpa perlu keahlian teknis.
          </p>
        </div>

        {/* Bento grid  — 2 cols on desktop, stack on mobile */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Card 1 — No-Code RAG Chatbot (full width) */}
          <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8 md:col-span-2">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                  <Headphones className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Chatbot CS Tanpa Coding
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Upload katalog produk, FAQ, atau daftar harga dalam format PDF
                  / TXT. Dalam hitungan menit, AI Anda siap menjawab pertanyaan
                  pelanggan di WhatsApp, Instagram, atau website — 24 jam
                  nonstop.
                </p>

                <ul className="mt-5 space-y-2.5">
                  {[
                    "Upload dokumen, langsung jadi basis pengetahuan AI",
                    "Jawab pertanyaan produk, harga, & ketersediaan otomatis",
                    "Bagikan link chatbot atau embed di website Anda",
                  ].map((text) => (
                    <li
                      key={text}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mini mockup */}
              <div className="rounded-xl border border-border bg-slate-50 p-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-500">
                      P
                    </span>
                    <div className="rounded-2xl rounded-bl-md border border-border bg-white px-4 py-2.5 text-sm text-foreground">
                      Apakah Croissant Almond masih tersedia? Berapa harganya?
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-bl-md border border-border bg-white px-4 py-2.5 text-sm text-foreground">
                      <p>
                        Hai! 🥐 <strong>Croissant Almond</strong> masih
                        tersedia. Harganya <strong>Rp28.000</strong>/pcs.
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Mau sekalian pesan? Saya bisa bantu ✨
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Smart Financial Dashboard (large) */}
          <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Dashboard Keuangan Cerdas
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Lihat arus kas, margin keuntungan, dan produk paling laris secara
              otomatis. AI mendeteksi anomali dan memberi peringatan stok
              menipis — tanpa perlu buka spreadsheet.
            </p>

            {/* Mini bar chart mockup */}
            <div className="mt-6 rounded-xl border border-border bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Produk Paling Untung
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productProfitData} barSize={32}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        `Rp${Number(value).toLocaleString("id-ID")}k`,
                        "Profit",
                      ]}
                    />
                    <Bar
                      dataKey="profit"
                      fill="#0258A3"
                      radius={[6, 6, 0, 0]}
                      name="Profit"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Card 3 — AI Conversational Analytics (large) */}
          <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cta/10">
              <BrainCircuit className="h-6 w-6 text-cta" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              AI Analitik Percakapan
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Tanya apa saja tentang bisnis Anda lewat chat. AI menjawab dengan
              data aktual — kapan harus restock, produk mana yang perlu promo,
              dan tren penjualan mingguan.
            </p>

            {/* Chat mockup */}
            <div className="mt-6 space-y-3 rounded-xl border border-border bg-slate-50 p-4">
              {/* User */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  Produk mana yang perlu restock minggu ini?
                </div>
              </div>

              {/* AI */}
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-border bg-white px-4 py-2.5 text-sm text-foreground">
                  <p>
                    Berdasarkan data 30 hari terakhir, 3 produk perlu restock
                    segera:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <strong className="text-foreground">Kopi Susu</strong> —
                      stok tersisa 12 cup (rata-rata 40/hari)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <strong className="text-foreground">
                        Matcha Latte
                      </strong>{" "}
                      — stok tersisa 18 cup
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <strong className="text-foreground">Croissant</strong> —
                      stok tersisa 8 pcs
                    </li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    💡 Rekomendasi: Order sebelum Kamis agar stok aman weekend.
                  </p>
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2">
                <input
                  type="text"
                  placeholder="Tanya insight bisnis Anda..."
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                  readOnly
                />
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      icon: Database,
      step: "01",
      title: "Integrasi Data & Dokumen",
      description:
        "Upload katalog produk, FAQ, atau data transaksi Anda. Mendukung format PDF, TXT, dan CSV — cukup drag-and-drop.",
    },
    {
      icon: BrainCircuit,
      step: "02",
      title: "AI Menganalisis",
      description:
        "Mesin AI Intara memproses dokumen untuk chatbot dan menganalisis data keuangan untuk menemukan tren, anomali, dan peluang.",
    },
    {
      icon: Lightbulb,
      step: "03",
      title: "Dapatkan Insight & Layani Pelanggan",
      description:
        "Ambil keputusan berbasis data melalui percakapan AI dan biarkan chatbot melayani pelanggan Anda 24/7 tanpa jeda.",
    },
  ];

  return (
    <section id="cara-kerja" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dari Data Mentah ke Keputusan Cerdas, 3&nbsp;Langkah Saja
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tidak perlu keahlian teknis. Intara memproses data Anda dan langsung
            siap melayani.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={idx} className="group relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute right-0 top-14 hidden h-px w-6 translate-x-full bg-border md:block" />
              )}

              <div className="h-full rounded-2xl border border-border bg-background p-8 shadow-sm transition hover:shadow-md">
                {/* Icon */}
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>

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

/* ── Pricing ─────────────────────────────────── */

function PricingSection() {
  const plans = [
    {
      name: "Paket Pemula",
      price: "Gratis",
      priceSuffix: "",
      description:
        "Cocok untuk eksplorasi AI chatbot dan melihat insight bisnis pertama Anda.",
      highlighted: false,
      badge: null,
      features: [
        "1 Chatbot AI (CS Otomatis)",
        "Dashboard insight dasar",
        "50 pesan / bulan",
        "Upload 3 dokumen PDF/TXT",
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
        "Untuk usaha yang serius meningkatkan pelayanan & memahami keuangan bisnisnya.",
      highlighted: true,
      badge: "Paling Populer",
      features: [
        "5 Chatbot AI",
        "AI Analitik Keuangan penuh",
        "Pesan unlimited",
        "Upload 50 dokumen",
        "Custom branding (logo & warna)",
        "Embed widget di website",
        "Analitik percakapan & keuangan",
        "Prioritas support via WhatsApp",
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
            Mulai gratis, upgrade kapan saja sesuai pertumbuhan bisnis Anda.
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
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 p-3">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Siap Otomasi CS & Pahami Keuangan Bisnis Anda?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Bergabung dengan ratusan pelaku usaha Indonesia yang sudah
            menggunakan Intara untuk melayani pelanggan lebih cepat dan
            mengambil keputusan bisnis lebih cerdas.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-4 text-base font-semibold text-cta-foreground shadow-lg transition hover:brightness-105"
          >
            Coba Gratis Sekarang
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
              Intelligence Nusantara — Super-App AI untuk UMKM Indonesia. CS
              otomatis &amp; analisis bisnis cerdas dalam satu platform.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Produk</h4>
            <ul className="mt-3 space-y-2">
              {[
                "Chatbot CS",
                "AI Analitik",
                "Dashboard Keuangan",
                "Integrasi",
              ].map((l) => (
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
