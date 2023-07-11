const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const https = require('https');
const fs = require('fs');
const tls = require('tls');

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
      reqHost: "jetwebapi.orgsocial.com.tr",
      targetUrl: "http://localhost:4001"
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
    console.log('Req socket server name : ', req.socket.servername);
    // console.log('A Request Came',req.headers.host);
    const matchedHost = hosts.find(host=> host.reqHost === req.headers.host);
    if(matchedHost){
        const proxy = createProxyMiddleware({
            target: matchedHost.targetUrl, // Yerel uygulamanın adresi
            changeOrigin: true
        });        
        return proxy(req,res,next);
    } else {
      next();
    }
  }
);

app.use(express.static('public'));

app.use((req, res) => {
  const notFoundPagePath = path.join(__dirname, 'public', 'not-found.html');
  res.sendFile(notFoundPagePath);
});

const readCertificate = (address, fileName) =>{
  return fs.readFileSync(path.join(__dirname, 'cert',address, fileName));
}

const orgsocialCert = readCertificate('orgsocial.com.tr','cert.pem');
const orgsocialKey = readCertificate('orgsocial.com.tr','key.pem');

const fikfikretCert = readCertificate('fikfikret.com.tr','cert.pem');
const fikfikretKey = readCertificate('fikfikret.com.tr','key.pem');

const sniCallback = (serverName, callback) => {
	console.log('sni call back ', serverName);
	let cert = null;
	let key = null;

	if (serverName.includes('fikfikret.com.tr')) {
		cert = fikfikretCert
		key = fikfikretKey
	} else {
		cert = orgsocialCert;
		key = orgsocialKey;
	}

	callback(null, new tls.createSecureContext({
		cert,
		key,
	}));
}

const serverOptions = {
	SNICallback: sniCallback,

	// Optional: TLS Versions
	maxVersion: 'TLSv1.3',
	minVersion: 'TLSv1.2'
}

const PORT = 443;
const sslServer = https.Server(serverOptions, app);

sslServer.listen(PORT, () => {
  console.log('Listening Port ', PORT);
});

