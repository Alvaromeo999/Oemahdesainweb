if (window.__maintenanceLoaded) return;
window.__maintenanceLoaded = true;

const MAINTENANCE_MODE = true;
const ADMIN_PASSWORD = "admin123";

window.adminLogin = function () {
  const pass = prompt("Masukkan password admin:");
  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("odw_admin", "true");
    location.reload();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("odw_admin") === "true";
  if (!MAINTENANCE_MODE || isAdmin) return;

  if (document.getElementById("maintenanceOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:#111;
    color:#fff;
    z-index:9999;
    display:flex;
    justify-content:center;
    align-items:center;
  `;

  overlay.innerHTML = `
    <div>
      <h1>🚧 Under Construction</h1>
      <button onclick="adminLogin()">🔐 Admin Login</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});
