CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    patronymic TEXT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    gender TEXT,
    age INT,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
