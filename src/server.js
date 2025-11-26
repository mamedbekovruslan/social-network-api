import http from 'http';

const PORT = process.env.PORT ?? 5000;

const sendJSON = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendJSON(res, 400, { message: 'Bad Request' });
    return;
  }

  const { method, headers, url } = req;
  const requestUrl = new URL(url, `http://${headers.host}`);

  if (method === 'OPTIONS') {
    sendJSON(res, 204, {});
    return;
  }

  if (method === 'GET' && requestUrl.pathname === '/api/test') {
    sendJSON(res, 200, { message: 'тест' });
    return;
  }

  sendJSON(res, 404, { message: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
