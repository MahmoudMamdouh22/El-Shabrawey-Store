## Summary

Change the Prisma datasource provider from `sqlite` to `libsql` to use Turso as the cloud database on Netlify.

## Changes

- `prisma/schema.prisma`: Updated the `datasource db` block to use `provider = "libsql"` with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables instead of the local SQLite file.

## Why

The project is deployed on Netlify and needs a cloud database that persists across deployments. SQLite files are wiped on every Netlify deploy, so Turso (LibSQL) is used instead. The credentials are read from environment variables so they are never hardcoded in the repository.

## What a reviewer should know

- The `prisma.config.ts` and `prisma/seed.ts` files already expect these environment variables.
- The credentials must be set in Netlify's Site Settings > Environment Variables.
- This change does not affect local development; the local database file is still used when the environment variables are not set.