import http from 'http';
import { config } from './config.js';
import { accountRepository } from './repositories/accountRepository.js';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const sendJSON = (res, statusCode, payload) => {
  const body = statusCode === 204 ? '' : JSON.stringify(payload);
  res.writeHead(statusCode, defaultHeaders);
  res.end(body);
};

const parseJSONBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

const handleLogin = async (req, res) => {
  const body = await parseJSONBody(req);
  const email = body.email?.toString().trim().toLowerCase();
  const password = body.password?.toString();

  if (!email || !password) {
    sendJSON(res, 400, { message: 'Укажите email и пароль' });
    return;
  }

  const accountRow = await accountRepository.findByEmail(email);
  if (!accountRepository.verifyPassword(accountRow, password)) {
    sendJSON(res, 401, { message: 'Неверный email или пароль' });
    return;
  }

  const account = accountRepository.sanitize(accountRow);
  sendJSON(res, 200, { account });
};

const handleRegister = async (req, res) => {
  const body = await parseJSONBody(req);
  const firstName = body.firstName?.toString().trim();
  const lastName = body.lastName?.toString().trim();
  const patronymic = body.patronymic?.toString().trim() || null;
  const email = body.email?.toString().trim().toLowerCase();
  const password = body.password?.toString();
  const gender = body.gender?.toString().trim().toLowerCase() || null;
  const ageValue = body.age;
  const city = body.city?.toString().trim() || null;

  const age = typeof ageValue === 'number' ? ageValue : Number.parseInt(ageValue, 10);
  const normalizedAge = Number.isFinite(age) ? age : null;

  if (!firstName || !lastName || !email || !password) {
    sendJSON(res, 400, { message: 'Заполните имя, фамилию, email и пароль' });
    return;
  }

  const existingAccount = await accountRepository.findByEmail(email);
  if (existingAccount) {
    sendJSON(res, 409, { message: 'Пользователь с таким email уже существует' });
    return;
  }

  const accountRow = await accountRepository.createAccount({
    firstName,
    lastName,
    patronymic,
    email,
    password,
    gender,
    age: normalizedAge,
    city
  });

  const account = accountRepository.sanitize(accountRow);
  sendJSON(res, 201, { account });
};

const requestHandler = async (req, res) => {
  const { method, headers } = req;
  const url = req.url ?? '/';
  const requestUrl = new URL(url, `http://${headers.host ?? `localhost:${config.port}`}`);

  if (method === 'OPTIONS') {
    sendJSON(res, 204, {});
    return;
  }

  if (method === 'POST' && requestUrl.pathname === '/api/login') {
    await handleLogin(req, res);
    return;
  }
  if (method === 'POST' && requestUrl.pathname === '/api/register') {
    await handleRegister(req, res);
    return;
  }

  sendJSON(res, 404, { message: 'Not Found' });
};

const server = http.createServer((req, res) => {
  requestHandler(req, res).catch((error) => {
    console.error('Request handling error', error);
    if (!res.headersSent) {
      sendJSON(res, 500, { message: 'Internal Server Error' });
    } else {
      res.end();
    }
  });
});

server.listen(config.port, () => {
  console.log(`API server listening on http://localhost:${config.port}`);
});
