# Doctor License Management

A medical SaaS module for managing doctor licenses — built with **.NET 8**, **Next.js 14**, and **SQL Server**.

> Technical assignment for the Full Stack Developer role at **Carlisle**.

---

## 🧭 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Database](#-database)
- [Stored Procedures](#-stored-procedures)
- [API Reference](#-api-reference)
- [Validation Strategy](#-validation-strategy)
- [Decisions & Trade-offs](#-decisions--trade-offs)

---

## 📋 Overview

This module lets clinics and medical platforms manage their doctors' license records:

- ✅ Full CRUD with soft delete
- ✅ Auto-mark licenses as **Expired** when expiry date passes
- ✅ Prevent duplicate license numbers
- ✅ Search by name or license number
- ✅ Filter by status (Active / Expired / Suspended)
- ✅ Server-side pagination

---

## 🛠 Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| **Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS       |
| **Backend**  | .NET 8 Web API · Clean Architecture · FluentValidation    |
| **Database** | SQL Server · Stored Procedures                            |
| **Tooling**  | Swagger · xUnit · Serilog                                 |

---

## 🏛 Architecture

Clean Architecture with four layers — dependencies point **inward only**:

```
┌──────────────────────────────────────────┐
│  API   (Controllers, Middleware, DI)     │
└─────────────┬────────────────────────────┘
              ▼ depends on
┌──────────────────────────────────────────┐
│  Application  (DTOs, Services, Validators)│
└─────────────┬────────────────────────────┘
              ▼ depends on
┌──────────────────────────────────────────┐
│  Domain  (Entities, Enums, Rules)        │  ← zero dependencies
└──────────────────────────────────────────┘
              ▲ implements interfaces from Application
              │
┌──────────────────────────────────────────┐
│  Infrastructure  (EF Core, Repositories) │
└──────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Doctor_Application/
├── backend/         # .NET 8 Web API solution
├── frontend/        # Next.js 14 app
└── database/        # SQL scripts (schema + stored procedures + seed)
```

---

## 🚀 Quick Start

> _Detailed setup steps will be added as each layer is implemented._

### Prerequisites

- .NET 8 SDK
- Node.js 20+
- SQL Server 2019+ (or LocalDB)
- Git

---

## 🗄 Database

_TBD — schema and migration steps._

## 📦 Stored Procedures

_TBD — `sp_GetDoctors` and `sp_GetExpiredDoctors`._

## 📡 API Reference

_TBD — endpoints will be documented via Swagger at `/swagger`._

## 🛡 Validation Strategy

_TBD — defense in depth: Zod (frontend) + FluentValidation (backend) + DB constraints._

## 🤔 Decisions & Trade-offs

_TBD — to be filled in as the project evolves._

---

## 📜 License

Built as a technical assignment — not for production redistribution.
