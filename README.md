# StackPulse

StackPulse is a directory application for discovering, reviewing, and bookmarking developer tools, libraries, and frameworks. It gives visitors a searchable, filterable catalog of products and gives registered users a dashboard to submit and manage their own listings. An admin layer moderates new submissions, manages categories, and oversees user accounts.

This repository contains the Next.js client. It renders the public catalog, the authenticated dashboard, and the admin interface, and it communicates with a separate backend API for authentication, product, category, review, bookmark, and user data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Authentication](#authentication)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Features

**Authentication**

- Email/password sign-up and sign-in against the backend's own `/api/auth` endpoints
- The auth token is set by the backend as an httpOnly, Secure cookie — it is never stored in `localStorage` and never read by client-side JS
- Route protection and role-based redirects handled in Next.js middleware (`src/proxy.ts`)

**Product Discovery**

- Paginated product listing with search
- Filtering by category and pricing model
- Sorting controls
- Related products on product detail pages

**Reviews**

- Star-rating reviews on product pages
- Users can create, edit, and delete their own review per product
- A dedicated view for a user's own submitted reviews

**Bookmarks**

- Bookmark or unbookmark a product from its listing or detail page
- A "My Bookmarks" view in the dashboard

**Dashboard**

- Overview of a user's submitted products and reviews
- Product submission and editing
- Resubmission flow for rejected products

**Admin Features**

- Platform-wide overview statistics
- Pending product queue with approve/reject actions
- Category management (create, update, delete)
- User management, including approving, suspending, and unsuspending accounts

**Search & Filtering**

- Keyword search combined with category, pricing, and tag filters
- Debounced search input

**Responsive Design**

- Built with Tailwind CSS utility classes and shadcn/ui components throughout

**Security**

- The auth token is carried in an httpOnly cookie set by the backend, sent automatically by the browser (`credentials: "include"`) — it's inaccessible to any client-side script, including an injected one
- Server-side route gating in Next.js middleware for protected and admin-only routes
- Request payload validation with Zod before submission

## Tech Stack

| Layer            | Technology                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Frontend         | Next.js 16 (App Router), React 19, TypeScript                                                           |
| Backend          | External API, proxied through Next.js rewrites (`API_URL`); not part of this repository                 |
| Authentication   | Custom JWT issued by the backend, held in an httpOnly cookie — no auth library or database in this repo |
| Validation       | Zod, React Hook Form with `@hookform/resolvers`                                                         |
| Styling          | Tailwind CSS v4, `tw-animate-css`                                                                       |
| State Management | TanStack React Query                                                                                    |
| Deployment       | Not specified in this repository                                                                        |
| Libraries        | Framer Motion, Recharts, react-hot-toast, react-icons, cmdk, date-fns, lucide-react                     |
| Developer Tools  | ESLint (`eslint-config-next`), TypeScript, React Compiler (Babel plugin)                                |

This app does not use a database or an auth library (e.g. Better Auth) itself — it is a pure API client. All persistence, including user accounts, lives in the separate backend service.

## Architecture

The application follows a feature-based structure. Route handling and layout live under `src/app` using the Next.js App Router, while domain logic (types, API service calls, and hooks) is grouped by feature under `src/features`. Shared UI primitives live in `src/components`, with base shadcn/ui components isolated in `src/components/ui`.

Data fetching and caching are handled by TanStack React Query, with each feature exposing its own hooks (for example `useProducts`, `useMyBookmarks`) that wrap a corresponding `*.service.ts` module. Service modules are the only place that call the API, through the shared `api` client in `src/lib/api.ts`.

The browser never talks to the backend directly. `api.ts` and the auth service call same-origin, relative `/api/*` paths; a `rewrites()` rule in `next.config.ts` proxies those requests server-side to the backend at `API_URL`. This keeps all API traffic same-origin from the browser's perspective, which avoids cross-site cookie issues with the auth cookie.

Authentication is delegated entirely to the backend: `authService` (`src/features/auth/auth.service.ts`) calls the backend's `POST /api/auth/login` / `POST /api/auth/register`, which set the JWT as an httpOnly cookie on their response — the client never sees the token itself. `useAuth` (`src/features/auth/hooks/useAuth.ts`) determines the current session by calling `GET /api/users/me` with `credentials: "include"`, letting the backend read its own cookie. Route protection (which pages require a session, and which require an admin role) is enforced in `src/proxy.ts`, which Next.js uses as middleware and which reads that same cookie server-side.

```
src/
├── app/                  # App Router routes and layouts
├── components/           # Shared components (guards, layout, ui primitives)
├── features/             # Feature modules: types, service calls, hooks, components
├── hooks/                # Cross-feature hooks
├── lib/                  # API client, auth session-change event, utilities
├── providers/            # React Query provider
├── types/                # Shared types (e.g. pagination)
├── validators/           # Zod schemas per feature
├── env.ts                # Runtime environment variable validation
└── proxy.ts              # Route protection middleware
```

## Getting Started

### Prerequisites

- Node.js (version compatible with Next.js 16 and React 19)
- npm
- Access to the StackPulse backend API (running and reachable — no separate database or auth provider is needed for this repo)

### Installation

Clone the repository:

```bash
git clone https://github.com/md-saju-ahmed/stackpulse-client.git
cd stackpulse-client
```

Install dependencies:

```bash
npm install
```

This repository contains only the Next.js client. Authentication, and all product, category, review, bookmark, and user data, are provided by a separate backend service, which must be running and reachable at the URL configured in `API_URL`.

### Environment Variables

| Variable                    | Description                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`                   | Server-side base URL of the backend API, used by the `rewrites()` proxy in `next.config.ts`. Defaults to `http://localhost:5000`. Not exposed to the browser. |
| `NEXT_PUBLIC_DEMO_EMAIL`    | Email address used to pre-fill or display a demo account. Required.                                                                                           |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Password used alongside the demo account. Required.                                                                                                           |

Environment variables are validated at startup via `src/env.ts`; the application will throw a descriptive error if a required variable is missing or invalid.

In production, the backend's `CLIENT_URL` setting must still be configured so it accepts requests forwarded from this app's server. Because the browser now talks to this app's own origin and the proxy forwards to the backend server-side, the auth cookie only needs to round-trip between this app and the browser — cross-site `COOKIE_DOMAIN`/`COOKIE_SAMESITE` configuration is no longer required for that leg.

### Running Locally

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start the production server (requires a prior build)
npm run start

# Lint the codebase
npm run lint
```

## Authentication

Authentication is fully delegated to the backend — this app holds no session state of its own beyond an in-memory React state derived from an API call:

- **Sign-up / sign-in**: `authService.login` / `authService.register` (`src/features/auth/auth.service.ts`) POST to the backend's `/api/auth/login` and `/api/auth/register`. The backend sets the JWT as an httpOnly, Secure cookie on its response; the client never receives the token in the response body and has no way to read, copy, or persist it itself.
- **Session lookup**: `useAuth` (`src/features/auth/hooks/useAuth.ts`) calls `GET /api/users/me` with `credentials: "include"` on mount and whenever a `stackpulse_auth_changed` event fires (dispatched by `src/lib/auth.ts` after login, register, logout, or a 401 response). The backend reads its own cookie to answer that request — the client is just relaying the browser's automatic cookie attachment.
- **Logout**: `authService.logout` POSTs to the relative `/api/auth/logout` path (proxied to the backend by the `rewrites()` rule in `next.config.ts`), which clears the cookie server-side (client JS cannot clear an httpOnly cookie itself).
- **Protected routes**: `src/proxy.ts` runs as Next.js middleware. It reads the same httpOnly cookie directly off the incoming request (server-side code can read httpOnly cookies fine — the restriction is only on browser JS/`document.cookie`), redirects unauthenticated users to `/login` with a `callbackUrl`, and redirects authenticated users away from `/login` and `/register`.
- **Admin-only routes**: `/dashboard/pending`, `/dashboard/categories`, and `/dashboard/users` additionally require the `admin` role at the middleware level, and are further guarded client-side by the `AdminGuard` component.
- **`useJwtToken`**: kept as a compatibility shim for existing call sites that still destructure a `token` — it always returns `null` now, since there is no client-readable token. Passing it through to `api.*` calls is a harmless no-op; authorization happens via the cookie instead.

## API Overview

All authentication, product, category, review, bookmark, and user data is served by an external backend API. The browser calls this app's own same-origin `/api/*` paths; `next.config.ts` rewrites those requests server-side to the backend at `API_URL`, so the backend URL itself is never exposed to client code. Requests are made through a shared `api` client (`src/lib/api.ts`) that always sends `credentials: "include"` (so the httpOnly auth cookie is attached) and expects a consistent `{ success, message, data, meta? }` response shape.

Service modules under `src/features/*/*.service.ts` group the endpoints by domain:

- **Auth** (`auth.service.ts`) — login, register, logout.
- **Products** (`product.service.ts`) — listing with search/filter/sort, retrieval by slug, creation, update, deletion, and admin moderation (pending queue, approve, reject, resubmit).
- **Categories** (`category.service.ts`) — listing, retrieval by slug, and admin create/update/delete.
- **Reviews** (`review.service.ts`) — listing reviews for a product, retrieving the current user's review, and create/update/delete.
- **Bookmarks** (`bookmark.service.ts`) — add/remove a bookmark, list the current user's bookmarked products, and fetch bookmarked slugs.
- **Users** (`user.service.ts`) — current user profile retrieval and update, public profile lookup by ID, and admin operations (list, approve, suspend, unsuspend, delete).
- **Dashboard** (`dashboard.service.ts`) — per-user overview, admin platform overview, owned products, and owned reviews.

## Project Structure

```
stackpulse-client/
├── src/
│   ├── app/
│   │   ├── (auth)/login, register
│   │   ├── (dashboard)/dashboard/...
│   │   ├── products/, categories/, about/, contact/, privacy/, terms/
│   │   └── layout.tsx, page.tsx, globals.css
│   ├── components/
│   │   ├── ui/                            # shadcn/ui primitives
│   │   ├── layout/                         # Navbar, Footer, Container, etc.
│   │   ├── AuthGuard.tsx, AdminGuard.tsx
│   │   └── Pagination.tsx, StarRating.tsx, StatusBadge.tsx, EmptyState.tsx
│   ├── features/
│   │   ├── auth/, products/, categories/, reviews/, bookmarks/, users/, dashboard/, home/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts, auth.ts, utils.ts
│   ├── providers/QueryProvider.tsx
│   ├── types/pagination.ts
│   ├── validators/
│   ├── env.ts
│   └── proxy.ts
├── components.json
├── next.config.ts
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## Deployment

No deployment configuration (such as a Dockerfile, CI workflow, or platform-specific config) is included in this repository. The application is a standard Next.js app and can be built with `npm run build` and started with `npm run start`. The backend API is deployed and hosted separately from this client.

Because the browser only ever talks to this app's own origin (`/api/*` requests are proxied server-side to the backend via the `rewrites()` rule in `next.config.ts`, driven by `API_URL`), the auth cookie set by the backend's response is forwarded back to the browser as if it came from this app — no cross-site cookie configuration is needed between the browser and this app. The backend's `CLIENT_URL` should still point at this app's deployed origin so its own CORS/cookie settings accept the proxied requests.

## Performance Considerations

- The React Compiler (`babel-plugin-react-compiler`) is enabled via `reactCompiler: true` in `next.config.ts`.
- TanStack React Query caches server data client-side, with a default stale time of 60 seconds, reducing redundant network requests.
- Search input is debounced (`useDebounce`) to limit the number of requests sent while a user is typing.

## Security

- The auth token is carried exclusively in an httpOnly, Secure cookie set by the backend — it is never written to `localStorage`, never attached manually as a header from client-side state, and never readable via `document.cookie`. This removes the token as an XSS-exfiltration target entirely.
- Protected and admin-only routes are enforced server-side in Next.js middleware (`src/proxy.ts`), which reads that cookie directly off the incoming request before rendering a route.
- Client-side guards (`AuthGuard`, `AdminGuard`) provide an additional layer of protection and loading-state handling for authenticated and admin-only views.
- All form input (authentication, products, categories, reviews, user profiles) is validated with Zod schemas before submission.

## Screenshots

### Home

(Add screenshot here)

### Dashboard

(Add screenshot here)

### Product Details

(Add screenshot here)

### Admin Dashboard

(Add screenshot here)

## Future Improvements

- Add automated tests (unit, integration, and end-to-end)
- Add a type-checking script (`tsc --noEmit`) to the `package.json` scripts
- Document or include deployment configuration for the client and its backend dependency

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository and create a feature branch.
2. Make your changes, following the existing code style enforced by ESLint.
3. Run `npm run lint` and ensure the project builds with `npm run build`.
4. Open a pull request describing the change and its motivation.

Please open an issue first for significant changes so the approach can be discussed before implementation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
