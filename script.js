// ===============================
// SUPABASE INIT
// ===============================

// 1. URL baru kamu (sudah saya masukkan)
const supabaseUrl = 'https://tosjjicxibibuxpskpjz.supabase.co'

// 2. MASUKKAN KEY "ANON" (PUBLIC) DI SINI
// Jangan pakai process.env, tapi copy-paste text kodenya langsung di antara tanda petik
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 

// 3. Gunakan variabel global 'supabase' (bawaan dari script CDN di HTML)
// Bukan 'createClient' dari import
const sb = supabase.createClient(supabaseUrl, supabaseKey)

// ===============================
// LANJUT KE KODE RATING & SUBMIT...
// ===============================
// (kode sisanya sama seperti sebelumnya)
