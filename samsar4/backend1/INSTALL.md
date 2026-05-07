# SAMSAR Backend — Installation Guide

## Prerequisites

- Node.js 18+ (LTS recommended — NOT 22.x)
- npm 9+

> ⚠️ **Important:** SQLite3 requires native compilation.
> Use **Node.js 18 LTS** for best compatibility.
> If using Node 20+, you may need build tools:
> ```bash
> # Ubuntu/Debian
> sudo apt-get install -y python3 make g++ libsqlite3-dev
>
> # macOS
> xcode-select --install
>
> # Windows
> npm install --global windows-build-tools
> ```

## Installation

```bash
# 1. Clone / unzip the project
cd samsar-backend

# 2. Install dependencies
npm install

# Note: if sqlite3 fails to compile, try:
npm install sqlite3 --build-from-source

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Seed demo data
npm run seed

# 5. Start development server
npm run start:dev
```

## Verify Installation

```bash
# Server running?
curl http://localhost:3001/api/properties

# Swagger docs
open http://localhost:3001/api/docs

# Login as admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@samsar.ma","password":"admin123"}'
```

## Alternative: Use PostgreSQL for Production

Change `app.module.ts`:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [...],
  synchronize: false, // use migrations in production
})
```

And install: `npm install pg`

## Environment Variables

```env
PORT=3001
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES=7d
DB_PATH=samsar.db
CIH_IBAN=MA64002301032100000000001234
WHATSAPP_SUPPORT=+212600000000
```

## Demo Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@samsar.ma | admin123 |
| Agent (active) | mohammed@samsar.ma | agent123 |
| Agent (active) | fatima@samsar.ma | agent123 |
| Agent (inactive) | youssef@samsar.ma | agent123 |
