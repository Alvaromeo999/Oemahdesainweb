// ===============================
// 1. SETUP SUPABASE
// ===============================
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0' // <--- JANGAN LUPA ISI KEY LAGI

const sb = supabase.createClient(supabaseUrl, supabaseKey)
const ADMIN_SECRET = "OemahDesain2026";

// ===============================
// 2. LOGIKA UTAMA
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- FITUR RAHASIA: PELACAK PENGUNJUNG ---
    trackVisitor(); 

    // --- SETUP BINTANG ---
    let selectedRating = 0;
    const stars = document.querySelectorAll('.stars span');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < selectedRating; i++) stars[i].classList.add('active');
        });
    });

    // --- SETUP TOMBOL KIRIM ---
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const textElement = document.getElementById('reviewText');
            const botField = document.getElementById('botField');
            const text = textElement ? textElement.value.trim() : '';

            // Anti Spam
            if (botField && botField.value !== '') return; 

            if (!text || selectedRating === 0) {
                alert('Isi bintang dan ulasan dulu ya!');
                return;
            }

            submitBtn.textContent = "Mengirim...";
            submitBtn.disabled = true;

            const { error } = await sb.from('reviews').insert([{
                rating: selectedRating,
                review: text
            }]);

            submitBtn.textContent = "Kirim Ulasan";
            submitBtn.disabled = false;

            if (error) {
                alert('Gagal: ' + error.message);
            } else {
                alert('Terima kasih!');
                document.getElementById('reviewText').value = '';
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active'));
                loadReviews();
            }
        });
    }

    loadReviews();
});

// ===============================
// 3. FUNGSI PELACAK (MATA-MATA) 🕵️‍♂️
// ===============================
async function trackVisitor() {
    // Cek apakah pengunjung ini sudah direkam hari ini? (Agar database tidak penuh)
    const lastVisit = localStorage.getItem('tracked_date');
    const today = new Date().toDateString();

    if (lastVisit === today) return; // Jika sudah direkam hari ini, stop.

    try {
        // 1. Curi IP Address pake layanan gratis ipify
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIP = data.ip;
        const deviceInfo = navigator.userAgent; // Info Browser/HP

        // 2. Kirim ke Supabase tabel 'visitors' diam-diam
        await sb.from('visitors').insert([{
            ip_address: userIP,
            device_info: deviceInfo
        }]);

        // Tandai sudah direkam
        localStorage.setItem('tracked_date', today);
        console.log("Visitor tracked via IP."); 

    } catch (err) {
        console.log("Silent tracking error:", err); // Error diam, user tidak tahu
    }
}

// ===============================
// 4. FUNGSI LOAD ULASAN & ADMIN
// ===============================
async function loadReviews() {
    const list = document.getElementById('reviewList');
    const avgDisplay = document.getElementById('averageDisplay');
    if (!list) return;

    const { data, error } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (!error && data) {
        // Hitung Rata-rata
        let total = 0;
        data.forEach(r => total += r.rating);
        let avg = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        
        if(avgDisplay) avgDisplay.innerHTML = `⭐ ${avg} / 5.0 (${data.length} ulasan)`;

        // Render List
        list.innerHTML = '';
        data.forEach(r => {
            let stars = '';
            for(let i=0; i<5; i++) stars += i < r.rating ? '★' : '☆';
            
            // Tombol Hapus (Sampah)
            const delBtn = `<span onclick="hapusReview(${r.id})" style="cursor:pointer; float:right; opacity:0.2;">🗑️</span>`;

            list.innerHTML += `
                <div style="border-bottom:1px solid #eee; margin-bottom:10px; padding-bottom:10px;">
                    ${delBtn}
                    <div style="color:gold;">${stars}</div>
                    <p>"${r.review}"</p>
                    <small style="color:#ccc;">${new Date(r.created_at).toLocaleDateString()}</small>
                </div>`;
        });
    }
}

window.hapusReview = async function(id) {
    const pwd = prompt("Password Admin:");
    if (pwd === ADMIN_SECRET) {
        if(confirm("Hapus?")) {
            await sb.from('reviews').delete().eq('id', id);
            loadReviews();
        }
    }
}
