# Тестовое задание

## Стек

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Redis
- **Auth:** JWT (access + refresh токены в httpOnly cookies)
- **Frontend:** Vanilla JS, HTML, CSS

---

## Требования

Перед запуском убедитесь, что установлены:

- Node.js >= 18
- PostgreSQL (например, через pgAdmin 4)
- Redis

---

## Запуск

### 1. Клонировать репозиторий
```bash
git clone <ссылка на репозиторий>
cd <папка проекта>
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Настроить переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

### 4. Создать базу данных

В pgAdmin 4 создайте новую базу данных и укажите её название в `.env` в переменной `DATABASE_URL`.

### 5. Применить миграции и заполнить БД
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

### 6. Запустить проект
```bash
npm run dev
```

Клиент доступен по адресу: `http://localhost:3000`

---

## Тестовые аккаунты (после seed)

| Роль  | Email           | Пароль   |
|-------|-----------------|----------|
| Admin | admin@admin.com | Admin-password |
