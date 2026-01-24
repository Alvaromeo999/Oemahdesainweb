const MAINTENANCE_MODE = true; // true = ON, false = OFF

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  if (isAdmin) {
    localStorage.setItem("odw_admin", "true");
  }

  const adminSaved = localStorage.getItem("odw_admin") === "true";

  // jika maintenance OFF atau admin → normal
  if (!MAINTENANCE_MODE || isAdmin || adminSaved) return;

  // tampilkan overlay maintenance
  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.classList.add("active");

  overlay.innerHTML = `
    <div class="maintenance-box">
      <img src="maintenance/laptop-under-construction.png">
      <h1>🚧 Lagi Diperbaiki Dulu Ya</h1>
      <p>Website sedang maintenance 🚀</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});
