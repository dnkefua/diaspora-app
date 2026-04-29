const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = process.cwd();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json'
};

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send404(res);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const safeUrl = decodeURI(req.url.split('?')[0]);
    let filePath = path.join(ROOT, safeUrl);

    // If path is directory, serve index.html inside it
    if (safeUrl === '/' || safeUrl.endsWith('/')) {
      filePath = path.join(ROOT, safeUrl, 'index.html');
    }

    // If no extension, try adding .html
    if (!path.extname(filePath)) {
      const withHtml = filePath + '.html';
      if (fs.existsSync(withHtml)) filePath = withHtml;
    }

    if (!fs.existsSync(filePath)) {
      return send404(res);
    }

    serveFile(req, res, filePath);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGINT', () => process.exit());
