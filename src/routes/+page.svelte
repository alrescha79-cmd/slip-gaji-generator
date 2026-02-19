<script lang="ts">
    import { onMount } from "svelte";

    let mounted = false;
    onMount(() => {
        mounted = true;
    });
</script>

<svelte:head>
    <title
        >Payslip Generator Indonesia - Buat Slip Gaji Profesional Instan</title
    >
    <meta
        name="description"
        content="Alat pembuat slip gaji online terbaik di Indonesia. Otomatis hitung PPh 21, BPJS, dan format PDF standar industri. Gratis & Tanpa Daftar!"
    />
    <meta
        name="keywords"
        content="slip gaji online, buat slip gaji, aplikasi payroll, pph 21 2024, hitung gaji bersih"
    />
</svelte:head>

<div class="min-h-screen bg-base-100 font-sans text-base-content">
    <!-- Navbar -->
    <div
        class="navbar bg-base-100/90 backdrop-blur fixed top-0 z-50 px-4 md:px-8 border-b border-base-200"
    >
        <div class="navbar-start">
            <div
                class="flex items-center gap-2 text-primary font-black text-xl tracking-tighter uppercase"
            >
                <div
                    class="bg-primary text-primary-content p-1.5 rounded-lg shadow-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                        /><polyline points="14 2 14 8 20 8" /><line
                            x1="16"
                            y1="13"
                            x2="8"
                            y2="13"
                        /><line x1="16" y1="17" x2="8" y2="17" /><line
                            x1="10"
                            y1="9"
                            x2="8"
                            y2="9"
                        /></svg
                    >
                </div>
                Payslip Generator
            </div>
        </div>
        <div class="navbar-end">
            <a
                href="/generate"
                class="btn btn-primary btn-sm md:btn-md font-bold"
                >Mulai Sekarang</a
            >
        </div>
    </div>

    <!-- Hero Section -->
    <div class="hero min-h-screen pt-16">
        <div class="hero-content text-center px-4 max-w-4xl">
            <div class="max-w-3xl">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20"
                >
                    <span class="badge badge-primary badge-xs">New</span> Perhitungan
                    PPh 21 TER 2024
                </div>
                <h1
                    class="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary"
                >
                    Buat Slip Gaji Profesional dalam Hitungan Detik
                </h1>
                <p
                    class="py-6 text-xl text-base-content/70 md:px-12 leading-relaxed"
                >
                    Lupakan Excel yang rumit. Generator slip gaji otomatis kami
                    menghitung pajak, BPJS, dan menyusun format PDF standar
                    industri secara instan.
                </p>
                <div
                    class="flex flex-col sm:flex-row gap-4 justify-center mt-4"
                >
                    <a
                        href="/generate"
                        class="btn btn-primary btn-lg font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform"
                    >
                        Buat Slip Gaji Gratis
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="ml-1"
                            ><path d="M5 12h14" /><path
                                d="m12 5 7 7-7 7"
                            /></svg
                        >
                    </a>
                </div>

                <div class="mt-12 opacity-60 text-sm font-mono">
                    <span class="mx-2">✓ Tidak Perlu Login</span>
                    <span class="mx-2">✓ Data Aman di Browser</span>
                    <span class="mx-2">✓ 100% Gratis</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="py-24 bg-base-200 px-4 md:px-8">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">
                Kenapa Ribuan HR Menggunakan Alat Ini?
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body">
                        <div
                            class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path d="m12 14 7-7" /><path
                                    d="M12 14l-7-7"
                                /><path d="M12 14v10" /><path
                                    d="M3.4 9a6.6 6.6 0 0 1 11.2-4.4"
                                /><path d="m20.6 9-3.6 3.6" /><path
                                    d="M17 9v3h3"
                                /></svg
                            >
                        </div>
                        <h3 class="card-title text-xl mb-2">
                            Format PDF Standar
                        </h3>
                        <p class="text-base-content/70">
                            Mendukung format kertas A4, F4, dan Legal dengan
                            margin presisi 20mm. Siap cetak dan profesional.
                        </p>
                    </div>
                </div>

                <!-- Feature 2 -->
                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body">
                        <div
                            class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-4 p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><path d="M12 2v20" /><path
                                    d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                /></svg
                            >
                        </div>
                        <h3 class="card-title text-xl mb-2">Hitung Otomatis</h3>
                        <p class="text-base-content/70">
                            Kalkulasi Gaji Bersih (Take Home Pay) otomatis dari
                            komponen gaji pokok, tunjangan, dan potongan.
                        </p>
                    </div>
                </div>

                <!-- Feature 3 -->
                <div class="card bg-base-100 shadow-xl border border-base-300">
                    <div class="card-body">
                        <div
                            class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                ><rect
                                    width="18"
                                    height="18"
                                    x="3"
                                    y="3"
                                    rx="2"
                                    ry="2"
                                /><line x1="12" x2="12" y1="3" y2="21" /><line
                                    x1="3"
                                    x2="21"
                                    y1="12"
                                    y2="12"
                                /></svg
                            >
                        </div>
                        <h3 class="card-title text-xl mb-2">
                            Multi-Halaman Cerdas
                        </h3>
                        <p class="text-base-content/70">
                            Konten panjang otomatis dipecah ke halaman baru
                            tanpa terpotong, dengan penempatan footer yang rapi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-24 px-4 text-center">
        <div class="max-w-3xl mx-auto">
            <h2 class="text-3xl md:text-5xl font-black mb-8">
                Siap Membuat Slip Gaji Pertamamu?
            </h2>
            <p class="text-xl opacity-70 mb-10">
                Tanpa biaya langganan, tanpa instalasi. Cukup buka browser dan
                mulai.
            </p>
            <a
                href="/generate"
                class="btn btn-primary btn-lg font-bold shadow-xl"
            >
                Mulai Sekarang - Gratis
            </a>
        </div>
    </div>

    <!-- Footer -->
    <footer
        class="footer footer-center p-10 bg-base-200 text-base-content rounded"
    >
        <div>
            <div
                class="flex items-center gap-2 text-primary font-bold text-xl uppercase tracking-tighter mb-2"
            >
                Payslip Generator
            </div>
            <p>Copyright © 2024 - All right reserved</p>
        </div>
    </footer>
</div>
