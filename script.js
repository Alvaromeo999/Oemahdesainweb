let selectedRating = 0;

// Rating
document.querySelectorAll('.stars span').forEach(star => {
  star.addEventListener('click', function () {
    selectedRating = this.dataset.value;
    document.querySelectorAll('.stars span').forEach(s => s.classList.remove('active'));
    for (let i = 0; i < selectedRating; i++) {
      document.querySelectorAll('.stars span')[i].classList.add('active');
    }
  });
});

// Review
function submitReview() {
  const text = document.getElementById('reviewText').value;
  if (!text || selectedRating == 0) {
    alert('Isi rating & review dulu ya 🙂');
    return;
  }

  document.getElementById('reviewList').innerHTML += `
    <p>⭐ ${selectedRating}/5<br>${text}</p><hr>
  `;
  document.getElementById('reviewText').value = '';
}

// Visitor counter
let count = localStorage.getItem('visitorCount') || 0;
count++;
localStorage.setItem('visitorCount', count);
document.getElementById('reviewText').placeholder =
  "Terima kasih! Ulasan Anda berhasil dikirim 😊";

const { error } = await supabase
  .from('reviews')
  .insert([{
    name: name,
    rating: rating,
    comment: comment
  }])

if (error) {
  console.error('Insert error:', error.message)
  alert(error.message)
}


                        
