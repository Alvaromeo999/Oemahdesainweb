// ===============================
// 1. SETUP SUPABASE
// ===============================
// Hati-hati: Gunakan tanda sama dengan (=) dan tanda petik ('...')
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'
// GANTI TEXT DI BAWAH DENGAN KODE "ANON PUBLIC" PANJANG DARI DASHBOARD
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0' 

// Inisialisasi Client
const sb = supabase.createClient(supabaseUrl, supabaseKey)

// ===============================
// 2. LOGIKA UTAMA (Jalan setelah website selesai loading)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SETUP BINTANG ---
    let selectedRating = 0;
    const stars = document.querySelectorAll('.stars span');
    
    if (stars.length === 0) {
        console.error("Error: Elemen bintang tidak ditemukan di HTML");
    }

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            // Reset warna semua bintang
            stars.forEach(s => s.classList.remove('active'));
            // Warnai bintang yang dipilih
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('active');
            }
            console.log("Rating dipilih:", selectedRating);
        });
    });

    // --- SETUP TOMBOL KIRIM ---
    const submitBtn = document.getElementById('submitBtn');

    if (!submitBtn) {
        console.error("Error: Tombol dengan id 'submitBtn' tidak ditemukan");
        return; // Stop jika tombol tidak ada
    }

    // Fungsi saat tombol diklik
    submitBtn.addEventListener('click', async () => {
        console.log("Tombol ditekan..."); // Cek debug

        const textElement = document.getElementById('reviewText');
        const text = textElement ? textElement.value.trim() : '';

        // Validasi Input
        if (!text || selectedRating === 0) {
            alert('Mohon isi rating bintang & ulasan teks dulu ya 🙂');
            return;
        }

        // Ubah tombol jadi loading
        submitBtn.textContent = "Mengirim...";
        submitBtn.disabled = true;

        // Kirim ke Supabase
        const { error } = await sb
            .from('ulasan')
            .insert([{
                peringkat: selectedRating,
                tinjauan_teks: text
            }]);

        // Kembalikan tombol
        submitBtn.textContent = "Kirim Ulasan";
        submitBtn.disabled = false;

        // Cek Hasil
        if (error) {
            console.error("Gagal kirim:", error);
            alert('Gagal kirim ulasan. Cek konsol untuk detail.');
        } else {
            alert('Terima kasih! Ulasan berhasil dikirim.');
            // Reset Form
            document.getElementById('reviewText').value = '';
            selectedRating = 0;
            stars.forEach(s => s.classList.remove('active'));
            
            // Reload list ulasan (jika ada fungsinya)
            if (typeof loadReviews === 'function') {
                loadReviews();
            }
        }
    });

    // Panggil fungsi load ulasan di awal (jika ada)
    if (typeof loadReviews === 'function') {
        loadReviews();
    }
});

// ===============================
// 3. FUNGSI LOAD ULASAN (Agar tampil di bawah)
// ===============================
async function loadReviews() {
    const list = document.getElementById('reviewList');
    if (!list) return;

    const { data, error } = await sb
        .from('ulasan')
        .select('*')
        .order('dibuat_pada', { ascending: false });

    if (!error && data) {
        list.innerHTML = '';
        data.forEach(r => {
            let starDisplay = '';
            for(let i=0; i<5; i++) {
                starDisplay += i < r.peringkat ? '★' : '☆';
            }
            list.innerHTML += `
                <div style="border-bottom:1px solid #ddd; margin-bottom:10px; padding-bottom:10px;">
                    <div style="color:gold; font-size:1.2em;">${starDisplay}</div>
                    <p>${r.tinjauan_teks}</p>
                </div>`;
        });
    }
}
