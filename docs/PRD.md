# PRD — Segmenta

**E-Commerce Platform dengan Segmentasi Pelanggan Otomatis (RFM)**

| Atribut | Nilai |
|---|---|
| Nama kerja produk | **Segmenta** (dapat diganti) |
| Versi dokumen | 1.1 |
| Tanggal | 17 November 2026 |
| Status | Disetujui sebagai acuan MVP |
| Jenis proyek | Portfolio / showcase |
| Stack | Next.js (App Router) + TypeScript + PostgreSQL + Prisma |
| Pembayaran | Mock / simulasi |
| Bahasa UI | Indonesia |
| Bahasa dokumen kode (README) | Inggris |

---

## 1. Ringkasan Eksekutif

Segmenta adalah toko online fungsional (katalog, keranjang, checkout, riwayat pesanan) yang dilengkapi panel admin analitik. Nilai jual utamanya bukan transaksi, melainkan **lapisan intelijen pelanggan**: setiap periode, sistem menghitung ulang skor **RFM (Recency, Frequency, Monetary)** untuk seluruh pelanggan, memetakan mereka ke 11 segmen perilaku, dan menyimpan hasilnya sebagai snapshot historis.

Dari snapshot tersebut diturunkan analitik yang dapat ditindaklanjuti:

- **Segment Migration** — pelanggan berpindah segmen dari bulan ke bulan.
- **Cohort Retention** — seberapa lama pelanggan hasil akuisisi tiap bulan bertahan.
- **Tren penjualan bulanan**, **produk best-seller**, **AOV**, **repeat purchase rate**, **churn per segmen**, **CLV sederhana**, dan **funnel konversi**.

Prinsip desain yang mengikat seluruh dokumen ini:

1. **Analitik harus berasal dari data nyata di database**, bukan angka hardcoded.
2. **Riwayat adalah warga kelas satu** — harga, nama produk, dan segmen disimpan sebagai snapshot, tidak pernah dihitung ulang dari data master yang bisa berubah.
3. **Setiap insight harus punya jalan ke aksi** (minimal: filter audiens + export; sasaran: pembuatan kupon per segmen).

---

## 2. Latar Belakang & Masalah

Toko online kecil umumnya hanya punya data transaksi, tanpa kemampuan menjawab pertanyaan seperti:

- Siapa pelanggan yang paling berharga dan sedang berisiko pergi?
- Berapa banyak pelanggan yang hilang tiap bulan?
- Apakah pelanggan yang datang bulan ini akan kembali bulan depan?
- Produk mana yang menarik pelanggan bernilai tinggi?

RFM adalah metode yang murah, dapat dijelaskan, dan sudah terbukti di industri untuk menjawab pertanyaan tersebut tanpa machine learning. Masalah implementasinya: kebanyakan solusi menghitung RFM *on-the-fly* per request sehingga lambat, dan menyimpan segmen sebagai kolom tunggal sehingga tidak ada histori perpindahan segmen.

Segmenta menyelesaikan ini dengan **pipeline snapshot periodik** yang idempoten, dapat diaudit (job log), dan dapat ditampilkan sebagai perjalanan pelanggan antar segmen.

**Untuk siapa dokumen ini:** pengembang (acuan implementasi), reviewer portfolio (bukti kedalaman teknis), dan pemilik produk (batas ruang lingkup).

---

## 3. Tujuan & Metrik Keberhasilan

### 3.1 Tujuan Produk

| ID | Tujuan |
|---|---|
| G1 | Menyediakan alur belanja end-to-end yang benar secara data (stok, harga, status pesanan). |
| G2 | Menghitung RFM secara otomatis dan periodik, dengan histori snapshot yang dapat dibandingkan. |
| G3 | Menyajikan minimal 6 visualisasi analitik yang masing-masing punya definisi metrik eksplisit. |
| G4 | Menghubungkan hasil segmentasi ke aksi konkret (audiens + export, lanjut kupon di P2). |
| G5 | Menghasilkan demo yang deterministik: satu perintah seed → dashboard penuh. |

### 3.2 Metrik Keberhasilan (proyek, bukan bisnis)

| Metrik | Target |
|---|---|
| Waktu dari clone → aplikasi berjalan penuh berisi data | ≤ 10 menit |
| Cakupan segmen RFM pada data seed | ≥ 9 dari 11 segmen terisi |
| Retensi cohort pada data seed | ≥ 12 baris cohort dengan nilai non-nol |
| Waktu muat halaman dashboard (p95, lokal) | ≤ 1,5 detik |
| Unit test untuk `lib/rfm.ts` dan `lib/cohort.ts` | lulus semua, mencakup 11 aturan segmen |
| Semua metrik di dashboard dapat ditelusuri ke query/SQL yang terdokumentasi | 100% |

---

## 4. Persona & Peran Pengguna

| Peran | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Pembeli (CUSTOMER)** | Pengguna terdaftar yang berbelanja. | Menemukan produk, checkout cepat, melihat status & riwayat pesanan. |
| **Admin (ADMIN)** | Pemilik toko. | Mengelola produk & pesanan, membaca segmentasi, menjalankan job analitik, mengekspor data. |
| **Reviewer / Demo User** | Melihat portfolio. | Login sekali klik, melihat dashboard berisi data, memahami metode dalam < 3 menit. |

**Keputusan:** tidak ada guest checkout. Semua pembeli wajib login agar identitas pelanggan tunggal dan RFM tidak terpecah per email.

---

## 5. Ruang Lingkup

### 5.1 In Scope (MVP)

**Toko**
- Registrasi, login, logout, sesi berbasis cookie.
- Katalog: daftar produk, pencarian, filter kategori, urutkan harga, halaman detail.
- Keranjang persisten (server-side, per user).
- Checkout dengan alamat pengiriman + pembayaran simulasi.
- Riwayat & detail pesanan pelanggan, pembatalan selama `PENDING_PAYMENT`.
- Profil pelanggan sederhana.

**Admin**
- CRUD produk (soft delete), manajemen stok, kategori.
- Daftar pesanan + transisi status.
- Dashboard RFM: distribusi segmen, tabel pelanggan per segmen, filter periode.
- Segment migration (bulan ini vs bulan lalu).
- Cohort retention heatmap.
- Tren penjualan bulanan, produk best-seller, AOV, repeat purchase rate, churn per segmen, CLV sederhana.
- Funnel konversi.
- Export CSV untuk tabel analitik.
- Job log + tombol "Recalculate now".

**Infrastruktur**
- Seed generator 18 bulan riwayat dengan persona perilaku.
- Unit test untuk mesin RFM dan query cohort.

### 5.2 Out of Scope (dinyatakan eksplisit agar tidak melebar)

- Payment gateway asli (Midtrans/Xendit) — hanya mock.
- Multi-vendor / marketplace.
- Review, rating, wishlist, notifikasi email, live chat.
- Multi-currency, multi-bahasa, pajak per region.
- Machine learning (KMeans, churn prediction). Quintile RFM adalah metode resmi.
- Aplikasi mobile native.
- Rekomendasi produk personalisasi.
- Multi-gudang / manajemen logistik.

### 5.3 P2 (hanya jika MVP selesai lebih awal)

- Kupon bertarget segmen (buat kode dari segmen "At Risk").
- Perbandingan RFM quintile vs KMeans (halaman eksperimen).
- Segment detail drill-down dengan daftar produk favorit per segmen.

---

## 6. Glosarium & Definisi Metrik

Definisi ini **mengikat implementasi**. Setiap chart wajib menampilkan tooltip definisi yang sama.

| Istilah | Definisi |
|---|---|
| **Order valid (revenue)** | Order dengan status `PAID`, `PROCESSING`, `SHIPPED`, atau `COMPLETED`. `PENDING_PAYMENT`, `CANCELLED`, `REFUNDED` **tidak** dihitung. |
| **Recency (R)** | Jumlah hari dari `now` ke `paid_at` terakhir pelanggan. |
| **Frequency (F)** | Jumlah order valid dalam **365 hari terakhir**. |
| **Monetary (M)** | Total `grand_total` order valid dalam **365 hari terakhir**. |
| **RFM cell** | Gabungan skor, contoh `555`, `311`. |
| **Segmen** | Hasil pemetaan aturan pada §10.2. |
| **AOV** | `SUM(grand_total) / COUNT(order valid)` pada periode. |
| **Repeat purchase rate** | Pelanggan dengan ≥ 2 order valid / total pelanggan dengan ≥ 1 order valid. |
| **Churn rate (periode P)** | Pelanggan aktif di P−1 yang **tidak** punya order valid di P / pelanggan aktif di P−1. |
| **CLV sederhana (per segmen)** | `avg_monetary × avg_frequency × margin_assumption` (default margin 30%, dapat dikonfigurasi via env). Bukan prediksi; labelnya wajib "estimasi". |
| **Cohort** | Kelompok pelanggan berdasarkan bulan order valid pertamanya (`date_trunc('month', first_paid_at)`). |
| **Retention bulan ke-N** | % anggota cohort yang punya ≥ 1 order valid pada bulan ke-N sejak bulan cohort. Bulan ke-0 = 100% by definition. |
| **Funnel** | Urutan event: `PRODUCT_VIEW` → `ADD_TO_CART` → `CHECKOUT_STARTED` → `ORDER_PAID`. |
| **Periode snapshot** | Tanggal (tanggal 1) bulan berjalan saat job dijalankan. |

**Aturan waktu:** semua timestamp disimpan dalam **UTC**. Periode bulanan (cohort, snapshot, tren) dihitung pada zona **Asia/Jakarta** menggunakan `AT TIME ZONE 'Asia/Jakarta'`.

---

## 7. Peta Rute / Information Architecture

### 7.1 Publik & Pelanggan

| Rute | Deskripsi |
|---|---|
| `/` | Landing + produk unggulan + kategori |
| `/products` | Katalog + pencarian + filter + sort + pagination |
| `/products/[slug]` | Detail produk |
| `/cart` | Keranjang |
| `/checkout` | Alamat + ringkasan + tombol bayar (mock) |
| `/checkout/success/[orderCode]` | Konfirmasi pesanan |
| `/account` | Profil |
| `/account/orders` | Riwayat pesanan |
| `/account/orders/[orderCode]` | Detail + timeline status |
| `/login`, `/register` | Autentikasi |

### 7.2 Admin (`/admin`, dilindungi role ADMIN)

| Rute | Deskripsi |
|---|---|
| `/admin` | Ringkasan: KPI cards + tren penjualan |
| `/admin/products` | Tabel produk + CRUD |
| `/admin/categories` | Kategori |
| `/admin/orders` | Daftar pesanan + transisi status |
| `/admin/customers` | Daftar pelanggan + segmen terkini |
| `/admin/analytics/rfm` | Distribusi segmen, tabel audiens, filter periode |
| `/admin/analytics/migration` | Segment migration |
| `/admin/analytics/cohort` | Heatmap retention |
| `/admin/analytics/products` | Best-seller + performa produk |
| `/admin/analytics/funnel` | Funnel konversi |
| `/admin/jobs` | Job log + tombol recalculate |
| `/api/cron/rfm` | Endpoint ber-secret untuk trigger otomatis (opsional) |

---

## 8. Kebutuhan Fungsional (dengan Acceptance Criteria)

Format: **kebutuhan → AC**. AC ditulis dalam bentuk yang bisa diverifikasi manual.

### 8.1 Autentikasi & Otorisasi

- **F-AUTH-1** Registrasi dengan email + password (min 8 karakter), email unik.
- **F-AUTH-2** Login menghasilkan sesi cookie `httpOnly`, `secure` di produksi.
- **F-AUTH-3** Role `CUSTOMER` | `ADMIN` tersimpan di sesi.
- **F-AUTH-4** Semua rute `/admin/**` menolak non-admin dengan 403/redirect.
- **F-AUTH-5** Akun demo admin tersedia dari seed (`admin@segmenta.test`).

**AC**
1. Password disimpan sebagai hash bcrypt/argon2; tidak ada plaintext di DB.
2. Mengakses `/admin` sebagai CUSTOMER → redirect ke `/login` atau 403.
3. Setelah logout, cookie sesi tidak dapat dipakai ulang.

### 8.2 Katalog

- **F-CAT-1** Daftar produk hanya menampilkan `is_active = true` dan `deleted_at IS NULL`.
- **F-CAT-2** Pencarian berdasarkan nama (case-insensitive, partial match).
- **F-CAT-3** Filter kategori, sort (`price_asc`, `price_desc`, `newest`), pagination 12/halaman.
- **F-CAT-4** Halaman detail menampilkan stok tersedia; tombol "Tambah ke keranjang" disabled bila stok 0.
- **F-CAT-5** Setiap kunjungan detail produk mencatat `PRODUCT_VIEW` di `analytics_events`.

**AC**
1. Produk yang di-soft-delete hilang dari katalog dan pencarian, tetapi tetap muncul di detail order lama.
2. Query pencarian dengan input kosong mengembalikan daftar default tanpa error.
3. `PRODUCT_VIEW` tercatat tepat satu kali per page load (tidak dobel karena Strict Mode / prefetch).

### 8.3 Keranjang

- **F-CART-1** Keranjang tersimpan server-side per user (bertahan antar perangkat/sesi).
- **F-CART-2** Tambah, ubah qty, hapus item.
- **F-CART-3** Qty dibatasi `1 ≤ qty ≤ stock`.
- **F-CART-4** Menambahkan item yang sama menambah qty, bukan baris baru.
- **F-CART-5** Menampilkan subtotal, ongkir (flat), dan total.

**AC**
1. Menambah item yang sama dua kali menghasilkan satu baris dengan qty 2.
2. Qty di atas stok ditolak dengan pesan jelas, bukan error 500.
3. Mengubah qty langsung memperbarui subtotal tanpa reload penuh.
4. `ADD_TO_CART` tercatat di `analytics_events` setiap penambahan berhasil.

### 8.4 Checkout & Pesanan

- **F-ORD-1** Checkout membuat order + order_items dalam satu transaksi DB.
- **F-ORD-2** Harga dan nama produk **disalin** ke `order_items` saat checkout.
- **F-ORD-3** Stok dikurangi secara atomik dengan guard `stock >= qty`.
- **F-ORD-4** Checkout bersifat idempoten: klik ganda tidak membuat dua order.
- **F-ORD-5** Order dimulai pada status `PENDING_PAYMENT`, lalu pembayaran mock mengubahnya ke `PAID` dan mengisi `paid_at`.
- **F-ORD-6** `CHECKOUT_STARTED` dan `ORDER_PAID` dicatat untuk funnel.
- **F-ORD-7** Order `PENDING_PAYMENT` lebih dari 24 jam otomatis `CANCELLED` dan stok dikembalikan.

**AC**
1. Dua request checkout paralel dengan idempotency key sama → hanya satu order dibuat.
2. Checkout ketika stok berubah menjadi kurang → gagal dengan pesan "stok tidak cukup", tidak ada order setengah jadi, dan stok tidak negatif.
3. Setelah admin mengubah harga produk, detail order lama tetap menampilkan harga saat pembelian.
4. Order yang dibatalkan mengembalikan stok tepat sejumlah yang dikurangi.

### 8.5 Akun Pelanggan

- **F-ACC-1** Riwayat pesanan menampilkan kode, tanggal, total, status.
- **F-ACC-2** Detail pesanan menampilkan timeline status dari `order_events`.
- **F-ACC-3** Pelanggan dapat membatalkan order selama `PENDING_PAYMENT`.

**AC**
1. Pelanggan A tidak dapat membuka order pelanggan B (403).
2. Timeline menampilkan minimal transisi `PENDING_PAYMENT → PAID`.

### 8.6 Admin — Produk & Kategori

- **F-ADM-1** CRUD produk: nama, slug (auto, unik), deskripsi, harga, stok, kategori, gambar (URL), aktif/nonaktif.
- **F-ADM-2** Hapus produk = soft delete (`deleted_at`), bukan `DELETE`.
- **F-ADM-3** Validasi: harga > 0, stok ≥ 0, slug unik.
- **F-ADM-4** CRUD kategori.

**AC**
1. Menghapus produk tidak memutus relasi `order_items`.
2. Produk nonaktif tidak bisa dibeli (ditolak di server, bukan hanya UI).
3. Perubahan produk tercatat `updated_at`.

### 8.7 Admin — Pesanan

- **F-ADM-5** Tabel pesanan dengan filter status dan rentang tanggal.
- **F-ADM-6** Transisi status hanya melalui state machine §9.1; transisi ilegal ditolak.
- **F-ADM-7** Setiap transisi menulis `order_events` dan `updated_at`.

**AC**
1. `COMPLETED → PENDING_PAYMENT` ditolak.
2. Transisi `PAID → REFUNDED` mengeluarkan order dari semua perhitungan revenue pada job berikutnya.

### 8.8 Mesin RFM

- **F-RFM-1** Job menghitung R/F/M untuk semua pelanggan yang punya ≥ 1 order valid.
- **F-RFM-2** Skor 1–5 per dimensi (quintile), dengan fallback threshold tetap bila pelanggan < 50 (§10.3).
- **F-RFM-3** Pemetaan segmen mengikuti aturan berprioritas §10.2.
- **F-RFM-4** Hasil disimpan sebagai snapshot per periode; menjalankan ulang periode yang sama bersifat **upsert**, tidak menduplikasi.
- **F-RFM-5** Job dapat dijalankan dari tombol admin dan dari CLI/endpoint cron.
- **F-RFM-6** Setiap eksekusi menulis satu baris `job_runs` (status, jumlah diproses, durasi, error).
- **F-RFM-7** Halaman RFM menampilkan periode snapshot beserta `computed_at` dan tombol recalculate.

**AC**
1. Menjalankan job dua kali pada periode sama menghasilkan jumlah baris `rfm_snapshots` yang identik.
2. `rfm_snapshots` untuk periode lama tidak berubah ketika job periode baru berjalan.
3. Jika job gagal di tengah, `job_runs.status = FAILED` dan `error_message` terisi; snapshot lama tetap utuh.
4. Total pelanggan pada tabel `rfm_snapshots` = total pelanggan dengan ≥ 1 order valid.

### 8.9 Dashboard Analitik

- **F-DASH-1** KPI cards: revenue bulan berjalan, jumlah order, AOV, pelanggan aktif, repeat purchase rate.
- **F-DASH-2** Tren penjualan bulanan (line/area) minimal 12 bulan.
- **F-DASH-3** Produk best-seller (bar) berdasarkan qty dan revenue (toggle).
- **F-DASH-4** Distribusi segmen (bar/donut) + tabel audiens per segmen dengan pencarian.
- **F-DASH-5** Semua chart punya filter periode global (default: 12 bulan terakhir).
- **F-DASH-6** Setiap chart menampilkan definisi metrik pada tooltip/info.

**AC**
1. Angka KPI revenue sama dengan hasil query manual `SUM(grand_total)` pada rentang yang sama.
2. Filter periode mengubah semua chart pada halaman yang sama secara konsisten.
3. Chart kosong menampilkan empty state, bukan error.

### 8.10 Segment Migration

- **F-MIG-1** Membandingkan snapshot periode terpilih dengan periode sebelumnya.
- **F-MIG-2** Menampilkan matriks/sankey perpindahan segmen (naik, stabil, turun).
- **F-MIG-3** Ringkasan: jumlah pelanggan naik segmen, stabil, turun.

**AC**
1. Pelanggan yang baru pertama kali muncul dihitung sebagai `NEW_ENTRANT`, bukan perpindahan.
2. Pelanggan tanpa order valid di periode berjalan ditandai `INACTIVE`, bukan dihapus dari perbandingan.
3. Jumlah total baris migration = jumlah pelanggan union dua periode.

### 8.11 Cohort Retention

- **F-COH-1** Cohort berdasarkan bulan order valid pertama.
- **F-COH-2** Heatmap triangular: baris cohort, kolom bulan ke-0..N, nilai %.
- **F-COH-3** Menampilkan ukuran cohort (n) di samping label.
- **F-COH-4** Retention curve rata-rata (weighted by cohort size) ditampilkan terpisah.

**AC**
1. Kolom bulan ke-0 selalu 100%.
2. Bulan yang belum terjadi untuk suatu cohort tidak ditampilkan sebagai 0, melainkan kosong.
3. Nilai dapat diverifikasi dengan query §10.5.

### 8.12 Funnel

- **F-FUN-1** Empat tahap: view → add to cart → checkout started → order paid.
- **F-FUN-2** Menampilkan jumlah unik (per sesi) dan conversion rate antar tahap.
- **F-FUN-3** Periode mengikuti filter global.

**AC**
1. Metrik memakai `session_id` unik, bukan jumlah event mentah.
2. Tahap dengan nilai 0 menampilkan `—`, bukan `NaN%`.

### 8.13 Export

- **F-EXP-1** Export CSV untuk: tabel audiens segmen, cohort matrix, best-seller, daftar pesanan.
- **F-EXP-2** Nama file mengandung entitas + periode.
- **F-EXP-3** Export mengikuti filter yang sedang aktif.

**AC**
1. CSV valid (UTF-8, header, delimiter koma, escape benar).
2. Jumlah baris CSV = jumlah baris yang tampil di tabel (tanpa pagination).

### 8.14 Job Log

- **F-JOB-1** Tabel `job_runs` ditampilkan: nama job, periode, status, mulai, selesai, durasi, jumlah diproses, error.
- **F-JOB-2** Tombol "Recalculate now" menjalankan job untuk periode berjalan dan me-refresh halaman.
- **F-JOB-3** Endpoint `/api/cron/rfm` memerlukan header secret dan menolak tanpa itu.

**AC**
1. Klik recalculate menambah satu baris log baru.
2. Request tanpa secret ke endpoint cron → 401.
3. Job berjalan > 10 detik tetap menampilkan status `RUNNING` bila di-refresh.

---

## 9. Aturan Bisnis

### 9.1 State Machine Pesanan

```
PENDING_PAYMENT ──pay──▶ PAID ──▶ PROCESSING ──▶ SHIPPED ──▶ COMPLETED
       │                  │            │
       └──cancel──▶ CANCELLED          └──refund──▶ REFUNDED
                          └────────────refund──────▶ REFUNDED
```

| Transisi | Aktor | Efek |
|---|---|---|
| `PENDING_PAYMENT → PAID` | sistem (mock pay) | isi `paid_at`, catat `ORDER_PAID` |
| `PENDING_PAYMENT → CANCELLED` | pelanggan/admin | kembalikan stok |
| `PENDING_PAYMENT → CANCELLED` (auto) | job 24 jam | kembalikan stok |
| `PAID → PROCESSING` | admin | — |
| `PROCESSING → SHIPPED` | admin | — |
| `SHIPPED → COMPLETED` | admin | — |
| `PAID/PROCESSING/COMPLETED → REFUNDED` | admin | keluarkan dari revenue |

Transisi lain **ditolak** di layer server (bukan hanya UI).

### 9.2 Stok & Oversell

- Stok dikurangi saat order dibuat (reservasi), dalam transaksi DB yang sama dengan pembuatan order.
- Guard wajib: `UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty`. Jika `rowCount = 0`, batalkan seluruh transaksi.
- Stok dikembalikan saat `CANCELLED` atau auto-expire.
- Tidak ada backorder.

### 9.3 Idempotensi Checkout

- Client mengirim `idempotencyKey` (UUID) yang dibuat sekali per halaman checkout.
- `orders.idempotency_key` unik. Request kedua dengan key sama mengembalikan order yang sudah ada.

### 9.4 Integritas Riwayat

- `order_items` menyimpan `product_name` dan `unit_price` (snapshot).
- Produk tidak pernah di-`DELETE`; hanya `deleted_at`.
- Perubahan harga produk tidak memengaruhi order lama.

### 9.5 Analitik & Event

- Event hanya dicatat untuk aksi yang berhasil (mis. add-to-cart yang ditolak stok tidak mencatat `ADD_TO_CART`).
- `analytics_events` bersifat append-only.
- Semua agregasi revenue memakai daftar status valid dari §6.

---

## 10. Spesifikasi Algoritma

### 10.1 Perhitungan R/F/M

```
as_of        = waktu job dijalankan (UTC)
window       = 365 hari

recency_days = date_diff(as_of, MAX(paid_at))
frequency    = COUNT(order valid WHERE paid_at >= as_of - window)
monetary     = SUM(grand_total of order valid WHERE paid_at >= as_of - window)
```

Pelanggan tanpa order valid **tidak** masuk snapshot.

### 10.2 Pemetaan Segmen (dievaluasi berurutan; aturan pertama yang cocok menang)

| # | Segmen | Kode | Aturan |
|---|---|---|---|
| 1 | Champions | `CHAMPIONS` | R ≥ 4 AND F ≥ 4 AND M ≥ 4 |
| 2 | Cannot Lose Them | `CANNOT_LOSE_THEM` | R ≤ 1 AND F ≥ 4 AND M ≥ 4 |
| 3 | Loyal Customers | `LOYAL` | R ≥ 3 AND F ≥ 4 |
| 4 | At Risk | `AT_RISK` | R ≤ 2 AND F ≥ 3 |
| 5 | Potential Loyalist | `POTENTIAL_LOYALIST` | R ≥ 3 AND F BETWEEN 2 AND 3 |
| 6 | New Customers | `NEW` | R ≥ 4 AND F ≤ 1 |
| 7 | Promising | `PROMISING` | R = 3 AND F ≤ 1 |
| 8 | Need Attention | `NEED_ATTENTION` | R = 3 AND F = 3 |
| 9 | About to Sleep | `ABOUT_TO_SLEEP` | R = 2 AND F ≤ 2 |
| 10 | Hibernating | `HIBERNATING` | R ≤ 2 AND F ≤ 2 AND M ≤ 2 |
| 11 | Lost | `LOST` | selain di atas |

Catatan: aturan dievaluasi top-down sehingga `CANNOT_LOSE_THEM` harus didahulukan dari `LOYAL`, dan `NEED_ATTENTION` hanya tercapai jika `POTENTIAL_LOYALIST` tidak cocok (R=3, F=3 memang cocok keduanya — sehingga **urutan ini disengaja**: `POTENTIAL_LOYALIST` menang). Perilaku ini harus dikunci oleh unit test.

### 10.3 Scoring

**Mode quintile (default, N ≥ 50):**

```sql
r_score = 6 - NTILE(5) OVER (ORDER BY recency_days ASC)
f_score =       NTILE(5) OVER (ORDER BY frequency   ASC)
m_score =       NTILE(5) OVER (ORDER BY monetary    ASC)
```

**Mode threshold (N < 50):** gunakan ambang tetap agar tidak ada bucket kosong.

| Skor | R (hari) | F (order/365h) | M (Rp) |
|---|---|---|---|
| 5 | ≤ 14 | ≥ 10 | ≥ 5.000.000 |
| 4 | ≤ 30 | 6–9 | 2.000.000–4.999.999 |
| 3 | ≤ 60 | 4–5 | 1.000.000–1.999.999 |
| 2 | ≤ 120 | 2–3 | 300.000–999.999 |
| 1 | > 120 | 0–1 | < 300.000 |

Mode yang dipakai dicatat di `job_runs.meta`.

### 10.4 Query RFM (referensi)

```sql
WITH params AS (
  SELECT now() AS as_of, interval '365 days' AS win
),
base AS (
  SELECT o.user_id,
         MAX(o.paid_at) AS last_paid_at,
         COUNT(*) FILTER (WHERE o.paid_at >= (SELECT as_of FROM params) - (SELECT win FROM params)) AS frequency,
         COALESCE(SUM(o.grand_total) FILTER (WHERE o.paid_at >= (SELECT as_of FROM params) - (SELECT win FROM params)), 0) AS monetary
  FROM orders o
  WHERE o.status IN ('PAID','PROCESSING','SHIPPED','COMPLETED')
  GROUP BY o.user_id
),
scored AS (
  SELECT b.*,
         EXTRACT(EPOCH FROM ((SELECT as_of FROM params) - b.last_paid_at)) / 86400.0 AS recency_days_raw
  FROM base b
),
final AS (
  SELECT *,
         FLOOR(recency_days_raw)::int AS recency_days,
         6 - NTILE(5) OVER (ORDER BY recency_days_raw ASC) AS r_score,
             NTILE(5) OVER (ORDER BY frequency ASC)        AS f_score,
             NTILE(5) OVER (ORDER BY monetary  ASC)        AS m_score
  FROM scored
)
SELECT * FROM final;
```

### 10.5 Query Cohort Retention (referensi)

```sql
WITH first_order AS (
  SELECT user_id,
         date_trunc('month', MIN(paid_at) AT TIME ZONE 'Asia/Jakarta') AS cohort_month
  FROM orders
  WHERE status IN ('PAID','PROCESSING','SHIPPED','COMPLETED')
  GROUP BY user_id
),
cohort_size AS (
  SELECT cohort_month, COUNT(*) AS n FROM first_order GROUP BY cohort_month
),
activity AS (
  SELECT f.cohort_month,
         ((EXTRACT(YEAR  FROM o.paid_at AT TIME ZONE 'Asia/Jakarta') * 12
         + EXTRACT(MONTH FROM o.paid_at AT TIME ZONE 'Asia/Jakarta'))
         -
         (EXTRACT(YEAR  FROM f.cohort_month) * 12
         + EXTRACT(MONTH FROM f.cohort_month)))::int AS month_index,
         COUNT(DISTINCT o.user_id) AS active_users
  FROM orders o
  JOIN first_order f ON f.user_id = o.user_id
  WHERE o.status IN ('PAID','PROCESSING','SHIPPED','COMPLETED')
  GROUP BY 1, 2
)
SELECT a.cohort_month,
       a.month_index,
       a.active_users,
       cs.n,
       ROUND(100.0 * a.active_users / cs.n, 1) AS retention_pct
FROM activity a
JOIN cohort_size cs ON cs.cohort_month = a.cohort_month
ORDER BY a.cohort_month, a.month_index;
```

### 10.6 KPI Tambahan

| KPI | Formula |
|---|---|
| Revenue (periode) | `SUM(grand_total)` order valid |
| Orders (periode) | `COUNT(order valid)` |
| AOV | revenue / orders |
| Active customers | `COUNT(DISTINCT user_id)` order valid di periode |
| Repeat purchase rate | pelanggan ≥ 2 order valid / pelanggan ≥ 1 order valid |
| Churn rate (P) | (aktif di P−1 yang tidak aktif di P) / aktif di P−1 |
| CLV estimasi (segmen) | avg(monetary) × avg(frequency) × `CLV_MARGIN` (default 0.3) |
| Funnel rate | tahap_n / tahap_1, per `session_id` unik |

### 10.7 Idempotensi Job

- Kunci unik: `rfm_snapshots (period, user_id)`.
- Implementasi: `INSERT ... ON CONFLICT (period, user_id) DO UPDATE`.
- Snapshot periode **lampau** tidak pernah ditimpa oleh job periode berjalan.
- `period` = tanggal 1 bulan berjalan (UTC), disimpan sebagai `DATE`.

---

## 11. Model Data (Prisma)

> Skema di bawah adalah acuan; detail tipe final disesuaikan saat implementasi tanpa mengubah semantik.

```prisma
enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
  PROCESSING
  SHIPPED
  COMPLETED
  CANCELLED
  REFUNDED
}

enum Segment {
  CHAMPIONS
  CANNOT_LOSE_THEM
  LOYAL
  AT_RISK
  POTENTIAL_LOYALIST
  NEW
  PROMISING
  NEED_ATTENTION
  ABOUT_TO_SLEEP
  HIBERNATING
  LOST
}

enum AnalyticsEventType {
  PRODUCT_VIEW
  ADD_TO_CART
  CHECKOUT_STARTED
  ORDER_PAID
}

enum JobStatus {
  RUNNING
  SUCCESS
  FAILED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(CUSTOMER)
  createdAt    DateTime @default(now())
  lastLoginAt  DateTime?

  cart         Cart?
  orders       Order[]
  rfmSnapshots RfmSnapshot[]
  events       AnalyticsEvent[]
}

model Category {
  id       String    @id @default(cuid())
  slug     String    @unique
  name     String
  products Product[]
}

model Product {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  description String
  price       Decimal   @db.Decimal(12, 2)
  stock       Int
  imageUrl    String?
  isActive    Boolean   @default(true)
  deletedAt   DateTime?
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  cartItems CartItem[]
  orderItems OrderItem[]

  @@index([categoryId, isActive, deletedAt])
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  quantity  Int
  cart      Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}

model Order {
  id             String      @id @default(cuid())
  code           String      @unique
  userId         String
  user           User        @relation(fields: [userId], references: [id])
  status         OrderStatus @default(PENDING_PAYMENT)
  idempotencyKey String      @unique
  subtotal       Decimal     @db.Decimal(12, 2)
  discountTotal  Decimal     @db.Decimal(12, 2) @default(0)
  shippingFee    Decimal     @db.Decimal(12, 2) @default(0)
  grandTotal     Decimal     @db.Decimal(12, 2)
  shipRecipient  String
  shipPhone      String
  shipAddress    String
  paidAt         DateTime?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  items  OrderItem[]
  events OrderEvent[]

  @@index([userId, createdAt])
  @@index([status, paidAt])
  @@index([paidAt])
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  productId   String
  productName String
  unitPrice   Decimal @db.Decimal(12, 2)
  quantity    Int
  lineTotal   Decimal @db.Decimal(12, 2)
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product @relation(fields: [productId], references: [id])

  @@index([productId])
}

model OrderEvent {
  id         String       @id @default(cuid())
  orderId    String
  fromStatus OrderStatus?
  toStatus   OrderStatus
  note       String?
  createdAt  DateTime     @default(now())
  order      Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId, createdAt])
}

model AnalyticsEvent {
  id        String              @id @default(cuid())
  sessionId String
  userId    String?
  type      AnalyticsEventType
  productId String?
  metadata  Json?
  createdAt DateTime            @default(now())
  user      User?               @relation(fields: [userId], references: [id])

  @@index([type, createdAt])
  @@index([sessionId, type])
}

model RfmSnapshot {
  id          String   @id @default(cuid())
  period      DateTime @db.Date
  userId      String
  recencyDays Int
  frequency   Int
  monetary    Decimal  @db.Decimal(14, 2)
  rScore      Int
  fScore      Int
  mScore      Int
  rfmCell     String
  segment     Segment
  computedAt  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])

  @@unique([period, userId])
  @@index([period, segment])
  @@index([userId, period])
}

model JobRun {
  id             String    @id @default(cuid())
  jobName        String
  period         DateTime  @db.Date
  status         JobStatus @default(RUNNING)
  startedAt      DateTime  @default(now())
  finishedAt     DateTime?
  processedCount Int       @default(0)
  windowDays     Int       @default(365)
  scoringMode    String    @default("quintile")
  errorMessage   String?
  meta           Json?

  @@index([jobName, startedAt])
}
```

**Aturan migrasi:** perubahan skema harus disertai catatan di §19 (changelog) dan, bila menyentuh `order_items`/`rfm_snapshots`, alasan eksplisit.

---

## 12. Arsitektur & Stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js App Router + TypeScript | Fullstack satu repo, Server Components, Server Actions |
| Database | PostgreSQL 15+ | Window function & `date_trunc` untuk RFM/cohort |
| ORM | Prisma | Migrasi + type safety |
| Auth | Auth.js (NextAuth v5), credentials + JWT role | Nama dikenal reviewer |
| Styling | Tailwind CSS + shadcn/ui | Cepat, konsisten |
| Chart | Recharts (line/bar/donut/sankey) | Deklaratif, ringan |
| Heatmap | CSS Grid kustom | Recharts tidak punya heatmap |
| Job | Fungsi TS + `pg`/Prisma raw query; CLI script + server action | Tanpa infra queue |
| Deploy | Vercel + Neon/Supabase (free tier) | Biaya nol, relevan portfolio |
| Test | Vitest untuk `lib/rfm.ts`, `lib/cohort.ts` | Bagian paling perlu dikunci |

**Prinsip arsitektur**

- `lib/rfm.ts` dan `lib/cohort.ts` **pure function** — tidak menyentuh DB — sehingga mudah diuji.
- Query DB berada di `lib/queries/*` dan mengembalikan tipe eksplisit.
- Server Action / Route Handler melakukan otorisasi terlebih dahulu, baru validasi input (`zod`).
- Semua mutasi yang menyentuh stok atau order berada dalam transaksi DB.

**Struktur direktori acuan**

```
src/
  app/
    (shop)/...
    (admin)/admin/...
    api/cron/rfm/route.ts
  components/
    ui/            # shadcn
    charts/
  lib/
    auth.ts
    db.ts
    rfm.ts         # pure: score + segment mapping
    cohort.ts      # pure: matrix builder
    queries/       # query DB
    validators/    # zod
  types/
scripts/
  seed.ts
  rfm-job.ts
prisma/
  schema.prisma
  migrations/
docs/
  PRD.md
```

---

## 13. Spesifikasi Seed Data

Seed adalah **fitur inti**, bukan pelengkap. Tujuan: dashboard langsung bermakna setelah `npm run seed`.

| Parameter | Nilai |
|---|---|
| Rentang waktu | 18 bulan ke belakang dari hari seed dijalankan |
| Pelanggan | ±150 (termasuk 1 admin + 1 akun demo) |
| Produk | 45–60 dalam 6 kategori |
| Order valid | ±1.400–1.800 |
| Determinisme | PRNG ber-seed tetap (mis. `SEED=42`) |
| Zona waktu | dibuat dalam UTC, merepresentasikan jam wajar 08:00–22:00 WIB |

**Persona perilaku**

| Persona | Porsi | Pola |
|---|---|---|
| Loyal | 15% | 1–2 order/bulan sepanjang 18 bulan |
| Regular | 20% | 1 order tiap 2–3 bulan |
| Seasonal | 20% | meningkat pada bulan tertentu (12.12, Ramadan/Lebaran) |
| One-timer | 25% | 1 order lalu tidak kembali |
| Churner | 10% | aktif 3–4 bulan pertama, lalu berhenti |
| New joiner | 10% | mulai 1–3 bulan terakhir |

**Persyaratan hasil**

1. ≥ 9 dari 11 segmen terisi setelah job RFM.
2. ≥ 12 baris cohort dengan retensi non-nol.
3. Funnel konsisten menurun (view > cart > checkout > paid).
4. Beberapa pelanggan berpindah segmen antar bulan (bahan Segment Migration).
5. Distribusi segmen tidak didominasi satu segmen (> 60%).
6. Akun demo: `admin@segmenta.test` / `customer@segmenta.test` dengan password terdokumentasi di README.

**Event analitik** dibangkitkan mengikuti order aktual ditambah noise view: rasio ± `view → cart 12%`, `cart → checkout 45%`, `checkout → paid 65%`.

---

## 14. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performa | Halaman dashboard p95 ≤ 1,5 detik lokal; query analitik memakai snapshot, bukan agregasi penuh per request |
| Skalabilitas | Nyaman hingga 5.000 order (di luar itu perlu materialized view) |
| Keamanan | Password hashed; otorisasi di server; validasi input zod; endpoint cron ber-secret; tidak mengekspos PII di log |
| Integritas | Semua mutasi stok/order transaksional; tidak ada stok negatif |
| Aksesibilitas | Kontras WCAG AA, navigasi keyboard untuk form & tabel, label pada input |
| Responsif | Desktop-first untuk admin, mobile-friendly untuk toko |
| Observabilitas | `job_runs` untuk job; error dicatat dengan konteks |
| Kualitas kode | `tsc --noEmit` & ESLint bersih; Vitest untuk modul inti |
| Privasi | Seluruh data seed sintetis, tanpa PII nyata; dicatat di README |
| Dokumentasi | README: setup, akun demo, arsitektur, definisi metrik, screenshot/GIF |

---

## 15. Pedoman UI/UX

- **Toko**: bersih, fokus pada produk, maksimal 2 aksi utama per layar.
- **Admin**: padat informasi, tabel dengan sticky header, filter di atas tabel.
- Setiap chart wajib punya: judul metrik, rentang periode, dan ikon info berisi definisi (§6).
- Warna segmen konsisten di seluruh aplikasi (legend sama di dashboard, tabel, migration).
- Format angka: `Rp1.234.567` (Intl `id-ID`), persen 1 desimal.
- Empty state: jelaskan penyebab + aksi (mis. "Belum ada snapshot — jalankan Recalculate").
- Loading state: skeleton untuk tabel & chart, bukan spinner penuh layar.
- Badge status order dengan warna: kuning (`PENDING_PAYMENT`), biru (`PAID`), ungu (`PROCESSING`/`SHIPPED`), hijau (`COMPLETED`), abu (`CANCELLED`), merah (`REFUNDED`).

---

## 16. Milestone & Definition of Done

### 16.1 Peta Milestone

| # | Milestone | Isi inti | Artefak |
|---|---|---|---|
| M1 | Fondasi & Tooling | Scaffolding Next.js + TS, Tailwind/shadcn, Prisma + migrasi awal, Auth.js + role, layout toko & admin, proteksi rute, `.env.example`, lint/`tsc`, CI, deploy preview | URL preview + screenshot login |
| M2 | Belanja & Pesanan | Admin produk/kategori, katalog, cart, checkout transaksional, state machine, riwayat, auto-expire | GIF alur beli |
| M3 | Seed Generator | PRNG deterministik, 6 persona, 18 bulan, ~150 pelanggan, event funnel, akun demo | Tabel ringkasan seed |
| M4 | Mesin RFM | `lib/rfm.ts` + test, job + upsert, `job_runs`, halaman RFM, tombol recalculate | Screenshot distribusi segmen |
| M5 | Analitik | Cohort, tren, best-seller, KPI cards, AOV/repeat/churn/CLV, migration, funnel | 4 screenshot dashboard |
| M6 | Polish & Rilis | Export CSV, job log UI, cron ber-secret, README + ERD, deploy final | Link demo + GIF di README |

### 16.2 Gate per Milestone

Aturan: **tidak boleh mulai milestone berikutnya sebelum semua gate-nya lulus.** Syarat fungsional tetap merujuk §8 dan tidak diduplikasi di sini. Setiap gate harus dapat dibuktikan dengan angka, perintah, atau artefak — bukan klaim.

**M1 — Fondasi & Tooling**
*Scope out:* cart, order, analitik, seed lengkap (cukup 1 admin + 2 user uji)

1. `npm install && npm run build` dari clone bersih berhasil tanpa error.
2. `tsc --noEmit` dan ESLint 0 error, dan keduanya berjalan di CI.
3. `prisma migrate deploy` berhasil dari database kosong.
4. Login sebagai CUSTOMER lalu akses `/admin` → ditolak **di server** (bukan hanya redirect middleware).
5. Preview deploy dapat diakses dan login berfungsi.

**M2 — Belanja & Pesanan**
*Scope out:* kupon/diskon, review, wishlist, email, analitik

1. Dua request checkout paralel dengan `idempotencyKey` sama → hanya 1 order.
2. Stok = 1, qty = 2 → ditolak, tidak ada order setengah jadi, stok tetap 1.
3. Transisi ilegal (`COMPLETED → PENDING_PAYMENT`) ditolak di server.
4. Order `CANCELLED` mengembalikan stok tepat sejumlah yang dikurangi.
5. Mengubah harga produk → detail order lama tidak berubah.
6. Order `PENDING_PAYMENT` dengan `created_at` dimundurkan 25 jam → otomatis `CANCELLED` + stok kembali.
7. Customer A membuka order milik customer B → 403.

**M3 — Seed Generator**
*Scope out:* RFM, semua chart (belum boleh dibangun)

1. `npm run seed` dua kali menghasilkan dataset identik (jumlah order & total revenue sama).
2. Tersedia 18 bulan kalender berturut-turut tanpa bulan kosong.
3. Dihitung manual dengan aturan §10.2 → **≥ 9 dari 11 segmen terisi**.
4. **≥ 12 cohort month** dengan jumlah member ≥ 1.
5. Funnel menurun monoton dan tidak ada tahap bernilai 0.
6. Tidak ada satu segmen yang menampung > 60% populasi.

**M4 — Mesin RFM**
*Scope out:* migration chart, cohort, funnel, kupon

1. 11 aturan segmen lulus unit test, termasuk dua kasus prioritas: `CANNOT_LOSE_THEM` menang atas `LOYAL`, dan `R=3,F=3` jatuh ke `POTENTIAL_LOYALIST` (bukan `NEED_ATTENTION`).
2. Job dijalankan dua kali pada periode sama → jumlah baris `rfm_snapshots` identik.
3. Job periode baru tidak mengubah snapshot periode lama.
4. Job sengaja digagalkan → `job_runs.status = FAILED`, `error_message` terisi, snapshot lama tetap utuh.
5. Jumlah baris snapshot = jumlah pelanggan dengan ≥ 1 order valid.
6. Total distribusi segmen = 100% dari jumlah pelanggan tersebut.
7. Saat N < 50, fallback threshold aktif dan `job_runs.scoringMode` mencatatnya.

**M5 — Analitik**
*Scope out:* export CSV (dipindah ke M6), kupon, KMeans

1. Revenue KPI sama persis dengan hasil `SUM(grand_total)` manual, diuji pada dua rentang bulan berbeda.
2. Kolom cohort bulan ke-0 = 100%; bulan yang belum terjadi tampil kosong, bukan 0.
3. Jumlah baris migration = union pelanggan dua periode; `NEW_ENTRANT` dan `INACTIVE` berlabel benar.
4. Mengubah filter periode mengubah semua chart pada halaman itu secara konsisten.
5. Funnel menghitung `session_id` unik, bukan event mentah.
6. Semua chart punya empty state dan definisi metrik pada tooltip/info.

**M6 — Polish & Rilis**
*Scope out:* fitur baru apa pun (hanya perbaikan)

1. Clone di folder baru → aplikasi berjalan ≤ 10 menit dengan mengikuti README apa adanya.
2. 13 poin checklist §20 lulus semua.
3. Export CSV terbuka benar di Excel (UTF-8 dengan BOM).
4. Request ke `/api/cron/rfm` tanpa secret → 401.
5. Loading skeleton dan error state ada di semua halaman admin.
6. README memuat ERD, akun demo, definisi metrik, dan trade-off quintile vs threshold.

### 16.3 Aturan Pelaksanaan

- **Urutan mengikat:** M3 (seed) selesai sebelum M5 (analitik). Membangun chart sebelum data adalah penyebab utama proyek analitik gagal saat demo.
- Setiap milestone ditutup dengan tag git dan preview deploy yang dapat dilihat.
- Jika sebuah gate gagal, perbaiki dulu — jangan ditunda ke milestone berikutnya.
- Perubahan gate dicatat di §19 agar tetap menjadi kontrak yang dapat dipertanggungjawabkan.

**Definition of Done global (per fitur)**
1. AC terpenuhi dan diverifikasi manual.
2. Otorisasi dicek di server, bukan hanya UI.
3. Empty/loading/error state ada.
4. Tidak ada `any` yang tidak beralasan; `tsc` bersih.
5. Jika menyentuh metrik, definisi di §6 dipakai dan dicantumkan di UI.

---

## 17. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data seed tidak menghasilkan variasi segmen | Dashboard membosankan, klaim RFM tidak terbukti | Persona eksplisit + verifikasi jumlah segmen sebagai test seed |
| Quintile tidak stabil pada N kecil | Skor melompat antar run | Fallback threshold + catat `scoringMode` di job run |
| Cohort kosong karena histori pendek | Heatmap tidak informatif | Wajib 18 bulan data |
| Job menimpa snapshot lama | Migration rusak | Unique `(period, user_id)` + larangan update periode lampau |
| Scope melebar (payment asli, review, wishlist) | Tidak selesai | Daftar Out of Scope §5.2 bersifat mengikat |
| Query analitik lambat | Demo terasa berat | Snapshot + index; hindari agregasi penuh per request |
| Bug timezone | Recency/cohort meleset | Simpan UTC, periode Asia/Jakarta, diuji dengan data lintas bulan |
| Oversell saat checkout | Data stok rusak | Guard atomik + transaksi + test konkurensi |

---

## 18. Keputusan & Pertanyaan Terbuka

**Sudah diputuskan**

| # | Keputusan |
|---|---|
| D1 | Portfolio showcase, bukan produk produksi |
| D2 | Next.js + TypeScript + PostgreSQL + Prisma |
| D3 | Mock payment, tanpa gateway asli |
| D4 | MVP = inti + analitik lengkap |
| D5 | Wajib login, tanpa guest checkout |
| D6 | RFM quintile sebagai metode resmi; KMeans hanya P2 |
| D7 | Snapshot periodik append-only, bukan kolom di `users` |
| D8 | Milestone memakai gate yang wajib lulus sebelum fase berikutnya; scaffolding & tooling digabung ke M1 |

**Asumsi yang perlu dikonfirmasi pemilik produk**

| # | Asumsi | Dampak bila berubah |
|---|---|---|
| A1 | Bahasa UI Indonesia, dokumen/README Inggris | Penyaringan teks UI |
| A2 | Tidak ada deadline keras | Bisa memangkas funnel/export bila mendesak |
| A3 | Auth.js credentials + JWT role | Alternatif: cookie session sendiri (lebih ringan, kurang relevan CV) |
| A4 | Margin CLV default 30% | Angka CLV berubah |
| A5 | Ongkir flat (mis. Rp20.000) | Skema order & total |
| A6 | Nama produk "Segmenta" | Penamaan repo & UI |

---

## 19. Changelog

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 2026-11-17 | Dokumen awal: ruang lingkup, AC, algoritma RFM/cohort, skema data, milestone |
| 1.1 | 2026-11-17 | §16 dirombak: gate per milestone yang terverifikasi (angka/perintah/artefak), scope out per fase, M1 mencakup scaffolding & tooling; tambah D8 |

---

## 20. Lampiran — Checklist Verifikasi Demo

Dijalankan sebelum menyerahkan/mendemokan:

- [ ] `npm run seed` bersih, lalu job RFM dijalankan → semua halaman analitik berisi.
- [ ] Login admin demo → `/admin` menampilkan KPI dan tren.
- [ ] Distribusi segmen menunjukkan ≥ 9 segmen.
- [ ] Segment Migration menampilkan pelanggan naik/turun segmen.
- [ ] Cohort heatmap punya ≥ 12 baris dengan nilai non-nol, kolom ke-0 = 100%.
- [ ] Best-seller berubah saat toggle qty ↔ revenue.
- [ ] Funnel menurun monoton.
- [ ] Recalculate dua kali → jumlah snapshot tidak bertambah.
- [ ] Checkout ganda (double click) → satu order.
- [ ] Ubah harga produk → order lama tidak berubah.
- [ ] Export CSV terbuka benar di Excel.
- [ ] User non-admin tidak bisa membuka `/admin`.
- [ ] Semua timestamp tampil dalam WIB.
