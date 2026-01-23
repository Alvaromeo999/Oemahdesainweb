// ===============================
// 1. SETUP SUPABASE
// ===============================
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'
// Masukkan Key Anon Public kamu lagi di sini
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0' 

const sb = supabase.createClient(supabaseUrl, supabaseKey)

// Password Admin Sederhana (Ganti sesukamu)
const ADMIN_SECRET = "090524"; 

// ===============================
// 2. LOGIKA UTAMA
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SETUP BINTANG ---
    let selectedRating = 0;
    const stars = document.querySelectorAll('.stars span');

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('active');
            }
        });
    });

    // --- SETUP TOMBOL KIRIM ---
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const textElement = document.getElementById('reviewText');
            const botField = document.getElementById('botField'); // Honeypot
            const text = textElement ? textElement.value.trim() : '';

            // --- FITUR 2: ANTI SPAM (Honeypot & Rate Limit) ---
            // 1. Cek Honeypot (Jika terisi, berarti Bot)
            if (botField && botField.value !== '') {
                console.log("Bot terdeteksi!"); return; 
            }
            // 2. Cek LocalStorage (Batas 1 menit per user)
            const lastSubmit = localStorage.getItem('lastReviewTime');
            if (lastSubmit && (new Date() - new Date(lastSubmit)) < 60000) {
                alert('Tunggu 1 menit sebelum mengirim ulasan lagi ya! ⏳');
                return;
            }

            // Validasi Input
            if (!text || selectedRating === 0) {
                alert('Mohon isi bintang dan ulasan dulu.');
                return;
            }

            submitBtn.textContent = "Mengirim...";
            submitBtn.disabled = true;

            // Kirim ke Supabase
            const { error } = await sb
                .from('reviews')
                .insert([{
                    rating: selectedRating,
                    review: text
                }]);

            submitBtn.textContent = "Kirim Ulasan";
            submitBtn.disabled = false;

            if (error) {
                alert('Gagal kirim: ' + error.message);
            } else {
                alert('Terima kasih! Ulasan berhasil dikirim.');
                
                // Simpan waktu kirim agar kena limit spam
                localStorage.setItem('lastReviewTime', new Date());

                // Reset Form
                document.getElementById('reviewText').value = '';
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active'));
                
                loadReviews(); // Refresh data
            }
        });
    }

    // Load data pertama kali
    loadReviews();
});

// ===============================
// 3. FUNGSI LOAD & UPDATE SEO
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
        // --- FITUR 1: HITUNG RATA-RATA ---
        let totalRating = 0;
        data.forEach(r => totalRating += r.rating);
        
        // Hitung (jika data 0, rata-rata 0)
        let average = data.length > 0 ? (totalRating / data.length).toFixed(1) : 0;
        
        // Tampilkan Rata-rata di HTML
        if(avgDisplay) {
            avgDisplay.innerHTML = `
                <span style="color:gold; font-size:1.5rem">★</span> 
                ${average} / 5.0 
                <small style="color:grey; font-weight:normal">(${data.length} ulasan)</small>
            `;
        }

        // --- FITUR 3: UPDATE SEO (RICH SNIPPET) ---
        updateSEOSchema(average, data.length);

        // --- RENDER LIST ULASAN ---
        list.innerHTML = '';
        data.forEach(r => {
            let starDisplay = '';
            for(let i=0; i<5; i++) starDisplay += i < r.rating ? '★' : '☆';
            
            // Tombol Hapus (Fitur 4)
            // Kita pasang event onclick langsung di sini
            const deleteBtn = `<button onclick="hapusReview(${r.id})" style="border:none; background:none; cursor:pointer; float:right; opacity:0.3;">🗑️</button>`;

            list.innerHTML += `
                <div style="border-bottom:1px solid #eee; margin-bottom:15px; padding-bottom:10px;">
                    ${deleteBtn}
                    <div style="color:gold; margin-bottom:5px;">${starDisplay}</div>
                    <p style="margin:5px 0; font-style:italic">"${r.review}"</p>
                    <small style="color:#ccc; font-size:0.8rem">${new Date(r.created_at).toLocaleDateString()}</small>
                </div>`;
        });
    }
}

// ===============================
// 4. FUNGSI TAMBAHAN (SEO & ADMIN)
// ===============================

// Update Google Rich Snippet (JSON-LD)
function updateSEOSchema(ratingVal, reviewCount) {
    // Hapus script lama jika ada
    const oldScript = document.getElementById('json-ld-reviews');
    if (oldScript) oldScript.remove();

    if (reviewCount > 0) {
        const script = document.createElement('script');
        script.id = 'json-ld-reviews';
        script.type = 'application/ld+json';
        script.text = JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product", // Atau 'LocalBusiness' / 'Service'
            "name": "Jasa Desain Web", // Ganti dengan nama produkmu
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": ratingVal,
                "reviewCount": reviewCount
            }
        });
        document.head.appendChild(script);
    }
}

// Fitur Admin: Hapus Review
// Dibuat global (window.) agar bisa dipanggil dari HTML string
window.hapusReview = async function(id) {
    const password = prompt("⚠️ ADMIN AREA\nMasukkan kode rahasia untuk menghapus:");
    
    if (password === ADMIN_SECRET) {
        if(confirm("Yakin hapus permanen?")) {
            const { error } = await sb.from('reviews').delete().eq('id', id);
            if(error) {
                alert("Gagal hapus: " + error.message);
            } else {
                alert("Terhapus!");
                loadReviews(); // Refresh
            }
        }
    } else if (password !== null) {
        alert("Password salah!");
    }
}
