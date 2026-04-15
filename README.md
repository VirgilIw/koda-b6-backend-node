# koda-b6-backend-node

REST API backend untuk aplikasi **Koda Batch 6**, dibangun dengan **Express.js**, **PostgreSQL**, dan **Redis**. Mendukung autentikasi berbasis JWT, manajemen pengguna, upload file, dokumentasi API otomatis via Swagger, serta Dockerized deployment.

---

## Daftar Isi

- [Tech Stack](#tech-stack)
- [Fitur Utama](#fitur-utama)
- [Prasyarat](#prasyarat)
- [Struktur Proyek](#struktur-proyek)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Menjalankan dengan Docker](#menjalankan-dengan-docker)
- [Scripts](#scripts)
- [API Routes](#api-routes)
- [Dokumentasi API (Swagger)](#dokumentasi-api-swagger)
- [Linting](#linting)
- [Lisensi](#lisensi)

---

## Tech Stack

| Kategori       | Teknologi                          |
|----------------|------------------------------------|
| Runtime        | Node.js (ESM / `"type": "module"`) |
| Framework      | Express.js v5                      |
| Database       | PostgreSQL (`pg`)                  |
| Cache/Session  | Redis (`redis`)                    |
| Auth           | JWT (`jsonwebtoken`) + Argon2      |
| Upload File    | Multer                             |
| ID Generation  | Nanoid                             |
| Docs           | Swagger (`swagger-jsdoc` + `swagger-ui-express`) |
| Linter         | ESLint v10                         |
| Containerize   | Docker                             |

---

## Fitur Utama

- **Autentikasi** — Register, login, logout dengan JWT dan password hashing menggunakan Argon2
- **Manajemen Pengguna** — CRUD profil pengguna
- **Admin Panel** — Route khusus admin dengan kontrol akses berbeda
- **Upload Foto Profil** — File upload menggunakan Multer, disimpan di `uploads/profile/`
- **Redis Caching** — Digunakan untuk session/token management
- **Swagger UI** — Dokumentasi API interaktif otomatis
- **CORS** — Dikonfigurasi via environment variable `FRONTEND_URL`
- **Docker Ready** — Siap di-deploy menggunakan Docker

---

## Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) >= 18 (untuk dukungan ESM dan `--env-file`)
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Redis](https://redis.io/) >= 7
- [Docker](https://www.docker.com/) *(opsional, untuk deployment via container)*

---

## Struktur Proyek

```
koda-b6-backend-node/
├── .github/
│   └── workflows/          # CI/CD GitHub Actions
├── migrations/             # File migrasi database SQL
├── src/
│   ├── controller/
│   │   ├── auth.controller.js      # Logic autentikasi (register, login, logout)
│   │   └── users.controller.js     # Logic manajemen pengguna
│   ├── lib/
│   │   └── db.js                   # Koneksi PostgreSQL
|   |   └── hash.js                 # hash password argon2
|   |   └── jwt.js                  # json web token
|   |   └── redis.js                # caching dengan redis
│   ├── model/
│   │   ├── auth.model.js           # Query DB untuk autentikasi
│   │   └── users.model.js          # Query DB untuk pengguna
│   ├── router/
│   │   ├── admin.router.js         # Route admin
│   │   ├── auth.router.js          # Route autentikasi
│   │   └── users.router.js         # Route pengguna
│   ├── app.js                      # Setup Express & middleware
│   └── main.js                     # Entry point server
├── uploads/
│   └── profile/                    # Direktori upload foto profil
├── .editorconfig
├── .env.example                    # Template environment variables
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── package.json
├── package-lock.json
└── test.http                       # File pengujian HTTP manual
```

---

## Getting Started

### 1. Clone repositori

```bash
git clone https://github.com/VirgilIw/koda-b6-backend-node.git
cd koda-b6-backend-node
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu isi nilai-nilainya. Lihat bagian [Environment Variables](#environment-variables) untuk panduan lengkap.

### 4. Setup database

Jalankan migrasi SQL yang ada di folder `migrations/` ke dalam database PostgreSQL kamu:

```bash
psql -U <DB_USERNAME> -d <DB_NAME> -f migrations/<nama_file>.sql
```

### 5. Jalankan server

```bash
# Mode development (auto-restart saat ada perubahan)
npm run dev

# Mode production
npm start
```

Server akan berjalan di `http://localhost:<PORT>`.

---

## Environment Variables

Salin `.env.example` ke `.env` dan isi seluruh variabel berikut:

```env
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SSLMODE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

FRONTEND_URL=
APP_URL=
```

| Variable          | Deskripsi                                               | Contoh                        |
|-------------------|---------------------------------------------------------|-------------------------------|
| `PORT`            | Port yang digunakan server                              | `3000`                        |
| `DB_HOST`         | Host database PostgreSQL                                | `localhost`                   |
| `DB_PORT`         | Port PostgreSQL                                         | `5432`                        |
| `DB_USERNAME`     | Username PostgreSQL                                     | `postgres`                    |
| `DB_PASSWORD`     | Password PostgreSQL                                     | `password123`                 |
| `DB_NAME`         | Nama database                                           | `koda_db`                     |
| `DB_SSLMODE`      | Mode SSL koneksi DB (`disable` / `require`)             | `disable`                     |
| `REDIS_HOST`      | Host server Redis                                       | `localhost`                   |
| `REDIS_PORT`      | Port Redis                                              | `6379`                        |
| `REDIS_PASSWORD`  | Password Redis (kosongkan jika tidak ada)               | `redispassword`               |
| `FRONTEND_URL`    | URL frontend untuk konfigurasi CORS                     | `http://localhost:5173`       |
| `APP_URL`         | URL publik backend (digunakan untuk link file/upload)   | `http://localhost:3000`       |

---

## Menjalankan dengan Docker

### Build image

```bash
docker build -t koda-b6-backend .
```

### Jalankan container

```bash
docker run -d \
  --name koda-backend \
  -p 3000:3000 \
  --env-file .env \
  koda-b6-backend
```

> Pastikan PostgreSQL dan Redis sudah berjalan dan dapat diakses dari dalam container (gunakan `host.docker.internal` jika keduanya berjalan di host lokal).

### Menggunakan Docker Compose (opsional)

Jika ingin menjalankan backend bersama PostgreSQL dan Redis sekaligus, buat file `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: koda_db
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

Lalu jalankan:

```bash
docker compose up -d
```

---

## Scripts

| Command           | Deskripsi                                      |
|-------------------|------------------------------------------------|
| `npm run dev`     | Jalankan server dengan watch mode (auto-restart) |
| `npm start`       | Jalankan server mode production                |
| `npm run lint`    | Cek lint pada semua file di `src/`             |
| `npm run lint:fix`| Auto-fix masalah lint                          |

---

## API Routes

| Prefix    | Router File         | Deskripsi                                  |
|-----------|---------------------|--------------------------------------------|
| `/auth`   | `auth.router.js`    | Autentikasi (register, login, logout)      |
| `/users`  | `users.router.js`   | Manajemen profil & data pengguna           |
| `/admin`  | `admin.router.js`   | Operasi khusus admin                       |

### Contoh Endpoint Auth

| Method | Endpoint            | Deskripsi              |
|--------|---------------------|------------------------|
| POST   | `/auth/register`    | Daftarkan pengguna baru |
| POST   | `/auth/login`       | Login & dapatkan token JWT |
| POST   | `/auth/logout`      | Invalidasi token / logout |

### Contoh Endpoint Users

| Method | Endpoint            | Deskripsi                    |
|--------|---------------------|------------------------------|
| GET    | `/users/me`         | Ambil data profil sendiri    |
| PUT    | `/users/me`         | Update profil                |
| POST   | `/users/me/photo`   | Upload foto profil           |

> Endpoint lengkap dapat dilihat melalui Swagger UI setelah server berjalan.

---

## Dokumentasi API (Swagger)

Setelah server berjalan, akses dokumentasi interaktif di:

```
http://localhost:<PORT>/api-docs
```

Swagger UI memungkinkan kamu untuk melihat semua endpoint, parameter, dan mencoba request langsung dari browser.

---

## Linting

Proyek menggunakan **ESLint v10** dengan konfigurasi flat config (`eslint.config.js`).

```bash
# Cek semua file
npm run lint

# Auto-fix
npm run lint:fix
```

---

## Dependencies

### Production

| Package              | Versi    | Kegunaan                              |
|----------------------|----------|---------------------------------------|
| `express`            | ^5.2.1   | Web framework                         |
| `pg`                 | ^8.20.0  | PostgreSQL client                     |
| `redis`              | ^5.12.1  | Redis client                          |
| `jsonwebtoken`       | ^9.0.3   | JWT sign & verify                     |
| `argon2`             | ^0.44.0  | Password hashing                      |
| `multer`             | ^2.1.1   | File upload middleware                 |
| `nanoid`             | ^5.1.7   | Generate ID unik                      |
| `cors`               | ^2.8.6   | Cross-Origin Resource Sharing         |
| `dotenv`             | ^17.4.2  | Load environment variables            |
| `swagger-jsdoc`      | ^6.2.8   | Generate OpenAPI spec dari JSDoc      |
| `swagger-ui-express` | ^5.0.1   | Serve Swagger UI                      |

### Development

| Package       | Versi    | Kegunaan            |
|---------------|----------|---------------------|
| `eslint`      | ^10.1.0  | Linter              |
| `@eslint/js`  | ^10.0.1  | ESLint base config  |
| `globals`     | ^17.4.0  | Global variable defs|

---

## Lisensi

Proyek ini dilisensikan di bawah **ISC License**.
