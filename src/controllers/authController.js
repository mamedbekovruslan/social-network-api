import { accountRepository } from '../repositories/accountRepository.js';
import { sendJSON, parseJSONBody } from '../utils/http.js';
import { logger } from '../utils/logger.js';
import { validateLoginPayload, validateRegisterPayload } from '../utils/validators.js';
import { comparePassword, hashPassword } from '../utils/password.js';

class AuthController {
  async login(req, res) {
    const body = await parseJSONBody(req);
    const { email, password } = validateLoginPayload(body);

    const accountRow = await accountRepository.findByEmail(email);
    if (!accountRow) {
      sendJSON(res, 401, { message: 'Неверный email или пароль' });
      return;
    }

    const isValidPassword = await comparePassword(password, accountRow.password);
    if (!isValidPassword) {
      sendJSON(res, 401, { message: 'Неверный email или пароль' });
      return;
    }

    const account = accountRepository.sanitize(accountRow);
    sendJSON(res, 200, { account });
  }

  async register(req, res) {
    const body = await parseJSONBody(req);
    const payload = validateRegisterPayload(body);

    const existingAccount = await accountRepository.findByEmail(payload.email);
    if (existingAccount) {
      sendJSON(res, 409, { message: 'Пользователь с таким email уже существует' });
      return;
    }

    const hashedPassword = await hashPassword(payload.password);
    const accountRow = await accountRepository.createAccount({
      ...payload,
      password: hashedPassword
    });

    logger.info('Создан новый пользователь', { email: payload.email, id: accountRow?.id });

    const account = accountRepository.sanitize(accountRow);
    sendJSON(res, 201, { account });
  }
}

export const authController = new AuthController();
