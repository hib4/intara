import os
import json
import shutil
import sqlite3
import time
from datetime import datetime
from google import genai
from dotenv import load_dotenv

# 1. SETUP & CONFIG
load_dotenv()
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

DB_FILE = "memori.db"
MAX_HISTORY_TURNS = 6   # Jumlah pesan terakhir yang disertakan ke prompt
MAX_RETRIES = 3


# Validasi schema untuk update data (untuk mencegah AI menambahkan field sembarangan yang bisa merusak file JSON)
VALID_KEYS = {
    "operational.json": {
        "periode", "biaya_sewa_tempat", "gaji_karyawan",
        "listrik_dan_air", "pemasaran_ads", "lain_lain"
    },
    # Tambahkan schema untuk file lain di sini kalau perlu
    # "inventory.json": {"produk", "stok", ...},
}

# 2. DATABASE MEMORI SEDERHANA — Untuk menyimpan catatan strategi tambahan dari user
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

# 3. EFFICIENT DATA LOADING dengan Caching
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
    """Panggil ini kalau data JSON di-update secara manual."""
    _cache.clear()

# 4. FILTER DATA RELEVAN BERDASARKAN KEYWORD (untuk mempercepat prompt dan fokus ke data yang penting)
KEYWORDS = {
    "sales":     ["penjualan", "revenue", "omzet", "laku", "terjual", "sales", "pendapatan"],
    "inventory": ["stok", "produk", "barang", "inventory", "persediaan", "gudang"],
    "ops":       ["operasional", "biaya", "cost", "ops", "pengeluaran", "overhead"],
}

def filter_data_relevan(pertanyaan: str, sales, inventory, ops) -> dict:
    q = pertanyaan.lower()
    hasil = {}

    if any(k in q for k in KEYWORDS["sales"]):
        hasil["sales"] = sales[-30:] if isinstance(sales, list) else sales

    if any(k in q for k in KEYWORDS["inventory"]):
        hasil["inventory"] = inventory

    if any(k in q for k in KEYWORDS["ops"]):
        hasil["ops"] = ops

    # Fallback: kalau ga ada keyword cocok, sertakan semua (tapi tetap batasi sales)
    if not hasil:
        hasil = {
            "sales":     sales[-30:] if isinstance(sales, list) else sales,
            "inventory": inventory,
            "ops":       ops,
        }

    return hasil

# GENERATE DENGAN RETRY & BACKOFF — Untuk meningkatkan robustness terhadap error API
def generate_with_retry(prompt: str, retries: int = MAX_RETRIES) -> str:
    for attempt in range(retries):
        try:
            resp = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            return resp.text
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                print(f"⚠️  API error (attempt {attempt + 1}/{retries}), retry dalam {wait}s: {e}")
                time.sleep(wait)
            else:
                raise

#KLASIFIKASI INTENT — Tentukan apakah user ingin SIMPAN, TANYA, HAPUS MEMORI, atau UPDATE DATA
def klasifikasi_intent(pertanyaan: str) -> str:
    checker_prompt = f"""
Klasifikasikan intent kalimat berikut dengan cermat.

Contoh SAVE:
- "catat bahwa margin minimum kita 15%"
- "ingat promo bulan ini gratis ongkir"
- "simpan info: target penjualan Q3 adalah 500 juta"
- "tambahkan ke strategi: fokus upsell produk premium"

Contoh ASK:
- "berapa profit bulan lalu?"
- "produk mana yang paling laku?"
- "berapa untung kalau ada promo diskon 20%?"
- "analisis performa penjualan minggu ini"

Contoh DELETE:
- "hapus semua catatan"
- "reset memori"
- "bersihkan semua strategi yang tersimpan"

Contoh UPDATE_DATA:
- "tambah biaya listrik bulan ini 2 juta"
- "update stok Indomie jadi 150"
- "catat operasional baru: gaji karyawan 5 juta"
- "stok produk A sekarang 200 unit"
- "biaya sewa bulan ini naik jadi 3.5 juta"

Kalimat: "{pertanyaan}"

Jawab hanya dengan JSON valid (tanpa markdown):
{{"intent": "SAVE|ASK|DELETE|UPDATE_DATA", "confidence": 0.0-1.0, "reason": "alasan singkat"}}
"""
    resp = generate_with_retry(checker_prompt)
    try:
        clean = resp.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(clean)
        intent = data.get("intent", "ASK").upper()
        confidence = float(data.get("confidence", 1.0))
        # Kalau confidence rendah, default ke ASK (lebih aman)
        if confidence < 0.6:
            return "ASK"
        return intent
    except (json.JSONDecodeError, ValueError):
        return "ASK"  # Fallback aman

# 7. FORMAT RIWAYAT CHAT — Ambil beberapa pesan terakhir untuk konteks
def format_history(history: list) -> str:
    if not history:
        return "Belum ada riwayat percakapan."
    lines = []
    for msg in history[-MAX_HISTORY_TURNS:]:
        role = "User" if msg["role"] == "user" else "Bot"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)

# 8. GENERATE PROACTIVE INSIGHT — Saat sesi dimulai, berikan insight berdasarkan data terkini tanpa perlu ditanya
def generate_proactive_insight(sales, inventory, ops, catatan_strategi: str) -> str:
    data_snapshot = {
        "sales":     sales[-30:] if isinstance(sales, list) else sales,
        "inventory": inventory,
        "ops":       ops,
    }
    prompt = f"""
Anda adalah PayBot, asisten keuangan bisnis yang proaktif.

Saat ini user baru membuka sesi. Tanpa perlu ditanya, berikan laporan singkat kondisi bisnis terkini.

DATA BISNIS:
{json.dumps(data_snapshot, ensure_ascii=False, indent=2)}

CATATAN STRATEGI / PROMO (RAG):
{catatan_strategi}

INSTRUKSI — Buat laporan proaktif dengan format PERSIS ini:

📊 RINGKASAN BISNIS HARI INI
──────────────────────────────
💰 Revenue & Profit
   [Totalkan revenue, gross profit, dan net profit dari data. Tampilkan perbandingan periode jika memungkinkan.]

📦 Alert Stok
   [Sebutkan produk dengan stok < 20 unit atau yang perlu perhatian. Kalau semua aman, tulis "Semua stok aman."]

📈 Performa Penjualan
   [Produk/kategori terlaris, tren naik/turun jika data memungkinkan.]

⚠️  Perhatian Khusus
   [Anomali, risiko, atau hal yang perlu segera ditindaklanjuti.]

💡 Rekomendasi Aksi
   [1-2 aksi konkret berdasarkan data + catatan strategi yang tersimpan.]

Gunakan format angka: Rp 1.250.000. Singkat, padat, actionable.
"""
    return generate_with_retry(prompt)


def jalankan_analisis():
    init_db()
    history: list[dict] = []

    print("=" * 52)
    print("   💼  PayBot Finance Advisor  (RAG + History)   ")
    print("=" * 52)
    print("Perintah khusus:")
    print("  'exit'         → Keluar")
    print("  'hapus memori' → Reset semua catatan strategi")
    print("  'reload data'  → Refresh cache JSON dari disk")
    print("-" * 52)

    # ── PROACTIVE INSIGHT saat sesi dimulai ───────────
    print("\n⏳ Menganalisis kondisi bisnis terkini...\n")
    try:
        sales, inventory, ops = load_all_json()
        catatan_strategi = baca_memori()
        insight = generate_proactive_insight(sales, inventory, ops, catatan_strategi)
        print(insight)
        # Masukkan ke history supaya bisa direferensikan user di pertanyaan berikutnya
        history.append({"role": "assistant", "content": insight})
    except Exception as e:
        print(f"⚠️  Gagal generate insight awal: {e}")

    print("\n" + "-" * 52)

    # ── CHAT LOOP ─────────────────────────────────────
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
            # ── A. Klasifikasi Intent
            mode = klasifikasi_intent(pertanyaan)

            # ── B. HAPUS MEMORI 
            if mode == "DELETE":
                hasil = hapus_semua_memori()
                print(f"\n--- BOT: {hasil} ---")

            # ── C. SIMPAN KE MEMORI 
            elif mode == "SAVE":
                hasil = simpan_ke_memori(pertanyaan)
                print(f"\n--- BOT: {hasil} ---")
                history.append({"role": "user",      "content": pertanyaan})
                history.append({"role": "assistant", "content": hasil})


            # ── D. UPDATE DATA JSON
            elif mode == "UPDATE_DATA":
                sales, inventory, ops = load_all_json()

                # Tentukan file mana yang mau di-update berdasarkan konteks
                detect_prompt = f"""
Dari instruksi berikut, tentukan data mana yang ingin diupdate: sales, inventory, atau operational.
Instruksi: "{pertanyaan}"
Jawab satu kata saja: sales / inventory / operational
"""
                target = generate_with_retry(detect_prompt).strip().lower()

                # Pilih data yang relevan
                if "inventory" in target:
                    data_target = inventory
                    file_target = "inventory.json"
                    label = "Inventory"
                elif "sales" in target:
                    data_target = sales
                    file_target = "sales_data.json"
                    label = "Sales"
                else:
                    data_target = ops
                    file_target = "operational.json"
                    label = "Operasional"

                # Minta AI update datanya
                update_prompt = f"""
Data {label} saat ini:
{json.dumps(data_target, ensure_ascii=False, indent=2)}

Instruksi user: "{pertanyaan}"

Perbarui data sesuai instruksi user. 
Jawab HANYA dengan JSON valid hasil update-nya, tanpa penjelasan apapun, tanpa markdown.
"""
                hasil_raw = generate_with_retry(update_prompt)
                try:
                    clean = hasil_raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
                    data_baru = json.loads(clean)

                    # Validasi sebelum overwrite
                    if not data_baru:
                        raise ValueError("Data hasil parse kosong.")

                    # Validasi schema kalau file ada di VALID_KEYS
                    if file_target in VALID_KEYS:
                        field_asing = set(data_baru.keys()) - VALID_KEYS[file_target]
                        if field_asing:
                            raise ValueError(f"AI menambahkan field tidak dikenal: {field_asing}")

                    # Backup file lama sebelum overwrite
                    if os.path.exists(file_target):
                        shutil.copy(file_target, file_target + ".bak")

                    with open(file_target, "w") as f:
                        json.dump(data_baru, f, ensure_ascii=False, indent=2)

                    invalidate_cache()  # Wajib refresh cache setelah update!

                    hasil = f"✅ Data {label} berhasil diperbarui dan disimpan ke {file_target}. (Backup: {file_target}.bak)"
                    print(f"\n--- BOT: {hasil} ---")
                    history.append({"role": "user",      "content": pertanyaan})
                    history.append({"role": "assistant", "content": hasil})

                except (json.JSONDecodeError, ValueError) as e:
                    print(f"\n⚠️  Gagal memperbarui data — AI tidak bisa parse output dengan benar: {e}")
                    print("   Perubahan dibatalkan. Coba ulangi dengan instruksi yang lebih spesifik.")

            # ── E. ANALISIS / TANYA ────────────────────────────
            else:
                sales, inventory, ops = load_all_json()
                data_relevan = filter_data_relevan(pertanyaan, sales, inventory, ops)
                catatan_strategi = baca_memori()
                riwayat_chat = format_history(history)

                prompt_lengkap = f"""
Anda adalah asisten keuangan bisnis yang cerdas dan efisien bernama INTARA.

═══════════════════════════════════════
RIWAYAT PERCAKAPAN (konteks terbaru):
═══════════════════════════════════════
{riwayat_chat}

═══════════════════════════════════════
DATA BISNIS (hanya yang relevan):
═══════════════════════════════════════
{json.dumps(data_relevan, ensure_ascii=False, indent=2)}

═══════════════════════════════════════
CATATAN STRATEGI / PROMO (RAG):
═══════════════════════════════════════
{catatan_strategi}

═══════════════════════════════════════
INSTRUKSI:
═══════════════════════════════════════
- Jawab pertanyaan user secara singkat, padat, dan akurat.
- Gunakan riwayat percakapan untuk memahami konteks follow-up question.
- Jika ditanya profit/untung: rincikan Gross Profit, Biaya Ops, dan Net Profit.
- Gunakan catatan strategi jika relevan dengan pertanyaan.
- Format angka dengan pemisah ribuan (contoh: Rp 1.250.000).
- Kalau data tidak tersedia, katakan dengan jelas daripada mengarang.

Pertanyaan User: {pertanyaan}
"""
                jawaban = generate_with_retry(prompt_lengkap)
                print("\n--- 🤖 ANALISIS INTARA ---")
                print(jawaban)

                history.append({"role": "user",      "content": pertanyaan})
                history.append({"role": "assistant", "content": jawaban})

        except Exception as e:
            print(f"\n❌ Terjadi kesalahan: {e}")


if __name__ == "__main__":
    jalankan_analisis()
