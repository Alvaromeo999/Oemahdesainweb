// ==========================================
// 1. SETUP SUPABASE & CONFIG
// ==========================================
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co';

// Key Anon Public Anda
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0';

const sb = supabase.createClient(supabaseUrl, supabaseKey);

// 🔐 PASSWORD HAPUS ULASAN (Sudah diset ke admin123)
const ADMIN_SECRET = "admin123"; 

// ==========================================
// 2. LOGIKA UTAMA WEBSITE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. JALANKAN PELACAK & LOAD DATA ---
    trackVisitor();
    countVisitors();
    loadReviews();

    // --- B. LOGIKA RATING BINTANG ---
    let selectedRating = 0;
    const stars = document.querySelectorAll('.stars span');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach(s => s.style.color = '#ccc'); // Reset warna
            for(let i=0; i<selectedRating; i++) stars[i].style.color = '#f39c12'; // Warna emas
        });
    });

    // --- C. LOGIKA TOMBOL KIRIM ULASAN ---
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const text = document.getElementById('reviewText').value.trim();
            const bot = document.getElementById('botField').value; 

            if(bot !== '') return; // Anti Spam Bot
            
            if(!text || selectedRating === 0) {
                alert("Mohon isi bintang & ulasan dulu ya 🙏");
                return;
            }

            // Ubah tombol jadi loading
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Mengirim...";
            submitBtn.disabled = true;

            // Kirim ke Supabase
            const { error } = await sb.from('reviews').insert([{
                rating: selectedRating,
                review: text
            }]);

            // Kembalikan tombol
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;

            if(error) {
                console.error("Error:", error);
                alert("Gagal kirim ulasan. Cek koneksi internet.");
            } else {
                alert("Terima kasih! Ulasan berhasil dikirim.");
                document.getElementById('reviewText').value = '';
                // Reset Bintang
                selectedRating = 0;
                stars.forEach(s => s.style.color = '#ccc');
                // Refresh Daftar Ulasan
                loadReviews(); 
            }
        });
    }

    // --- D. LOGIKA FAQ (TANYA JAWAB) ---
    const faqs = document.querySelectorAll('details');
    faqs.forEach((targetDetail) => {
        targetDetail.addEventListener("click", () => {
            faqs.forEach((detail) => {
                if (detail !== targetDetail) {
                    detail.removeAttribute("open");
                }
            });
        });
    });
});

// ==========================================
// 3. FUNGSI-FUNGSI PENDUKUNG
// ==========================================

// --- FUNGSI LOAD ULASAN DARI SUPABASE ---
async function loadReviews() {
    const list = document.getElementById('reviewList');
    const avg = document.getElementById('averageDisplay');
    
    // Ambil data dari tabel 'reviews', urutkan dari terbaru
    const { data, error } = await sb.from('reviews').select('*').order('created_at', { ascending: false });

    if(data && list) {
        let total = 0;
        data.forEach(r => total += r.rating);
        
        // Hitung Rata-rata
        let average = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        if(avg) avg.innerText = `Rata-rata Rating: ⭐ ${average} / 5.0`;

        list.innerHTML = ''; // Kosongkan list sebelum isi ulang
        
        // Render setiap ulasan
        data.forEach(r => {
            let starHtml = '';
            for(let i=0; i<5; i++) {
                starHtml += i < r.rating ? '<span style="color:#f39c12">★</span>' : '<span style="color:#ccc">★</span>';
            }

            // Format tanggal
            const tanggal = new Date(r.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});

            list.innerHTML += `
                <div style="border-bottom:1px solid #eee; margin-bottom:15px; padding-bottom:10px; text-align: left; position: relative;">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>Pengunjung</strong>
                        <small style="color:#999">${tanggal}</small>
                    </div>
                    <div style="font-size:1.2rem;">${starHtml}</div>
                    <p style="margin-top:5px; color:#555;">"${r.review}"</p>
                    
                    <span onclick="hapusReview(${r.id})" 
                          style="position:absolute; right:0; bottom:5px; cursor:pointer; opacity:0.3; font-size:1rem;" 
                          title="Hapus Ulasan Ini">
                          🗑️
                    </span>
                </div>
            `;
        });
    }
}

// --- FUNGSI MATA-MATA (IP TRACKER) ---
async function trackVisitor() {
    // Cek apakah sudah pernah track sesi ini (biar ga spam database saat refresh)
    if(sessionStorage.getItem('tracked')) return;

    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const json = await res.json();
        
        // Kirim ke tabel 'visitors'
        await sb.from('visitors').insert([{ 
            ip_address: json.ip, 
            device_info: navigator.userAgent 
        }]);
        
        sessionStorage.setItem('tracked', 'true'); // Tandai sudah dilacak
    } catch(e) { console.log("Tracking skip"); }
}

// --- FUNGSI HITUNG TOTAL PENGUNJUNG ---
async function countVisitors() {
    const el = document.getElementById('visitorCount');
    if(el) {
        // Hitung jumlah baris di tabel 'visitors'
        const { count } = await sb.from('visitors').select('*', { count: 'exact', head: true });
        if(count !== null) el.innerText = count + " Orang";
    }
}

// --- FUNGSI ADMIN (HAPUS DATA) ---
// Harus pakai 'window.' agar bisa dipanggil dari HTML onclick
window.hapusReview = async function(id) {
    // 1. Minta Password
    const pwd = prompt("⚠️ ADMIN AREA ⚠️\nMasukkan Password untuk menghapus:");
    
    // 2. Cek Password
    if(pwd === ADMIN_SECRET) {
        if(confirm("Yakin ingin menghapus ulasan ini permanen?")) {
            // Hapus dari Supabase
            const { error } = await sb.from('reviews').delete().eq('id', id);
            
            if(!error) {
                alert("✅ Data berhasil dihapus.");
                loadReviews(); // Refresh tampilan otomatis
            } else {
                alert("Gagal menghapus: " + error.message);
            }
        }
    } else if(pwd !== null) { 
        alert("❌ Password Salah! Akses Ditolak."); 
    }
}
