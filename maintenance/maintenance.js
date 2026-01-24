/* ===========================
   MAINTENANCE MODE SWITCH
   true  = AKTIF
   false = NONAKTIF
=========================== */
const MAINTENANCE_MODE = true;

document.addEventListener("DOMContentLoaded", function () {
  if (MAINTENANCE_MODE) {
    const overlay = document.createElement("div");
    overlay.id = "maintenanceOverlay";
    overlay.classList.add("active");

    overlay.innerHTML = `
      <div class="maintenance-box">
        <img src="maintenance/laptop-under-construction.png" alt="Under Construction">
        <h1>Website Sedang Dalam Perbaikan</h1>
        <p>
          Mohon maaf atas ketidaknyamanannya.<br>
          Saat ini website <strong>Oemah Desain Web</strong> sedang dalam proses
          peningkatan kualitas dan pelayanan.
        </p>
        <div class="maintenance-footer">
          © ${new Date().getFullYear()} Oemah Desain Web
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
  }
});
