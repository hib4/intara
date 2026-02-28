import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Zap, Circle, CreditCard, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "ai" | "user";

interface Message {
  id: string;
  role: Role;
  text: string;
  time: string;
  hasPayment?: boolean;
  imageUrl?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTime(): string {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Mock conversation in 3 staged prompts ───────────────────────────────────

// Prompt 1: Welcome + user asks about best seller
const PROMPT_1: Message[] = [
  {
    id: uid(),
    role: "ai",
    text: "Halo! Selamat datang di Batik Tradisional Pak Wiryo. Saya asisten virtual Anda. Ada yang bisa saya bantu terkait koleksi batik atau pemesanan hari ini? 🎨",
    time: "10:04",
  },
];

// Prompt 2: User question + AI recommendation with image
const PROMPT_2: Message[] = [
  {
    id: uid(),
    role: "user",
    text: "Halo, apa batik yang paling bagus dan best seller di sini?",
    time: "10:05",
  },
  {
    id: uid(),
    role: "ai",
    text: "Halo Kak! Selamat datang di Batik Tradisional Pak Wiryo.\n\nBatik paling best seller kami saat ini adalah Batik Tulis Mega Mendung Premium. Harganya Rp\u00a0750.000, dibuat langsung oleh pengrajin lokal dengan pewarna alami yang sangat elegan.\n\nApakah Kakak tertarik untuk memesannya?",
    time: "10:05",
  },
  {
    id: uid(),
    role: "ai",
    text: "🖼️ Batik Tulis Mega Mendung Premium",
    time: "10:05",
    imageUrl:
      "https://cdn-ilealle.nitrocdn.com/nWbsFnOuVXoKORnPXFTCZsDHIKzPYfgd/assets/images/optimized/rev-aeb1163/btbatiktrusmi.com/wp-content/uploads/2025/11/5.png",
  },
];

// Prompt 3: User agrees to buy + AI checkout with PayLabs
const PROMPT_3: Message[] = [
  {
    id: uid(),
    role: "user",
    text: "Wah bagus ya, boleh deh. Saya mau beli 1 potong yang itu ya.",
    time: "10:06",
  },
  {
    id: uid(),
    role: "ai",
    text: "Baik Kak, pesanan untuk 1 potong Batik Tulis Mega Mendung Premium (Rp\u00a0750.000) sudah saya siapkan.\n\nUntuk menyelesaikan pembelian, silakan klik tombol pembayaran di bawah ini. Transaksi Kakak diproses secara aman menggunakan PayLabs (Mendukung QRIS, e-Wallet, & Virtual Account).",
    time: "10:06",
    hasPayment: true,
  },
];

// ─── Round-robin simulated AI responses ───────────────────────────────────────

const AI_REPLIES = [
  "Tentu, Kak! Kami juga punya Batik Cap Parang Klasik seharga Rp\u00a0350.000 yang juga sangat populer. Mau saya tambahkan ke pesanan?",
  "Untuk metode pembayaran, kami menerima transfer bank, QRIS, GoPay, OVO, dan COD ya, Kak. Mana yang Kakak pilih?",
  "Terima kasih! Pesanan Kakak sedang kami proses. Estimasi pengiriman sekitar 2–3 hari kerja ke seluruh Indonesia. 🚀",
  "Ada yang lain yang bisa saya bantu, Kak? Kami juga punya koleksi Batik Tulis Lasem Premium yang baru datang! 🎨",
  "Untuk info lengkap koleksi, Kakak bisa cek katalog kami di Instagram @batikpakwiryo ya. Kami update setiap minggu!",
];

let replyIndex = 0;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BubbleProps {
  message: Message;
}

function AiBubble({ message }: BubbleProps) {
  return (
    <div className="flex items-end gap-2">
      <Avatar className="h-7 w-7 shrink-0 self-end mb-1">
        <AvatarFallback
          className="text-[10px] font-bold text-white"
          style={{ backgroundColor: "#0258A3" }}
        >
          PW
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[80%] space-y-2">
        {message.imageUrl && (
          <div className="overflow-hidden rounded-2xl rounded-bl-sm shadow-sm">
            <img
              src={message.imageUrl}
              alt={message.text}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm whitespace-pre-line">
          {message.text}
        </div>

        {message.hasPayment && (
          <>
            <button
              type="button"
              onClick={() =>
                window.alert("Redirecting to PayLabs Checkout Page...")
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-[0.98]"
            >
              <CreditCard className="h-4 w-4" />
              Bayar Sekarang via PayLabs
            </button>
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="h-3 w-3" />
              Transaksi aman &amp; terenkripsi
            </div>
          </>
        )}

        <p className="ml-1 text-[11px] text-slate-400">{message.time}</p>
      </div>
    </div>
  );
}

function UserBubble({ message }: BubbleProps) {
  return (
    <div className="flex flex-col items-end">
      <div
        className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed text-white shadow-sm whitespace-pre-line"
        style={{ backgroundColor: "#0258A3" }}
      >
        {message.text}
      </div>
      <p className="mt-1 mr-1 text-[11px] text-slate-400">{message.time}</p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <Avatar className="h-7 w-7 shrink-0 self-end mb-1">
        <AvatarFallback
          className="text-[10px] font-bold text-white"
          style={{ backgroundColor: "#0258A3" }}
        >
          PW
        </AvatarFallback>
      </Avatar>
      <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 shadow-sm">
        <span className="flex gap-1 items-center h-4">
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PublicChatPage() {
  const [messages, setMessages] = useState<Message[]>(PROMPT_1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const STAGES = [PROMPT_1, PROMPT_2, PROMPT_3];

  // Auto-scroll on new messages or typing indicator change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (isTyping) return;

    // If there are staged prompts remaining, advance to the next stage
    if (stage < STAGES.length) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, ...STAGES[stage]]);
        setStage((s) => s + 1);
      }, 1500);
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      text: trimmed,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay (1.2 – 2.0 s)
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const aiMsg: Message = {
        id: uid(),
        role: "ai",
        text: AI_REPLIES[replyIndex % AI_REPLIES.length],
        time: getTime(),
      };
      replyIndex++;
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, delay);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    /*
     * Outer shell:
     *   Mobile  → full-screen 100dvh
     *   Desktop → centered card over muted slate background
     */
    <div className="flex min-h-[100dvh] items-center justify-center bg-white md:bg-slate-50 md:p-6">
      {/* ── Chat Container ── */}
      <div
        className={[
          "flex flex-col bg-white overflow-hidden",
          // Mobile: true full-screen, flush to edges
          "h-[100dvh] w-full",
          // Desktop: wide elevated chat card, centered
          "md:h-[85vh] md:max-w-2xl md:rounded-2xl md:shadow-2xl md:ring-1 md:ring-black/5",
        ].join(" ")}
      >
        {/* ── Sticky Header ── */}
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3 shadow-md"
          style={{ backgroundColor: "#0258A3" }}
        >
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white/30">
            <AvatarFallback className="bg-white/20 text-sm font-bold text-white">
              PW
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold leading-none text-white">
              Asisten Batik Tradisional Pak Wiryo
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-blue-100">
              <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
              Aktif membalas cepat
            </p>
          </div>

          {/* Subtle header badge — desktop only */}
          <a
            href="https://intara.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 text-[10px] text-blue-200 transition-colors hover:text-white md:flex"
          >
            <Zap className="h-3 w-3" />
            Intara
          </a>
        </header>

        {/* ── Scrollable Message Area ── */}
        <div
          className="flex-1 overflow-y-auto overscroll-y-contain bg-white px-4 py-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Date divider */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] text-slate-400">
              Hari ini
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3">
            {messages.map((msg) =>
              msg.role === "ai" ? (
                <AiBubble key={msg.id} message={msg} />
              ) : (
                <UserBubble key={msg.id} message={msg} />
              ),
            )}

            {isTyping && <TypingIndicator />}

            {/* Invisible scroll anchor */}
            <div ref={bottomRef} className="h-1" />
          </div>
        </div>

        {/* ── Input Area + Branding Footer ── */}
        <div className="shrink-0 border-t border-slate-100 bg-white">
          {/* Input row */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan Anda di sini..."
              className="flex-1 rounded-full border-slate-200 bg-slate-50 px-4 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              disabled={isTyping}
              autoComplete="off"
            />

            <Button
              onClick={handleSend}
              disabled={isTyping}
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full shadow-sm transition-transform active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: "#0258A3" }}
              aria-label="Kirim pesan"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* ⚡ Powered by Intara */}
          <div className="pb-3 text-center">
            <a
              href="https://intara.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-600"
            >
              <Zap className="h-3 w-3" />
              Powered by Intara
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
