# ⭐ Ratings App — NestJS + React + PostgreSQL

A full-stack application for managing **users, stores, and ratings**, built with:
- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** React + Vite + Axios
- **Database:** PostgreSQL (via Docker or local installation)

---

## ✅ Features
- User authentication (Signup, Login)
- Roles: `system_admin`, `store_owner`, `normal_user`
- Admin can manage users and stores
- Store owners can view ratings by users
- Normal users can rate stores (1–5 stars)
- Prisma ORM for database operations
- Secure password hashing with `bcrypt`
- JWT-based authentication

---

## ✅ Project Structure
├── backend/
│ ├── main.ts # NestJS API entry point
│ ├── prisma/
│ │ └── schema.prisma
│ ├── tsconfig.json
│ └── package.json
└── frontend/
├── src/App.tsx # React App entry
├── tsconfig.json
└── package.json
