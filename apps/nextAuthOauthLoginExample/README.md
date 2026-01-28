# NextAuth OAuth Login Example (SDUI)

This app provides a login screen example using NextAuth GitHub OAuth login with SDUI templates/components.

## Key Behaviors

- **GitHub login**: Handle GitHub OAuth login using NextAuth
- **SDUI rendering**: Build the UI with `@lodado/sdui-template` and `@lodado/sdui-template-component`
- **JWT cookies**: Store access tokens (NextAuth JWT) in httpOnly cookies
- **RTR (Refresh Token Rotation)**: Store refresh tokens in the Supabase DB and rotate on each refresh
- **Auto refresh**: When the session expires, the client attempts re-issuance with the refresh token

## Environment Variables

Set the following values in `.env.local`.

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase Setup

### 1) Create the Refresh Token table

Run the following script in the Supabase SQL Editor.

```sql
create extension if not exists "pgcrypto";

create table if not exists public.auth_refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  user_id text not null,
  user_email text,
  user_name text,
  user_image text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  replaced_by_token_hash text,
  created_at timestamptz not null default now()
);

create index if not exists auth_refresh_tokens_user_id_idx on public.auth_refresh_tokens (user_id);
```

### 2) Create a Storage bucket

Create an `avatars` bucket in Supabase Storage. (Configure public/private according to your policy.)

> This app is implemented to upload GitHub profile images to the `avatars` bucket.

## Run

```bash
pnpm --filter next-auth-oauth-login-example dev
```

## Flow

1. After a successful login, the client calls `/api/auth/refresh` to issue a refresh token.
2. The refresh token is stored in the **Supabase DB** and also saved as a cookie.
3. When the session (JWT) expires, the client calls `/api/auth/refresh`,
   validates the refresh token, and issues a new session token.
4. The refresh token is rotated (RTR) to prevent reuse.

## Notes

- The session expiration time is set to **15 minutes** (`sessionMaxAgeSeconds`).
- The refresh token expiration time is set to **30 days**.
