// index.js
const express = require('express');
const app = express();
const PORT = 3000;

// Route dasar
app.get('/', (req, res) => {
  res.send('🎉 Selamat datang di belajarNode!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});