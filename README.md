# Doctor License Management

A medical SaaS module for managing doctor license records — built with **.NET 8**, **Next.js 14**, and **SQL Server** for the Carlisle Full Stack technical assignment.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Database](#database)
- [Stored Procedures](#stored-procedures)
- [API Reference](#api-reference)
- [Frontend](#frontend)
- [Role-Based UI](#role-based-ui)
- [Export](#export)
- [Validation Strategy](#validation-strategy)
- [Decisions and Trade-offs](#decisions-and-trade-offs)
- [What I Would Add Next](#what-i-would-add-next)

---

## Overview

This module lets clinics and medical platforms manage their doctors' license records.

**Functional features:**
- Create, list, view, update, delete (soft) doctors
- Search by name or license number
- Filter by status (Active / Expired / Suspended)
- Auto-mark licenses as **Expired** when expiry date passes — without anyone updating the row
- Prevent duplicate license numbers across active records
- Server-side pagination
- Bonus listing of expired licenses with days-overdue calculation

**All four bonuses from the brief:**
- Pagination — server-driven via `COUNT(*) OVER()` in the SP, single round trip
- Modal view — Add, Edit, Delete confirmation, and Quick View all as modals
- Expired highlight — pink row tint plus an amber "Expires in N days" warning
- Role-based UI — Admin / Editor / Viewer with a mock role switcher

**Product polish on top of the brief:**
- Dashboard with key-metrics stats and a status-distribution chart
- Greeting hero with contextual insight ("X licenses need renewal")
- Add and Edit flows in modal popups so the table stays in context
- Inline status update via the dedicated PATCH endpoint
- Quick view modal — click any doctor's name to see full details without leaving the dashboard
- CSV and Word (.docx) export with formatted templates and active-filter context
- Active filter chips with one-click removal and "Clear all"
- Custom SVG empty state, status badges with colored dots, initials avatars
- Animated number count-up, top progress bar, modal entrance transitions
- Toast notifications for every mutation
- "Expires in N days" warning badges on active doctors with imminent expiry
- Loading skeletons for every route segment
- Keyboard shortcuts — `/` focuses search, `N` opens Add Doctor
- `prefers-reduced-motion` support for accessibility

---

## Tech Stack

| Layer        | Technology                                                                |
| ------------ | ------------------------------------------------------------------------- |
| **Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS                       |
|              | react-hook-form · zod · sonner (toasts) · lucide-react (icons) · docx (Word export) |
| **Backend**  | .NET 8 Web API · Clean Architecture · FluentValidation · Serilog          |
| **Database** | SQL Server · Stored Procedures · EF Core 8 · Microsoft.Data.SqlClient     |
| **Tooling**  | Swagger / OpenAPI · GitHub                                                |

---

## Architecture

Clean Architecture with four layers — dependencies always point **inward**:

```
┌──────────────────────────────────────────────────────────┐
│  API   (Controllers · Middleware · DI · Swagger · CORS)  │
└──────────────────────┬───────────────────────────────────┘
                       │ depends on
┌──────────────────────▼───────────────────────────────────┐
│  Application  (DTOs · Services · Validators · Interfaces)│
└──────────────────────┬───────────────────────────────────┘
                       │ depends on
┌──────────────────────▼───────────────────────────────────┐
│  Domain  (Entity · Enum · Exceptions)                    │  ← zero deps
└──────────────────────────────────────────────────────────┘
                       ▲
                       │ implements interfaces from Application
┌──────────────────────┴───────────────────────────────────┐
│  Infrastructure  (EF Core DbContext · Repository)        │
│                  (calls stored procedures via SqlQueryRaw)│
└──────────────────────────────────────────────────────────┘
```

### Data flow for a list request

```
Browser  →  GET /api/doctors?search=ali&status=2&pageNumber=1
            │
            ▼
       DoctorsController  (API layer)
            │
            ▼
       DoctorService  (Application layer — orchestration)
            │
            ▼
       IDoctorRepository  (Application interface)
            │
            ▼  implemented by
       DoctorRepository  (Infrastructure)
            │
            ▼  EF Core SqlQueryRaw with SqlParameter
       EXEC dbo.sp_GetDoctors @Search, @StatusFilter, @PageNumber, @PageSize
            │
            ▼
       SQL Server  (filters, computes Status with CASE expression, paginates)
            │
            ▼
       Result rows  →  PagedResult<DoctorListItemDto>  →  JSON
```

The expiry-status logic lives **inside SQL** so the C# code never has to derive it — when a license expires, the next read returns `Status = Expired` automatically with no row update.

---

## Project Structure

```
Doctor_Application/
├── backend/                                            .NET 8 solution
│   ├── DoctorLicense.sln
│   └── src/
│       ├── DoctorLicense.Domain/                       Entities, enum, exceptions
│       │   ├── Entities/Doctor.cs
│       │   ├── Enums/DoctorStatus.cs
│       │   └── Exceptions/DomainException.cs
│       ├── DoctorLicense.Application/                  DTOs, validators, services, interfaces
│       │   ├── DTOs/
│       │   ├── Validators/
│       │   ├── Interfaces/IDoctorRepository.cs
│       │   └── Services/DoctorService.cs
│       ├── DoctorLicense.Infrastructure/               EF Core, repository implementation
│       │   └── Persistence/
│       │       ├── AppDbContext.cs
│       │       ├── Configurations/DoctorConfiguration.cs
│       │       └── DoctorRepository.cs
│       └── DoctorLicense.API/                          ASP.NET Core host
│           ├── Controllers/DoctorsController.cs
│           ├── Middleware/ExceptionMiddleware.cs
│           ├── Program.cs
│           └── appsettings.json
├── database/                                           SQL scripts (idempotent, runnable in order)
│   ├── 01_schema.sql
│   ├── 02_sp_GetDoctors.sql
│   ├── 03_sp_GetExpiredDoctors.sql
│   └── 04_seed.sql
└── frontend/                                           Next.js 14 app
    └── src/
        ├── app/                                        App Router pages + loading + error
        │   └── doctors/
        ├── components/
        │   ├── ui/                                     Reusable primitives
        │   └── doctors/                                Feature components
        └── lib/
            ├── api.ts                                  Typed fetch wrapper
            ├── types.ts                                TS types matching backend DTOs
            └── validators.ts                           Zod schemas mirroring FluentValidation
```

---

## Quick Start

### Prerequisites

- **.NET 8 SDK** — [download](https://dotnet.microsoft.com/download/dotnet/8.0) (the project targets `net8.0`)
- **Node.js 20+** and **npm**
- **SQL Server 2019+** (or SQL Server Express / LocalDB)
- **Git**

### 1. Clone and install

```powershell
git clone git@github.com:AhmadAlzean99/doctor-license-management.git
cd doctor-license-management
```

### 2. Database — run the four scripts in order

```powershell
sqlcmd -S localhost -E -i database/01_schema.sql
sqlcmd -S localhost -E -i database/02_sp_GetDoctors.sql
sqlcmd -S localhost -E -i database/03_sp_GetExpiredDoctors.sql
sqlcmd -S localhost -E -i database/04_seed.sql
```

This creates `DoctorLicenseDb`, the `Doctors` table with constraints and indexes, both stored procedures, and 10 sample doctors.

The scripts are **idempotent** — re-running them is safe and never produces duplicates.

### 3. Backend

```powershell
cd backend/src/DoctorLicense.API
dotnet run --launch-profile http
```

The API starts at `http://localhost:5050`. Swagger UI: `http://localhost:5050/swagger`.

> **Connection string:** edit `appsettings.json` if your SQL Server uses a different server name, instance, or auth method. Default assumes Windows Authentication on `localhost`.

### 4. Frontend

In a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` — auto-redirects to `/doctors`.

> The frontend reads `NEXT_PUBLIC_API_URL` from `frontend/.env.example`. Default is `http://localhost:5050`. Copy the file to `.env.local` if you need to override.

---

## Database

The `dbo.Doctors` table:

| Column            | Type           | Notes                                                          |
| ----------------- | -------------- | -------------------------------------------------------------- |
| Id                | INT IDENTITY   | Primary key, clustered                                          |
| FullName          | NVARCHAR(150)  | Required, supports unicode                                     |
| Email             | NVARCHAR(150)  | Required                                                       |
| Specialization    | NVARCHAR(100)  | Required                                                       |
| LicenseNumber     | NVARCHAR(50)   | Required, unique per active row (filtered index)               |
| LicenseExpiryDate | DATE           | Required, no time component                                    |
| Status            | TINYINT        | 1=Active · 2=Expired · 3=Suspended (`CHECK` constraint)        |
| CreatedDate       | DATETIME2(0)   | Defaults to `SYSUTCDATETIME()` in UTC                          |
| ModifiedDate      | DATETIME2(0)   | Nullable, set on update                                        |
| IsDeleted         | BIT            | Soft-delete flag, default 0                                    |

**Indexes:**
- `PK_Doctors` — clustered on Id
- `UX_Doctors_LicenseNumber_Active` — unique on LicenseNumber **filtered to** `IsDeleted = 0`. Lets a license number be reused after the holder is soft-deleted.
- `IX_Doctors_Status_IsDeleted` — speeds the listing SP's status filter.
- `IX_Doctors_LicenseExpiryDate` — filtered to `IsDeleted = 0`, includes `FullName, LicenseNumber` to cover the expired-doctors SP.

**Constraints:**
- `CHECK Status IN (1, 2, 3)` — defends the data even if the application validator is bypassed.

---

## Stored Procedures

### `sp_GetDoctors` — primary listing

**Parameters:** `@Search`, `@StatusFilter`, `@PageNumber`, `@PageSize` (all optional with sensible defaults).

**What it does:**
1. Filters `IsDeleted = 0` and the optional search term (trimmed, applies to `FullName` OR `LicenseNumber`)
2. Computes the **effective status** in SQL via a `CASE`:
   - `Suspended` stays `Suspended` (administrative override wins)
   - Otherwise: `Expired` if `LicenseExpiryDate < today`, else `Active`
3. Applies the optional status filter against the **computed** status
4. Returns `OFFSET / FETCH` page along with `COUNT(*) OVER()` so the row count comes in the same result set — one round trip
5. `@PageSize` is capped at 100 server-side as a DOS guard

The `CASE` result is wrapped in `CAST(... AS TINYINT)` so the byte-backed C# enum maps cleanly via EF Core's `SqlQueryRaw`.

### `sp_GetExpiredDoctors` — bonus

Returns every non-deleted doctor whose `LicenseExpiryDate` is in the past, sorted oldest-expiry-first, with a computed `DaysExpired` column. Suspended doctors are included if also expired — from a compliance perspective they're still expired licenses needing follow-up.

Both procedures use `CREATE OR ALTER` so deployment scripts are idempotent.

---

## API Reference

Full interactive docs at `http://localhost:5050/swagger`.

| Method | Route                                | Body                  | Returns                          |
| ------ | ------------------------------------ | --------------------- | -------------------------------- |
| GET    | `/api/doctors`                       | (querystring)         | `PagedResult<DoctorListItemDto>` |
| GET    | `/api/doctors/expired`               | —                     | `ExpiredDoctorDto[]`             |
| GET    | `/api/doctors/{id}`                  | —                     | `DoctorDetailsDto`               |
| POST   | `/api/doctors`                       | `CreateDoctorDto`     | `DoctorDetailsDto` (201 + Loc)   |
| PUT    | `/api/doctors/{id}`                  | `UpdateDoctorDto`     | `DoctorDetailsDto`               |
| PATCH  | `/api/doctors/{id}/status`           | `UpdateDoctorStatusDto` | (204 No Content)               |
| DELETE | `/api/doctors/{id}`                  | —                     | (204 No Content) — soft delete   |

**Error responses are a consistent JSON shape:**

```json
{ "status": 404, "title": "Not Found", "detail": "Doctor with id 999 was not found." }
```

For validation errors, an `errors` map keyed by property name is included.

---

## Frontend

Next.js 14 App Router with Tailwind. The dashboard at `/doctors` is the single primary view.

**Data flow:**
- Server Components (`page.tsx`, `StatsBar`, `StatusDistribution`, `DashboardHero`, `DoctorTable`) fetch from the .NET API
- Client Components (`SearchBar`, `StatusFilter`, `Pagination`, `DoctorForm`, modals) drive interactivity via `useTransition` and URL search params
- `lib/api.ts` is the single typed fetch wrapper; `HttpError` carries the parsed error body for callers
- `lib/validators.ts` defines Zod schemas that mirror the FluentValidation rules on the backend exactly

**Routing patterns:**
- Filters and pagination live in the URL (`/doctors?search=ali&status=2&pageNumber=2`) so the view is bookmarkable and refresh-safe.
- Add and Edit are modal-driven for in-context UX, with `/doctors/new` and `/doctors/{id}/edit` kept as fallback pages for deep links.

**Components:**
- `components/ui/` — `Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Skeleton`, `Avatar`, `CountUp`, `TopProgressBar`
- `components/doctors/` — `DashboardHero`, `StatsBar`, `StatusDistribution`, `DoctorTable`, `SearchBar`, `StatusFilter`, `Pagination`, `StatusBadge`, `DoctorForm`, `DoctorRowActions`, `DoctorStatusCard`, `AddDoctorModal`, `EditDoctorModal`, `EmptyStateIllustration`
- `components/layout/` — `Header`

---

## Role-Based UI

Implemented as a **client-side mock** — three roles with three permission profiles, switchable via a dropdown in the header. The active role persists in `localStorage`.

| Role       | Create | Edit | Delete | Change Status |
| ---------- | :----: | :--: | :----: | :-----------: |
| **Admin**  |   ✅   |  ✅  |   ✅   |      ✅       |
| **Editor** |   ✅   |  ✅  |   ❌   |      ❌       |
| **Viewer** |   ❌   |  ❌  |   ❌   |      ❌       |

The architecture mirrors what real authentication would use:

- `lib/role.ts` — role types and the permission matrix (server-safe pure code)
- `RoleProvider` — React Context with `localStorage` hydration, exposes the `useRole` and `usePermissions` hooks
- `RoleSwitcher` — the dropdown in the header (this is the mock; in production it would be a user menu showing the JWT claims)
- Components consume `usePermissions()` and conditionally render — `Header` hides the **Add Doctor** button for Viewer, `DoctorRow` hides the edit/delete icons per permission, `EditDoctorModal` hides the Administrative status section unless the role can change status

**In production**, the same `usePermissions()` hook would read the role from a JWT claim instead of `localStorage`, and the backend would also enforce the rules with `[Authorize(Roles = "Admin")]` attributes on the relevant endpoints. Only the source of the role changes — every call site stays identical.

The mock is clearly labeled in the dropdown footer: *"Mock role switch — production would use a JWT claim."*

---

## Export

Both formats download the **currently filtered** doctor list — search and status filters are respected.

**CSV** (Excel-compatible)
- Pure-browser `Blob` generation, no server round trip
- UTF-8 BOM so Excel renders unicode names (Arabic, Chinese, etc.) correctly
- RFC 4180-compliant escaping for fields containing commas, quotes, or newlines
- Eight columns: Id, Full Name, Email, Specialization, License Number, License Expiry Date, Status (label), Created Date
- Filename pattern: `doctors-YYYY-MM-DD.csv`

**Word** (.docx, formatted report)
- Generated client-side with the [docx](https://docx.js.org) library, which is **dynamically imported** so the dashboard's first-paint bundle stays small
- Heading 1 title, italic generated date, applied-filter description, record count
- Styled table with light-teal header row + bold dark-teal text + light-gray cell borders
- Footer with "Page X of Y"
- Filename pattern: `doctors-YYYY-MM-DD.docx`

The exporter loops the listing API page-by-page (respecting the SP's `pageSize` cap of 100), collects every matching row, and only then triggers the download — so the export reflects the full filtered set, not just what's visible on screen.

---

## Validation Strategy

Three layers of defense, each catching what the previous one misses:

| Layer            | What it catches                                                          |
| ---------------- | ------------------------------------------------------------------------ |
| **Frontend**     | Zod schemas in `lib/validators.ts` — instant feedback in the form, prevents the bad request |
| **Service**      | FluentValidation in `Application/Validators/` — runs in `DoctorService.CreateAsync` and `UpdateAsync` even if validation is bypassed at the controller layer |
| **Database**     | `CHECK` constraint on Status, filtered `UNIQUE INDEX` on LicenseNumber — the unbreakable last line |

The same length limits (NVARCHAR sizes) appear in all three places. If any layer drifts the others still hold.

---

## Decisions and Trade-offs

### Why Clean Architecture?
The Application project has **zero dependency on EF Core or ASP.NET**. If the data store changes (Dapper, MongoDB, an HTTP service to another team), only Infrastructure changes — the service and controllers stay identical. This also makes the service easy to unit-test with a mocked `IDoctorRepository`.

### Why stored procedures for reads but EF Core for writes?
Reads benefit from the SP — the expiry CASE belongs in SQL so it's the single source of truth, and `COUNT(*) OVER()` returns total + page in one round trip. Writes don't benefit from SPs — EF Core's change tracking, `SaveChangesAsync`, and `ExecuteUpdateAsync` are cleaner than handcrafted `INSERT` / `UPDATE` procedures for one entity.

### Why is Status computed in SQL instead of stored?
Storing the computed status would require a nightly job or row-level trigger to flip `Active → Expired` when a license passes its expiry. Computing it on read means the "today's truth" is always returned with zero data drift. The stored value reflects **administrative intent** (`Active` or `Suspended`); the read returns **effective state**.

### Why a filtered UNIQUE INDEX instead of a regular UNIQUE?
A plain `UNIQUE` would block a license number from ever being reused — even after the holder is soft-deleted. The filtered index `WHERE IsDeleted = 0` enforces uniqueness only across active rows, mirroring the real-world rule that a license can have a new holder once the previous one leaves.

### Why modals for Add/Edit instead of separate pages?
Modals keep the table visible behind the form, preserving context — the admin doesn't lose their place after every edit. The `/doctors/new` and `/doctors/{id}/edit` page routes are kept as fallbacks for deep links and shareable URLs.

### Why URL-driven search and filters?
Storing filter state in the URL makes the view bookmarkable and refresh-safe, and the browser back button works naturally. It also means Server Components can read the filters directly from `searchParams` without any client-side state.

### Why three exception types in Domain?
Each one maps to a distinct HTTP status code through the global middleware: `NotFoundException → 404`, `ConflictException → 409`, `DomainException → 400`. The middleware does the translation; the service throws semantic exceptions without knowing about HTTP.

### Why a mock role switcher instead of full auth?
Authentication and user management are explicitly out of scope for a license-management module assignment — adding them would mean less time on the actual brief. A client-side mock with `localStorage` persistence demonstrates **the same UI patterns** that real auth uses: the same `usePermissions()` hook, the same conditional rendering, the same permission matrix. In production, only the source of the role changes (from `localStorage` to a JWT claim) and the backend would also enforce it via `[Authorize]` attributes. The mock is labeled clearly in the UI so it's never mistaken for real security.

### Why a client-side export instead of a backend endpoint?
For 10–1000 doctors, generating the file in the browser is fast, free, and avoids a server round trip. The browser already has the data via the listing API. A backend endpoint would shine for **large datasets** (50k+ rows), background generation, or audit trails — none of which apply at this scale. The `docx` library is dynamically imported so the export code only loads when the user clicks Export.

### Why Sonner instead of a homemade toast?
Three reasons: it's tiny (~1 KB), it has accessible defaults (focus management, ARIA roles), and it ships an animated entry/exit out of the box. Building those correctly takes longer than the integration.

### Why a top progress bar AND `loading.tsx`?
On localhost, navigation is so fast that `loading.tsx` skeletons flash for milliseconds and feel invisible. The progress bar guarantees a 700ms minimum visible feedback on every navigation. In production with real network latency, the skeleton becomes the dominant signal — both work together.

---

## What I Would Add Next

These were intentionally cut from scope to keep the submission focused:

- **Unit tests** for `DoctorService` (mock `IDoctorRepository`) and integration tests using `WebApplicationFactory`
- **Authentication and role-based UI** — JWT bearer tokens, role claims for `Admin` vs `Viewer`, RBAC on the status update endpoint
- **Audit log table** capturing who changed which field and when, surfaced in the edit modal as a timeline
- **Sortable table columns** — backend SP already does the work; frontend just needs clickable headers
- **CSV export** of the filtered list
- **Multi-tenant isolation** — `TenantId` column with row-level security in SQL Server, JWT carries the tenant claim
- **AI-assisted features** — using OpenAI to summarize a doctor's profile or flag licenses likely to expire based on history

---

## License

Built for the Carlisle Full Stack Developer technical assignment. Not for production redistribution.
