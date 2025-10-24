# Database Setup

## Prerequisites

- PostgreSQL installed locally or accessible remotely
- Node.js 20+
- npm or yarn

## Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/context-forge-dev"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

## Development Commands

### Start PostgreSQL

```bash
npm run db:start
```

Starts PostgreSQL using Docker (if configured) or assumes PostgreSQL is running locally.

### Generate Prisma Client

```bash
npm run db:generate
```

Generates TypeScript types based on your Prisma schema. Run this after any schema changes.

### Push Schema Changes (Development)

```bash
npm run db:push
```

Pushes schema changes directly to the database without creating migrations. Useful during development.

**Note:** This does not create migration files. Use migrations for production.

### Open Prisma Studio

```bash
npm run db:studio
```

Opens Prisma Studio, a visual database browser at `http://localhost:5555`.

## Database Migrations

### Create a Migration

```bash
npx prisma migrate dev --name migration_name
```

Creates a new migration file and applies it to the database.

**Example:**

```bash
npx prisma migrate dev --name add_subtask_type
```

### Reset Database

```bash
npx prisma migrate reset
```

**WARNING:** This deletes all data and reapplies all migrations from scratch.

### Deploy Migrations (Production)

```bash
npx prisma migrate deploy
```

Applies pending migrations to the production database. Use this in CI/CD pipelines.

## Migration Workflow

### Development Workflow

1. **Modify Schema**: Edit `prisma/schema.prisma`
2. **Generate Types**: Run `npm run db:generate`
3. **Push Changes**: Run `npm run db:push` for quick iteration
4. **Create Migration**: When ready, run `npx prisma migrate dev --name description`

### Production Workflow

1. **Test Locally**: Ensure migrations work in development
2. **Commit Migrations**: Add migration files to version control
3. **Deploy**: Run `npx prisma migrate deploy` in production

## Common Issues

### TypeScript Errors After Schema Changes

**Solution:**

```bash
npm run db:generate
```

Then restart your TypeScript server in your IDE.

### Database Connection Errors

**Check PostgreSQL is running:**

```bash
npm run db:start
```

**Verify DATABASE_URL:**

```bash
echo $DATABASE_URL
```

### Migration Conflicts

**Development - Reset Database:**

```bash
npx prisma migrate reset
```

**Production - Manual Fix:**

```bash
# Pull current database state
npx prisma db pull

# Review differences and create migration
npx prisma migrate dev --name fix_conflict
```

## Database Inspection

### View Schema

```bash
npx prisma db pull
```

Pulls the current database schema and updates `schema.prisma`.

### Execute Raw SQL

```bash
psql $DATABASE_URL
```

Opens PostgreSQL CLI for direct database access.

### Seed Database

If you have a seed script configured:

```bash
npx prisma db seed
```

See `prisma/seed.ts` for seed data configuration.
