
# Development Guide

This document explains how to set up, run, migrate, stop, and troubleshoot the Wedding Planner application locally.

## 1. Technology Stack

The application uses:

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- ORM: Prisma
- Database: PostgreSQL 17
- Database container: Docker Compose
- Version control: Git and GitHub

## 2. Prerequisites

Install the following before starting:

- Node.js (supported LTS version)
- npm
- Docker Desktop
- Git

Verify the installations:

```bash
node --version
npm --version
docker --version
docker compose version
git --version
```

Make sure Docker Desktop is running before starting the database.

## 3. Clone and Install

Clone the repository:

```bash
git clone <repository-url>
cd wedding-planner
```

Install backend dependencies:

```bash
cd server
npm install
cd ..
```

If the frontend is configured, install its dependencies:

```bash
cd client
npm install
cd ..
```

## 4. Environment Variables

Environment files contain configuration such as database credentials and application ports.

Do not commit real `.env` files to Git.

### Root environment

Create `.env` in the project root using `.env.example`:

```bash
cp .env.example .env
```

Example:

```dotenv
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_local_password
POSTGRES_DB=wedding_planner
POSTGRES_PORT=5433
```

These variables are used by Docker Compose.

### Backend environment

Create `server/.env` using `server/.env.example`:

```bash
cp server/.env.example server/.env
```

Example:

```dotenv
DATABASE_URL="postgresql://postgres:your_local_password@localhost:5433/wedding_planner?schema=public"
PORT=3000
NODE_ENV=development
```

The credentials, database name, and port must match the root environment.

If your password contains special URL characters, encode them appropriately inside `DATABASE_URL`.

**Important:** Docker containers connect to PostgreSQL internally on port `5432`, while applications running directly on your computer connect through port `5433`.

## 5. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL in the background.

Check container status:

```bash
docker compose ps
```

The PostgreSQL container should display a healthy status.

Example:

```text
SERVICE    STATUS
postgres   Up (healthy)
```

View database logs:

```bash
docker compose logs -f postgres
```

Press `Ctrl + C` to stop following the logs. This does not stop the container.

## 6. Prisma Setup and Migrations

Prisma manages the database schema through version-controlled migrations.

Run Prisma commands from the `server/` directory.

### Generate the Prisma client

```bash
cd server
npx prisma generate
```

This generates the Prisma client based on the schema and generator configuration.

### Apply existing migrations

```bash
npx prisma migrate deploy
```

This applies migrations already committed to the repository.

Use this when setting up an existing database or applying migrations without creating new ones.

### Create a new migration

After modifying `prisma/schema.prisma`, run:

```bash
npx prisma migrate dev --name descriptive_migration_name
```

Example:

```bash
npx prisma migrate dev --name add_guest_table
```

This creates and applies a development migration.

### Check migration status

```bash
npx prisma migrate status
```

### Open Prisma Studio

```bash
npx prisma studio
```

Prisma Studio provides a browser-based interface to inspect and edit database records.

### Migration conventions

- Use descriptive migration names in snake_case.
- Commit migration files to Git.
- Review generated SQL before merging significant schema changes.
- Never manually modify migration history after it has been applied to shared environments.
- Use `prisma migrate dev` for creating migrations during development.
- Use `prisma migrate deploy` for applying existing migrations.
- Avoid `prisma db push` as a substitute for migrations in the normal project workflow.
- Never run destructive reset commands against a shared or production database.

## 7. Start the Backend

Open a terminal:

```bash
cd server
npm run dev
```

The backend should start using the configured application port.

For example:

```text
http://localhost:3000
```

Verify the server using the currently configured test or health-check route.

The exact route depends on the Express application configuration.

## 8. Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite commonly uses:

```text
http://localhost:5173
```

If this port is unavailable, Vite may select a different port.

Use the URL printed in the terminal.

## 9. Normal Development Workflow

For a typical development session:

1. Open Docker Desktop.
2. Start PostgreSQL from the project root.
3. Apply any new database migrations.
4. Start the backend server.
5. Start the frontend development server.
6. Make code changes and test locally.
7. Stop the application servers when finished.
8. Stop Docker Compose when the database is no longer needed.

Common commands:

```bash
# Project root
docker compose up -d

# Backend terminal
cd server
npx prisma migrate deploy
npm run dev

# Frontend terminal
cd client
npm run dev
```

## 10. Stop the Application

To stop the frontend and backend development servers, press:

```text
Ctrl + C
```

in their respective terminal windows.

To stop PostgreSQL, run from the project root:

```bash
docker compose down
```

This stops and removes the Compose containers and network.

**Database data is preserved** in the named Docker volume.

You can start PostgreSQL again later:

```bash
docker compose up -d
```

## 11. Database Reset Warnings

Database resets are destructive operations.

### Safe container shutdown

```bash
docker compose down
```

This preserves the named PostgreSQL volume.

### Delete PostgreSQL data

**WARNING: The following command permanently deletes data stored in Docker Compose-managed volumes.**

```bash
docker compose down -v
```

This removes containers and Compose-managed volumes, including the PostgreSQL data volume.

Only use this when you intentionally want a fresh local database.

After starting PostgreSQL again, apply the existing migrations:

```bash
docker compose up -d
cd server
npx prisma migrate deploy
```

### Reset through Prisma

**WARNING: This deletes database data.**

```bash
npx prisma migrate reset
```

This resets the development database and reapplies migrations. Depending on the Prisma version and project configuration, seeding may need to be run separately.

Never use this command against production or shared databases.

Before any reset:

1. Confirm the database connection string.
2. Make sure the target is the local development database.
3. Back up any data you want to keep.
4. Confirm that no other developer relies on that database.

## 12. Troubleshooting

### PostgreSQL port 5433 is already in use

Check the process using port `5433` on macOS:

```bash
lsof -nP -iTCP:5433 -sTCP:LISTEN
```

Check running Docker containers:

```bash
docker ps
```

If another application is using the port, stop that application or change:

```dotenv
POSTGRES_PORT=5434
```

in the root `.env`.

Also update the backend `DATABASE_URL` to use port `5434`.

Recreate the database container:

```bash
docker compose up -d --force-recreate postgres
```

Changing the host port does not require deleting the database volume.

### Backend port 3000 is already in use

Check the process:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

If appropriate, stop that process.

Alternatively, change the backend port in `server/.env`:

```dotenv
PORT=3001
```

Restart the backend and update any frontend API URL or proxy configuration that references the old port.

### Docker cannot connect

Make sure Docker Desktop is running.

Check:

```bash
docker info
```

If Docker is not available, start Docker Desktop and retry.

### Database connection fails

Verify:

- PostgreSQL is running.
- The container is healthy.
- `DATABASE_URL` uses the correct username and password.
- The database name matches `POSTGRES_DB`.
- The backend connects to `localhost:5433` when running on the host.
- The root and backend environment files are correctly configured.

Check the container:

```bash
docker compose ps
```

Check logs:

```bash
docker compose logs postgres
```

### Password authentication failed

PostgreSQL initializes its credentials when the data directory is first created.

Changing `POSTGRES_PASSWORD` in `.env` does not automatically change the password inside an existing database volume.

For an existing database, update the database role password deliberately and synchronize the connection string.

Do not delete the volume merely to resolve a password mismatch unless losing all local data is acceptable.

### Prisma migration fails

Check the migration status:

```bash
cd server
npx prisma migrate status
```

Check the configured database connection.

Review the error message and generated migration SQL.

Do not delete existing migration files or reset the database automatically to resolve migration errors.

### Docker Compose variable errors

Validate the Compose configuration:

```bash
docker compose config
```

Confirm that the root `.env` exists and contains the expected variables.

Save all edited configuration files before restarting containers.

### Environment changes are not being applied

After changing a backend environment variable, restart the backend process.

After changing Docker Compose environment variables, recreate the affected container if necessary:

```bash
docker compose up -d --force-recreate postgres
```

Remember that reinitialization-only PostgreSQL settings do not change an already initialized database.

## 13. Git and Database Conventions

Database changes should follow the normal Git workflow.

1. Create a feature branch from an updated `main`.
2. Modify the Prisma schema.
3. Generate a descriptive migration.
4. Test the migration locally.
5. Commit the schema and migration files together.
6. Open a pull request.
7. Merge after reviewing the changes.

Example branch:

```text
feature/add-guest-model
```

Example commit:

```text
feat(db): add guest model and migration
```

Never commit:

- `.env` files containing secrets
- Database passwords
- Local database dumps containing private information
- `node_modules/`
- Temporary generated files

## 14. Quick Command Reference

Run Docker commands from the project root.

| Task | Command |
|------|---------|
| Start database | `docker compose up -d` |
| Check containers | `docker compose ps` |
| View logs | `docker compose logs -f postgres` |
| Stop database | `docker compose down` |
| Delete local database data | `docker compose down -v` |
| Validate Compose | `docker compose config` |
| Apply existing migrations | `npx prisma migrate deploy` |
| Create migration | `npx prisma migrate dev --name migration_name` |
| Check migrations | `npx prisma migrate status` |
| Generate Prisma client | `npx prisma generate` |
| Open Prisma Studio | `npx prisma studio` |
| Start backend | `npm run dev` |
| Start frontend | `npm run dev` |

Prisma commands run inside `server/`.

Frontend commands run inside `client/`.

## 15. Development Safety Rules

- Keep secrets in untracked environment files.
- Use environment example files to document required variables.
- Keep database migrations in version control.
- Never delete local volumes without understanding the consequences.
- Never reset shared or production databases.
- Never assume a migration is safe without reviewing its changes.
- Keep development documentation updated when project setup changes.

Following these practices ensures the project can be recreated and maintained consistently.
