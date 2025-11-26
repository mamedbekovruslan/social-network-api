import { Pool } from 'pg';
import { config } from '../config.js';

export const pool = new Pool(config.db);

pool.on('error', (error) => {
  console.error('Postgres pool error', error);
});

export const query = (text, params) => pool.query(text, params);
