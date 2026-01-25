(() => {
  'use strict';

  /* =========================
     CONFIG
  ========================= */
  const CONFIG = {
    supabaseUrl: 'https://tosjjicxibibuxpskpjz.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0', // tetap anon
    adminPromptText: '⚠️ ADMIN AREA ⚠️\nMasukkan Password:'
  };

  const sb = supabase.createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabaseKey
  );

  /* =========================
     STATE
  ========================= */
  const state = {
    rating: 0
  };

  /* =========================
     INIT
  ========================= */
  document.addEventListener('DOMContentLoaded', () => {
    Visitor.track();
    Visitor.count();
    Review.init();
    Review.load();
    UI.initFAQ();
  });

  /* =========================
     REVIEW MODULE
  ========================= */
  const Review = {
    init() {
      const stars = document.querySelectorAll('.stars span');
      const btn = document.getElementById('submitBtn');

      stars.forEach((star, i) => {
        star.addEventListener('click', () => {
          state.rating = i + 1;
          UI.renderStars(stars, state.rating);
        });
      });

      if (btn) {
        btn.addEventListener('click', Review.submit);
      }
    },

    async submit() {
      const text = document.getElementById('reviewText').value.trim();
      const bot = document.getElementById('botField').value;
      if (bot !== '') return;

      if (!text || state.rating === 0) {
        alert('Mohon isi rating & ulasan 🙏');
        return;
      }

      UI.setLoading(true);

      const { error } = await sb.from('reviews').insert({
        rating: state.rating,
        review: text
      });

      UI.setLoading(false);

      if (error) {
        alert('Gagal kirim ulasan.');
        console.error(error);
        return;
      }

      alert('Terima kasih atas ulasannya 🙏');
      state.rating = 0;
      document.getElementById('reviewText').value = '';
      UI.renderStars(document.querySelectorAll('.stars span'), 0);
      Review.load();
    },

    async load() {
      const list = document.getElementById('reviewList');
      const avgEl = document.getElementById('averageDisplay');

      const { data } = await sb
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!data || !list) return;

      list.innerHTML = '';
      let total = 0;

      data.forEach(r => {
        total += r.rating;
        list.appendChild(UI.reviewItem(r));
      });

      const avg = data.length ? (total / data.length).toFixed(1) : 0;
      if (avgEl) avgEl.textContent = `Rata-rata Rating: ⭐ ${avg} / 5.0`;
    },

    async delete(id) {
      const pwd = prompt(CONFIG.adminPromptText);
      if (!pwd) return;

      // ⚠️ masih client-side, tapi kita rapikan
      if (pwd !== 'admin123') {
        alert('Password salah');
        return;
      }

      if (!confirm('Hapus ulasan ini?')) return;

      const { error } = await sb.from('reviews').delete().eq('id', id);
      if (!error) Review.load();
    }
  };

  /* =========================
     VISITOR MODULE
  ========================= */
  const Visitor = {
    async track() {
      if (sessionStorage.getItem('tracked')) return;

      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const { ip } = await res.json();

        await sb.from('visitors').insert({
          ip_address: ip,
          device_info: navigator.userAgent
        });

        sessionStorage.setItem('tracked', '1');
      } catch {
        console.log('Visitor tracking skipped');
      }
    },

    async count() {
      const el = document.getElementById('visitorCount');
      if (!el) return;

      const { count } = await sb
        .from('visitors')
        .select('*', { count: 'exact', head: true });

      if (count !== null) el.textContent = `${count} Orang`;
    }
  };

  /* =========================
     UI MODULE
  ========================= */
  const UI = {
    renderStars(stars, active) {
      stars.forEach((s, i) => {
        s.style.color = i < active ? '#f39c12' : '#ccc';
      });
    },

    setLoading(isLoading) {
      const btn = document.getElementById('submitBtn');
      if (!btn) return;
      btn.disabled = isLoading;
      btn.textContent = isLoading ? 'Mengirim...' : 'Kirim Ulasan';
    },

    reviewItem(r) {
      const div = document.createElement('div');
      div.className = 'review-item';

      const stars = '★★★★★'
        .split('')
        .map((_, i) =>
          `<span style="color:${i < r.rating ? '#f39c12' : '#ccc'}">★</span>`
        )
        .join('');

      const date = new Date(r.created_at).toLocaleDateString('id-ID');

      div.innerHTML = `
        <strong>Pengunjung</strong>
        <small>${date}</small>
        <div>${stars}</div>
        <p>"${r.review}"</p>
        <span class="delete-review">🗑️</span>
      `;

      div.querySelector('.delete-review')
        .addEventListener('click', () => Review.delete(r.id));

      return div;
    },

    initFAQ() {
      document.querySelectorAll('details').forEach(d => {
        d.addEventListener('click', () => {
          document.querySelectorAll('details').forEach(o => {
            if (o !== d) o.removeAttribute('open');
          });
        });
      });
    }
  };

})();
