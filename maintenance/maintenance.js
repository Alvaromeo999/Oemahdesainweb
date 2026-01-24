const MAINTENANCE_MODE = true;
const ADMIN_PASSWORD = "admin123"; // ganti sesuai keinginan

function adminLogin() {
  const pass = prompt("Masukkan password admin:");
  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("odw_admin", "true");
    alert("Login berhasil");
    location.reload();
  } else {
    alert("Password salah");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const isAdmin = localStorage.getItem("odw_admin") === "true";

  if (!MAINTENANCE_MODE || isAdmin) return;

  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:#111;
    color:#fff;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9999;
  `;

  overlay.innerHTML = `
    <div style="text-align:center">
      <h1>🚧 Under Construction</h1>
      <p>Website sedang maintenance</p>
      <button onclick="adminLogin()"
        style="
          padding:10px 20px;
          cursor:pointer;
          border:none;
          border-radius:5px;
        ">
        🔐 Admin Login
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});
