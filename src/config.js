import dotenv from 'dotenv';

dotenv.config();

const parseNumber = (value, fallback) => {
  if (typeof value === 'undefined') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: parseNumber(process.env.PORT, 5000),
  db: {
    host: process.env.PGHOST ?? 'localhost',
    port: parseNumber(process.env.PGPORT, 5432),
    database: process.env.PGDATABASE ?? 'social_network',
    user: process.env.PGUSER ?? 'sn_user',
    password: process.env.PGPASSWORD ?? 'sn_password'
  }
};
