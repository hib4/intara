import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Package,
  DollarSign,
  BrainCircuit,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
 *  INTARA — Asisten Analitik Bisnis
 *  AI Financial Chat Interface
 *  All copy in Indonesian
 * ───────────────────────────────────────────── */

/* ── Types ───────────────────────────────────── */
interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  chart?: { data: ChartDataItem[]; title: string };
  insight?: string;
  timestamp: Date;
}

interface ChartDataItem {
  name: string;
  value: number;
}

/* ── Mock Chart Data ─────────────────────────── */
const topProductsChart: ChartDataItem[] = [
  { name: "Tulis Mega Mendung", value: 38 },
  { name: "Cap Parang Rusak", value: 31 },
  { name: "Tulis Sekar Jagad", value: 24 },
];

/* ── Suggested Prompts ───────────────────────── */
const suggestedPrompts = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: "Bagaimana tren penjualan batik minggu ini?",
    emoji: "📊",
  },
  {
    icon: <Package className="h-4 w-4" />,
    text: "Stok kain mori atau pewarna apa yang menipis?",
    emoji: "📦",
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    text: "Berapa total pengeluaran bahan baku bulan ini?",
    emoji: "💰",
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    text: "Berikan insight bisnis batik hari ini",
    emoji: "✨",
  },
];

/* ── Rupiah Formatter ────────────────────────── */
function formatRupiah(value: number): string {
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(0)}rb`;
  return `Rp${value}`;
}

/* ── Time Formatter ──────────────────────────── */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── In-chat Bar Chart ───────────────────────── */
function InlineBarchart({
  data,
  title,
  isRupiah,
}: {
  data: ChartDataItem[];
  title: string;
  isRupiah?: boolean;
}) {
  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-slate-50/70 p-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        {title}
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 5, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(214, 32%, 91%)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "hsl(215, 16%, 47%)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              isRupiah ? formatRupiah(Number(v)) : String(v)
            }
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "hsl(215, 28%, 17%)" }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            formatter={(value) => [
              isRupiah ? formatRupiah(Number(value)) : `${Number(value)} unit`,
              isRupiah ? "Jumlah" : "Terjual",
            ]}
            labelStyle={{ fontWeight: 600, fontSize: 12 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(214, 32%, 91%)",
              boxShadow: "0 4px 12px rgba(0,0,0,.08)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="value"
            fill="hsl(205, 95%, 32%)"
            radius={[0, 6, 6, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Chat Bubble Components ──────────────────── */
function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end gap-3">
      <div className="max-w-[75%]">
        <div className="rounded-2xl rounded-br-md bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground shadow-sm">
          {message.content}
        </div>
        <p className="mt-1.5 text-right text-[11px] text-muted-foreground">
          {formatTime(message.timestamp)}
        </p>
      </div>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

function AIBubble({ message }: { message: ChatMessage }) {
  const isExpenseChart = message.chart?.data.some((d) => d.value > 100000);

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-bl-md border border-border/50 bg-white px-5 py-3 shadow-sm">
          <p className="text-sm leading-relaxed text-foreground">
            {message.content}
          </p>

          {/* Embedded Chart */}
          {message.chart && (
            <InlineBarchart
              data={message.chart.data}
              title={message.chart.title}
              isRupiah={isExpenseChart}
            />
          )}

          {/* AI Insight / Recommendation */}
          {message.insight && (
            <div className="mt-3 rounded-xl bg-amber-50/80 px-4 py-3">
              <p className="text-xs leading-relaxed text-amber-900">
                {message.insight}
              </p>
            </div>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Intara AI · {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

/* ── Typing Indicator ────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="rounded-2xl rounded-bl-md border border-border/50 bg-white px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

/* ── Main Page Component ─────────────────────── */
export default function AnalyticsChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const isFirstPrompt = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  /* Send message */
  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiMsg: ChatMessage;

      if (isFirstPrompt.current) {
        isFirstPrompt.current = false;
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Tentu! Berikut adalah 3 motif batik paling laris di workshop Anda bulan ini, menyumbang 58% dari total pendapatan:",
          chart: {
            data: topProductsChart,
            title: "Motif Batik Terlaris — Februari 2026",
          },
          insight:
            "💡 Rekomendasi: Tingkatkan produksi Batik Tulis Mega Mendung karena permintaannya sedang tinggi. Pertimbangkan juga bundling dengan selendang batik untuk meningkatkan average order value.",
          timestamp: new Date(),
        };
      } else {
        aiMsg = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content:
            "Saya sedang menganalisis data bisnis batik Anda. Fitur ini akan terhubung dengan backend AI Intara untuk memberikan jawaban berdasarkan data real-time Anda. Saat ini, ini adalah preview interface-nya.",
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    isFirstPrompt.current = true;
  };

  const handlePromptClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-white px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              Asisten Analitik Bisnis
            </h1>
            <p className="text-xs text-muted-foreground">
              Tanya apa saja tentang penjualan, pengeluaran, atau performa
              workshop batik Anda.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="gap-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Chat
        </Button>
      </header>

      {/* ── Chat Area ─────────────────────── */}
      <ScrollArea ref={scrollRef} className="min-h-0 flex-1 bg-slate-50">
        <div
          className={cn(
            "mx-auto max-w-3xl px-6 py-6",
            messages.length === 0 &&
              "flex min-h-full flex-col items-center justify-center",
          )}
        >
          {/* Messages */}
          <div className="space-y-6">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <UserBubble key={msg.id} message={msg} />
              ) : (
                <AIBubble key={msg.id} message={msg} />
              ),
            )}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Suggested Prompts (show when empty or after last AI message) */}
          {!isTyping &&
            (messages.length === 0 ||
              messages[messages.length - 1]?.role === "ai") && (
              <div className={messages.length === 0 ? "mt-0" : "mt-6"}>
                {messages.length === 0 && (
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <BrainCircuit className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">
                      Halo! 👋 Saya Asisten Analitik Intara
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Saya bisa membantu Anda memahami data penjualan,
                      pengeluaran, dan performa bisnis batik Anda.
                    </p>
                  </div>
                )}
                <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
                  {messages.length === 0
                    ? "Mulai dengan salah satu pertanyaan:"
                    : "Coba tanyakan:"}
                </p>
                <div
                  className={cn(
                    "flex flex-wrap gap-2",
                    messages.length === 0 && "justify-center",
                  )}
                >
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-white px-4 py-2.5 text-xs font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                    >
                      <span>{prompt.emoji}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </ScrollArea>

      {/* ── Input Area ────────────────────── */}
      <div className="shrink-0 border-t border-border/60 bg-white px-6 pb-4 pt-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan tentang bisnis batik Anda di sini..."
              rows={1}
              className={cn(
                "w-full resize-none rounded-xl border border-border bg-slate-50/50 px-4 py-3 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
                "focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20",
                "transition-all",
              )}
              style={{ minHeight: 48, maxHeight: 120 }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-12 w-12 shrink-0 rounded-xl bg-cta text-cta-foreground shadow-md shadow-cta/20 transition hover:brightness-105 disabled:opacity-40 disabled:shadow-none"
            size="icon"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>

        {/* Disclaimer */}
        <p className="mx-auto mt-3 max-w-3xl text-center text-[11px] text-muted-foreground">
          AI dapat membuat kesalahan. Harap periksa kembali data sensitif.
        </p>
      </div>
    </div>
  );
}
