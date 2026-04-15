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

```env
PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SSLMODE=
```

| Variable      | Description                            |
| ------------- | -------------------------------------- |
| `PORT`        | Port the server will run on            |
| `DB_HOST`     | PostgreSQL host                        |
| `DB_PORT`     | PostgreSQL port (default: `5432`)      |
| `DB_USERNAME` | PostgreSQL username                    |
| `DB_PASSWORD` | PostgreSQL password                    |
| `DB_NAME`     | PostgreSQL database name               |
| `DB_SSLMODE`  | SSL mode (`disable` / `require`)       |

### 4. Run the server

```bash
# Development (with watch mode)
npm run dev

# Production
npm start
```

---

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Run with watch mode          |
| `npm start`       | Run in production mode       |
| `npm run lint`    | Lint source files            |
| `npm run lint:fix`| Auto-fix lint issues         |

---

## API Reference

Base URL: `http://localhost:8888`

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

### 🔐 Auth

#### `POST /auth/register`

Register a new user.

**Request**
```http
POST /auth/register HTTP/1.1
Host: localhost:8888
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@gmail.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

**Response `201 Created`**
```json
{
  "message": "Register success",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@gmail.com"
  }
}
```

**Response `400 Bad Request`** — password mismatch / missing fields
```json
{
  "message": "Password and confirmPassword do not match"
}
```

**Response `409 Conflict`** — email already registered
```json
{
  "message": "Email already exists"
}
```

---

#### `POST /auth/login`

Login and receive a JWT token.

**Request**
```http
POST /auth/login HTTP/1.1
Host: localhost:8888
Content-Type: application/json

{
  "email": "john@gmail.com",
  "password": "secret123"
}
```

**Response `200 OK`**
```json
{
  "message": "Login success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response `400 Bad Request`** — missing fields
```json
{
  "message": "Email and password are required"
}
```

**Response `401 Unauthorized`** — wrong credentials
```json
{
  "message": "Invalid email or password"
}
```

---

### 👤 Users

#### `PATCH /users/:id`

Update a user's data.

**Request**
```http
PATCH /users/10 HTTP/1.1
Host: localhost:8888
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "newemail@gmail.com",
  "password": "newpassword"
}
```

**Response `200 OK`**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": 10,
    "email": "newemail@gmail.com"
  }
}
```

**Response `404 Not Found`**
```json
{
  "message": "User not found"
}
```

---

#### `DELETE /users/:id`

Delete a user by ID.

**Request**
```http
DELETE /users/10 HTTP/1.1
Host: localhost:8888
Authorization: Bearer <token>
```

**Response `200 OK`**
```json
{
  "message": "User deleted successfully"
}
```

**Response `404 Not Found`**
```json
{
  "message": "User not found"
}
```

---

### 🛡️ Admin

> All admin routes require a valid JWT token with role `admin`.

#### `GET /admin/users`

Get all users.

**Request**
```http
GET /admin/users HTTP/1.1
Host: localhost:8888
Authorization: Bearer <token>
```

**Response `200 OK`**
```json
{
  "message": "Success",
  "data": [
    {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@gmail.com",
      "role": "user"
    },
    {
      "id": 2,
      "fullname": "Admin User",
      "email": "admin@gmail.com",
      "role": "admin"
    }
  ]
}
```

**Response `401 Unauthorized`**
```json
{
  "message": "Unauthorized"
}
```

**Response `403 Forbidden`** — not an admin
```json
{
  "message": "Forbidden"
}
```

---

#### `GET /admin/users/:id`

Get a single user by ID.

**Request**
```http
GET /admin/users/1 HTTP/1.1
Host: localhost:8888
Authorization: Bearer <token>
```

**Response `200 OK`**
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@gmail.com",
    "role": "user"
  }
}
```

**Response `404 Not Found`**
```json
{
  "message": "User not found"
}
```

---

#### `POST /admin/users`

Create a new user (admin only).

**Request**
```http
POST /admin/users HTTP/1.1
Host: localhost:8888
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "newuser@gmail.com",
  "password": "secret123"
}
```

**Response `201 Created`**
```json
{
  "message": "User created successfully",
  "data": {
    "id": 22,
    "email": "newuser@gmail.com",
    "role": "user"
  }
}
```

---

## HTTP Status Codes

| Code  | Meaning                               |
| ----- | ------------------------------------- |
| `200` | OK — request succeeded                |
| `201` | Created — resource created            |
| `400` | Bad Request — validation error        |
| `401` | Unauthorized — token missing/invalid  |
| `403` | Forbidden — insufficient permissions  |
| `404` | Not Found — resource not found        |
| `409` | Conflict — duplicate resource         |
| `500` | Internal Server Error                 |

---

## License

MIT License

Copyright (c) 2026 VirgilIw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
