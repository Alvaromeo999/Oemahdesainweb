const MAINTENANCE_MODE = true;

// halaman yang BOLEH diakses publik
const PUBLIC_PAGES = [
  "/demo",
  "/portfolio",
  "/jasa"
];

const path = window.location.pathname;
const isPublic = PUBLIC_PAGES.some(p => path.startsWith(p));

if (isPublic) {
  // skip maintenance
  return;
}
