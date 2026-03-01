import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { AxiosError } from "axios";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

/* ── Business Categories ─────────────────────── */
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

/* ── Zod Schema ──────────────────────────────── */
const registerSchema = z.object({
  businessName: z.string().min(1, "Nama bisnis tidak boleh kosong"),
  businessCategory: z.string().min(1, "Pilih kategori bisnis"),
  email: z.email("Masukkan alamat email yang valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

/* ── Page Component ──────────────────────────── */
export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: "",
      businessCategory: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      setApiError(null);
      await registerUser({
        email: data.email,
        password: data.password,
        business_name: data.businessName,
        business_category: data.businessCategory,
      });
      setSuccess(true);
      // Auto-login and redirect to dashboard
      await login({ email: data.email, password: data.password });
    } catch (err) {
      if (err instanceof AxiosError) {
        const detail = err.response?.data?.detail;
        setApiError(
          typeof detail === "string"
            ? detail
            : "Pendaftaran gagal. Silakan coba lagi.",
        );
      } else {
        setApiError("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mulai Langkah Digital Anda
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Buat akun Intara untuk bisnis Anda sekarang. Gratis 14 hari.
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="outline"
          type="button"
          className="h-11 w-full rounded-xl text-sm font-medium"
          onClick={() => alert("Fitur ini akan segera tersedia")}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Daftar dengan Google
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium text-muted-foreground">
            atau daftar dengan email
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Success Banner */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Pendaftaran berhasil! Mengalihkan ke halaman login...
            </div>
          )}

          {/* API Error Banner */}
          {apiError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {apiError}
            </div>
          )}

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Nama Bisnis / Toko</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Contoh: Batik Tradisional Pak Wiryo"
              autoComplete="organization"
              className="h-11 rounded-xl"
              aria-invalid={!!errors.businessName}
              {...register("businessName")}
            />
            {errors.businessName && (
              <p className="text-xs text-destructive">
                {errors.businessName.message}
              </p>
            )}
          </div>

          {/* Business Category */}
          <div className="space-y-2">
            <Label htmlFor="businessCategory">Kategori Bisnis</Label>
            <select
              id="businessCategory"
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-invalid={!!errors.businessCategory}
              {...register("businessCategory")}
            >
              <option value="" disabled>
                Pilih kategori...
              </option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.businessCategory && (
              <p className="text-xs text-destructive">
                {errors.businessCategory.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@bisnis.com"
              autoComplete="email"
              className="h-11 rounded-xl"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
                className="h-11 rounded-xl pr-10"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                tabIndex={-1}
                aria-label={
                  showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-cta text-cta-foreground shadow-md shadow-cta/20 hover:brightness-105"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Daftar Sekarang
          </Button>
        </form>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Ketentuan Layanan
          </Link>{" "}
          dan{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Kebijakan Privasi
          </Link>{" "}
          kami.
        </p>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
