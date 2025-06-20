# English Telegram Bot

**English Telegram Bot** is a Telegram mini-app that helps users learn and practice English words and expressions using the Spaced Repetition Method (SRM). It features built-in translation powered by [LibreTranslate](https://libretranslate.com/), deck sharing, and daily vocabulary reviews — all within Telegram.

This project is built as a monorepo using **PNPM**, **Turborepo**, **React.js**, **Node.js**, **NestJS**, and **PostgreSQL**.

![Preview](assets/preview.png)

## ✨ Features

- 📚 Create custom decks and folders to organize vocabulary
- ➕ Add words and expressions with definitions
- 🔁 Practice using the Spaced Repetition Algorithm (SRM)
- 🌍 Built-in English translation support via LibreTranslate
- 🤝 Share your decks with other users
- 📥 Import decks shared by others
- 📅 Daily practice reminders and review sessions
- 🧩 Built as a Telegram WebApp for seamless UX

_Planned:_
- 🌐 Support for additional languages (German, French, etc.)
- 📊 Track your learning progress with statistics

## 🧰 Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, NestJS
- **Database**: PostgreSQL (Dockerized)
- **Translations**: LibreTranslate (Dockerized)
- **Monorepo**: PNPM + Turborepo
- **ORM**: TypeORM

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or later, tested on v20)
- **pnpm** (v10 or later)
- **Docker Desktop** (for PostgreSQL and LibreTranslate)

### Installation

1. Clone the repository

```bash
git clone https://github.com/usein-abilev/english-tg-bot.git
cd english-tg-bot
```

2. Install dependencies

```bash 
pnpm install
```
3. Set up environment variables

Create a `.env` file in the root directory. Use `.env.example` as a reference:
```bash
cp .env.example .env
```

4. Start PostgreSQL and LibreTranslate using Docker
```bash
docker-compose up -d
```

6. Start the application
```bash
pnpm serve
```

> **NOTE:**  If you want to run the backend and frontend separately, you can use:
> ```bash
> pnpm run serve:api # backend
> pnpm run serve:web # frontend
> pnpm run serve:bot # telegram bot
> ```

## 🧪 Development
Use Turbo to run frontend/backend/dev tasks in parallel:
```bash
pnpm turbo run dev
```

## 🤝 Contributing
Contributions, ideas, and bug reports are welcome! Feel free to open issues or pull requests.
