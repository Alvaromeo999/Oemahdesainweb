// ==========================================
// 1. SETUP SUPABASE
// ==========================================
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'

// ⚠️ PASTE API KEY "ANON PUBLIC" DI SINI
const supabaseKey = 'PASTE_KODE_ANON_PUBLIC_DISINI' 

const sb = supabase.createClient(supabaseUrl, supabaseKey)
const ADMIN_SECRET = "12345"; 

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
            stars.forEach(s => s.classList.remove('active'));
            for(let i=0; i<selectedRating; i++) stars[i].classList.add('active');
        });
    });

    // --- C. LOGIKA TOMBOL KIRIM ULASAN ---
    const submitBtn = document.getElementById('submitBtn');
    if(submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const text = document.getElementById('reviewText').value.trim();
            const bot = document.getElementById('botField').value; 

            if(bot !== '') return; // Anti Spam
            if(!text || selectedRating === 0) {
                alert("Mohon isi bintang & ulasan dulu ya 🙏");
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

            if(error) {
                alert("Gagal kirim: " + error.message);
            } else {
                alert("Terima kasih! Ulasan berhasil dikirim.");
                document.getElementById('reviewText').value = '';
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active'));
                loadReviews(); 
            }
        });
    }

    // --- D. LOGIKA FAQ (TANYA JAWAB) ---
    const faqs = document.querySelectorAll('.faq-item');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            faq.classList.toggle('active');
        });
    });
});

// ==========================================
// 3. FUNGSI-FUNGSI PENDUKUNG
// ==========================================

// --- FUNGSI TOGGLE KATALOG ---
function toggleCatalog() {
    var hiddenDiv = document.getElementById("catalog-hidden");
    var btn = document.getElementById("toggleBtn");
    
    if (hiddenDiv.style.display === "none" || hiddenDiv.style.display === "") {
        hiddenDiv.style.display = "block";
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Tutup Katalog';
    } else {
        hiddenDiv.style.display = "none";
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Lihat Semua Pilihan Desain';
        btn.scrollIntoView({behavior: "smooth", block: "center"});
    }
}

// --- FUNGSI LOAD ULASAN ---
async function loadReviews() {
    const list = document.getElementById('reviewList');
    const avg = document.getElementById('averageDisplay');
    
    const { data, error } = await sb.from('reviews').select('*').order('created_at', { ascending: false });

    if(data && list) {
        let total = 0;
        data.forEach(r => total += r.rating);
        let average = data.length > 0 ? (total / data.length).toFixed(1) : 0;
        if(avg) avg.innerText = `⭐ ${average} / 5.0`;

        list.innerHTML = '';
        data.forEach(r => {
            let stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            list.innerHTML += `
                <div style="border-bottom:1px solid #eee; margin-bottom:15px; padding-bottom:10px;">
                    <span onclick="hapusReview(${r.id})" style="float:right; cursor:pointer; opacity:0.3;">🗑️</span>
                    <div style="color:#f39c12; font-size:1.2rem;">${stars}</div>
                    <p>"${r.review}"</p>
                    <small style="color:#ccc">${new Date(r.created_at).toLocaleDateString()}</small>
                </div>
            `;
        });
    }
}

// --- FUNGSI MATA-MATA ---
async function trackVisitor() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const json = await res.json();
        await sb.from('visitors').insert([{ ip_address: json.ip, device_info: navigator.userAgent }]);
    } catch(e) { console.log("Tracking error"); }
}

async function countVisitors() {
    const el = document.getElementById('visitorCount');
    if(el) {
        const { count } = await sb.from('visitors').select('*', { count: 'exact', head: true });
        if(count) el.innerText = count + " Orang";
    }
}

// --- FUNGSI ADMIN ---
window.hapusReview = async function(id) {
    const pwd = prompt("Oemahdesainweb2026:");
    if(pwd === ADMIN_SECRET) {
        if(confirm("Yakin hapus?")) {
            await sb.from('reviews').delete().eq('id', id);
            loadReviews();
        }
    } else if(pwd) { alert("Password Salah!"); }
}
