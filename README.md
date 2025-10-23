# 🚌 Transjak Fleet Tracker

Aplikasi *mobile* yang dikembangkan menggunakan React Native dan TypeScript untuk memonitor data kendaraan Transjakarta secara *real-time* (menggunakan data publik MBTA sebagai simulasi API).



https://github.com/user-attachments/assets/31d35810-1195-4c75-84a8-2f0f8fe7b75f



## Daftar Isi
1. [Fitur Utama](#1-fitur-utama)
2. [Teknologi yang Digunakan](#2-teknologi-yang-digunakan)
3. [Arsitektur Aplikasi](#3-arsitektur-aplikasi)
4. [Persyaratan Sistem](#4-persyaratan-sistem)
5. [Cara Menjalankan Aplikasi](#5-cara-menjalankan-aplikasi)

---

## 1. Fitur Utama

Aplikasi ini menyediakan sistem manajemen armada yang meliputi:

* **Daftar Kendaraan dengan Pagination:** Menampilkan 10 kendaraan per halaman dalam bentuk Card, dengan fitur *Load More* dan *Pull-to-Refresh*.
* **Filter Ganda:** Memungkinkan pengguna memfilter daftar kendaraan berdasarkan **Rute** dan **Trip** secara *multiple selection*.
* **Detail Kendaraan:** Menampilkan detail status, koordinat (Latitude & Longitude), waktu *update* terakhir, Rute, dan Trip.
* **(Bonus) Peta:** Dukungan untuk menampilkan posisi kendaraan di peta.

---

## 2. Teknologi yang Digunakan

| Kategori | Teknologi | Versi | Tujuan |
| :--- | :--- | :--- | :--- |
| **Mobile** | React Native CLI | 0.79 | Pengembangan lintas *platform* (Android & iOS). |
| **Bahasa** | TypeScript | Terbaru | Menambah keamanan tipe dan skalabilitas kode. |
| **Data** | Axios | Terbaru | Klien HTTP untuk fetching data dari REST API. |
| **State/Logic** | React Hooks | - | Manajemen *state* lokal, *side effects*, dan *custom hooks*. |
| **Navigasi** | React Navigation | v6 | Pengelolaan navigasi antar layar. |

---

## 3. Arsitektur Aplikasi

Aplikasi ini mengadopsi prinsip arsitektur **Clean Architecture** yang disederhanakan, fokus pada pemisahan *concern* menggunakan *Functional Components* dan *Custom Hooks*.

### Struktur Folder Utama

### Penjelasan Arsitektur

1.  **Layer Data (`api/`)**: Bertanggung jawab tunggal untuk berinteraksi dengan dunia luar (REST API MBTA). Ini memastikan bahwa jika sumber data berubah, hanya *layer* ini yang perlu dimodifikasi.
2.  **Layer Domain/Logic (`hooks/`)**: Merupakan inti logika aplikasi. `useVehicles.ts` mengelola *state* daftar kendaraan, *pagination*, *refresh*, dan *filtering*. Ini menjaga *Screen Components* tetap murni dari logika *fetching* data.
3.  **Layer Presentation (`screens/` & `components/`)**:
    * **Screens**: Mengambil data dan fungsi dari *Custom Hooks* (`useVehicles`) dan menyalurkannya ke komponen UI.
    * **Components**: Murni *presentational* (UI *dumb components*) yang hanya bertugas merender data yang diberikan.

Pemisahan ini membuat kode mudah diuji (**Hooks** dapat diuji secara terpisah dari UI), mudah dibaca, dan *maintainable*.

---

## 4. Persyaratan Sistem

Pastikan sistem Anda memenuhi spesifikasi berikut:

* **Node.js:** Versi LTS (seperti 18.x atau 20.x).
* **Yarn/npm:** Terinstal.
* **React Native Environment:** Sesuai dengan dokumentasi React Native CLI.
* **Target OS Minimum:**
    * **Android:** SDK 24 (Android 7.0 - Nougat)
    * **iOS:** iOS 15.0

---

## 5. Cara Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di perangkat/emulator Anda.

### A. Persiapan Awal

1.  **Clone Repository:**
    ```bash
    git clone [LINK_REPOSITORY_ANDA]
    cd TransjakartaFleetTracker
    ```

2.  **Instal Dependensi JavaScript:**
    ```bash
    npm install 
    # atau
    yarn install
    ```

3.  **Instal Dependensi Native (Pods untuk iOS):**
    * **PENTING:** Jika Anda menginstal *library* yang memiliki kode *native* (seperti `react-native-gesture-handler` atau `react-native-maps`), Anda harus memperbarui Pods.
    * **iOS:**
        ```bash
        cd ios
        pod install
        cd ..
        ```

### B. Menjalankan di Android

1.  **Pastikan Emulator/Perangkat Terhubung:** Jalankan emulator Android atau hubungkan perangkat fisik Anda.
2.  **Jalankan Aplikasi:**
    ```bash
    npx react-native run-android
    ```

### C. Menjalankan di iOS

1.  **Pastikan Simulator/Xcode Siap:** Jalankan simulator iOS atau buka proyek di Xcode.
2.  **Jalankan Aplikasi:**
    ```bash
    npx react-native run-ios
    ```
    *(Alternatif: Buka `ios/TransjakartaFleetManager.xcworkspace` di Xcode dan jalankan dari sana.)*

### D. Mengatasi Error Native (`RNGestureHandlerModule' could not be found`)

Jika Anda menemui *error* yang berhubungan dengan *native module* (seperti `RNGestureHandlerModule`), ini berarti *linking* belum sempurna. Lakukan langkah-langkah *clean build* ini:

1.  **Bersihkan Cache:**
    ```bash
    npm start -- --reset-cache
    ```
2.  **Bersihkan Build Android:**
    ```bash
    cd android
    ./gradlew clean
    cd ..
    ```
3.  **Instal Ulang Pods iOS:** (Lihat langkah 3 di atas)
    ```bash
    cd ios
    rm -rf Pods && rm Podfile.lock && pod install
    cd ..
    ```
4.  **Jalankan Ulang Aplikasi secara Native:** Gunakan `npx react-native run-ios` atau `npx react-native run-android`.
