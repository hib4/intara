import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CloudUpload,
  FileText,
  FileSpreadsheet,
  MoreVertical,
  Eye,
  RefreshCw,
  Trash2,
  FolderOpen,
  Database,
  Upload,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Pusat Data & Pengetahuan
 *  Knowledge & Data Management Page
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Types ───────────────────────────────────── */
type FileStatus = "active" | "syncing";

interface DataFile {
  id: string;
  name: string;
  type: "pdf" | "txt" | "docx" | "csv" | "xlsx";
  size: string;
  uploadedAt: string;
  usedBy: string;
  usedByVariant: "bot" | "analytics";
  status: FileStatus;
}

/* ── Mock Data ───────────────────────────────── */
const documentFiles: DataFile[] = [
  {
    id: "doc-1",
    name: "Katalog_Batik_Tulis_2026.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "25 Feb 2026",
    usedBy: "Asisten Batik Pak Wiryo",
    usedByVariant: "bot",
    status: "active",
  },
  {
    id: "doc-2",
    name: "Panduan_Perawatan_Batik.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadedAt: "20 Feb 2026",
    usedBy: "Asisten Batik Pak Wiryo",
    usedByVariant: "bot",
    status: "active",
  },
  {
    id: "doc-3",
    name: "FAQ_Motif_dan_Teknik_Batik.txt",
    type: "txt",
    size: "340 KB",
    uploadedAt: "18 Feb 2026",
    usedBy: "CS Galeri Batik Online",
    usedByVariant: "bot",
    status: "syncing",
  },
  {
    id: "doc-4",
    name: "Daftar_Harga_Batik_Premium.pdf",
    type: "pdf",
    size: "3.1 MB",
    uploadedAt: "15 Feb 2026",
    usedBy: "Asisten Batik Pak Wiryo",
    usedByVariant: "bot",
    status: "active",
  },
];

const transactionFiles: DataFile[] = [
  {
    id: "trx-1",
    name: "Penjualan_Batik_Februari_2026.csv",
    type: "csv",
    size: "856 KB",
    uploadedAt: "24 Feb 2026",
    usedBy: "Dashboard Analitik",
    usedByVariant: "analytics",
    status: "active",
  },
  {
    id: "trx-2",
    name: "Pengeluaran_Bahan_Baku_Q1_2026.xlsx",
    type: "xlsx",
    size: "1.2 MB",
    uploadedAt: "22 Feb 2026",
    usedBy: "Dashboard Analitik",
    usedByVariant: "analytics",
    status: "active",
  },
  {
    id: "trx-3",
    name: "Stok_Kain_Mori_Jan2026.csv",
    type: "csv",
    size: "420 KB",
    uploadedAt: "12 Feb 2026",
    usedBy: "Dashboard Analitik",
    usedByVariant: "analytics",
    status: "syncing",
  },
];

/* ── File Icon Helper ────────────────────────── */
function FileIcon({ type }: { type: DataFile["type"] }) {
  const isSpreadsheet = type === "csv" || type === "xlsx";
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText;
  const color = isSpreadsheet ? "text-emerald-600" : "text-red-500";
  const bg = isSpreadsheet ? "bg-emerald-50" : "bg-red-50";

  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        bg,
      )}
    >
      <Icon className={cn("h-4 w-4", color)} />
    </div>
  );
}

/* ── Status Badge ────────────────────────────── */
function StatusBadge({ status }: { status: FileStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-emerald-500" : "animate-pulse bg-amber-500",
        )}
      />
      {status === "active" ? "Aktif" : "Sinkronisasi..."}
    </Badge>
  );
}

/* ── Used-By Badge ───────────────────────────── */
function UsedByBadge({
  label,
  variant,
}: {
  label: string;
  variant: DataFile["usedByVariant"];
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        variant === "bot"
          ? "border-primary/20 bg-primary/5 text-primary"
          : "border-violet-200 bg-violet-50 text-violet-700",
      )}
    >
      {label}
    </Badge>
  );
}

/* ── Actions Dropdown ────────────────────────── */
function ActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Menu aksi</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2 text-sm">
          <Eye className="h-4 w-4" />
          Lihat Detail
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-sm">
          <RefreshCw className="h-4 w-4" />
          Perbarui File
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Data Table ──────────────────────────────── */
function DataTable({ files }: { files: DataFile[] }) {
  return (
    <Card className="overflow-hidden rounded-xl border-border/60 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-border/60 bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="h-11 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nama File
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ukuran
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tanggal Diunggah
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Digunakan Oleh
            </TableHead>
            <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-11 w-[60px] px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              className="border-border/40 transition-colors hover:bg-slate-50/60"
            >
              {/* File Name */}
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <FileIcon type={file.type} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="text-[11px] uppercase text-muted-foreground">
                      {file.type}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Size */}
              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                {file.size}
              </TableCell>

              {/* Upload Date */}
              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                {file.uploadedAt}
              </TableCell>

              {/* Used By */}
              <TableCell className="px-4 py-4">
                <UsedByBadge label={file.usedBy} variant={file.usedByVariant} />
              </TableCell>

              {/* Status */}
              <TableCell className="px-4 py-4">
                <StatusBadge status={file.status} />
              </TableCell>

              {/* Actions */}
              <TableCell className="px-4 py-4">
                <ActionsDropdown />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/* ── Empty State ─────────────────────────────── */
function EmptyState({
  icon: Icon,
  title,
  description,
  onUpload,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onUpload: () => void;
}) {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardContent className="flex flex-col items-center py-20 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
        <Button
          variant="outline"
          className="mt-6 gap-2 rounded-xl text-sm font-semibold"
          onClick={onUpload}
        >
          <Upload className="h-4 w-4" />
          Unggah File Sekarang
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Tab Summary Bar ─────────────────────────── */
function TabSummary({
  totalFiles,
  totalSyncing,
}: {
  totalFiles: number;
  totalSyncing: number;
}) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{totalFiles}</span> file
        ditemukan
      </p>
      {totalSyncing > 0 && (
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          {totalSyncing} sedang sinkronisasi
        </Badge>
      )}
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState("documents");

  // In production, these would come from an API
  const [documents] = useState<DataFile[]>(documentFiles);
  const [transactions] = useState<DataFile[]>(transactionFiles);

  const navigate = useNavigate();

  const handleUpload = () => {
    navigate("/dashboard/data/upload");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Header ────────────────────────── */}
        <header className="flex shrink-0 items-start justify-between border-b border-border/60 bg-white px-8 py-5">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              Pusat Data & Pengetahuan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola dokumen katalog untuk Asisten CS dan data transaksi untuk
              Asisten Analitik Anda.
            </p>
          </div>
          <Button
            className="gap-2 rounded-xl bg-cta px-5 text-sm font-bold text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105"
            onClick={handleUpload}
          >
            <CloudUpload className="h-4 w-4" />
            Unggah Data Baru
          </Button>
        </header>

        {/* ── Content ───────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-8 py-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mx-auto max-w-6xl"
          >
            {/* Tab Triggers */}
            <TabsList className="mb-6 h-11 rounded-xl bg-slate-100 p-1">
              <TabsTrigger
                value="documents"
                className="gap-2 rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <FileText className="h-4 w-4" />
                Dokumen Chatbot (PDF/TXT)
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="gap-2 rounded-lg px-5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Data Transaksi (CSV/Excel)
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Documents */}
            <TabsContent value="documents" className="mt-0">
              {documents.length > 0 ? (
                <>
                  <TabSummary
                    totalFiles={documents.length}
                    totalSyncing={
                      documents.filter((f) => f.status === "syncing").length
                    }
                  />
                  <DataTable files={documents} />
                </>
              ) : (
                <EmptyState
                  icon={FolderOpen}
                  title="Belum ada dokumen yang diunggah"
                  description="Unggah file PDF, TXT, atau DOCX sebagai sumber pengetahuan untuk chatbot Asisten CS Anda."
                  onUpload={handleUpload}
                />
              )}
            </TabsContent>

            {/* Tab 2: Transactions */}
            <TabsContent value="transactions" className="mt-0">
              {transactions.length > 0 ? (
                <>
                  <TabSummary
                    totalFiles={transactions.length}
                    totalSyncing={
                      transactions.filter((f) => f.status === "syncing").length
                    }
                  />
                  <DataTable files={transactions} />
                </>
              ) : (
                <EmptyState
                  icon={Database}
                  title="Belum ada data transaksi yang diunggah"
                  description="Unggah file CSV atau Excel berisi data penjualan, pengeluaran, atau stok untuk Asisten Analitik Anda."
                  onUpload={handleUpload}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
