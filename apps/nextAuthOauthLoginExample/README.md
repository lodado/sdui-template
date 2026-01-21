# NextAuth OAuth Login Example (SDUI)

이 앱은 NextAuth GitHub OAuth 로그인과 SDUI 템플릿/컴포넌트를 사용한 로그인 화면 예제를 제공합니다.

## 주요 동작

- **GitHub 로그인**: NextAuth를 사용해 GitHub OAuth 로그인 처리
- **SDUI 렌더링**: `@lodado/sdui-template`, `@lodado/sdui-template-component`를 사용해 화면 구성
- **JWT 쿠키**: 액세스 토큰(NextAuth JWT)은 httpOnly 쿠키에 저장
- **RTR(Refresh Token Rotation)**: 리프레시 토큰은 Supabase DB에 저장하고 매 갱신 시 회전
- **자동 갱신**: 클라이언트에서 세션이 만료되면 리프레시 토큰으로 자동 재발급 시도

## 환경 변수

`.env.local`에 아래 값을 설정하세요.

```
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase 설정

### 1) Refresh Token 테이블 생성

Supabase SQL Editor에서 아래 스크립트를 실행하세요.

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

### 2) Storage 버킷 생성

Supabase Storage에서 `avatars` 버킷을 생성하세요. (public/private 여부는 정책에 맞게 설정)

> 이 앱은 GitHub 프로필 이미지를 `avatars` 버킷에 업로드하도록 구현되어 있습니다.

## 실행

```bash
pnpm --filter next-auth-oauth-login-example dev
```

## 동작 흐름

1. 로그인 성공 시 클라이언트에서 `/api/auth/refresh`를 호출해 리프레시 토큰을 발급합니다.
2. 리프레시 토큰은 **Supabase DB**에 저장되며, 쿠키로도 저장됩니다.
3. 세션(JWT)이 만료되면 클라이언트가 `/api/auth/refresh`를 호출해
   리프레시 토큰을 대조하고 신규 세션 토큰을 발급합니다.
4. 리프레시 토큰은 회전(RTR)되어 재사용이 차단됩니다.

## 참고

- 세션 만료 시간은 **15분**(`sessionMaxAgeSeconds`)으로 설정되어 있습니다.
- 리프레시 토큰 만료 시간은 **30일**로 설정되어 있습니다.
