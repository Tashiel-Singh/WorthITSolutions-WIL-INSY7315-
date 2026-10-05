const http = require('http');
http.createServer((q, r) => {
  if (q.url === '/health') { r.writeHead(200, {'Content-Type':'application/json'}); return r.end(JSON.stringify({status:'ok'})); }
  r.end('MedFlow API stub');
}).listen(process.env.PORT || 10000);
