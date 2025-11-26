# Социальная сеть — API

Node.js-бэкенд, обслуживающий клиент социальной сети. Сервер поднимается на чистом `http`, использует PostgreSQL как хранилище пользователей и реализует базовый набор auth-эндпоинтов (`/api/login`, `/api/register`).

## Используемый стек

- Node.js 20+, ES Modules
- PostgreSQL 16
- `pg` для работы с БД
- `bcryptjs` для хеширования паролей
- `dotenv` для управления конфигурацией
- `nodemon` для hot-reload в разработке

## Структура проекта

- `src/server.js` — создание HTTP-сервера, базовый роутинг и обработка ошибок
- `src/routes` — сопоставление URL и контроллеров
- `src/controllers` — бизнес-логика (авторизация/регистрация)
- `src/repositories` — доступ к базе данных, преобразование результатов
- `src/db` — пул подключений и вспомогательные запросы
- `src/utils` — обработка HTTP, валидация, логирование, работа с паролями
- `database/` — инфраструктура для PostgreSQL (docker-compose, скрипт `init.sql`)

## Переменные окружения

Создайте `.env` в корне `social-network-api`:

```env
PORT=5000
PGHOST=localhost
PGPORT=5432
PGDATABASE=social_network
PGUSER=sn_user
PGPASSWORD=sn_password
```

Все значения имеют дефолты (см. `src/config.js`), но отдельный файл помогает отделить локальные настройки или продакшен-секреты.

## Подготовка PostgreSQL

```bash
cd database
docker compose up -d           # поднимет postgres:16 и выполнит init.sql
```

Контейнер создаёт БД `social_network` и пользователя `sn_user/sn_password`. Для остановки используйте `docker compose down`.

## Установка и запуск

```bash
npm install          # установка зависимостей
npm run dev          # запуск dev-сервера с nodemon
# или
npm start            # запуск без перезапуска на изменение файлов
```

Сервер по умолчанию доступен на `http://localhost:5000`.

## API (MVP)

- `POST /api/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Ответ 200: `{ "account": { ... } }` при успешной проверке
- `POST /api/register`
  - Body: `{ "email": "...", "password": "...", "name": "...", "surname": "..." }`
  - Ответ 201: `{ "account": { ... } }`, 409 если email занят

Формат входящих данных валидируется в `src/utils/validators.js`, пароли хранятся в хеше `bcrypt`.

## Рекомендованный рабочий процесс

1. Поднимите базу данных (Docker или локальная установка PostgreSQL)
2. Заполните `.env`
3. Запустите `npm run dev` и убедитесь, что сервер слушает нужный порт
4. Проверяйте ручки через Postman/curl, передавая `Content-Type: application/json`
5. Добавляйте новые модули в `src/routes`/`src/controllers`, соблюдая принцип разделения ответственности

## Дальнейшие шаги

- Добавление JWT/refresh-токенов
- Расширение схемы БД (профили, посты, подписки)
- Настройка автоматических тестов и CI/CD
