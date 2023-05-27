const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

const hosts = [
    {
        reqHost: "gizlisanat.orgsocial.com.tr",
        targetUrl: "http://localhost:8080"
    },
    {
        reqHost: "softfes.fikfikret.com.tr",
        targetUrl: "http://localhost:3000"
    },
    {
        reqHost: "localhost",
        targetUrl: "http://localhost:8080/"
    }
];



// Fikret.com.tr isteklerini yönlendirme
app.use('/',
  (req, res, next) => {
    console.log('A Request Came',req.headers.host);
    const matchedHost = hosts.find(host=> host.reqHost === req.headers.host);
    if(matchedHost){
        const proxy = createProxyMiddleware({
            target: matchedHost.targetUrl, // Yerel uygulamanın adresi
            changeOrigin: true,
        });        
        proxy(req,res,next);
    }else {
        next();
    }
  }
);

app.use(express.static('public'));

// Sayfa bulunamadığında HTML dosyası döndürme
app.use((req, res) => {
  const notFoundPagePath = path.join(__dirname, 'public', 'not-found.html');
  res.sendFile(notFoundPagePath);
});

app.use(express.static('public'));

const port = 80;

app.listen(port, () => {
  console.log('Listening Port ', port);
});

