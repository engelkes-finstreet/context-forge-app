# Development Setup

## Prerequisites

- **Node.js**: Version 20 or higher
- **PostgreSQL**: Version 14 or higher
- **npm** or **yarn**: Package manager
- **Git**: For version control

## Environment Configuration

### 1. Create Environment File

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/context-forge-dev"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_TOKEN="your-github-token-here"
```

### 2. Generate Auth Secret

Generate a secure secret for Better Auth:

```bash
openssl rand -base64 32
```

Copy the output and set it as `BETTER_AUTH_SECRET` in your `.env` file.

### 3. Configure Database URL

Update `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
```

**Example for local development:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/context-forge-dev"
```

### 4. Configure GitHub Token (Optional)

For accessing company GitHub repositories to fetch Swagger/OpenAPI files:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token and set it as `GITHUB_TOKEN` in your `.env` file

**Note:** Without this token, only public repositories are accessible.

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd context-forge-app
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Prisma, React, and more.

### 3. Setup Database

#### Start PostgreSQL (if using Docker)

```bash
npm run db:start
```

#### Generate Prisma Client

```bash
npm run db:generate
```

#### Run Migrations

```bash
npm run db:migrate
```

Or for development, push schema directly:

```bash
npm run db:push
```

## Development Commands

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Database Commands

### Generate Prisma Client

After schema changes:

```bash
npm run db:generate
```

### Push Schema Changes

For rapid development:

```bash
npm run db:push
```

**Note:** This doesn't create migration files.

### Create Migration

For production-ready changes:

```bash
npx prisma migrate dev --name migration_description
```

### Open Prisma Studio

Visual database browser:

```bash
npm run db:studio
```

Available at `http://localhost:5555`.

### Reset Database

**WARNING:** Deletes all data!

```bash
npx prisma migrate reset
```

## Verification Steps

### 1. Check Database Connection

```bash
npx prisma db pull
```

Should complete without errors.

### 2. Verify Environment Variables

```bash
npm run dev
```

Check console for any environment variable warnings.

### 3. Access Application

Visit `http://localhost:3000` in your browser.

### 4. Check Prisma Studio

```bash
npm run db:studio
```

Verify you can see the database tables.

## Common Issues

### Port Already in Use

If port 3000 is taken:

```bash
PORT=3001 npm run dev
```

### Database Connection Failed

Check:

1. PostgreSQL is running
2. `DATABASE_URL` is correct
3. Database exists
4. Credentials are valid

### Prisma Client Errors

Regenerate Prisma client:

```bash
npm run db:generate
```

Then restart your development server.

### TypeScript Errors

After schema changes:

```bash
npm run db:generate
```

Restart your IDE's TypeScript server.

## Project Structure

```
context-forge-app/
├── src/
│   ├── app/                  # Next.js pages and API routes
│   ├── components/           # Shared components
│   ├── features/             # Feature-specific components
│   └── lib/                  # Utilities, services, actions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration files
├── public/                   # Static assets
├── .env                      # Environment variables (not in git)
├── .env.example              # Example environment variables
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Next Steps

After setup:

1. **Explore the codebase**: Start with `src/app/` for pages
2. **Read the documentation**: Check `docs/` folder
3. **Create a project**: Use the UI to create your first project
4. **Try the MCP server**: Test the API endpoints

## IDE Setup

### VS Code

Recommended extensions:

- **Prisma**: Syntax highlighting for Prisma schema
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Language support
- **Tailwind CSS IntelliSense**: Tailwind autocomplete

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Debugging

### Next.js Debug Mode

```bash
NODE_OPTIONS='--inspect' npm run dev
```

### Prisma Debug Logging

```env
DEBUG="prisma:*"
```

### Browser DevTools

Use React Developer Tools extension for debugging React components.

## Performance

### Development Mode

Development mode includes:

- Hot module replacement
- Detailed error messages
- Source maps
- Slower performance (expected)

### Production Mode

For testing production performance:

```bash
npm run build
npm run start
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
