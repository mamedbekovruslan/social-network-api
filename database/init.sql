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

INSERT INTO accounts (first_name, last_name, patronymic, email, password, gender, age, city)
VALUES
    ('Иван', 'Иванов', 'Иванович', 'ivan@example.com', 'password123', 'male', 30, 'Москва')
ON CONFLICT (email) DO NOTHING;
