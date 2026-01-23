// ===============================
// SUPABASE INIT
// ===============================
const supabaseUrl = 'https://XXXXX.supabase.co'
const supabaseKey = 'PUBLIC_ANON_KEY'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

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
// SUBMIT REVIEW
// ===============================
async function submitReview() {
  const text = document.getElementById('reviewText').value.trim()

  if (!text || selectedRating === 0) {
    alert('Isi rating & review dulu ya 🙂')
    return
  }

  const { error } = await supabase
    .from('reviews')
    .insert([{
      rating: selectedRating,
      comment: text
    }])

  if (error) {
    console.error(error)
    alert('Gagal kirim ulasan')
    return
  }

  document.getElementById('reviewText').value = ''
  selectedRating = 0
  loadReviews()
}

// ===============================
// LOAD REVIEWS
// ===============================
async function loadReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return

  const list = document.getElementById('reviewList')
  list.innerHTML = ''

  data.forEach(r => {
    list.innerHTML += `
      <p>⭐ ${r.rating}/5<br>${r.comment}</p><hr>
    `
  })
}

loadReviews()
