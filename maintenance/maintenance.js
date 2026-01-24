const MAINTENANCE_MODE = true;
const ADMIN_PASSWORD = "admin123";

window.adminLogin = function () {
  const pass = prompt("Masukkan password admin:");
  console.log("Password input:", pass);

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("odw_admin", "true");
    console.log("Admin saved:", localStorage.getItem("odw_admin"));
    alert("Login berhasil");
    location.reload();
  } else {
    alert("Password salah");
  }
};

document.addEventListener("DOMContentLoaded", () => {

  const isAdmin = localStorage.getItem("odw_admin") === "true";
  console.log("Is admin?", isAdmin);

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
      <button id="adminBtn"
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

  // event listener (lebih aman dari inline onclick)
  document.getElementById("adminBtn")
    .addEventListener("click", adminLogin);
});
