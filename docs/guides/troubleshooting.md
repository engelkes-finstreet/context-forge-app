# Troubleshooting

## Common Issues

### TypeScript Errors

#### Issue: Type errors after schema changes

**Symptoms:**
- TypeScript complains about missing properties
- Prisma types don't match database schema
- IDE shows errors that should work

**Solution:**
```bash
npm run db:generate
```

Then restart your TypeScript server in your IDE:
- **VS Code**: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
- **WebStorm**: Right-click → "TypeScript" → "Restart TypeScript Service"

#### Issue: Cannot find module '@prisma/client'

**Solution:**
```bash
npm install
npm run db:generate
```

### Database Connection

#### Issue: Database connection failed

**Symptoms:**
- Error: `Can't reach database server`
- Error: `Authentication failed`
- Application fails to start

**Solution:**

1. **Check PostgreSQL is running:**
```bash
# If using Docker
npm run db:start

# Check PostgreSQL status
psql --version
```

2. **Verify DATABASE_URL:**
```bash
# Check .env file
cat .env | grep DATABASE_URL
```

3. **Test connection:**
```bash
npx prisma db pull
```

4. **Check credentials:**
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE"
```

Common mistakes:
- Wrong password
- Database doesn't exist
- PostgreSQL not running
- Wrong port (default: 5432)

#### Issue: Database does not exist

**Solution:**

Create the database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE context_forge_dev;

# Exit
\q
```

Then run migrations:
```bash
npm run db:migrate
```

### Migration Issues

#### Issue: Migration conflicts

**Symptoms:**
- Error: `Migration failed to apply`
- Error: `Table already exists`
- Migrations out of sync

**Solution for Development:**
```bash
# WARNING: This deletes all data
npx prisma migrate reset
```

**Solution for Production:**
```bash
# Pull current database state
npx prisma db pull

# Review differences
git diff prisma/schema.prisma

# Create new migration
npx prisma migrate dev --name fix_schema
```

#### Issue: "Database is not empty"

**Symptoms:**
- Can't run initial migration
- Error about existing tables

**Solution:**
```bash
# Option 1: Reset database (deletes data)
npx prisma migrate reset

# Option 2: Baseline existing database
npx prisma migrate resolve --applied "migration_name"
```

### Form Validation

#### Issue: Form not validating

**Symptoms:**
- Form submits with invalid data
- No error messages shown
- Validation schema not being used

**Solution:**

1. **Check schema matches form fields:**
```typescript
// Schema
export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

// Form config
const fields: FormFieldsType<CreateProjectInput> = {
  name: { type: 'input', label: 'Name' },
  description: { type: 'textarea', label: 'Description' },
};
```

2. **Verify field names:**
```typescript
// ✅ Good - using fieldNames
<DynamicFormField fieldName={fieldNames.name} />

// ❌ Bad - hardcoded string (typo-prone)
<DynamicFormField fieldName="nmae" />
```

#### Issue: Hidden field validation errors

**Symptoms:**
- Error: "Field is required"
- Hidden field showing validation error

**Solution:**

Don't render hidden fields:
```typescript
// ✅ Good
<Form formConfig={formConfig}>
  <DynamicFormField fieldName={fieldNames.name} />
  {/* taskId is hidden, not rendered */}
</Form>

// ❌ Bad
<Form formConfig={formConfig}>
  <DynamicFormField fieldName={fieldNames.taskId} />
  <DynamicFormField fieldName={fieldNames.name} />
</Form>
```

### Server Actions

#### Issue: Server action redirect not working

**Symptoms:**
- Page doesn't redirect after form submission
- Error caught even though operation succeeded

**Solution:**

Move `redirect()` outside try-catch:
```typescript
// ✅ Good - redirect outside try-catch
try {
  const project = await ProjectService.create(data);
  revalidatePath('/projects');
} catch (error) {
  return { error: 'Failed', message: null };
}
redirect(`/projects/${project.id}`);

// ❌ Bad - redirect caught by catch
try {
  const project = await ProjectService.create(data);
  redirect(`/projects/${project.id}`);
} catch (error) {
  return { error: 'Failed', message: null };
}
```

#### Issue: Cache not updating after mutation

**Symptoms:**
- Page shows stale data after update
- Need to refresh to see changes

**Solution:**

Add revalidation:
```typescript
const project = await ProjectService.update(id, data);
revalidatePath('/projects');
revalidatePath(`/projects/${id}`);
redirect(`/projects/${id}`);
```

### Build Errors

#### Issue: Build fails with type errors

**Solution:**

1. **Run type check:**
```bash
npm run type-check
```

2. **Regenerate Prisma client:**
```bash
npm run db:generate
```

3. **Clear Next.js cache:**
```bash
rm -rf .next
npm run build
```

#### Issue: Module not found during build

**Solution:**

1. **Clear node_modules:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Check imports:**
```typescript
// ✅ Good - using alias
import { db } from '@/lib/db';

// ❌ Bad - relative path might break
import { db } from '../../lib/db';
```

### Performance Issues

#### Issue: Slow page loads

**Solution:**

1. **Check database queries:**
```typescript
// ✅ Good - minimal relations
include: { _count: { select: { tasks: true } } }

// ❌ Bad - over-fetching
include: { tasks: { include: { subtasks: true } } }
```

2. **Use Suspense boundaries:**
```typescript
<Suspense fallback={<Skeleton />}>
  <ProjectList />
</Suspense>
```

3. **Enable Next.js production mode:**
```bash
npm run build
npm run start
```

#### Issue: Large bundle size

**Solution:**

1. **Check client components:**
```bash
npm run build
# Check output for large chunks
```

2. **Move to server components where possible:**
```typescript
// ✅ Good - server component
export default async function Page() {
  const data = await fetchData();
  return <Display data={data} />;
}

// ❌ Bad - unnecessary client component
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchData().then(setData); }, []);
  return <Display data={data} />;
}
```

### Development Server Issues

#### Issue: Port already in use

**Symptoms:**
- Error: `Port 3000 is already in use`

**Solution:**

1. **Use different port:**
```bash
PORT=3001 npm run dev
```

2. **Find and kill process using port:**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Issue: Hot reload not working

**Solution:**

1. **Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

2. **Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

3. **Check file watchers limit (Linux):**
```bash
# Increase limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Authentication Issues

#### Issue: Better Auth errors

**Solution:**

1. **Check environment variables:**
```env
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
```

2. **Regenerate secret:**
```bash
openssl rand -base64 32
```

3. **Check auth configuration:**
```typescript
// src/lib/auth.ts
```

### Prisma Studio

#### Issue: Prisma Studio won't open

**Solution:**

1. **Check port 5555:**
```bash
lsof -i :5555
```

2. **Use different port:**
```bash
npx prisma studio --port 5556
```

3. **Check database connection:**
```bash
npx prisma db pull
```

## Debugging Tips

### Enable Debug Logging

#### Next.js
```bash
NODE_OPTIONS='--inspect' npm run dev
```

#### Prisma
```env
DEBUG="prisma:*"
```

### Check Logs

#### Development
```bash
npm run dev
# Check console output
```

#### Production
```bash
npm run build
npm run start
# Check server logs
```

### Browser DevTools

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Use React Developer Tools

### Database Inspection

#### View data
```bash
npm run db:studio
```

#### Execute raw SQL
```bash
psql $DATABASE_URL

# List tables
\dt

# Describe table
\d table_name

# Query data
SELECT * FROM "Project";
```

## Getting Help

### Before Asking for Help

1. **Check error message carefully**
2. **Search documentation**
3. **Check GitHub issues**
4. **Try searching the error message**

### Providing Information

When asking for help, include:
- Error message (full stack trace)
- Steps to reproduce
- Environment (OS, Node version, etc.)
- Relevant code snippets
- What you've tried

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js GitHub Issues](https://github.com/vercel/next.js/issues)
- [Prisma GitHub Issues](https://github.com/prisma/prisma/issues)
