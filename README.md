# StackPulse

StackPulse is a directory application for discovering, reviewing, and bookmarking developer tools, libraries, and frameworks. It gives visitors a searchable, filterable catalog of products and gives registered users a dashboard to submit and manage their own listings. An admin layer moderates new submissions, manages categories, and oversees user accounts.

This repository contains the Next.js client. It renders the public catalog, the authenticated dashboard, and the admin interface, and it communicates with a separate backend API for product, category, review, bookmark, and user data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Database](#database)
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

- Email/password sign-up and sign-in via Better Auth
- Google OAuth sign-in
- JWT-based session tokens for authorizing API requests
- Route protection and role-based redirects handled in Next.js middleware

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

- JWT-authorized API requests
- Server-side session verification in middleware for protected and admin-only routes
- Request payload validation with Zod before submission

## Tech Stack

| Layer            | Technology                                                                          |
| ---------------- | ----------------------------------------------------------------------------------- |
| Frontend         | Next.js 16 (App Router), React 19, TypeScript                                       |
| Backend          | External API (consumed via `NEXT_PUBLIC_API_URL`); not part of this repository      |
| Database         | MongoDB (used by this app's authentication layer only)                              |
| Authentication   | Better Auth (email/password, Google OAuth, JWT plugin)                              |
| Validation       | Zod, React Hook Form with `@hookform/resolvers`                                     |
| Styling          | Tailwind CSS v4, `tw-animate-css`                                                   |
| State Management | TanStack React Query                                                                |
| Deployment       | Not specified in this repository                                                    |
| Libraries        | Framer Motion, Recharts, react-hot-toast, react-icons, cmdk, date-fns, lucide-react |
| Developer Tools  | ESLint (`eslint-config-next`), TypeScript, React Compiler (Babel plugin)            |

## Architecture

The application follows a feature-based structure. Route handling and layout live under `src/app` using the Next.js App Router, while domain logic (types, API service calls, and hooks) is grouped by feature under `src/features`. Shared UI primitives live in `src/components`, with base shadcn/ui components isolated in `src/components/ui`.

Data fetching and caching are handled by TanStack React Query, with each feature exposing its own hooks (for example `useProducts`, `useMyBookmarks`) that wrap a corresponding `*.service.ts` module. Service modules are the only place that call the external API, through the shared `api` client in `src/lib/api.ts`.

Authentication is handled locally within this Next.js app: Better Auth is configured with a MongoDB adapter and issues JWTs that are attached to outgoing API requests as a bearer token. Route protection (which pages require a session, and which require an admin role) is enforced in `src/proxy.ts`, which Next.js uses as middleware.

```
src/
├── app/                  # App Router routes, layouts, and the Better Auth API handler
├── components/           # Shared components (guards, layout, ui primitives)
├── features/             # Feature modules: types, service calls, hooks, components
├── hooks/                # Cross-feature hooks
├── lib/                  # API client, Better Auth client/server setup, utilities
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
- A running MongoDB instance
- Access to the StackPulse backend API

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

This repository contains only the Next.js client. The product, category, review, bookmark, and user APIs are provided by a separate backend service, which must be running and reachable at the URL configured in `NEXT_PUBLIC_API_URL`.

### Environment Variables

| Variable                    | Description                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`       | Base URL of the backend API. Defaults to `http://localhost:5000`.                       |
| `BETTER_AUTH_URL`           | Base URL of this application, used by Better Auth. Defaults to `http://localhost:3000`. |
| `BETTER_AUTH_SECRET`        | Secret used by Better Auth to sign sessions. Required.                                  |
| `DATABASE_URL`              | MongoDB connection string used by the Better Auth adapter. Required.                    |
| `GOOGLE_CLIENT_ID`          | OAuth client ID for Google sign-in. Falls back to a placeholder if unset.               |
| `GOOGLE_CLIENT_SECRET`      | OAuth client secret for Google sign-in. Falls back to a placeholder if unset.           |
| `NEXT_PUBLIC_DEMO_EMAIL`    | Email address used to pre-fill or display a demo account. Required.                     |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Password used alongside the demo account. Required.                                     |

Environment variables are validated at startup via `src/env.ts`; the application will throw a descriptive error if a required variable is missing or invalid.

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

## Database

This repository does not manage a product/content database directly; that data is owned by the separate backend API. MongoDB is used only by this application's authentication layer, through the Better Auth MongoDB adapter (`src/lib/auth-server.ts`). No migration or seeding scripts are included in this repository; user documents and schema are managed by Better Auth at runtime.

## Authentication

Authentication is implemented with Better Auth:

- **Sign-up / sign-in**: Email and password, plus Google OAuth, configured in `src/lib/auth-server.ts` and exposed to the client through `src/lib/auth.ts`.
- **Sessions**: Better Auth manages sessions with a short-lived cookie cache. A JWT plugin issues a bearer token (`useJwtToken`) that carries the user's `id`, `email`, `role`, and `accountStatus`, used to authorize calls to the backend API.
- **Roles**: Users have a `role` field (`user` or `admin`) and an `accountStatus` field (defaulting to `pending`), both stored as additional fields on the Better Auth user model.
- **Protected routes**: `src/proxy.ts` runs as Next.js middleware. It checks for an active session (via the Better Auth `get-session` endpoint) before allowing access to `/dashboard` and `/products/submit`, redirects unauthenticated users to `/login` with a `callbackUrl`, and redirects authenticated users away from `/login` and `/register`.
- **Admin-only routes**: `/dashboard/pending`, `/dashboard/categories`, and `/dashboard/users` additionally require the `admin` role at the middleware level, and are further guarded client-side by the `AdminGuard` component.

## API Overview

All product, category, review, bookmark, and user data is served by an external backend API, reachable at `NEXT_PUBLIC_API_URL`. Requests are made through a shared `api` client (`src/lib/api.ts`) that attaches a JWT bearer token when available and expects a consistent `{ success, message, data, meta? }` response shape.

Service modules under `src/features/*/*.service.ts` group the endpoints by domain:

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
│   │   ├── api/auth/[...all]/route.ts     # Better Auth handler
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
│   │   ├── api.ts, auth.ts, auth-server.ts, utils.ts
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

## Performance Considerations

- The React Compiler (`babel-plugin-react-compiler`) is enabled via `reactCompiler: true` in `next.config.ts`.
- TanStack React Query caches server data client-side, with a default stale time of 60 seconds, reducing redundant network requests.
- The JWT used for API authorization is cached client-side with a 45-minute stale time to avoid refetching a token on every request.
- Search input is debounced (`useDebounce`) to limit the number of requests sent while a user is typing.

## Security

- API requests that require authorization attach a JWT as a `Bearer` token, generated and verified by Better Auth.
- Protected and admin-only routes are enforced server-side in Next.js middleware (`src/proxy.ts`), which validates the session cookie against the Better Auth session endpoint before rendering a route.
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
- Add database migration and seeding tooling if the authentication data model grows in complexity

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository and create a feature branch.
2. Make your changes, following the existing code style enforced by ESLint.
3. Run `npm run lint` and ensure the project builds with `npm run build`.
4. Open a pull request describing the change and its motivation.

Please open an issue first for significant changes so the approach can be discussed before implementation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
