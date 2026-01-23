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
// SUBMIT REVIEW
// =====================

// expose function ke global supaya bisa dipanggil dari HTML
window.submitReview = submitReview
