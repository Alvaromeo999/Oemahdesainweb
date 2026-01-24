/* ===========================
   MAINTENANCE MODE + ADMIN
=========================== */
const MAINTENANCE_MODE = true; // true = ON, false = OFF

document.addEventListener("DOMContentLoaded", function () {

  // cek admin via URL
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "false
";

if (isAdmin) {
  localStorage.setItem("odw_admin", "true");
}

const adminSaved = localStorage.getItem("odw_admin") === "true";

if (!MAINTENANCE_MODE || isAdmin || adminSaved) {
  return;
}


   
  // kalau admin, website normal
  if (!MAINTENANCE_MODE || isAdmin) {
    return;
  }

  // overlay maintenance
  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.classList.add("active");

  overlay.innerHTML = `
    <div class="maintenance-box">
      <img src="maintenance/laptop-under-construction.png" alt="Under Construction">
      <h1>🚧 Lagi Diperbaiki Dulu Ya</h1>
      <p>
        Halo! 👋<br><br>
        Website <strong>Oemah Desain Web</strong> lagi dalam proses
        perbaikan & peningkatan layanan.<br><br>
        Tenang, kami lagi bongkar dapur biar nanti
        tampilannya makin kece dan makin ngebut 🚀
      </p>
      <div class="maintenance-footer">
        Terima kasih sudah mampir 🙏<br>
        © ${new Date().getFullYear()} Oemah Desain Web
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
});
