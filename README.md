# Capstone Project

This project was developed as a **Capstone Project** for  
**Adama Science and Technology University (ASTU)**.

This project is a full-stack web application built using **Next.js**, **Bun**, and **PostgreSQL**, following modern web development practices with a clear separation between frontend and backend.

---

## 🚀 Tech Stack

### Frontend

- **Next.js 16** (React 19)
- **Tailwind CSS**
- **Radix UI**
- **Material UI**
- **React Hook Form + Zod**
- **Recharts**

### Backend

- **Bun** runtime
- **TypeScript**
- **Drizzle ORM**
- **PostgreSQL**
- **@bepalo/router**
- **@bepalo/jwt**
- **@bepalo/cache**
- **@bepalo/time**

## ⚙️ Prerequisites

- Node.js (v18+)
- Bun — https://bun.sh
- PostgreSQL (v14+)

---

## 🔐 Environment Variables

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Server
URL=http://localhost
EMAIL_DOMAIN=choicex.gov.et

## Backend
BACKEND_PORT=4000
JWT_AUTH_KEY=fSuwkiibZGgROT9gukjqBDNi-u3aRo3jhruNBvK4gfyaZfyjDzlzZY3VAexry-xa
JWT_AUTH_ALG=HS256
SALT_ROUNDS=10

## Frontend
PORT=3000

#  DB
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/choicex"
SUPER_ADMIN_EMAIL="super.admin@choicex.gov.et"
SUPER_ADMIN_FULLNAME="Super Admin"
SUPER_ADMIN_PASSWORD="SuperAdmin@12345"
```

---

## 🗄️ Database Setup

```bash
bunx drizzle-kit push
```

---

## 📦 Install Dependencies

```bash
bun install
```

---

## 🧪 Development Mode

```bash
bun run dev
# or
bun run dev:backend
bun run dev:frontend
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## 🏗️ Production Build

```bash
bun run build
bun run start
# or
bun run start:backend
bun run start:frontend
```

---
