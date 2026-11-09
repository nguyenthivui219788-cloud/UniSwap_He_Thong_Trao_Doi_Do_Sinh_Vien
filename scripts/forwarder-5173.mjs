import http from 'node:http';
import net from 'node:net';

const TARGET_PORT = 8080;
const LISTEN_PORT = 5173;

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${TARGET_PORT}` },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('UniSwap Vite server đang khởi động trên cổng 8080...');
  });

  req.pipe(proxyReq, { end: true });
});

server.on('upgrade', (req, socket, head) => {
  const proxySocket = net.connect(TARGET_PORT, '127.0.0.1', () => {
    socket.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\r\n') +
      '\r\n\r\n'
    );
    if (head && head.length > 0) proxySocket.write(head);
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxySocket.on('error', () => socket.destroy());
  socket.on('error', () => proxySocket.destroy());
});

server.listen(LISTEN_PORT, '127.0.0.1', () => {
  console.log(`UniSwap: http://localhost:${TARGET_PORT} (phụ: http://localhost:${LISTEN_PORT})`);
});

server.on('error', (err) => {
  // If 5173 is busy, that is harmless since 8080 is the main port
  console.warn(`[forwarder-5173] Cổng ${LISTEN_PORT} không khả dụng: ${err.message}`);
});
