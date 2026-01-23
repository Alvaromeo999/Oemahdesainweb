// ===============================
// 1. KONFIGURASI SUPABASE (VERSI BROWSER)
// ===============================
// Masukkan URL dan Key Anon kamu langsung di sini (String)
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'
const supabaseKey = 'sb_publishable_gTmur1J62LkEE4nG8EE_pg_2YFwV7nf...' // <-- GANTI DENGAN KEY PANJANG DARI DASHBOARD

// Pastikan library supabase sudah dimuat di HTML (cek langkah 2 di bawah)
const sb = supabase.createClient(supabaseUrl, supabaseKey)

// ===============================
// 2. LOGIKA UTAMA (JALAN SETELAH WEBSITE LOAD)
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. LOGIKA RATING BINTANG ---
    let selectedRating = 0
    const stars = document.querySelectorAll('.stars span') // Pastikan class di HTML adalah "stars" dan isinya "span"
    
    if (stars.length === 0) {
        console.error("Elemen bintang tidak ditemukan! Cek class HTML-nya.")
    }

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1
            // Reset semua bintang jadi abu-abu/kosong
            stars.forEach(s => s.classList.remove('active'))
            // Warnai bintang sesuai urutan yang diklik
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('active')
            }
            console.log("Rating dipilih:", selectedRating) // Cek di konsol browser
        })
    })

    // --- B. LOGIKA KIRIM ULASAN ---
    const submitBtn = document.getElementById('submitBtn') // Pastikan ID tombol di HTML = "submitBtn"

    // Kita buat fungsinya di dalam sini agar rapi
    async function handleReviewSubmit() {
        const textElement = document.getElementById('reviewText') // Pastikan ID textarea = "reviewText"
        const text = textElement ? textElement.value.trim() : ''

        if (!text || selectedRating === 0) {
            alert('Mohon isi rating bintang & ulasan teks dulu ya 🙂')
            return
        }

        // Tampilkan loading (opsional)
        submitBtn.textContent = "Mengirim..."
        submitBtn.disabled = true

        const { error } = await sb
            .from('ulasan')
            .insert([{
                peringkat: selectedRating,
                tinjauan_teks: text
            }])

        // Kembalikan tombol
        submitBtn.textContent = "Kirim"
        submitBtn.disabled = false

        if (error) {
            console.error("Error upload:", error)
            alert('Gagal kirim ulasan: ' + error.message)
            return
        }

        // Reset Form jika sukses
        alert('Terima kasih ulasannya!')
        document.getElementById('reviewText').value = ''
        selectedRating = 0
        stars.forEach(s => s.classList.remove('active'))
        
        loadReviews() // Refresh list ulasan
    }

    // Pasang Event Listener ke Tombol
    if (submitBtn) {
        // Hapus "onclick" di HTML, kita pakai ini saja biar aman
        submitBtn.addEventListener('click', handleReviewSubmit)
    } else {
        console.error("Tombol dengan ID 'submitBtn' tidak ditemukan!")
    }

    // Load ulasan saat pertama buka
    loadReviews()
})

// ===============================
// 3. FUNGSI LOAD ULASAN
// ===============================
async function loadReviews() {
    const list = document.getElementById('reviewList') // Pastikan ID container list = "reviewList"
    if (!list) return

    const { data, error } = await sb
        .from('ulasan')
        .select('*')
        .order('dibuat_pada', { ascending: false })

    if (error) {
        console.error("Gagal ambil data:", error)
        return
    }

    list.innerHTML = ''
    data.forEach(r => {
        // Render bintang kuning sesuai jumlah rating
        let starDisplay = ''
        for(let i=0; i<5; i++) {
            starDisplay += i < r.peringkat ? '★' : '☆' 
        }

        list.innerHTML += `
            <div class="review-item" style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                <div style="color: gold; font-size: 1.2rem;">${starDisplay}</div>
                <p>${r.tinjauan_teks}</p>
                <small style="color: grey;">${new Date(r.dibuat_pada).toLocaleDateString()}</small>
            </div>
        `
    })
}
