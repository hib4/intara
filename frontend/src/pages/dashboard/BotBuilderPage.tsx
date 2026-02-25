import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  Globe,
  MessageCircle,
  Send,
  Bot,
  SmartphoneNfc,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Studio Pembuat Chatbot
 *  Bot Builder Page (Split-Screen)
 *  All UI copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Zod Schema ──────────────────────────────── */
const botBuilderSchema = z.object({
  name: z
    .string()
    .min(3, "Nama asisten minimal 3 karakter")
    .max(60, "Nama asisten maksimal 60 karakter"),
  persona: z
    .string()
    .min(10, "Deskripsi peran minimal 10 karakter")
    .max(500, "Deskripsi peran maksimal 500 karakter"),
  channelWeb: z.boolean(),
  channelWhatsApp: z.boolean(),
  channelTelegram: z.boolean(),
});

type BotBuilderValues = z.infer<typeof botBuilderSchema>;

/* ── File Size Helpers ───────────────────────── */
function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

/* ── Dropzone Area Component ─────────────────── */
function KnowledgeDropzone({
  files,
  onDrop,
  onRemove,
}: {
  files: File[];
  onDrop: (accepted: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_FILE_SIZE,
      multiple: true,
    });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all",
          isDragActive && !isDragReject
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : "border-primary/30 bg-primary/[0.02] hover:border-primary/50 hover:bg-primary/5",
          isDragReject && "border-destructive/50 bg-destructive/5",
        )}
      >
        <input {...getInputProps()} />

        <div
          className={cn(
            "mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
            isDragActive && !isDragReject
              ? "bg-primary/15 text-primary"
              : "bg-primary/10 text-primary/70 group-hover:bg-primary/15 group-hover:text-primary",
            isDragReject && "bg-destructive/10 text-destructive",
          )}
        >
          <UploadCloud className="h-7 w-7" />
        </div>

        {isDragReject ? (
          <p className="text-sm font-medium text-destructive">
            Format file tidak didukung
          </p>
        ) : isDragActive ? (
          <p className="text-sm font-medium text-primary">
            Lepaskan file di sini...
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Tarik & Lepas file di sini, atau{" "}
              <span className="text-primary underline underline-offset-2">
                klik untuk memilih
              </span>
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Mendukung PDF, TXT, DOCX (Maks 10MB)
            </p>
          </>
        )}
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <FileText className="h-4 w-4 text-red-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Channel Toggle Row ──────────────────────── */
function ChannelToggle({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-white px-4 py-3.5 transition-colors hover:border-primary/20">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            checked
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-muted-foreground",
          )}
        >
          {icon}
        </div>
        <div>
          <Label
            htmlFor={id}
            className="text-sm font-medium text-foreground cursor-pointer"
          >
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ── Live Preview (Right Column) ─────────────── */
function LivePreview({ botName }: { botName: string }) {
  const displayName = botName.trim() || "Asisten AI Anda";

  return (
    <div className="flex flex-col items-center">
      {/* Label */}
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pratinjau Langsung
      </p>

      {/* Phone Mock */}
      <div className="w-full max-w-[340px]">
        {/* Phone Frame */}
        <div className="overflow-hidden rounded-[2rem] border-4 border-slate-800 bg-slate-800 shadow-2xl shadow-slate-900/30">
          {/* Notch */}
          <div className="flex justify-center bg-slate-800 py-2">
            <div className="h-5 w-28 rounded-full bg-slate-900" />
          </div>

          {/* Screen */}
          <div className="flex h-[520px] flex-col bg-slate-50">
            {/* Chat Header */}
            <div className="flex shrink-0 items-center gap-3 bg-primary px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {displayName}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-white/70">
                    Online sekarang
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {/* Welcome message */}
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border/50 bg-white px-3.5 py-2.5 shadow-sm">
                  <p className="text-xs leading-relaxed text-foreground">
                    Halo! 👋 Saya <strong>{displayName}</strong>. Ada yang bisa
                    saya bantu terkait produk kami?
                  </p>
                </div>
              </div>

              {/* User mock message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 shadow-sm">
                  <p className="text-xs leading-relaxed text-white">
                    Halo, bisa lihat daftar menu?
                  </p>
                </div>
              </div>

              {/* Bot reply */}
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-bl-md border border-border/50 bg-white px-3.5 py-2.5 shadow-sm">
                  <p className="text-xs leading-relaxed text-foreground">
                    Tentu, Kak! 😊 Berikut menu kami yang tersedia hari ini.
                    Silakan pilih kategori:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["☕ Minuman", "🍰 Kue", "🍞 Roti"].map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-border/50 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="shrink-0 border-t border-border/60 bg-white px-3 py-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-full border border-border bg-slate-50 px-4 py-2">
                  <p className="text-xs text-muted-foreground">
                    Ketik pesan...
                  </p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Send className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex justify-center bg-slate-800 py-2">
            <div className="h-1 w-24 rounded-full bg-slate-600" />
          </div>
        </div>
      </div>

      {/* Powered by */}
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        Pratinjau tampilan chat di perangkat pelanggan
      </p>
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function BotBuilderPage() {
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<BotBuilderValues>({
    resolver: zodResolver(botBuilderSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      persona: "",
      channelWeb: true,
      channelWhatsApp: false,
      channelTelegram: false,
    },
  });

  const watchName = watch("name");

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: BotBuilderValues) => {
    // TODO: Connect to backend — deploy chatbot
    console.log("Bot config:", data, "Files:", files);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Header ────────────────────────── */}
        <header className="flex shrink-0 items-center gap-4 border-b border-border/60 bg-white px-8 py-4">
          <Link
            to="/dashboard/chatbot"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              Studio Pembuat Chatbot
            </h1>
            <p className="text-xs text-muted-foreground">
              Konfigurasikan identitas, pengetahuan, dan saluran publikasi
              asisten AI Anda.
            </p>
          </div>
        </header>

        {/* ── Split-Screen Body ─────────────── */}
        <div className="flex min-h-0 flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Left Column — Form (Scrollable) */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 py-6 lg:px-8">
              <form
                id="bot-builder-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto max-w-2xl space-y-6"
              >
                {/* Card 1: Identitas Asisten */}
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          Identitas Asisten
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Beri nama dan karakter untuk asisten AI Anda
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="bot-name" className="text-sm font-medium">
                        Nama Asisten <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="bot-name"
                        placeholder="cth. CS Toko Kue Bunda"
                        className={cn(
                          "rounded-xl",
                          errors.name &&
                            "border-destructive focus-visible:ring-destructive/30",
                        )}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Persona */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="bot-persona"
                        className="text-sm font-medium"
                      >
                        Peran & Karakter{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="bot-persona"
                        placeholder="cth. Jawab dengan ramah, gunakan sapaan 'Kak', fokus pada detail harga dan ketersediaan produk."
                        className={cn(
                          "min-h-[100px] resize-none rounded-xl",
                          errors.persona &&
                            "border-destructive focus-visible:ring-destructive/30",
                        )}
                        {...register("persona")}
                      />
                      {errors.persona ? (
                        <p className="text-xs text-destructive">
                          {errors.persona.message}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Jelaskan bagaimana asisten AI ini harus menjawab
                          pertanyaan pelanggan.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Knowledge Base */}
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          Otak Asisten / Sumber Pengetahuan
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Unggah file yang menjadi dasar pengetahuan chatbot
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <KnowledgeDropzone
                      files={files}
                      onDrop={onDrop}
                      onRemove={removeFile}
                    />
                  </CardContent>
                </Card>

                {/* Card 3: Channels */}
                <Card className="rounded-xl border-border/60 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <SmartphoneNfc className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          Saluran Publikasi
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Pilih platform tempat chatbot Anda akan tersedia
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Controller
                      control={control}
                      name="channelWeb"
                      render={({ field }) => (
                        <ChannelToggle
                          id="ch-web"
                          icon={<Globe className="h-4 w-4" />}
                          label="Web Chat"
                          description="Widget chat di website Anda"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="channelWhatsApp"
                      render={({ field }) => (
                        <ChannelToggle
                          id="ch-wa"
                          icon={<MessageCircle className="h-4 w-4" />}
                          label="WhatsApp"
                          description="Integrasi dengan WhatsApp Business API"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="channelTelegram"
                      render={({ field }) => (
                        <ChannelToggle
                          id="ch-tg"
                          icon={<Send className="h-4 w-4" />}
                          label="Telegram"
                          description="Terhubung dengan Telegram Bot API"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Submit CTA — pinned footer */}
            <div className="shrink-0 border-t border-border/60 bg-white/95 px-6 py-4 backdrop-blur lg:px-8">
              <div className="mx-auto flex max-w-2xl items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {files.length > 0
                    ? `${files.length} file siap diunggah`
                    : "Belum ada file pengetahuan"}
                </p>
                <Button
                  type="submit"
                  form="bot-builder-form"
                  disabled={!isValid || files.length === 0}
                  className="gap-2 rounded-xl bg-cta px-8 text-sm font-bold text-cta-foreground shadow-lg shadow-cta/20 transition hover:brightness-105 disabled:opacity-50 disabled:shadow-none"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  Simpan & Nyalakan AI
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column — Live Preview (Sticky on desktop) */}
          <div className="hidden border-l border-border/60 bg-white lg:flex lg:w-[420px] lg:shrink-0 lg:items-center lg:justify-center lg:overflow-y-auto lg:overscroll-y-contain lg:px-8">
            <div>
              <LivePreview botName={watchName} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
