# Struktur Kode HTML – Oemah Desain Website

Dokumen ini menjelaskan **struktur HTML paling masuk akal, rapi, dan scalable** untuk website jasa seperti Oemah Desain Website.

Fokus utama:

* Mudah dipindahkan / dikembangkan
* SEO-friendly
* Enak dibaca developer lain
* Siap tumbuh (bukan sekali jadi)

---

## 🌳 Struktur Folder Final (Direkomendasikan)

```
root/
│
├─ index.html              # Homepage (jualan utama)
├─ about.html              # Filosofi, cerita, trust builder
├─ services.html           # Layanan & paket
├─ portfolio.html          # Demo / hasil kerja
├─ contact.html            # Kontak & CTA
│
├─ assets/
│   ├─ css/
│   │   └─ style.css       # Global styling
│   │
│   ├─ js/
│   │   └─ script.js       # Logic, interaksi, Supabase
│   │
│   ├─ img/
│   │   ├─ hero/
│   │   ├─ portfolio/
│   │   └─ icons/
│   │
│   └─ fonts/              # Jika pakai font lokal
│
├─ README.md               # Filosofi & mindset (trust asset)
└─ sitemap.xml             # SEO
```

---

## 🧱 Struktur HTML (Per Halaman)

### 1️⃣ Global Layout (Semua Halaman)

Urutan wajib:

1. `<header>` – navigasi & branding
2. `<main>` – konten utama (SEO fokus)
3. `<footer>` – trust & penutup

```html
<body>
  <header></header>
  <main></main>
  <footer></footer>
</body>
```

---

## 🏠 index.html (Homepage)

Tujuan: **closing & trust**

Urutan section:

1. Hero (value proposition)
2. Masalah klien (pain)
3. Solusi & keunggulan
4. Layanan / paket
5. Portfolio / demo
6. Testimoni
7. FAQ
8. CTA final

```html
<main>
  <section id="hero"></section>
  <section id="pain"></section>
  <section id="solution"></section>
  <section id="pricing"></section>
  <section id="portfolio"></section>
  <section id="reviews"></section>
  <section id="faq"></section>
  <section id="cta"></section>
</main>
```

---

## 🧠 about.html

Tujuan: **trust & cerita**

Isi utama:

* Filosofi Oemah
* Proses berpikir
* Nilai & prinsip

```html
<main>
  <section id="about-hero"></section>
  <section id="philosophy"></section>
  <section id="process"></section>
  <section id="values"></section>
</main>
```

---

## 🧰 services.html

Tujuan: **jelas & rasional**

```html
<main>
  <section id="services"></section>
  <section id="packages"></section>
  <section id="comparison"></section>
</main>
```

---

## 🎨 portfolio.html

Tujuan: **bukti nyata**

```html
<main>
  <section id="portfolio-list"></section>
</main>
```

---

## 📞 contact.html

Tujuan: **aksi cepat**

```html
<main>
  <section id="contact-form"></section>
  <section id="contact-info"></section>
</main>
```

---

## ⚙️ Catatan Teknis Penting

* **1 halaman = 1 file HTML** (mudah SEO)
* Jangan campur logic di HTML
* Semua JS via `assets/js/script.js`
* Semua styling global di `style.css`

---

## ✅ Checklist Struktur Siap Deploy

* [x] Folder rapi
* [x] Penamaan konsisten
* [x] SEO-friendly
* [x] Mudah dikembangkan
* [x] Siap untuk klien besar

---

> **Website yang rapi di struktur = bisnis yang rapi di masa depan.**

© Oemah Desain Website
