# Mission 11 — Online Bookstore

Full-stack **ASP.NET Core Web API** + **React (Vite, TypeScript)** bookstore: browse with filters, pagination, sort, cart, and **admin CRUD** (add / edit / delete books) against **SQLite**.

---

## Quick links (grading)

| What | Where |
|------|--------|
| **Live website (Azure Static Web Apps)** | `https://white-smoke-05fd5c10f.4.azurestaticapps.net` |
| **Live API (Azure App Service)** | `https://is413-bookstore-api-gbdkeqftb6azcgc8.francecentral-01.azurewebsites.net` |
| **Sample books endpoint** | `GET https://is413-bookstore-api-gbdkeqftb6azcgc8.francecentral-01.azurewebsites.net/api/books?page=1&pageSize=5&sortDirection=asc` |
| **Admin UI (after opening the site)** | **Menu → Admin** or path **`/adminbooks`** |
| **CI/CD** | [`.github/workflows/azure-static-web-apps-white-smoke-05fd5c10f.yml`](.github/workflows/azure-static-web-apps-white-smoke-05fd5c10f.yml) — runs on pushes to **`phase6`** and **`master`** |

> **URL note:** The Static Web App hostname includes **`.4.`** as its own label (`05fd5c10f.4.azurestaticapps.net`). If you omit the dot and type `05fd5c10f4`, you may hit a different host and see a 404.

---

## Rubric map (where to look)

| Criterion | In this project |
|-----------|-----------------|
| **App compiles and runs** | Backend: `dotnet build Bookstore.slnx` from repo root; Frontend: `cd frontend && npm ci && npm run build`. Run locally: API then `npm run dev` (see below). |
| **Add books** | UI: **`/adminbooks`** → **Add book** → [`NewBookForm.tsx`](frontend/src/components/NewBookForm.tsx). API: `POST /api/books` in [`BooksController.cs`](backend/BookstoreApi/Controllers/BooksController.cs). Client: [`addBook`](frontend/src/api/booksApi.ts). |
| **Edit books** | UI: **Edit** on admin table → [`EditBookForm.tsx`](frontend/src/components/EditBookForm.tsx). API: `PUT /api/books/{id}`. Client: [`updateBook`](frontend/src/api/booksApi.ts). |
| **Delete books** | UI: **Delete** on admin table → [`AdminBooksPage.tsx`](frontend/src/pages/AdminBooksPage.tsx). API: `DELETE /api/books/{id}`. Client: [`deleteBook`](frontend/src/api/booksApi.ts). |
| **Deployed on Azure (front + back)** | Frontend URL in the table above; production API base URL is set in [`booksApi.ts`](frontend/src/api/booksApi.ts) (`API_URL`). Backend is deployed separately (App Service); frontend calls that URL over HTTPS. |
| **Clean code** | Controllers use XML doc comments; React components use typed props/state and small focused files. Routing: [`App.tsx`](frontend/src/App.tsx). |

---

## Repository layout

```
mission11/
├── README.md                          ← Start here (this file)
├── Bookstore.slnx                     ← Open / build entire .NET solution
├── .github/workflows/
│   └── azure-static-web-apps-white-smoke-05fd5c10f.yml   ← Frontend deploy to Azure SWA
├── backend/
│   ├── README.md                      ← Backend-only notes
│   └── BookstoreApi/                  ← Web API, EF Core, SQLite under Data/
└── frontend/
    ├── README.md                      ← Frontend-only notes
    ├── src/
    │   ├── App.tsx                    ← Routes: /, /adminbooks, /cart, …
    │   ├── api/booksApi.ts            ← All HTTP calls to the books API
    │   ├── components/                ← BookList, forms, filters, cart UI
    │   └── pages/                     ← BookListPage, AdminBooksPage, …
    └── public/
        └── staticwebapp.config.json   ← SPA fallback for Azure Static Web Apps
```

---

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (10.x)
- [Node.js](https://nodejs.org/) 20+ (for the React app)

---

## Run locally (API + React)

**1. API**

```bash
cd backend/BookstoreApi
dotnet run --launch-profile http
```

Default URL: **http://localhost:5121** (see `Properties/launchSettings.json`).  
Database file: **`backend/BookstoreApi/Data/Bookstore.sqlite`**.

**2. Frontend** (second terminal)

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**).  
For local dev, point the client at the proxy by setting `API_URL` in [`booksApi.ts`](frontend/src/api/booksApi.ts) to **`'/api/books'`** (Vite proxies `/api` to the API). The committed value targets the **production** Azure API so the deployed site works without changes.

---

## Verify build from repo root

```bash
dotnet build Bookstore.slnx
cd frontend && npm ci && npm run build
```

---

## Assignment features (original checklist)

- [x] Models match `Books` table in SQLite  
- [x] List shows each book’s fields  
- [x] Pagination (default 5 per page, user can change page size), sort by title  
- [x] Bootstrap styling  
- [x] Category filters  
- [x] Admin: add, edit, delete books  
- [x] Frontend on Azure Static Web Apps; API on Azure App Service  

Submit: GitHub repo URL on Learning Suite.
