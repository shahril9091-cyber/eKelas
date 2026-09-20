# SISTEM MAKLUMAT KELAS (SK Seri Jaya)

HTML + Firebase Firestore. Tiada pemasangan/pelayan: buka `index.html` dalam pelayar (perlu internet untuk SDK Firebase dan pembaca Excel).

## Persediaan Firebase (sekali sahaja)
1. Firebase Console → projek **sksj-2026** → **Build → Firestore Database → Create database** (pilih lokasi `asia-southeast1`).
2. Tab **Rules** → tampal kandungan `firestore.rules` → **Publish**.
3. Selesai. Config sudah ada dalam `firebase-config.js`.

## Cara guna
- **Maklumat Kelas**: jumlah murid, lelaki/perempuan, ikut kelas. Klik kad kelas untuk senarai (BIL, ID MURID, NAMA, NO. KP, STATUS, NAMA KELAS, JANTINA).
- **Carian**: taip nama murid (atau kelas) dalam kotak carian; klik nama kelas dalam keputusan untuk buka senarai kelas itu.
- **Cetak / Muat turun**: pilih skop (semua murid / mengikut tahun / mengikut kelas) dan kandungan (senarai nama atau ringkasan bilangan), kemudian **Cetak (PDF)** atau **Muat turun Excel**. Cetakan A4, satu kelas satu halaman.
- **Admin** (kata laluan `sksj`): muat naik fail Excel eksport APDM. Sistem terus membaca, menganalisis dan menyimpan; data lama diganti.
- Sesuai untuk telefon (paparan mudah alih).

## Nota keselamatan
- Kata laluan admin disemak dalam pelayar sahaja; sesiapa yang tahu cara membaca kod halaman boleh melihatnya. Peraturan Firestore pula membenarkan baca dan tulis tanpa log masuk. Untuk keselamatan sebenar (NO. KP murid disimpan), gunakan Firebase Authentication dan hadkan `allow read/write` kepada pengguna berdaftar.
- Hanya lajur yang dipaparkan dibaca dan disimpan; alamat, pendapatan, akaun bank dan maklumat penjaga dibuang semasa muat naik.
