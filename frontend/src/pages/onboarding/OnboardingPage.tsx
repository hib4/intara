import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Bot,
  Store,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Upload,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Rocket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ─────────────────────────────────────────────
 *  INTARA — Onboarding Wizard (3 Steps)
 *  Post-registration flow for UMKM users
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Types ───────────────────────────────────── */
type FocusOption = "cs" | "insight" | "both" | null;

interface OnboardingData {
  businessCategory: string;
  employeeCount: string;
  focus: FocusOption;
  file: File | null;
}

/* ── Step Indicator ──────────────────────────── */
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Bisnis" },
    { num: 2, label: "Fokus" },
    { num: 3, label: "Data" },
  ];

  const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Step dots with labels */}
      <div className="flex items-center justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <div key={step.num} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20"
                      : "bg-slate-100 text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.num}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <Progress
          value={progressValue}
          className="h-2 bg-slate-100"
        />
      </div>
    </div>
  );
}

/* ── Step 1: Kenali Bisnis Anda ──────────────── */
function StepBusiness({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Store className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Kenali Bisnis Anda
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Bantu kami memahami bisnis Anda agar pengalaman Intara bisa lebih
          personal dan relevan.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        {/* Kategori Bisnis */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Kategori Bisnis</Label>
          <Select
            value={data.businessCategory}
            onValueChange={(val) => onChange({ businessCategory: val })}
          >
            <SelectTrigger className="h-12 w-full rounded-xl text-sm">
              <SelectValue placeholder="Pilih kategori bisnis Anda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fnb">🍜 F&B (Makanan & Minuman)</SelectItem>
              <SelectItem value="retail">👗 Retail / Fashion</SelectItem>
              <SelectItem value="jasa">🔧 Jasa / Services</SelectItem>
              <SelectItem value="lainnya">📦 Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Jumlah Karyawan */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Jumlah Karyawan</Label>
          <Select
            value={data.employeeCount}
            onValueChange={(val) => onChange({ employeeCount: val })}
          >
            <SelectTrigger className="h-12 w-full rounded-xl text-sm">
              <SelectValue placeholder="Berapa banyak tim Anda?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">👤 1–5 orang</SelectItem>
              <SelectItem value="6-20">👥 6–20 orang</SelectItem>
              <SelectItem value="20+">🏢 Lebih dari 20 orang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Apa Fokus Utama Anda? ───────────── */
function StepFocus({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  const options: {
    id: FocusOption;
    icon: React.ReactNode;
    title: string;
    desc: string;
  }[] = [
    {
      id: "cs",
      icon: <MessageSquare className="h-7 w-7" />,
      title: "Otomatisasi Customer Service",
      desc: "Chatbot AI yang menjawab pelanggan 24/7 berdasarkan katalog & FAQ Anda.",
    },
    {
      id: "insight",
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Analisis & Insight Keuangan",
      desc: "Tanya AI soal penjualan, laba, dan tren bisnis — dalam bahasa sehari-hari.",
    },
    {
      id: "both",
      icon: <Sparkles className="h-7 w-7" />,
      title: "Keduanya — Saya Mau Semuanya!",
      desc: "Layani pelanggan lebih cepat dan pahami keuangan bisnis, sekaligus.",
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Apa Fokus Utama Anda?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pilih fitur utama yang paling Anda butuhkan. Tenang, Anda bisa
          mengaktifkan semua fitur kapan saja.
        </p>
      </div>

      {/* Selectable Cards */}
      <div className="space-y-4">
        {options.map((opt) => {
          const isSelected = data.focus === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ focus: opt.id })}
              className={`group flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-white hover:border-primary/40 hover:bg-slate-50"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                {opt.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold transition-colors ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {opt.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {opt.desc}
                </p>
              </div>

              {/* Checkmark */}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "border-2 border-slate-200"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 3: Beri "Napas" pada AI Anda ───────── */
function StepUpload({
  data,
  onChange,
}: {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onChange({ file: accepted[0] });
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const removeFile = () => onChange({ file: null });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Beri &ldquo;Napas&rdquo; pada AI Anda
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Unggah satu dokumen (Katalog Produk PDF atau Data Penjualan CSV) agar
          AI Intara bisa langsung bekerja untuk Anda.
        </p>
      </div>

      {/* Upload Area */}
      {!data.file ? (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all ${
            isDragActive
              ? "border-primary bg-primary/5 shadow-inner"
              : "border-slate-300 bg-slate-50/50 hover:border-primary/50 hover:bg-slate-50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Upload
              className={`h-6 w-6 transition-colors ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
            />
          </div>
          {isDragActive ? (
            <p className="text-sm font-medium text-primary">
              Lepaskan file di sini...
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Seret & lepas file di sini, atau{" "}
                <span className="text-primary underline underline-offset-2">
                  klik untuk memilih
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Format: PDF atau CSV · Maks 10 MB
              </p>
            </>
          )}
        </div>
      ) : (
        /* File preview */
        <div className="flex items-center gap-4 rounded-xl border border-border bg-slate-50/50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {data.file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(data.file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-slate-200 hover:text-foreground"
            aria-label="Hapus file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Skip hint */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Anda juga bisa melewati langkah ini dan mengunggahnya nanti dari
        Dashboard.
      </p>
    </div>
  );
}

/* ── Main Wizard Container ───────────────────── */
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    businessCategory: "",
    employeeCount: "",
    focus: null,
    file: null,
  });

  const updateData = (updates: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...updates }));

  /* Validation per step */
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.businessCategory !== "" && data.employeeCount !== "";
      case 2:
        return data.focus !== null;
      case 3:
        return true; // file is optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinish = () => {
    // TODO: Send onboarding data to backend
    console.log("Onboarding complete:", data);
    navigate("/dashboard");
  };

  const handleSkip = () => {
    // Skip file upload, go to dashboard
    console.log("Onboarding complete (skipped upload):", {
      ...data,
      file: null,
    });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border/60 bg-white/80 px-6 py-4 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Intara
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Langkah {step} dari 3
        </span>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm sm:p-10">
            {/* Step Indicator */}
            <StepIndicator currentStep={step} />

            {/* Step Content */}
            {step === 1 && (
              <StepBusiness data={data} onChange={updateData} />
            )}
            {step === 2 && (
              <StepFocus data={data} onChange={updateData} />
            )}
            {step === 3 && (
              <StepUpload data={data} onChange={updateData} />
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex items-center justify-between gap-3">
              {/* Back / Skip */}
              <div>
                {step > 1 && step < 3 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                )}
                {step === 3 && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Kembali
                    </Button>
                  </div>
                )}
              </div>

              {/* Next / Finish */}
              <div className="flex items-center gap-3">
                {step === 3 && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-sm font-medium text-muted-foreground transition hover:text-foreground hover:underline"
                  >
                    Lewati Langkah Ini
                  </button>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="h-11 gap-2 rounded-xl bg-cta px-7 text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105 disabled:opacity-40 disabled:shadow-none"
                >
                  {step < 3 ? (
                    <>
                      Lanjut
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Mulai Gunakan Intara
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Trust footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            🔒 Data bisnis Anda terenkripsi dan tidak akan dibagikan ke pihak
            ketiga.
          </p>
        </div>
      </main>
    </div>
  );
}
