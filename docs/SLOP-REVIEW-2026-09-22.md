# AI-Slop & Gap Review — Overa Portfolio

| | |
| --- | --- |
| **Tanggal** | 2026-09-22 |
| **Peran reviewer** | Senior developer + senior UI/UX |
| **Pertanyaan** | Apakah project ini "AI slop", dan apa yang masih kurang? |
| **Metode** | Membaca seluruh `src/`, `content.ts`, `globals.css`, lalu mencocokkan setiap klaim di situs dengan `FORM UPDATE KOMPETENSI & PENGALAMAN PROJECT.md` (sumber data pengalaman) |
| **Dokumen terkait** | [`DESIGN-REVIEW-2026-09-16.md`](./DESIGN-REVIEW-2026-09-16.md) · [`AUDIT-2026-07-26.md`](./AUDIT-2026-07-26.md) · [`HANDOVER.md`](./HANDOVER.md) |

---

## Status per 2026-10-08

Review ini adalah snapshot 2026-09-22 dan tidak ditulis ulang. Daftar kerja terkini
ada di [`HANDOVER.md`](./HANDOVER.md#next-up).

| Bagian | Status | Keterangan |
| --- | --- | --- |
| §2a Skill tanpa bukti | ✅ Selesai | Outbox pattern dan cache-stampede dihapus; optimistic locking, TDD, dan JWT dipersempit. CV sekarang jadi sumber data kedua |
| §2b Status dilebihkan | Belum | "13 systems shipped", "Also shipped", MYTOS "Present", Impact TAS |
| §2c Role per project | ✅ Selesai | Field `role` tampil di semua kartu |
| §3 Visual template | Belum | |
| §4 Copy generik | Sebagian | Klise AI ("Now bringing that same rigor", "Leveling into AI engineering") hilang bersama positioning AI. Slogan hero, heading Skills, heading Contact, `footerNote`, dan klise di About masih ada |
| §5 Kode dan repo | Sebagian | `package.json` dan `viewTransition` beres. Komentar berisi ID audit dan konsolidasi `docs/` belum |
| §6 #1 Belum live | Sebagian | GitHub terisi. Domain, deploy, dan git belum (git ditunda pemilik) |
| §6 #2 Nama asli | ✅ Selesai | Termasuk di hero |
| §6 #3 CV | ✅ Selesai | |
| §6 #4 Bukti visual | Belum | |
| §6 #5 Pivot AI | ✅ Tidak relevan | Positioning sekarang ikut CV, tanpa AI ([DECISIONS D15](./DECISIONS.md#d15--positioning-follows-the-cv)) |
| §6 #6 Angka Impact | Belum | |
| §6 #7 Role | ✅ Selesai | |

**Temuan baru dari tes browser 2026-10-08** ([`HANDOVER.md` → Browser test](./HANDOVER.md#browser-test--2026-10-08)):
nav tanpa latar belakang menimpa teks di semua HP, label lokasi di foto tidak
terbaca di tema terang ([F40](./AUDIT-2026-07-26.md#f40)), dan tombol CTA tidak
terlihat tanpa scroll di HP kecil, HP landscape, iPad landscape, dan laptop.
Tidak ada error console, overflow, atau link rusak di 7 perangkat yang diuji.

---

## 0. Status sejak review sebelumnya

- `DESIGN-REVIEW-2026-09-16.md` sudah menemukan sebagian besar masalah visual dan konten.
  **Belum ada satu pun yang dikerjakan:** `src/lib/content.ts` terakhir diubah
  2026-07-27, dan tidak ada file di `src/` atau `public/` yang lebih baru dari audit 07-26.
- Project **masih belum menjadi git repo**.
- `site.github` masih `"[YOUR GITHUB]"` dan `site.url` masih `"https://your-domain.com"`.

Dokumen ini tidak mengulang review 09-16. Fokusnya ada pada **temuan baru**
(bagian 1 dan 4) dan **urutan kerja** (bagian 6).

---

## 1. Verdict

**Ya, situs ini masih terbaca sebagai AI slop**, dan kodenya sendiri tidak bermasalah.
Engineering-nya rapi: aksesibilitas, reduced-motion, font self-hosted, dan konten
terpusat. Masalahnya ada di empat lapisan:

1. **Klaim tanpa bukti.** Ada skill yang tidak muncul di catatan pengalaman mana pun. *(paling berbahaya)*
2. **Visual template.** Kombinasi elemennya adalah signature portfolio AI 2024–2026.
3. **Copy generik.** Slogan yang bisa ditempel di portfolio siapa saja.
4. **Repo over-dokumentasi.** Terlalu banyak audit, terlalu sedikit yang dikirim.

---

## 2. Klaim yang tidak didukung sumber data 🔴

Setiap klaim di situs dicocokkan dengan `FORM UPDATE KOMPETENSI & PENGALAMAN PROJECT.md`.

### 2a. Skill yang tidak muncul di project mana pun

| Klaim di situs | Lokasi | Ada di catatan? |
| --- | --- | --- |
| Outbox pattern | `content.ts` → `skills[0].tags` **dan** paragraf 2 `About.tsx` | ❌ |
| Cache-stampede prevention | `skills[0].tags` | ❌ |
| Optimistic locking | `skills[0].tags` ("Pessimistic & optimistic locking") | ❌ (hanya *pessimistic*, di TAS) |
| TDD · Pest & PHPUnit | `skills[0].tags` | ❌ |
| Sanctum / JWT (level 4) | `skills[3].tags` (Backend) | ❌ |

**Kenapa berbahaya:** di interview, pertanyaan pertama biasanya *"Outbox pattern-nya
kamu pakai di project mana?"*. Kalau tidak bisa menunjuk project konkret,
kredibilitas **seluruh** halaman ikut jatuh, termasuk klaim yang benar.

**Aturan:** setiap skill harus bisa ditunjuk ke minimal satu project. Kalau tidak
bisa, hapus. Kalau bisa, tambahkan ke `rows`/`stack` project tersebut.

Klaim yang **terverifikasi** (boleh tetap): pessimistic locking dan idempotency key
(TAS), atomic transaction dan race-condition prevention (AIA), multi-user concurrent
access (MYTOS, SIMONGKA), QR digital signature (AIA), DAX/YoY/C-level (Power BI).

### 2b. Status dan dampak yang dilebihkan

| Klaim di situs | Fakta di catatan | Perbaikan |
| --- | --- | --- |
| Stats: "13 enterprise systems **shipped**" | TAS status `[Status]` (kosong), Power BI *In Progress*, Carpool & MDM *Execution* | "13 systems built" atau hitung yang benar-benar *Closure* |
| Label "Also shipped" di grid More work | Sama seperti di atas | "Other projects" |
| MYTOS: "July 2021 – **Present**" | Status *Closure* | Samakan dengan catatan, atau perbarui catatannya |
| TAS Impact: "Smoother gate flow… lower yard congestion" | Project masih berjalan | Tulis sebagai tujuan desain ("Designed to…"), bukan dampak yang sudah terjadi |
| TAS client "PT Pelabuhan Tanjung Priok" | Catatan masih `[Client]` | Isi catatan dulu (HANDOVER #5) |

### 2c. Data yang ada tapi tidak dipakai

Catatan mencatat **Role** untuk setiap project (Backend / Fullstack / Data-BI).
Situs tidak menampilkannya, padahal "apa peranmu di project ini?" adalah pertanyaan
pertama HR. Tambahkan field `role` ke `CaseStudy` dan tampilkan di `case-meta` / `wc-meta`.

---

## 3. AI slop di visual 🟠

Masing-masing dieksekusi dengan baik, tapi kombinasinya langsung dikenali sebagai template:

| Elemen | File | Masalah |
| --- | --- | --- |
| Latar gelap + satu aksen neon lime `#c8ff3d` | `globals.css` | Palet template paling umum |
| Blob aurora | `Aurora.tsx` | Dekorasi tanpa informasi |
| Film grain | `Grain.tsx` | Dekorasi tanpa informasi |
| Custom cursor | `Cursor.tsx` | Dekorasi, mengganggu di trackpad |
| Loader count-up | `Loader.tsx` | **Progress palsu:** `Math.random()`, tidak mengukur apa pun, sekitar 2,5 detik sebelum konten terlihat |
| Headline raksasa dianimasikan per huruf | `Hero.tsx` | Slogan menutupi layar pertama, CTA di bawah fold |
| Marquee tech stack | `Marquee.tsx` | Mengulang isi Skills |
| Bento grid + tilt 3D | `Skills.tsx`, `Work.tsx` | Template signature |
| Sticky stacking cards | `Work.tsx` | Template signature |
| Magnetic button | `MagneticButton.tsx` | Dekorasi |
| Glyph `NPK`/`AIA` + lingkaran dekoratif | `Work.tsx` (`visuals[]`) | **Separuh area kartu case study kosong informasi**, padahal di situ seharusnya ada bukti |

**Arah perbaikan:** ikuti Phase 3 di `DESIGN-REVIEW-2026-09-16.md` §4 (arah
*Editorial Technical*). Pertahankan satu reveal sederhana dan theme toggle, lalu
buang sisanya. Lenis dan sebagian besar GSAP ikut bisa dihapus.

---

## 4. AI slop di copy 🟠

Sekitar **35 em-dash** di `content.ts` + `About.tsx`, ditambah frasa-frasa khas AI:

| Frasa | Lokasi | Pola |
| --- | --- | --- |
| "I build systems that don't break." | `heroLines` | Slogan generik |
| "Production hardening as a default, not an afterthought." | `skills[0].heading` | "X, not Y" |
| "Let's build something solid." | `Contact.tsx` | Slogan generik |
| "built with care, hardened by habit." | `site.footerNote` | Rima/aliterasi AI |
| "Leveling into AI engineering." | `Now.tsx` | Klise |
| "the unglamorous things that keep systems alive under load" | `About.tsx` | Klise |
| "Now bringing that same rigor to AI engineering" | `site.heroSubTail` | Klise |

**Tes sederhana:** kalau sebuah kalimat bisa dipindah ke portfolio developer lain
tanpa diubah, kalimat itu tidak bekerja untukmu.

Contoh arah yang spesifik:

> Overa Caesar. Full-stack developer, 7+ tahun. Sejak 2021 membangun sistem
> operasional terminal di Pelabuhan Tanjung Priok: container yard, cargo tally,
> audit internal, dan truck appointment.

Catatan kecil: Nov 2018 sampai sekarang hampir 8 tahun, jadi "7+" masih benar
tapi agak merendah.

---

## 5. AI slop di kode dan repo 🟡

Reviewer teknis biasanya membuka repo, dan yang terlihat di sana:

- **Komentar terlalu panjang dan berisi riwayat/ID audit.** Contohnya `(F25)` di
  `content.ts`, "That exact bug shipped on 2026-07-27" di `Loader.tsx`, dan komentar
  blok sekitar 15 baris di `Footer.tsx` yang panjang kodenya hanya 30 baris. Riwayat
  tempatnya di git log, bukan di komentar. Pola ini langsung terbaca sebagai tulisan AI.
- **Lima dokumen audit/review/handover untuk portfolio satu halaman**, sementara
  dua placeholder string belum diisi sekitar 2 bulan. Ini *auditing instead of shipping*.
  **Rekomendasi: jangan minta review baru, termasuk yang seperti dokumen ini, sampai
  bagian 6 selesai.**
- `package.json` `description` masih menyebut Framer Motion (HANDOVER F36).
- `experimental.viewTransition` masih ada padahal tidak dipakai (HANDOVER F37).

---

## 6. Yang masih kurang

| # | Kekurangan | Dampak |
| --- | --- | --- |
| 1 | **Belum live:** GitHub link 404, domain placeholder, belum ada git | Link belum bisa dikirim ke recruiter |
| 2 | **Nama asli tidak muncul** di mana pun, yang ada hanya "Overa" | Sulit dicocokkan dengan CV/LinkedIn |
| 3 | **Tidak ada CV** yang bisa diunduh | Recruiter butuh PDF untuk diteruskan |
| 4 | **Nol bukti visual** | Case study tidak bisa dibedakan dari karangan |
| 5 | **Pivot AI tanpa artefak.** Section "Now" isinya progress bar 30% | Bar 30% di bidang yang dilamar justru merugikan |
| 6 | **Tidak ada angka** di baris Impact | Klaim terbaca vague |
| 7 | **Role per project** tidak ditampilkan | Pertanyaan pertama HR tidak terjawab |

Untuk #4: kalau screenshot terhalang NDA, buat **diagram arsitektur per project**,
misalnya TAS: `Vue SPA → Laravel API → pessimistic lock + idempotency key → queue → PostgreSQL`.
Ini justru memamerkan cara berpikir backend.

Untuk #5: satu demo RAG kecil yang publik (misalnya tanya-jawab atas dokumen SOP
operasional pelabuhan, dengan repo dan write-up singkat) lebih kuat daripada seluruh
section Now. Sampai demo itu ada, kecilkan pesan pivot jadi satu kalimat.

Untuk #6: **jangan mengarang angka.** Kualitatif tapi benar lebih baik daripada
kuantitatif tapi palsu. Daftar angka yang dicari ada di `HANDOVER.md` → *Still blocked on real data*.

---

## 7. Urutan kerja

| # | Tindakan | Butuh input pemilik? | Estimasi |
| --- | --- | --- | --- |
| 1 | `git init` + commit pertama | Tidak | 5 menit |
| 2 | Hapus/tempelkan klaim di §2a; perbaiki "shipped", status MYTOS, Impact TAS (§2b) | Konfirmasi skill mana yang benar-benar pernah dipakai | 20 menit |
| 3 | Tambah field `role` dari catatan (§2c) | Tidak | 15 menit |
| 4 | Isi `site.github`, nama asli, deploy, lalu `site.url` | **Ya** | 30 menit |
| 5 | Tulis ulang copy hero, About, Contact, dan footer (§4) | Sebagian | 1 jam |
| 6 | Buang Loader, Cursor, Aurora, Grain, Marquee, tilt, magnetic, dan progress bar; kurangi kartu featured dari 6 ke 4 (TAS, AIA, MYTOS, Power BI) | Tidak | 2–3 jam |
| 7 | Route `/cv` dari `content.ts` + diagram arsitektur per project featured | Tidak | 3–4 jam |
| 8 | Rapikan komentar kode dan konsolidasi `docs/` (§5) | Tidak | 1 jam |
| 9 | Satu demo AI/RAG publik | Ya, project terpisah | Beberapa hari |

**Pertanyaan terbuka untuk pemilik (blok #2):** apakah outbox pattern,
cache-stampede prevention, optimistic locking, Pest/PHPUnit/TDD, dan Sanctum/JWT
pernah benar-benar dipakai di pekerjaan nyata? Kalau ya, di project mana?

---

## 8. Yang dipertahankan

Kualitas kode, aksesibilitas, penanganan reduced-motion, font self-hosted,
konten terpusat di `content.ts`, foto profil asli, dan light/dark theme dengan
kontras AA yang sudah diverifikasi. Semua perbaikan di atas menyentuh lapisan
konten dan dekorasi, bukan fondasinya.
