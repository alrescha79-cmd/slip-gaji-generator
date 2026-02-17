# IT Payslip Generator 🇮🇩

Aplikasi web modern untuk manajemen dan pembuatan slip gaji karyawan yang dioptimalkan untuk industri IT di Indonesia. Aplikasi ini memungkinkan Anda untuk menginput detail perusahaan, data karyawan, kehadiran, dan komponen gaji untuk menghasilkan slip gaji PDF profesional yang siap cetak.

## ✨ Fitur Utama

- **Live Preview**: Lihat perubahan slip gaji secara langsung saat Anda menginput data.
- **Perhitungan Otomatis**:
  - **Pajak (PPh 21)**: Menggunakan skema TER (Tarif Efektif Rata-rata) terbaru 2024.
  - **BPJS**: Perhitungan otomatis BPJS Kesehatan dan Ketenagakerjaan (JKK, JKM, JHT, JP).
  - **Lembur**: Perhitungan otomatis berdasarkan gaji pokok atau tarif kustom per jam.
  - **Kehadiran**: Kalkulasi otomatis hari hadir berdasarkan data ketidakhadiran (sakit, izin, cuti, alpha).
- **Ekspor PDF Berkualitas**:
  - Ukuran file yang dioptimalkan (< 1MB).
  - Margin 2.5 cm (rata) untuk kompatibilitas printer standar.
  - Watermark perusahaan otomatis untuk keamanan.
  - Pesan kerahasiaan dokumen otomatis.
- **Modern UI**: Antarmuka bersih dengan tema gelap/terang (Slip gaji otomatis dipaksa tema terang untuk konsistensi PDF).
- **Keamanan Data**: Semua proses dilakukan di sisi klien (browser). Tidak ada data gaji sensitif yang dikirim ke server.

## 🚀 Teknologi

- [SvelteKit](https://kit.svelte.dev/) - Framework web modern.
- [Tailwind CSS](https://tailwindcss.com/) & [daisyUI](https://daisyui.com/) - Untuk desain UI yang responsif dan premium.
- [html-to-image](https://github.com/bubkoo/html-to-image) - Konversi visual slip gaji ke gambar.
- [jsPDF](https://github.com/parallax/jsPDF) - Pembuatan dokumen PDF.
- [Bun](https://bun.sh/) - JavaScript runtime & package manager.

## 🛠️ Instalasi

Pastikan Anda sudah menginstal [Bun](https://bun.sh/).

1. Klon repositori:
   ```bash
   git clone <repository-url>
   cd slip-gaji
   ```

2. Instal dependensi:
   ```bash
   bun install
   ```

3. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   bun run dev
   ```

4. Buka browser dan akses `http://localhost:5173`.

## 🏗️ Build untuk Produksi

Untuk membuat versi produksi yang dioptimalkan:

```bash
bun run build
```

Anda bisa menjalankan versi build dengan:
```bash
bun run preview
```

## 📝 Catatan Penggunaan

- **ID Karyawan**: Secara otomatis menyarankan tahun berdasarkan tanggal bergabung (Join Date).
- **Watermark**: Diambil dari nama perusahaan yang dimasukkan di form.
- **Kerahasiaan**: Dokumen secara otomatis mencantumkan label "SANGAT RAHASIA" di bagian bawah.

## ⚖️ Lisensi

Proyek ini dibuat untuk keperluan internal/demonstrasi.

---
