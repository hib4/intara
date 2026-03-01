import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Plus,
  MoreVertical,
  Link2,
  FileText,
  Globe,
  MessageCircle,
  Send,
  Pencil,
  RefreshCw,
  Trash2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Manajemen Chatbot CS
 *  Chatbot Management Page
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Types ───────────────────────────────────── */
interface ChatbotChannel {
  name: string;
  icon: React.ReactNode;
}

interface ChatbotItem {
  id: string;
  name: string;
  status: "active" | "inactive";
  knowledgeFile: string;
  channels: ChatbotChannel[];
  totalChats: number;
  shareUrl: string;
  createdAt: string;
  lastActive: string;
}

/* ── Mock Data ───────────────────────────────── */
const mockBots: ChatbotItem[] = [
  {
    id: "bot-1",
    name: "Asisten Batik Pak Wiryo",
    status: "active",
    knowledgeFile: "katalog_batik_2026.pdf",
    channels: [
      { name: "Web", icon: <Globe className="h-3.5 w-3.5" /> },
      { name: "WhatsApp", icon: <MessageCircle className="h-3.5 w-3.5" /> },
      { name: "Telegram", icon: <Send className="h-3.5 w-3.5" /> },
    ],
    totalChats: 312,
    shareUrl: "https://intara.id/chat/batik-pak-wiryo",
    createdAt: "12 Jan 2026",
    lastActive: "2 jam lalu",
  },
  {
    id: "bot-2",
    name: "CS Galeri Batik Online",
    status: "active",
    knowledgeFile: "panduan_perawatan_batik.pdf",
    channels: [
      { name: "Web", icon: <Globe className="h-3.5 w-3.5" /> },
      { name: "WhatsApp", icon: <MessageCircle className="h-3.5 w-3.5" /> },
    ],
    totalChats: 148,
    shareUrl: "https://intara.id/chat/galeri-batik",
    createdAt: "28 Jan 2026",
    lastActive: "15 menit lalu",
  },
];

/* ── Number Formatter ────────────────────────── */
function formatNumber(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

/* ── Status Badge ────────────────────────────── */
function StatusBadge({ status }: { status: ChatbotItem["status"] }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-500",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "active" ? "bg-emerald-500" : "bg-slate-400",
        )}
      />
      {status === "active" ? "Aktif" : "Nonaktif"}
    </Badge>
  );
}

/* ── Share Link Dialog ───────────────────────── */
function ShareDialog({
  open,
  onOpenChange,
  bot,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bot: ChatbotItem | null;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (bot) {
      navigator.clipboard.writeText(bot.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!bot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            Bagikan Tautan Chatbot
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Salin tautan berikut dan bagikan ke pelanggan Anda agar mereka bisa
            langsung mengobrol dengan <strong>{bot.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-foreground select-all">
            {bot.shareUrl}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-xl"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl text-xs"
            onClick={() => window.open(bot.shareUrl, "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Buka di Tab Baru
          </Button>
          {copied && (
            <span className="text-xs font-medium text-emerald-600">
              Tautan disalin!
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Chatbot Card ────────────────────────────── */
function ChatbotCard({
  bot,
  onShare,
}: {
  bot: ChatbotItem;
  onShare: (bot: ChatbotItem) => void;
}) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-foreground">
              {bot.name}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Dibuat {bot.createdAt}
            </p>
          </div>
        </div>
        <StatusBadge status={bot.status} />
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-0">
        {/* Knowledge Source */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sumber Pengetahuan
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-slate-50/70 px-3 py-2">
            <FileText className="h-4 w-4 shrink-0 text-red-500" />
            <span className="truncate text-xs font-medium text-foreground">
              {bot.knowledgeFile}
            </span>
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tersedia di
          </p>
          <div className="flex flex-wrap gap-2">
            {bot.channels.map((ch) => (
              <div
                key={ch.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-slate-50/70 px-2.5 py-1.5 text-[11px] font-medium text-foreground"
              >
                <span className="text-primary">{ch.icon}</span>
                {ch.name}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50/70 px-3 py-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Percakapan
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatNumber(bot.totalChats)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Terakhir Aktif
            </p>
            <p className="text-xs font-medium text-foreground">
              {bot.lastActive}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 border-t border-border/40 bg-slate-50/30 px-6 py-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 rounded-xl text-xs font-semibold"
          onClick={() => onShare(bot)}
        >
          <Link2 className="h-3.5 w-3.5" />
          Bagikan Tautan
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu lainnya</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem className="gap-2 text-sm">
              <Pencil className="h-4 w-4" />
              Edit Instruksi
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Ganti File Pengetahuan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              Hapus Bot
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

/* ── Empty State ─────────────────────────────── */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Bot className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-cta/10">
          <Sparkles className="h-5 w-5 text-cta" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground">
        Anda belum memiliki Asisten AI
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Buat chatbot CS pertama Anda untuk melayani pelanggan 24/7 secara
        otomatis. Cukup unggah file pengetahuan dan chatbot siap digunakan!
      </p>

      <Button
        size="lg"
        className="mt-8 gap-2 rounded-xl bg-cta px-8 text-sm font-bold text-cta-foreground shadow-lg shadow-cta/20 transition hover:brightness-105"
        onClick={onCreate}
      >
        <Plus className="h-5 w-5" />
        Buat Chatbot Pertama Anda
      </Button>

      {/* Decorative hints */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {["Unggah PDF / CSV", "Atur Instruksi AI", "Bagikan ke Pelanggan"].map(
          (step, i) => (
            <div
              key={step}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function ChatbotManagementPage() {
  const [bots] = useState<ChatbotItem[]>(mockBots);
  const [shareBot, setShareBot] = useState<ChatbotItem | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const handleShare = (bot: ChatbotItem) => {
    setShareBot(bot);
    setShareOpen(true);
  };

  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/dashboard/chatbot/new");
  };

  const isEmpty = bots.length === 0;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ────────────────────────── */}
      <header className="flex shrink-0 items-start justify-between border-b border-border/60 bg-white px-8 py-5">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Manajemen Chatbot CS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola asisten virtual Anda, atur pengetahuan dasar, dan bagikan
            tautan ke pelanggan.
          </p>
        </div>
        <Button
          className="gap-2 rounded-xl bg-cta px-5 text-sm font-bold text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          Buat Chatbot Baru
        </Button>
      </header>

      {/* ── Content ───────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-6">
        {isEmpty ? (
          <EmptyState onCreate={handleCreate} />
        ) : (
          <>
            {/* Summary bar */}
            <div className="mb-6 flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Menampilkan{" "}
                <span className="font-semibold text-foreground">
                  {bots.length}
                </span>{" "}
                chatbot aktif
              </p>
            </div>

            {/* Bot Grid */}
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {bots.map((bot) => (
                <ChatbotCard key={bot.id} bot={bot} onShare={handleShare} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        bot={shareBot}
      />
    </div>
  );
}
