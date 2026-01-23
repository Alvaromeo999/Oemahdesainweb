// ===============================
// SUPABASE INIT
// ===============================
const supabaseUrl = 'https://XXXXX.supabase.co'
const supabaseKey = 'PUBLIC_ANON_KEY'
const sb = supabase.createClient(supabaseUrl, supabaseKey)

// ===============================
// RATING
// ===============================
let selectedRating = 0

document.querySelectorAll('.stars span').forEach((star, index) => {
  star.addEventListener('click', () => {
    selectedRating = index + 1
    document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'))
    for (let i = 0; i < selectedRating; i++) {
      document.querySelectorAll('.stars span')[i].classList.add('active')
    }
  })
})

// ===============================
// SUBMIT REVIEW FUNCTION
// ===============================
async function submitReview() {
  const text = document.getElementById('reviewText').value.trim()

  if (!text || selectedRating === 0) {
    alert('Isi rating & review dulu ya 🙂')
    return
  }

  const { error } = await sb
    .from('ulasan')
    .insert([{
      peringkat: selectedRating,
      tinjauan_teks: text
    }])

  if (error) {
    console.error(error)
    alert('Gagal kirim ulasan')
    return
  }

  document.getElementById('reviewText').value = ''
  selectedRating = 0
  document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'))

  loadReviews()
}

// ===============================
// LOAD REVIEWS
// ===============================
async function loadReviews() {
  const { data, error } = await sb
    .from('ulasan')
    .select('*')
    .order('dibuat_pada', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  const list = document.getElementById('reviewList')
  list.innerHTML = ''

  data.forEach(r => {
    list.innerHTML += `
      <p>
        ⭐ ${r.peringkat}/5<br>
        ${r.tinjauan_teks}
      </p>
      <hr>
    `
  })
}

// ===============================
// EVENT LISTENER TOMBOL
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submitBtn').addEventListener('click', submitReview)
  loadReviews()
})
