# koda-b6-backend-node

REST API backend built with **Express.js** and **PostgreSQL**.

---

## Tech Stack

- **Runtime**: Node.js (ESM / `"type": "module"`)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (`pg`)
- **Linter**: ESLint

---

## Project Structure

```
src/
├── controller/
│   ├── auth.controller.js
│   └── users.controller.js
├── lib/
│   └── db.js
├── model/
│   ├── auth.model.js
│   └── users.model.js
├── router/
│   ├── admin.router.js
│   ├── auth.router.js
│   └── users.router.js
├── app.js
└── main.js
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/VirgilIw/koda-b6-backend-node.git
cd koda-b6-backend-node
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```dotenv
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SSLMODE=
```

| Variable      | Description                          |
|---------------|--------------------------------------|
| `PORT`        | Port the server will run on          |
| `DB_HOST`     | PostgreSQL host                      |
| `DB_PORT`     | PostgreSQL port (default: `5432`)    |
| `DB_USERNAME` | PostgreSQL username                  |
| `DB_PASSWORD` | PostgreSQL password                  |
| `DB_NAME`     | PostgreSQL database name             |
| `DB_SSLMODE`  | SSL mode (`disable` / `require`)     |

### 4. Run the server

```bash
# Development (with watch mode)
npm run dev

# Production
npm start
```

---

## Scripts

| Command        | Description                        |
|----------------|------------------------------------|
| `npm run dev`  | Run with watch mode (auto-restart) |
| `npm start`    | Run in production mode             |
| `npm run lint` | Lint source files                  |
| `npm run lint:fix` | Auto-fix lint issues           |

---

## API Routes

| Prefix    | Router File          | Description       |
|-----------|----------------------|-------------------|
| `/auth`   | `auth.router.js`     | Authentication    |
| `/users`  | `users.router.js`    | User management   |
| `/admin`  | `admin.router.js`    | Admin operations  |

---

## License

ISC
