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

  async createAccount(payload) {
    const result = await query(
      `INSERT INTO accounts (first_name, last_name, patronymic, email, password, gender, age, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, first_name, last_name, patronymic, email, password, gender, age, city, created_at`,
      [
        payload.firstName,
        payload.lastName,
        payload.patronymic,
        payload.email,
        payload.password,
        payload.gender,
        payload.age,
        payload.city
      ]
    );
    return result.rows[0] ?? null;
  }

  sanitize(accountRow) {
    if (!accountRow) return null;
    return normalizeAccount(accountRow);
  }
}

export const accountRepository = new AccountRepository();
