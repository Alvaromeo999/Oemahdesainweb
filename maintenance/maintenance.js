const MAINTENANCE_MODE = true;
const ADMIN_PASSWORD = "odw123";

function loginAdmin() {
  const input = prompt("Masukkan password admin:");
  if (input === ADMIN_PASSWORD) {
    localStorage.setItem("odw_admin", "true");
    alert("Login admin berhasil");
    location.reload();
  } else {
    alert("Password salah");
  }
}

function logoutAdmin() {
  localStorage.removeItem("odw_admin");
  alert("Logout admin");
  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {

  const isAdmin = localStorage.getItem("odw_admin") === "true";

  if (!MAINTENANCE_MODE || isAdmin) return;

  const overlay = document.createElement("div");
  overlay.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:#111;
      color:#fff;
      display:flex;
      justify-content:center;
      align-items:center;
      z-index:9999;
    ">
      <div>
        <h1>🚧 Under Construction</h1>
        <p>Website sedang maintenance</p>
        <button onclick="loginAdmin()">Admin Login</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
});
