# Turborepo

## Getting Started

### Prerequisites
- Node.js
- pnpm
- Docker (for PostgreSQL database)

### Installation

First, install all dependencies:

```bash
pnpm install
```

## Database

### Running PostgreSQL

To start the PostgreSQL database:

```bash
pnpm db:up
```

To stop the database:

```bash
pnpm db:down
```

### Database Configuration

Before synchronizing the database with existing migrations, create a `.env` file in `packages/database` with the following content:

```
DATABASE_URL="postgresql://colibra:colibra@localhost:5432/colibra_db?schema=public"
```

### Migrations

To synchronize the database with existing migrations, run:

```bash
pnpm db:migrate:dev
```

### Prisma Studio

Command to run Prisma Studio for viewing data:

```bash
pnpm db:studio
```

## Running the Application

### Hono Server

1. Create a `.env` file in `apps/server`
2. Run the server:

```bash
pnpm exec turbo dev --filter=server
```

### Next.js Frontend

Run the Next.js application:

```bash
pnpm exec turbo dev --filter=web
```

## Testing Emails

To test email functionality, you can use the built-in test email feature:

```bash
cd packages/email
pnpm test:email
```

This command will:
- Send a test verification email using Ethereal (test SMTP service)
- Display a preview URL where you can view the sent email
- No need to build the project - it runs directly with tsx

The test email uses sample data and sends to a test recipient for verification purposes.

## Project Structure

The project consists of:
- **apps/web** - Next.js application (frontend)
- **apps/server** - Hono server (backend API)
- **packages/api** - Shared API logic
- **packages/auth** - Shared authentication logic
- **packages/database** - Database configuration and Prisma
- **packages/email** - Email service with Nodemailer integration