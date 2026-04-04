# MISSION 13 — IS 413 Bookstore App (Phase 6)

> This file is the single source of truth for the entire build.
> Read it fully before starting any step. Reference it throughout.
> Do NOT deviate from the file paths, names, or patterns defined here.

---

## Documentation in this repo

| File | Purpose |
|------|---------|
| **MISSION13.md** (this file) | Full spec, snippets, checklist, Azure notes |
| **MISSION13_CHUNKS.md** | Copy-paste Cursor prompts, one chunk at a time |
| **MISSION13_PLAN.md** | Step checklist (tick as you go) |
| **MISSION12_*.md** | Mission 12 rules, plan, architecture, Bootstrap notes (historical reference) |

Mission 13 builds on the existing Mission 12 codebase (filters, cart, routing, etc.).

---

## Project Overview

This is a continuation of the Bookstore app from Mission 12.

- **Goal:** Add CRUD (Create, Read, Update, Delete) for books + deploy to Azure
- **Branch:** `phase6` (create from current branch before doing anything — if it already exists, run `git checkout phase6`)
- **Stack:** ASP.NET Core backend (**this repo targets `net10.0`**) + React/TypeScript/Vite frontend + SQLite  
  - **Azure:** In App Service, pick a **.NET / ASP.NET Core** runtime that matches what you publish (**.NET 10** when the portal offers it). If the portal only lists .NET 8 and your project stays on `net10.0`, deployment may fail until the runtime matches the project file.

---

## Existing Project Structure (do not rename or move anything)

```
mission11/   (repository root — name may differ on your machine)
├── backend/
│   └── BookstoreApi/
│       ├── Controllers/
│       │   └── BooksController.cs        ← add CRUD methods here
│       ├── Data/
│       │   ├── Bookstore.sqlite          ← fix CopyToOutputDirectory here
│       │   └── BookstoreDbContext.cs
│       ├── Models/
│       │   ├── Book.cs                   ← existing model, do not change
│       │   └── PagedBooksResult.cs
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── BookstoreApi.csproj           ← add SQLite ItemGroup here
│       ├── Program.cs                    ← update CORS here
│       └── appsettings.json
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   ├── icons.svg
    │   └── routes.json                   ← CREATE THIS (Azure SPA routing)
    ├── src/
    │   ├── api/
    │   │   └── booksApi.ts               ← CREATE THIS (centralized API calls)
    │   ├── components/
    │   │   ├── BookList.tsx              ← do not modify
    │   │   ├── CartSummary.tsx           ← do not modify
    │   │   ├── CategoryFilter.tsx        ← do not modify
    │   │   ├── NewBookForm.tsx           ← CREATE THIS
    │   │   └── EditBookForm.tsx          ← CREATE THIS
    │   ├── context/
    │   │   └── CartProvider.tsx          ← do not modify
    │   ├── pages/
    │   │   ├── BookListPage.tsx          ← add admin nav link only
    │   │   ├── CartPage.tsx              ← do not modify
    │   │   ├── DonatePage.tsx            ← do not modify
    │   │   └── AdminBooksPage.tsx        ← CREATE THIS
    │   ├── types/
    │   │   ├── book.ts                   ← do not modify
    │   │   └── cart.ts                   ← do not modify
    │   ├── App.tsx                       ← add admin route only
    │   └── main.tsx                      ← do not modify
    ├── vite.config.ts                    ← update proxy
    └── package.json                      ← do not modify
```

---

## Existing Book Model (reference for all form fields)

```
BookID        int      (primary key, do not include in add form)
Title         string
Author        string
Publisher     string
ISBN          string
Classification string
Category      string
PageCount     int
Price         decimal
```

TypeScript type (already exists in `src/types/book.ts`):

```ts
export type Book = {
  bookID: number      // note: camelCase on frontend
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}
```

---

## Backend Ports (local dev)

- https: `7255`
- http: `5121`

---

## API Endpoints (after this mission is complete)

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/books` | Get paged books (already exists) |
| GET | `/api/books/categories` | Get categories (already exists) |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/{bookId}` | Update an existing book |
| DELETE | `/api/books/{bookId}` | Delete a book |

---

## Key Rules

1. **Never modify** any file not listed as a target for that step
2. **Never rename** existing files or components
3. **Always use** the existing `Book` type from `src/types/book.ts` — do not redefine it
4. **Always use** Bootstrap classes for styling — this project uses Bootstrap
5. **Forms:** Use normal `<form onSubmit={...}>` in React. **Do not** set the HTML `action` attribute (avoid full-page postbacks); handle submit in JS only.
6. **CORS** must use `AllowAnyOrigin()` + `AllowAnyMethod()` + `AllowAnyHeader()` for Azure deployment to work
7. **SQLite file** must have `CopyToOutputDirectory` set to `PreserveNewest` or it won't deploy  
   - **Already true in this repo:** `BookstoreApi.csproj` uses `<None Update="Data\Bookstore.sqlite">` with `PreserveNewest` (equivalent purpose). If an assignment insists on `<Content Include="...">`, **replace** the existing `None` block rather than duplicating two copies of the same file.
8. **routes.json** in `frontend/public/` is required for Azure SPA routing — without it `/adminbooks` won't work when navigated to directly
9. **Stop and wait for approval** at the end of every step before proceeding

---

## Steps Summary

| # | What | Files Touched |
|---|------|---------------|
| 1 | Create git branch | — |
| 2 | Add CRUD endpoints to backend controller | `BooksController.cs` |
| 3 | Fix CORS in Program.cs | `Program.cs` |
| 4 | Fix SQLite CopyToOutputDirectory | `BookstoreApi.csproj` |
| 5 | Create centralized API file | `src/api/booksApi.ts` (new) |
| 6 | Create AdminBooksPage | `src/pages/AdminBooksPage.tsx` (new) |
| 7 | Create NewBookForm component | `src/components/NewBookForm.tsx` (new) |
| 8 | Create EditBookForm component | `src/components/EditBookForm.tsx` (new) |
| 9 | Wire up route + nav link | `App.tsx`, `BookListPage.tsx` |
| 10 | Add routes.json | `frontend/public/routes.json` (new) |
| 11 | Update Vite proxy | `vite.config.ts` |
| 12 | Local test | — |
| 13 | Commit to GitHub | — |
| 14 | Deploy backend to Azure | — |
| 15 | Update API_URL to Azure backend URL | `src/api/booksApi.ts` (see **booksApi `API_URL` convention** below) |
| 16 | Deploy frontend to Azure | — |
| 17 | Final verify + submit | — |

---

## CORS Policy (exact code for Program.cs)

Replace the existing `AddCors` block with:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

Replace `app.UseCors()` with:

```csharp
app.UseCors("AllowAll");
```

---

## SQLite Fix (exact code for .csproj)

Add inside `<Project>` in `BookstoreApi.csproj` **if not already present**:

```xml
<ItemGroup>
  <Content Include="Data\Bookstore.sqlite">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </Content>
</ItemGroup>
```

**This repository already** copies the database via:

```xml
<None Update="Data\Bookstore.sqlite">
  <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
</None>
```

Do **not** add both `None` and `Content` for the same file — pick one approach.

---

## booksApi.ts `API_URL` convention (aligns with MISSION13_CHUNKS.md)

- **Local dev (Vite proxy):** use the chunk prompt value  
  `export const API_URL = '/api/books'`  
  so `GET` is `fetch(\`${API_URL}?${params}\`)` and `PUT`/`DELETE` use `` `${API_URL}/${bookId}` ``.
- **After Azure deploy (step 15):** set the **full books base URL**, e.g.  
  `export const API_URL = 'https://YOUR-BACKEND.azurewebsites.net/api/books'`  
  (no trailing slash after `books`).

`BookList.tsx` continues to call `/api/books?...` directly; only admin code needs `booksApi.ts` until you refactor.

---

## Vite Proxy Config (exact code for vite.config.ts)

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7255',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

---

## routes.json (exact content)

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

---

## Local Test Checklist (Step 12)

Run these in two separate terminals:

- Terminal 1: `cd backend/BookstoreApi` → `dotnet watch run --launch-profile https`  
  - **Why:** `vite.config.ts` (Mission 13) proxies `/api` to **`https://localhost:7255`**. The **`https`** launch profile listens on that URL (see `Properties/launchSettings.json`). Using only the **`http`** profile (`5121` only) will break the proxy unless you change the Vite target back to `http://localhost:5121`.
- Terminal 2: `cd frontend` → `npm run dev`

Then verify:

- [ ] `http://localhost:5173/` loads book list normally
- [ ] `http://localhost:5173/adminbooks` loads the admin table
- [ ] "Add Book" button shows the form, submitting adds a new row
- [ ] "Edit" button pre-fills the form, submitting updates the row
- [ ] "Delete" button shows a confirm dialog, confirming removes the row
- [ ] No console errors in browser dev tools

---

## Azure Deployment Notes

- Backend deploys as an **App Service Web App** (Free **F1** tier is typical). Choose a **.NET** runtime that matches **`TargetFramework`** in `BookstoreApi.csproj` (this repo: **net10.0**).
- Frontend deploys as a **Static Web App** (React, build output: `dist`)
- After deploying backend, copy its URL and update `API_URL` in `booksApi.ts`
- Frontend auto-deploys via GitHub Actions on every push after initial setup
- After deploying, test `/adminbooks` directly in the browser URL bar to confirm `routes.json` is working
