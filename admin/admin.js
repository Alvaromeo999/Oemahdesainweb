const SUPABASE_URL = 'https://tosjjicxibibuxpskpjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2pqaWN4aWJpYnV4cHNrcGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODAxMTAsImV4cCI6MjA4NDc1NjExMH0.-wAYdccN8Ji6tVWhXYQrhJunDeyA7cpzskkmpY3MLT0';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginBox = document.getElementById('loginBox');
const dashboard = document.getElementById('dashboard');
const msg = document.getElementById('loginMsg');

/* =========================
   CHECK SESSION
========================= */
sb.auth.getSession().then(({ data }) => {
  if (data.session) {
    showDashboard();
  }
});

/* =========================
   LOGIN
========================= */
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  msg.textContent = 'Loading...';

  const { error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.textContent = '❌ Login gagal';
    return;
  }

  showDashboard();
});

/* =========================
   LOGOUT
========================= */
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await sb.auth.signOut();
  location.reload();
});

/* =========================
   UI
========================= */
function showDashboard() {
  loginBox.classList.add('hidden');
  dashboard.classList.remove('hidden');
}
