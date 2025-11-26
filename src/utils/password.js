import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = (plain) => {
  if (!plain) throw new Error('Пустой пароль');
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePassword = (plain, hash) => {
  if (!plain || !hash) return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
};
