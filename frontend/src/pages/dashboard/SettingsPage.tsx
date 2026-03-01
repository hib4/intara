import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Building2,
  Shield,
  CreditCard,
  Rocket,
  Save,
  Eye,
  EyeOff,
  KeyRound,
  MessageSquare,
  FileText,
  Bot,
  AlertTriangle,
  Receipt,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Pengaturan & Tagihan
 *  Settings & Billing Page
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Zod Schemas ─────────────────────────────── */
const profileSchema = z.object({
  businessName: z
    .string()
    .min(2, "Nama bisnis minimal 2 karakter")
    .max(80, "Nama bisnis maksimal 80 karakter"),
  category: z.string().min(1, "Pilih kategori usaha"),
  email: z.email("Masukkan email yang valid"),
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Wajib diisi"),
    newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi baru tidak cocok",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

/* ── Mock Data ───────────────────────────────── */
const BUSINESS_CATEGORIES = [
  "Kerajinan & Seni",
  "Makanan & Minuman",
  "Retail / Toko",
  "Jasa Profesional",
  "Kesehatan & Kecantikan",
  "Pendidikan & Kursus",
  "Teknologi & Digital",
  "Lainnya",
];

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "paid" | "pending";
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-2026-003",
    date: "25 Feb 2026",
    description: "Langganan Intara Pemula — Gratis",
    amount: "Rp 0",
    status: "paid",
  },
  {
    id: "INV-2026-002",
    date: "25 Jan 2026",
    description: "Langganan Intara Pemula — Gratis",
    amount: "Rp 0",
    status: "paid",
  },
];

/* ── Usage Limits Data ───────────────────────── */
interface UsageLimit {
  label: string;
  icon: React.ReactNode;
  used: number;
  total: number;
  unit: string;
  color: "blue" | "orange" | "red";
}

const usageLimits: UsageLimit[] = [
  {
    label: "Kuota Percakapan AI",
    icon: <MessageSquare className="h-4 w-4" />,
    used: 850,
    total: 1000,
    unit: "pesan",
    color: "orange",
  },
  {
    label: "Batas Dokumen Pengetahuan",
    icon: <FileText className="h-4 w-4" />,
    used: 2,
    total: 5,
    unit: "file",
    color: "blue",
  },
  {
    label: "Jumlah Chatbot Aktif",
    icon: <Bot className="h-4 w-4" />,
    used: 2,
    total: 3,
    unit: "bot",
    color: "blue",
  },
];

/* ── Rupiah Formatter ────────────────────────── */
function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/* ── Profile Tab ─────────────────────────────── */
function ProfileTab() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "Batik Tradisional Pak Wiryo",
      category: "Kerajinan & Seni",
      email: "wiryo@batikpakwiryo.id",
    },
  });

  const onSubmit = (data: ProfileValues) => {
    // TODO: Connect to backend
    console.log("Profile saved:", data);
  };

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Building2 className="h-5 w-5 text-primary" />
          Profil Usaha
        </CardTitle>
        <CardDescription className="text-sm">
          Perbarui informasi bisnis Anda yang ditampilkan di chatbot dan
          dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="group relative">
              <Avatar className="h-20 w-20 border-2 border-border/60">
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  PW
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md transition hover:brightness-110"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Logo / Avatar Bisnis
              </p>
              <p className="text-xs text-muted-foreground">
                Klik ikon kamera untuk mengganti. JPG, PNG (Maks 2MB)
              </p>
            </div>
          </div>

          <Separator />

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business-name" className="text-sm font-medium">
              Nama Bisnis / Toko
            </Label>
            <Input
              id="business-name"
              placeholder="cth. Batik Pak Wiryo"
              className={cn(
                "rounded-xl",
                errors.businessName &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
              {...register("businessName")}
            />
            {errors.businessName && (
              <p className="text-xs text-destructive">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kategori Usaha</Label>
            <Select
              defaultValue="Kerajinan & Seni"
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-sm font-medium">
              Email Kontak
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="email@bisnis.com"
              className={cn(
                "rounded-xl",
                errors.email &&
                  "border-destructive focus-visible:ring-destructive/30",
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="gap-2 rounded-xl bg-cta px-6 text-sm font-bold text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Security Tab ────────────────────────────── */
function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: PasswordValues) => {
    // TODO: Connect to backend
    console.log("Password updated:", data);
  };

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Shield className="h-5 w-5 text-primary" />
          Keamanan Akun
        </CardTitle>
        <CardDescription className="text-sm">
          Perbarui kata sandi untuk menjaga keamanan akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-pw" className="text-sm font-medium">
              Kata Sandi Saat Ini
            </Label>
            <div className="relative">
              <Input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                placeholder="Masukkan kata sandi saat ini"
                className={cn(
                  "rounded-xl pr-10",
                  errors.currentPassword &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-pw" className="text-sm font-medium">
              Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="new-pw"
                type={showNew ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                className={cn(
                  "rounded-xl pr-10",
                  errors.newPassword &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-pw" className="text-sm font-medium">
              Konfirmasi Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm-pw"
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi kata sandi baru"
                className={cn(
                  "rounded-xl pr-10",
                  errors.confirmPassword &&
                    "border-destructive focus-visible:ring-destructive/30",
                )}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              className="gap-2 rounded-xl text-sm font-semibold"
            >
              <KeyRound className="h-4 w-4" />
              Perbarui Kata Sandi
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Usage Progress Row ──────────────────────── */
function UsageProgressRow({ limit }: { limit: UsageLimit }) {
  const pct = Math.round((limit.used / limit.total) * 100);
  const isNearLimit = pct >= 80;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span
            className={cn(
              "text-primary",
              isNearLimit && limit.color !== "blue" && "text-orange-500",
            )}
          >
            {limit.icon}
          </span>
          {limit.label}
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            isNearLimit ? "text-orange-600" : "text-foreground",
          )}
        >
          {formatNumber(limit.used)} / {formatNumber(limit.total)}{" "}
          <span className="font-normal text-muted-foreground">
            {limit.unit}
          </span>
        </span>
      </div>
      <div className="relative">
        <Progress
          value={pct}
          className={cn(
            "h-2.5 rounded-full",
            isNearLimit ? "[&>div]:bg-orange-500" : "[&>div]:bg-primary",
          )}
        />
      </div>
      {isNearLimit && (
        <div className="flex items-center gap-1.5 text-xs text-orange-600">
          <AlertTriangle className="h-3 w-3" />
          Kuota hampir habis — pertimbangkan upgrade untuk penggunaan tanpa
          batas.
        </div>
      )}
    </div>
  );
}

/* ── Billing Tab ─────────────────────────────── */
function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-primary/5 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Paket Saat Ini
            </p>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-foreground">Pemula</h3>
              <Badge
                variant="secondary"
                className="rounded-full border-slate-200 bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600"
              >
                Gratis
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Cocok untuk mencoba fitur dasar Intara. Upgrade untuk akses penuh.
            </p>
          </div>
          <Button
            className="gap-2 rounded-xl bg-cta px-6 text-sm font-bold text-cta-foreground shadow-lg shadow-cta/20 transition hover:brightness-105"
            size="lg"
          >
            <Rocket className="h-4 w-4" />
            Upgrade ke Paket Bisnis
          </Button>
        </div>
      </Card>

      {/* Usage Limits */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <CreditCard className="h-5 w-5 text-primary" />
            Batas Penggunaan
          </CardTitle>
          <CardDescription className="text-sm">
            Pantau penggunaan fitur Anda pada periode tagihan saat ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {usageLimits.map((limit) => (
            <UsageProgressRow key={limit.label} limit={limit} />
          ))}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Receipt className="h-5 w-5 text-primary" />
            Riwayat Pembayaran
          </CardTitle>
          <CardDescription className="text-sm">
            Daftar invoice dan pembayaran yang sudah dilakukan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {mockInvoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="h-11 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tanggal
                  </TableHead>
                  <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Deskripsi
                  </TableHead>
                  <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nominal
                  </TableHead>
                  <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="border-border/40 transition-colors hover:bg-slate-50/60"
                  >
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {inv.date}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {inv.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {inv.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-medium text-foreground">
                      {inv.amount}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          inv.status === "paid"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            inv.status === "paid"
                              ? "bg-emerald-500"
                              : "animate-pulse bg-amber-500",
                          )}
                        />
                        {inv.status === "paid" ? "Lunas" : "Menunggu"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Belum ada riwayat pembayaran.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ────────────────────────── */}
      <header className="shrink-0 border-b border-border/60 bg-white px-8 py-5">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Pengaturan & Tagihan
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola profil bisnis, keamanan akun, dan paket langganan Anda.
        </p>
      </header>

      {/* ── Content ───────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-slate-50 px-8 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mx-auto max-w-3xl"
        >
          {/* Tab Triggers */}
          <TabsList className="mb-6 h-11 rounded-xl bg-slate-100 p-1">
            <TabsTrigger
              value="profile"
              className="gap-2 rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4" />
              Profil Usaha
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2 rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="gap-2 rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              Paket & Tagihan
            </TabsTrigger>
          </TabsList>

          {/* Tab: Profil Usaha */}
          <TabsContent value="profile" className="mt-0">
            <ProfileTab />
          </TabsContent>

          {/* Tab: Keamanan */}
          <TabsContent value="security" className="mt-0">
            <SecurityTab />
          </TabsContent>

          {/* Tab: Paket & Tagihan */}
          <TabsContent value="billing" className="mt-0">
            <BillingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
