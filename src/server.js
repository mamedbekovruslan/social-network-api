import http from 'http';
import { config } from './config.js';
import { sendJSON } from './utils/http.js';
import { logger } from './utils/logger.js';
import { handleAuthRoutes } from './routes/authRoutes.js';

const requestHandler = async (req, res) => {
  const { method, headers } = req;
  const url = req.url ?? '/';
  const requestUrl = new URL(url, `http://${headers.host ?? `localhost:${config.port}`}`);

  if (method === 'OPTIONS') {
    sendJSON(res, 204, {});
    return;
  }

  const handled = await handleAuthRoutes({ req, res, method, url: requestUrl });
  if (handled) {
    return;
  }

  sendJSON(res, 404, { message: 'Not Found' });
};

const server = http.createServer((req, res) => {
  requestHandler(req, res).catch((error) => {
    logger.error('Request handling error', error);
    if (!res.headersSent) {
      sendJSON(res, 500, { message: 'Internal Server Error' });
    } else {
      res.end();
    }
  });
});

server.listen(config.port, () => {
  logger.info(`API server listening on http://localhost:${config.port}`);
});
