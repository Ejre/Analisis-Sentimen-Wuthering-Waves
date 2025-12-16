# Analisis Sentimen Wuthering Waves

Project ini adalah aplikasi web untuk melakukan analisis sentimen terhadap ulasan atau teks yang berkaitan dengan game **Wuthering Waves**. Aplikasi ini menggunakan model Machine Learning **Random Forest** untuk mengklasifikasikan sentimen menjadi **Positif** atau **Negatif**.

## 🚀 Fitur

- **Analisis Sentimen**: Memprediksi apakah sebuah teks ulasan memiliki sentimen positif atau negatif.
- **Preprocessing Teks Otomatis**: Melakukan pembersihan data, *stemming*, *stopword removal*, dan normalisasi kata secara otomatis sebelum prediksi.
- **Web Interface**: Antarmuka pengguna yang responsif dan mudah digunakan berbasis React.

## 🛠️ Teknologi yang Digunakan

### Backend
- **Python**: Bahasa pemrograman utama.
- **Flask**: Framework web untuk API.
- **Scikit-Learn**: Library untuk membangun model Machine Learning (Random Forest & TF-IDF).
- **Pandas & NumPy**: Untuk manipulasi data.
- **Sastrawi**: Library NLP khusus Bahasa Indonesia (Stemming & Stopword removal).
- **Joblib**: Untuk menyimpan dan memuat model yang telah dilatih.

### Frontend
- **React.js**: Library JavaScript untuk membangun antarmuka pengguna.
- **Tailwind CSS**: Framework CSS untuk styling.
- **Axios**: Untuk melakukan request HTTP ke backend.

## 📂 Struktur Project

```
├── backend/
│   ├── app.py              # Main Flask application
│   ├── train_model.py      # Script untuk melatih model
│   ├── data/               # Dataset (kamus baku, data latih)
│   └── model/              # Model tersimpan (.pkl)
├── frontend/
│   └── sentimen_wuwa/      # Source code React
└── README.md
```

## 📦 Instalasi dan Cara Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lokal komputer Anda.

### 1. Prasyarat
Pastikan Anda sudah menginstall:
- [Python](https://www.python.org/) (v3.8+)
- [Node.js](https://nodejs.org/) (v14+) & npm

### 2. Setup Backend

Masuk ke folder `backend` dan install dependensi Python.

```bash
cd backend
pip install flask flask-cors pandas numpy scikit-learn Sastrawi nltk imbalanced-learn joblib
```

> **Catatan**: Jika diperlukan, download resource NLTK secara manual atau biarkan script menanganinya jika ada konfigurasi tambahan.

Jalankan server Flask:

```bash
python app.py
```
Server akan berjalan di `http://localhost:5000`.

### 3. Setup Frontend

Buka terminal baru, masuk ke folder frontend project (`frontend/sentimen_wuwa`), install dependensi, dan jalankan aplikasi.

```bash
cd frontend/sentimen_wuwa
npm install
npm start
```
Aplikasi akan terbuka otomatis di browser pada `http://localhost:3000`.

## 🤖 Cara Kerja Model

1. **Input**: Pengguna memasukkan teks ulasan pada frontend.
2. **Request**: Frontend mengirimkan teks ke API backend (`/predict`).
3. **Preprocessing**: Backend membersihkan teks (lowercase, hapus simbol, normalisasi, stemming).
4. **Transformasi**: Teks diubah menjadi vektor numerik menggunakan **TF-IDF**.
5. **Prediksi**: Model **Random Forest** memprediksi sentimen berdasarkan vektor tersebut.
6. **Output**: Hasil prediksi (Positif/Negatif) dikirim kembali ke frontend untuk ditampilkan.

---
Dibuat untuk Tugas Akhir Semester 8.
