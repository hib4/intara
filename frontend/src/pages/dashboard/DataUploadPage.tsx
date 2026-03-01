import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Table,
  Trash2,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Unggah Pengetahuan & Data
 *  Data Upload Page (Focused Task View)
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Types ───────────────────────────────────── */
type DataType = "documents" | "transactions";
type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadedFile {
  file: File;
  status: UploadStatus;
  progress: number;
}

/* ── File Size Formatter ─────────────────────── */
function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

/* ── Accepted File Types ─────────────────────── */
const DOCUMENT_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

const TRANSACTION_TYPES = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-excel": [".xls"],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/* ── Data Type Selector Card ─────────────────── */
function DataTypeCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
  formats,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  formats: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-3 rounded-xl border-2 px-6 py-7 text-center transition-all",
        selected
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "border-border/60 bg-white hover:border-primary/30 hover:bg-slate-50",
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
          selected
            ? "bg-primary/15 text-primary"
            : "bg-slate-100 text-muted-foreground",
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-bold",
            selected ? "text-primary" : "text-foreground",
          )}
        >
          {title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-[11px] font-medium",
          selected
            ? "bg-primary/10 text-primary"
            : "bg-slate-100 text-muted-foreground",
        )}
      >
        {formats}
      </span>
    </button>
  );
}

/* ── Dropzone Area ───────────────────────────── */
function UploadDropzone({
  dataType,
  onDrop,
  disabled,
}: {
  dataType: DataType;
  onDrop: (files: File[]) => void;
  disabled: boolean;
}) {
  const accept = dataType === "documents" ? DOCUMENT_TYPES : TRANSACTION_TYPES;

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize: MAX_FILE_SIZE,
      multiple: true,
      disabled,
    });

  const formatLabel =
    dataType === "documents" ? "PDF, TXT, DOCX" : "CSV, Excel (.xlsx)";

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-10 text-center transition-all",
        disabled && "pointer-events-none opacity-50",
        isDragActive && !isDragReject
          ? "border-primary bg-primary/5 ring-4 ring-primary/10"
          : "border-slate-300 bg-slate-50/50 hover:border-primary/40 hover:bg-primary/[0.02]",
        isDragReject && "border-destructive/50 bg-destructive/5",
      )}
    >
      <input {...getInputProps()} />

      <div
        className={cn(
          "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
          isDragActive && !isDragReject
            ? "bg-primary/15 text-primary"
            : "bg-primary/10 text-primary/60 group-hover:bg-primary/15 group-hover:text-primary",
          isDragReject && "bg-destructive/10 text-destructive",
        )}
      >
        <UploadCloud className="h-8 w-8" />
      </div>

      {isDragReject ? (
        <p className="text-sm font-medium text-destructive">
          Format file tidak didukung
        </p>
      ) : isDragActive ? (
        <p className="text-sm font-semibold text-primary">
          Lepaskan file untuk mengunggah...
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-foreground">
            Tarik & Lepas file Anda di sini, atau{" "}
            <span className="text-primary underline underline-offset-2">
              Klik untuk memilih
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Mendukung {formatLabel} (Maks 10MB per file)
          </p>
        </>
      )}
    </div>
  );
}

/* ── File Row Component ──────────────────────── */
function FileRow({
  uploadedFile,
  onRemove,
}: {
  uploadedFile: UploadedFile;
  onRemove: () => void;
}) {
  const { file, status, progress } = uploadedFile;
  const isSpreadsheet =
    file.name.endsWith(".csv") ||
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls");
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText;
  const iconColor = isSpreadsheet ? "text-emerald-600" : "text-red-500";
  const iconBg = isSpreadsheet ? "bg-emerald-50" : "bg-red-50";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-white px-5 py-4 shadow-sm">
      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>

      {/* File Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {file.name}
          </p>
          {status === "success" && (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          )}
          {status === "error" && (
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
          {status === "uploading" && " — Mengunggah..."}
          {status === "success" && " — Selesai"}
          {status === "error" && " — Gagal mengunggah"}
        </p>

        {/* Progress Bar */}
        {status === "uploading" && (
          <Progress value={progress} className="mt-2 h-1.5" />
        )}
      </div>

      {/* Remove Button */}
      {(status === "idle" || status === "error") && (
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function DataUploadPage() {
  const [dataType, setDataType] = useState<DataType>("documents");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map((file) => ({
      file,
      status: "idle" as UploadStatus,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setIsUploading(true);

    // Simulate upload progress for each file
    files.forEach((_, index) => {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "uploading", progress: 0 } : f,
        ),
      );

      // Simulate incremental progress
      const interval = setInterval(
        () => {
          setFiles((prev) =>
            prev.map((f, i) => {
              if (i !== index || f.status !== "uploading") return f;
              const next = Math.min(f.progress + Math.random() * 30, 100);
              if (next >= 100) {
                clearInterval(interval);
                return { ...f, status: "success", progress: 100 };
              }
              return { ...f, progress: next };
            }),
          );
        },
        400 + index * 150,
      );

      // Mark success after delay
      setTimeout(
        () => {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f, i) =>
              i === index ? { ...f, status: "success", progress: 100 } : f,
            ),
          );
        },
        2200 + index * 600,
      );
    });

    // Reset uploading state after all files complete
    setTimeout(
      () => {
        setIsUploading(false);
      },
      2200 + files.length * 600 + 200,
    );
  };

  const handleDataTypeChange = (type: DataType) => {
    if (isUploading) return;
    setDataType(type);
    setFiles([]);
  };

  const allDone =
    files.length > 0 && files.every((f) => f.status === "success");
  const hasIdleFiles = files.some((f) => f.status === "idle");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ────────────────────────── */}
      <header className="flex shrink-0 items-center gap-4 border-b border-border/60 bg-white px-8 py-4">
        <Link
          to="/dashboard/data"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-slate-100 hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-base font-bold tracking-tight text-foreground">
            Unggah Pengetahuan & Data
          </h1>
          <p className="text-xs text-muted-foreground">
            Tambahkan dokumen untuk melatih Asisten CS atau data transaksi untuk
            Asisten Analitik Anda.
          </p>
        </div>
      </header>

      {/* ── Content ───────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-slate-50 px-6 py-8 lg:px-8">
        <Card className="mx-auto max-w-3xl rounded-2xl border-border/60 bg-white shadow-sm">
          <CardContent className="space-y-8 p-8">
            {/* Step 1: Data Type Selector */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-foreground">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  1
                </span>
                Pilih Jenis Data
              </Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <DataTypeCard
                  selected={dataType === "documents"}
                  onClick={() => handleDataTypeChange("documents")}
                  icon={FileText}
                  title="Dokumen Chatbot"
                  description="Cocok untuk FAQ, katalog produk, SOP pelayanan."
                  formats="PDF, TXT, DOCX"
                />
                <DataTypeCard
                  selected={dataType === "transactions"}
                  onClick={() => handleDataTypeChange("transactions")}
                  icon={Table}
                  title="Data Transaksi"
                  description="Cocok untuk laporan penjualan, pengeluaran, stok."
                  formats="CSV, Excel"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/40" />

            {/* Step 2: Dropzone */}
            <div className="space-y-3">
              <Label className="text-sm font-bold text-foreground">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  2
                </span>
                Unggah File
              </Label>
              <UploadDropzone
                dataType={dataType}
                onDrop={onDrop}
                disabled={isUploading}
              />
            </div>

            {/* Step 3: File Preview & Action */}
            {files.length > 0 && (
              <>
                <div className="border-t border-border/40" />

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-foreground">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </span>
                    File Terpilih
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      ({files.length} file)
                    </span>
                  </Label>

                  <div className="space-y-2">
                    {files.map((uf, i) => (
                      <FileRow
                        key={`${uf.file.name}-${i}`}
                        uploadedFile={uf}
                        onRemove={() => removeFile(i)}
                      />
                    ))}
                  </div>

                  {/* Success Message */}
                  {allDone && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Semua file berhasil diunggah!
                        </p>
                        <p className="text-xs text-emerald-700">
                          AI Intara sedang memproses data Anda. Proses ini
                          membutuhkan waktu beberapa menit.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground">
                      {allDone
                        ? "Anda bisa kembali ke halaman data."
                        : `${files.length} file siap diunggah`}
                    </p>

                    {allDone ? (
                      <Button
                        asChild
                        variant="outline"
                        className="gap-2 rounded-xl text-sm font-semibold"
                      >
                        <Link to="/dashboard/data">
                          <ArrowLeft className="h-4 w-4" />
                          Kembali ke Data
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUpload}
                        disabled={!hasIdleFiles || isUploading}
                        className="gap-2 rounded-xl bg-cta px-8 text-sm font-bold text-cta-foreground shadow-lg shadow-cta/20 transition hover:brightness-105 disabled:opacity-50 disabled:shadow-none"
                        size="lg"
                      >
                        <Sparkles className="h-4 w-4" />
                        Mulai Unggah & Proses AI
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
