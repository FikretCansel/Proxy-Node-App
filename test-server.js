const express = require('express');
const path = require('path');

const app = express();


// Fikret.com.tr isteklerini yönlendirme

app.use(express.static('public'));

// Sayfa bulunamadığında HTML dosyası döndürme
app.use((req, res) => {
  res.send('Test App')
});

app.use(express.static('public'));

const port = 8080;

app.listen(port, () => {
  console.log('Listening Port ', port);
});

