// ===============================
// 1. SETUP SUPABASE
// ===============================
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'

// JANGAN LUPA: Paste kode Key 'anon public' kamu di sini
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0' 

const sb = supabase.createClient(supabaseUrl, supabaseKey)

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
            console.log("Rating:", selectedRating);
        });
    });

    // --- SETUP TOMBOL KIRIM ---
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const textElement = document.getElementById('reviewText');
            const text = textElement ? textElement.value.trim() : '';

            // Validasi Input
            if (!text || selectedRating === 0) {
                alert('Isi bintang dan ulasan dulu ya!');
                return;
            }

            submitBtn.textContent = "Mengirim...";
            submitBtn.disabled = true;

            // KIRIM KE TABEL 'reviews' (Sesuai nama di Database kamu)
            const { error } = await sb
                .from('reviews') 
                .insert([{
                    rating: selectedRating,  // Nama kolom di DB: rating
                    review: text             // Nama kolom di DB: review
                }]);

            submitBtn.textContent = "Kirim Ulasan";
            submitBtn.disabled = false;

            if (error) {
                console.error("Gagal kirim:", error);
                alert('Gagal kirim: ' + error.message);
            } else {
                alert('Sukses! Terima kasih ulasannya.');
                // Reset Form
                document.getElementById('reviewText').value = '';
                selectedRating = 0;
                stars.forEach(s => s.classList.remove('active'));
                loadReviews(); // Refresh list
            }
        });
    }

    // Load ulasan saat pertama buka
    loadReviews();
});

// ===============================
// 3. FUNGSI LOAD ULASAN
// ===============================
async function loadReviews() {
    const list = document.getElementById('reviewList');
    if (!list) return;

    // AMBIL DATA DARI TABEL 'reviews'
    const { data, error } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false }); // Nama kolom: created_at

    if (!error && data) {
        list.innerHTML = '';
        data.forEach(r => {
            // Logic Bintang
            let starDisplay = '';
            // Perhatikan: kita pakai r.rating (bukan r.peringkat)
            for(let i=0; i<5; i++) {
                starDisplay += i < r.rating ? '★' : '☆';
            }
            
            // Perhatikan: kita pakai r.review (bukan r.tinjauan_teks)
            list.innerHTML += `
                <div style="border-bottom:1px solid #ddd; margin-bottom:10px; padding-bottom:10px;">
                    <div style="color:gold; font-size:1.2em;">${starDisplay}</div>
                    <p>${r.review}</p>
                    <small style="color:grey">${new Date(r.created_at).toLocaleDateString()}</small>
                </div>`;
        });
    }
}
