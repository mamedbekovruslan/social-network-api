import { query } from '../db/pool.js';

const genderMap = new Map([
  ['male', 'Мужской'],
  ['female', 'Женский']
]);

const normalizeAccount = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  patronymic: row.patronymic,
  email: row.email,
  gender: genderMap.get((row.gender ?? '').toLowerCase()) ?? row.gender,
  age: row.age,
  city: row.city,
  createdAt: row.created_at
});

class AccountRepository {
  async findByEmail(email) {
    const result = await query(
      `SELECT id, first_name, last_name, patronymic, email, password, gender, age, city, created_at
       FROM accounts WHERE email = $1 LIMIT 1`,
      [email]
    );
    return result.rows[0] ?? null;
  }

  sanitize(accountRow) {
    if (!accountRow) return null;
    return normalizeAccount(accountRow);
  }

  verifyPassword(accountRow, password) {
    if (!accountRow) return false;
    return accountRow.password === password;
  }
}

export const accountRepository = new AccountRepository();
