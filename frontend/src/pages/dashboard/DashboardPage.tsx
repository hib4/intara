import { Link } from "react-router-dom";
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
  Bell,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ShoppingBag,
  DollarSign,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Bot,
  Plus,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ─────────────────────────────────────────────
 *  INTARA — Ringkasan Bisnis (Dashboard Home)
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Mock Data ───────────────────────────────── */
const salesData = [
  { day: "Sen", penjualan: 2800000, cashflow: 2400000 },
  { day: "Sel", penjualan: 3200000, cashflow: 2900000 },
  { day: "Rab", penjualan: 2600000, cashflow: 2300000 },
  { day: "Kam", penjualan: 4100000, cashflow: 3600000 },
  { day: "Jum", penjualan: 3800000, cashflow: 3300000 },
  { day: "Sab", penjualan: 5200000, cashflow: 4500000 },
  { day: "Min", penjualan: 4700000, cashflow: 4100000 },
];

const productData = [
  { name: "Kue Lapis", jumlah: 142 },
  { name: "Brownies", jumlah: 118 },
  { name: "Nastar", jumlah: 96 },
  { name: "Bolu Kukus", jumlah: 87 },
  { name: "Donat", jumlah: 73 },
];

const recentChats = [
  {
    name: "Dina Safitri",
    message: "Apakah kue lapisnya ready stock?",
    time: "2 mnt lalu",
  },
  {
    name: "Budi Hartono",
    message: "Mau pesan brownies 3 box untuk besok",
    time: "15 mnt lalu",
  },
  {
    name: "Sari Melani",
    message: "Harga nastar per toples berapa ya?",
    time: "32 mnt lalu",
  },
];

const aiInsights = [
  {
    icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
    text: "Penjualan Kue Lapis naik 24% dibanding minggu lalu — pertimbangkan untuk menambah stok bahan baku.",
    tag: "Penjualan",
    tagColor: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: <ShoppingBag className="h-4 w-4 text-amber-600" />,
    text: "Stok kemasan box Brownies diperkirakan habis dalam 3 hari. Segera lakukan pemesanan ulang.",
    tag: "Stok",
    tagColor: "bg-amber-50 text-amber-700",
  },
  {
    icon: <Lightbulb className="h-4 w-4 text-primary" />,
    text: "Pelanggan paling sering bertanya tentang harga & ketersediaan. Tambahkan info ini ke knowledge base chatbot Anda.",
    tag: "Insight",
    tagColor: "bg-blue-50 text-primary",
  },
];

/* ── Rupiah Formatter ────────────────────────── */
function formatRupiah(value: number): string {
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

/* ── Custom Tooltip ──────────────────────────── */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {formatRupiah(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Stat Card Component ─────────────────────── */
function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <Card className="gap-0 border-border/60 py-0 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {value}
              </p>
              {subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={`text-xs font-semibold ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}
                >
                  {trendValue}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs minggu lalu
                </span>
              </div>
            )}
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Page Component ──────────────────────────── */
export default function DashboardPage() {
  const totalRevenue = salesData.reduce((sum, d) => sum + d.penjualan, 0);

  return (
    <DashboardLayout>
      {/* ── Top Header ──────────────────────── */}
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-white px-8 py-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Halo, Toko Kue Manis! 👋
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Berikut adalah ringkasan performa bisnis Anda hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cta" />
          </button>

          {/* Profile avatar */}
          <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/15">
            <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
              TK
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* ── Scrollable Content ──────────────── */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        {/* ── Top Row: Quick Stats ──────────── */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pendapatan"
            value={formatRupiah(totalRevenue)}
            subtitle="7 hari terakhir"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            trend="up"
            trendValue="+12.3%"
          />
          <StatCard
            title="Status Chatbot CS"
            value="Aktif"
            subtitle="847 chat ditangani minggu ini"
            icon={<Bot className="h-5 w-5 text-primary" />}
            trend="up"
            trendValue="+8.2%"
          />
          <StatCard
            title="Produk Terlaris"
            value="Kue Lapis"
            subtitle="142 terjual minggu ini"
            icon={<ShoppingBag className="h-5 w-5 text-primary" />}
            trend="up"
            trendValue="+24%"
          />
          <StatCard
            title="Pertanyaan Pelanggan"
            value="156"
            subtitle="Dijawab otomatis oleh AI"
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            trend="up"
            trendValue="+15%"
          />
        </div>

        {/* ── Middle Row: Chart + Product Bar ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Area Chart — Sales & Cashflow */}
          <Card className="gap-0 border-border/60 py-0 shadow-sm lg:col-span-2">
            <CardHeader className="px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-base">
                  Tren Penjualan & Cashflow
                </CardTitle>
                <CardDescription className="mt-1">
                  Data 7 hari terakhir
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-6 pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="gradPenjualan"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(205, 95%, 32%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(205, 95%, 32%)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradCashflow"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(25, 95%, 53%)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(25, 95%, 53%)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(214, 32%, 91%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatRupiah(Number(v))}
                    width={65}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      stroke: "hsl(205, 95%, 32%)",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="penjualan"
                    stroke="hsl(205, 95%, 32%)"
                    strokeWidth={2.5}
                    fill="url(#gradPenjualan)"
                    name="Penjualan"
                  />
                  <Area
                    type="monotone"
                    dataKey="cashflow"
                    stroke="hsl(25, 95%, 53%)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#gradCashflow)"
                    name="Cashflow"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Penjualan
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cta" />
                  Cashflow
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart — Top Products */}
          <Card className="gap-0 border-border/60 py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 pb-2">
              <div>
                <CardTitle className="text-base">Produk Terlaris</CardTitle>
                <CardDescription className="mt-1">
                  Berdasarkan unit terjual
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-6 pt-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={productData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(214, 32%, 91%)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value)} unit`, "Terjual"]}
                    labelStyle={{ fontWeight: 600 }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid hsl(214, 32%, 91%)",
                      boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                    }}
                  />
                  <Bar
                    dataKey="jumlah"
                    fill="hsl(205, 95%, 32%)"
                    radius={[0, 6, 6, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Row: AI Insights + Recent Chats ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* AI Insights */}
          <Card className="gap-0 border-border/60 py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Insight AI Hari Ini
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    Rekomendasi otomatis berdasarkan data bisnis Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {aiInsights.map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-4"
                  >
                    <div className="mt-0.5 shrink-0">{insight.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-foreground">
                        {insight.text}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`mt-2 border-0 text-[10px] font-semibold ${insight.tagColor}`}
                      >
                        {insight.tag}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/dashboard/analytics">
                <Button className="mt-6 h-11 w-full gap-2 rounded-xl bg-cta text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105">
                  <BrainCircuitIcon className="h-4 w-4" />
                  Tanya AI Asisten Lebih Lanjut
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card className="gap-0 border-border/60 py-0 shadow-sm">
            <CardHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Chat Pelanggan Terbaru
                    </CardTitle>
                    <CardDescription className="mt-0.5">
                      Ditangani oleh Chatbot AI Anda
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="border-0 bg-emerald-50 text-xs font-semibold text-emerald-700"
                >
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                {recentChats.map((chat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-4"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {chat.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {chat.name}
                        </p>
                        <span className="text-[11px] text-muted-foreground">
                          {chat.time}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {chat.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/dashboard/chatbot" className="flex-1">
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-2 rounded-xl text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Lihat Semua Chat
                  </Button>
                </Link>
                <Link to="/dashboard/chatbot">
                  <Button className="h-11 gap-2 rounded-xl bg-cta text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105">
                    <Plus className="h-4 w-4" />
                    Buat Bot Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom spacing */}
        <div className="h-6" />
      </main>
    </DashboardLayout>
  );
}

/* ── Inline icon component (keeps import clean) ── */
function BrainCircuitIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
}
