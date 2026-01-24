const MAINTENANCE_MODE = true;
const ADMIN_PASSWORD = "odw123";

document.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("odw_admin") === "true";
  if (!MAINTENANCE_MODE || isAdmin) return;

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "maintenanceOverlay";
  overlay.innerHTML = `
    <div class="box">
      <h1>🚧 Under Construction</h1>
      <p>Website sedang maintenance</p>
      <button id="openLogin">🔐 Admin Login</button>
    </div>

    <!-- Modal -->
    <div id="loginModal" class="modal hidden">
      <div class="modal-box">
        <h3>Admin Login</h3>
        <input type="password" id="adminPass" placeholder="Password admin">
        <div class="btn-group">
          <button id="loginBtn">Masuk</button>
          <button id="cancelBtn">Batal</button>
        </div>
        <p id="errorMsg"></p>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  // Element refs
  const modal = document.getElementById("loginModal");
  const openBtn = document.getElementById("openLogin");
  const loginBtn = document.getElementById("loginBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const passInput = document.getElementById("adminPass");
  const errorMsg = document.getElementById("errorMsg");

  openBtn.onclick = () => modal.classList.remove("hidden");
  cancelBtn.onclick = () => modal.classList.add("hidden");

  loginBtn.onclick = () => {
    if (passInput.value === ADMIN_PASSWORD) {
      localStorage.setItem("odw_admin", "true");
      location.reload();
    } else {
      errorMsg.textContent = "❌ Password salah";
    }
  };
});
