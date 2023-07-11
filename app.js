const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

const hosts = [
    {
      reqHost: "fikfikret.com.tr",
      targetUrl: "http://localhost:3000/fikretcansel"
    },
    {
      reqHost: "www.fikfikret.com.tr",
      targetUrl: "http://localhost:3000/fikretcansel"
    },
    {
      reqHost: "cv.fikfikret.com.tr",
      targetUrl: "http://localhost:3000/fikretcansel/fikretcansel/cv"
    },
    {
      reqHost: "orgsocial.com.tr",
      targetUrl: "http://localhost:4000"
    },
    {
      reqHost: "www.orgsocial.com.tr",
      targetUrl: "http://localhost:4000"
    },
    {
      reqHost: "jw.orgsocial.com.tr",
      targetUrl: "http://localhost:4002"
    },
    {
      reqHost: "jetweb.orgsocial.com.tr",
      targetUrl: "http://localhost:4003"
    },
    {
        reqHost: "softfes.fikfikret.com.tr",
        targetUrl: "http://localhost:3000"
    },
    {
      reqHost: "www.softfes.fikfikret.com.tr",
      targetUrl: "http://localhost:3000"
  },
    {
        reqHost: "localhost",
        targetUrl: "http://localhost:8080/"
    }
];

app.use('/',
  (req, res, next) => {
    // console.log('A Request Came',req.headers.host);
    const matchedHost = hosts.find(host=> host.reqHost === req.headers.host);
    if(matchedHost){
        const proxy = createProxyMiddleware({
            target: matchedHost.targetUrl, // Yerel uygulamanın adresi
            changeOrigin: true
        });        
        proxy(req,res,next);
    }else {
      const proxy = createProxyMiddleware({
        target: "http://localhost:4002", // Yerel uygulamanın adresi
        changeOrigin: true,
      });
      proxy(req,res,next);
    }
  }
);

app.use(express.static('public'));

app.use((req, res) => {
  const notFoundPagePath = path.join(__dirname, 'public', 'not-found.html');
  res.sendFile(notFoundPagePath);
});

const port = 443;


const sslServer = https.createServer({
  key: '',
  cert: ''
},
app);

sslServer.listen(port, () => {
  console.log('Listening Port ', port);
});

