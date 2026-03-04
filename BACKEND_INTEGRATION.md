# Backend Integration Guide

The frontend is ready to connect to a backend. It works without a backend (mock data) and switches to real API when configured.

## Quick Start

1. **Create `.env`** (copy from `.env.example`):
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Restart dev server** after changing env vars.

3. Your backend should expose these endpoints:

## Expected API Endpoints

### Auth

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/auth/login` | `{ email, password }` | `{ user: { id, email, name }, token }` |
| POST | `/auth/register` | `{ firstName, lastName, email, password }` | `{ user: { id, email, name }, token }` |

### Courses

| Method | Path | Response |
|--------|------|----------|
| GET | `/courses` | `Course[]` |
| GET | `/users/me/courses` | `EnrolledCourse[]` (requires auth) |

### Types (see `src/types/api.ts`)

```ts
interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface EnrolledCourse extends Course {
  progress: number;
  done: number;
  total: number;
}
```

## Project Structure

```
src/
├── api/           # API service functions
│   ├── auth.ts    # login, register
│   └── courses.ts # fetchCourses, fetchEnrolledCourses
├── lib/
│   └── api.ts     # Base fetch client, handles auth token & 401
├── types/
│   └── api.ts     # Shared types (match backend schema)
└── hooks/         # TanStack Query hooks
    ├── useCourses.ts
    └── useEnrolledCourses.ts
```

## Auth Flow

- **Token**: Stored in `localStorage` as `user.token` after login/register.
- **Requests**: `Authorization: Bearer <token>` is sent automatically.
- **401**: On 401, user is cleared from localStorage.

## Adding New Endpoints

1. Add types in `src/types/api.ts`
2. Create service in `src/api/` or extend existing
3. Use `api.get/post/...` from `@/lib/api` when `isBackendEnabled`
4. Add TanStack Query hook in `src/hooks/` if needed
