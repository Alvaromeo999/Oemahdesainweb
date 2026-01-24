const MAINTENANCE_MODE = true;

// 🔐 GANTI KEY INI (RAHASIA)
const ADMIN_SECRET_KEY = "ODW-2026-ADMIN";

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const secretKey = params.get("key");

  // 🔓 Login admin via URL
  if (secretKey === ADMIN_SECRET_KEY) {
    localStorage.setItem("odw_admin", "true");

    // hapus key dari URL (lebih aman)
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const isAdmin = localStorage.getItem("odw_admin") === "true";

  // jika bukan admin & maintenance ON → tampilkan overlay
  if (!MAINTENANCE_MODE || isAdmin) return;

  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.innerHTML = `
    <div style="text-align:center">
      <h1>🚧 Under Construction</h1>
      <p>Website sedang maintenance</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});
