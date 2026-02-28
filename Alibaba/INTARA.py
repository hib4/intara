import os
import json
import shutil
import sqlite3
from datetime import datetime
from dotenv import load_dotenv

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

#setup LLM dan parser
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2,
)
parser = StrOutputParser()

#history
store: dict[str, ChatMessageHistory] = {}
SESSION_ID = "intara-session"
MAX_HISTORY = 6  # Simpan N pesan terakhir

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def get_history_messages() -> list:
    """Ambil history dan batasi ke MAX_HISTORY pesan terakhir."""
    hist = get_session_history(SESSION_ID)
    return hist.messages[-MAX_HISTORY:]

def add_to_history(human: str, ai: str):
    hist = get_session_history(SESSION_ID)
    hist.add_user_message(human)
    hist.add_ai_message(ai)

def add_ai_to_history(ai: str):
    hist = get_session_history(SESSION_ID)
    hist.add_ai_message(ai)

# Validasi schema untuk update data —
VALID_KEYS = {
    "operational.json": {
        "periode", "biaya_sewa_tempat", "gaji_karyawan",
        "listrik_dan_air", "pemasaran_ads", "lain_lain"
    },
}

#(RAG) ini gw bikin sederhana pake SQLite, biar ga ribet setup vector DB 
# menurut gw dah cukkup sih buat hackaton biar menghindari error.
DB_FILE = "memori.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS memori (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            content   TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def simpan_ke_memori(teks: str) -> str:
    conn = sqlite3.connect(DB_FILE)
    conn.execute(
        "INSERT INTO memori (timestamp, content) VALUES (?, ?)",
        (datetime.now().isoformat(), teks)
    )
    conn.commit()
    conn.close()
    return "✅ Catatan berhasil disimpan ke dalam memori strategi bisnis."

def baca_memori() -> str:
    conn = sqlite3.connect(DB_FILE)
    rows = conn.execute(
        "SELECT timestamp, content FROM memori ORDER BY id DESC LIMIT 50"
    ).fetchall()
    conn.close()
    if not rows:
        return "Belum ada catatan strategi tambahan."
    return "\n".join(f"[{r[0][:19]}] {r[1]}" for r in reversed(rows))

def hapus_semua_memori() -> str:
    conn = sqlite3.connect(DB_FILE)
    conn.execute("DELETE FROM memori")
    conn.commit()
    conn.close()
    return "🗑️  Semua catatan memori telah dihapus."

# Simple in-memory cache untuk data JSON
_cache: dict = {}

def load_all_json():
    if _cache:
        return _cache["sales"], _cache["inventory"], _cache["ops"]
    try:
        with open("sales_data.json", "r") as f:
            sales = json.load(f)
        with open("inventory.json", "r") as f:
            inventory = json.load(f)
        with open("operational.json", "r") as f:
            ops = json.load(f)
        _cache.update({"sales": sales, "inventory": inventory, "ops": ops})
        return sales, inventory, ops
    except FileNotFoundError as e:
        print(f"⚠️  File tidak ditemukan: {e}")
        return [], [], {}
    except json.JSONDecodeError as e:
        print(f"⚠️  File JSON corrupt: {e}")
        return [], [], {}

def invalidate_cache():
    _cache.clear()


# Ambil semua nama produk dari sales_data.json
def get_nama_produk() -> list[str]:
    try:
        with open("sales_data.json", "r") as f:
            data = json.load(f)
        return [p["nama"].lower() for p in data if "nama" in p]
    except Exception:
        return []

KEYWORDS = {
    "sales":     ["penjualan", "revenue", "omzet", "laku", "terjual", "sales",
                  "pendapatan", "produk", "menu", "item", "untung", "profit",
                  "kategori", "makanan", "minuman", "tren", "harga"],
    "inventory": ["stok", "inventory", "persediaan", "gudang", "sisa"],
    "ops":       ["operasional", "biaya", "cost", "ops", "pengeluaran",
                  "overhead", "sewa", "gaji", "listrik", "iklan", "ads"],
}

def filter_data_relevan(pertanyaan: str, sales, inventory, ops) -> dict:
    q = pertanyaan.lower()
    hasil = {}

    # Cek keyword statis
    if any(k in q for k in KEYWORDS["sales"]):
        hasil["sales"] = sales[-30:] if isinstance(sales, list) else sales
    if any(k in q for k in KEYWORDS["inventory"]):
        hasil["inventory"] = inventory
    if any(k in q for k in KEYWORDS["ops"]):
        hasil["ops"] = ops

    # Cek nama produk secara dinamis — kalau user sebut nama produk, pasti include sales
    nama_produk = get_nama_produk()
    if any(nama in q for nama in nama_produk):
        hasil["sales"] = sales[-30:] if isinstance(sales, list) else sales

    # Fallback: kalau ga ada keyword cocok, sertakan semua
    if not hasil:
        hasil = {
            "sales":     sales[-30:] if isinstance(sales, list) else sales,
            "inventory": inventory,
            "ops":       ops,
        }
    return hasil



# Chain 1: Intent Classifier ────────────────
classifier_chain = (
    ChatPromptTemplate.from_messages([
        SystemMessage(content="""
Klasifikasikan intent kalimat berikut dengan cermat.

Contoh SAVE:
- "catat bahwa margin minimum kita 15%"
- "ingat promo bulan ini gratis ongkir"
- "simpan info: target penjualan Q3 adalah 500 juta"

Contoh ASK:
- "berapa profit bulan lalu?"
- "produk mana yang paling laku?"
- "analisis performa penjualan minggu ini"

Contoh DELETE:
- "hapus semua catatan"
- "reset memori"

Contoh UPDATE_DATA:
- "tambah biaya listrik bulan ini 2 juta"
- "update stok Indomie jadi 150"
- "biaya sewa naik jadi 3.5 juta"

Jawab hanya dengan JSON valid (tanpa markdown):
{"intent": "SAVE|ASK|DELETE|UPDATE_DATA", "confidence": 0.0-1.0, "reason": "alasan singkat"}
"""),
        HumanMessage(content="{pertanyaan}"),
    ])
    | llm
    | parser
)

#Chain 2: Analisis — pakai MessagesPlaceholder untuk history ──
_analisis_prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="""
Anda adalah asisten keuangan bisnis yang cerdas dan efisien bernama INTARA.

DATA BISNIS (hanya yang relevan):
{data_relevan}

CATATAN STRATEGI / PROMO (RAG):
{catatan_strategi}

INSTRUKSI:
- Jawab pertanyaan user secara singkat, padat, dan akurat.
- Jika ditanya profit/untung: rincikan Gross Profit, Biaya Ops, dan Net Profit.
- Gunakan catatan strategi jika relevan dengan pertanyaan.
- Format angka dengan pemisah ribuan (contoh: Rp 1.250.000).
- Kalau data tidak tersedia, katakan dengan jelas daripada mengarang.
"""),
    MessagesPlaceholder(variable_name="history"),
    HumanMessage(content="{pertanyaan}"),
])

# Bungkus dengan RunnableWithMessageHistory
analisis_chain = RunnableWithMessageHistory(
    _analisis_prompt | llm | parser,
    get_session_history,
    input_messages_key="pertanyaan",
    history_messages_key="history",
)

# Chain 3: Proactive Insight
insight_chain = (
    ChatPromptTemplate.from_messages([
        SystemMessage(content="""
Anda adalah INTARA, asisten keuangan bisnis yang proaktif.
Saat ini user baru membuka sesi. Berikan laporan singkat kondisi bisnis terkini.

DATA BISNIS:
{data_snapshot}

CATATAN STRATEGI / PROMO (RAG):
{catatan_strategi}

Buat laporan proaktif dengan format PERSIS ini:

📊 RINGKASAN BISNIS HARI INI
──────────────────────────────
💰 Revenue & Profit
   [Totalkan revenue, gross profit, dan net profit. Bandingkan periode jika memungkinkan.]

📦 Alert Stok
   [Produk dengan stok < 20 unit. Kalau aman semua, tulis "Semua stok aman."]

📈 Performa Penjualan
   [Produk/kategori terlaris, tren naik/turun.]

⚠️  Perhatian Khusus
   [Anomali, risiko, atau hal yang perlu segera ditindaklanjuti.]

💡 Rekomendasi Aksi
   [1-2 aksi konkret berdasarkan data + catatan strategi.]

Gunakan format angka: Rp 1.250.000. Singkat, padat, actionable.
"""),
        HumanMessage(content="Berikan laporan bisnis sekarang."),
    ])
    | llm
    | parser
)

#Chain 4: Deteksi target file update
detect_target_chain = (
    ChatPromptTemplate.from_messages([
        SystemMessage(content="Dari instruksi berikut, tentukan data mana yang ingin diupdate. Jawab satu kata saja: sales / inventory / operational"),
        HumanMessage(content="{pertanyaan}"),
    ])
    | llm
    | parser
)

#Chain 5: Generate JSON update
update_data_chain = (
    ChatPromptTemplate.from_messages([
        SystemMessage(content="""
Data {label} saat ini:
{data_target}

Perbarui data sesuai instruksi user.
Jawab HANYA dengan JSON valid hasil update-nya, tanpa penjelasan, tanpa markdown.
"""),
        HumanMessage(content="{pertanyaan}"),
    ])
    | llm
    | parser
)

# helper function untuk klasifikasi intent
def klasifikasi_intent(pertanyaan: str) -> str:
    resp = classifier_chain.invoke({"pertanyaan": pertanyaan})
    try:
        clean = resp.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(clean)
        intent = data.get("intent", "ASK").upper()
        confidence = float(data.get("confidence", 1.0))
        return "ASK" if confidence < 0.6 else intent
    except (json.JSONDecodeError, ValueError):
        return "ASK"

def handle_update_data(pertanyaan: str) -> str:
    sales, inventory, ops = load_all_json()

    target = detect_target_chain.invoke({"pertanyaan": pertanyaan}).strip().lower()

    if "inventory" in target:
        data_target, file_target, label = inventory, "inventory.json", "Inventory"
    elif "sales" in target:
        data_target, file_target, label = sales, "sales_data.json", "Sales"
    else:
        data_target, file_target, label = ops, "operational.json", "Operasional"

    hasil_raw = update_data_chain.invoke({
        "label":       label,
        "data_target": json.dumps(data_target, ensure_ascii=False, indent=2),
        "pertanyaan":  pertanyaan,
    })

    clean = hasil_raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data_baru = json.loads(clean)

    if not data_baru:
        raise ValueError("Data hasil parse kosong.")

    # Validasi schema
    if file_target in VALID_KEYS:
        field_asing = set(data_baru.keys()) - VALID_KEYS[file_target]
        if field_asing:
            raise ValueError(f"AI menambahkan field tidak dikenal: {field_asing}")

    # Backup lalu overwrite
    if os.path.exists(file_target):
        shutil.copy(file_target, file_target + ".bak")

    with open(file_target, "w") as f:
        json.dump(data_baru, f, ensure_ascii=False, indent=2)

    invalidate_cache()
    return f"✅ Data {label} diperbarui → {file_target} (backup: {file_target}.bak)"

#main function
def jalankan_analisis():
    init_db()

    print("Halo! saya INTARA, asisten keuangan bisnis Anda. Tanyakan apa saja tentang performa bisnis Anda, atau berikan instruksi untuk menyimpan catatan dan memperbarui data. Ketik 'exit' untuk keluar, atau 'reload data' untuk refresh data JSON.\n")

    # ── PROACTIVE INSIGHT ─────────────────────────────
    print("\n⏳ Menganalisis kondisi bisnis terkini...\n")
    try:
        sales, inventory, ops = load_all_json()
        data_snapshot = {
            "sales":     sales[-30:] if isinstance(sales, list) else sales,
            "inventory": inventory,
            "ops":       ops,
        }
        insight = insight_chain.invoke({
            "data_snapshot":    json.dumps(data_snapshot, ensure_ascii=False, indent=2),
            "catatan_strategi": baca_memori(),
        })
        print(insight)
        add_ai_to_history(insight)
    except Exception as e:
        print(f"⚠️  Gagal generate insight awal: {e}")

    print("\n" + "-" * 52)

    # loop chat
    while True:
        try:
            pertanyaan = input("\nUser: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nKeluar. Sampai jumpa!")
            break

        if not pertanyaan:
            continue
        if pertanyaan.lower() == "exit":
            print("Keluar. Sampai jumpa!")
            break
        if pertanyaan.lower() == "reload data":
            invalidate_cache()
            print("--- 🔄 Cache data JSON telah di-refresh. ---")
            continue

        try:
            mode = klasifikasi_intent(pertanyaan)

            # hapus memori
            if mode == "DELETE":
                hasil = hapus_semua_memori()
                print(f"\n--- BOT: {hasil} ---")

            # simpan ke memori
            elif mode == "SAVE":
                hasil = simpan_ke_memori(pertanyaan)
                print(f"\n--- BOT: {hasil} ---")
                add_to_history(pertanyaan, hasil)

            # update data JSON
            elif mode == "UPDATE_DATA":
                try:
                    hasil = handle_update_data(pertanyaan)
                    print(f"\n--- BOT: {hasil} ---")
                    add_to_history(pertanyaan, hasil)
                except (json.JSONDecodeError, ValueError) as e:
                    print(f"\n⚠️  Gagal memperbarui data: {e}")
                    print("   Perubahan dibatalkan. Coba ulangi dengan instruksi lebih spesifik.")

            # analisis & tanya jawab
            else:
                sales, inventory, ops = load_all_json()
                data_relevan = filter_data_relevan(pertanyaan, sales, inventory, ops)

                # RunnableWithMessageHistory auto-inject & auto-save history
                jawaban = analisis_chain.invoke(
                    {
                        "pertanyaan":       pertanyaan,
                        "data_relevan":     json.dumps(data_relevan, ensure_ascii=False, indent=2),
                        "catatan_strategi": baca_memori(),
                    },
                    config={"configurable": {"session_id": SESSION_ID}},
                )

                print("\n--- 🤖 ANALISIS INTARA ---")
                print(jawaban)

        except Exception as e:
            print(f"\n❌ Terjadi kesalahan: {e}")


if __name__ == "__main__":
    jalankan_analisis()