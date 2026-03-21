# Mission 11 – Online Bookstore

ASP.NET Core Web API + React (Vite) app connected to the provided **SQLite** database (`Bookstore.sqlite`). Lists all books with **Bootstrap** styling, **pagination** (default **5 per page**, user-selectable page size), and **sort by title** (A→Z / Z→A).

## Repository layout

| Folder | What it is |
|--------|------------|
| **`backend/BookstoreApi/`** | **API + database** — ASP.NET Core project, EF Core, SQLite file under `Data/`. |
| **`frontend/`** | **React UI** — Vite + TypeScript, Bootstrap, book list and pagination. |

```
mission11/
├── Bookstore.slnx          ← Open in Rider / VS / `dotnet build`
├── README.md               ← You are here
├── backend/
│   └── BookstoreApi/       ← .NET Web API (Program.cs, Controllers, Models, Data/)
└── frontend/               ← React app (package.json, src/, vite.config.ts)
```

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (10.x used here)
- [Node.js](https://nodejs.org/) (for the React client)

## Run the API (backend)

```bash
cd backend/BookstoreApi
dotnet run --launch-profile http
```

API listens on **http://localhost:5121** (see `Properties/launchSettings.json`).

- Books: `GET /api/books?page=1&pageSize=5&sortDirection=asc`

The database file is at **`backend/BookstoreApi/Data/Bookstore.sqlite`**.

## Run the React app (frontend)

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). The dev server **proxies** `/api` to the API on port 5121.

## Build / check from repo root

```bash
dotnet build Bookstore.slnx
cd frontend && npm run build
```

## Assignment checklist

- [x] Models match `Books` table in SQLite  
- [x] Component lists each book’s fields  
- [x] Pagination, 5 per page default, user can change page size  
- [x] Sort by book title  
- [x] Bootstrap styling  
- [x] Main list component used from `App.tsx`  

Submit: push this folder to **GitHub** and turn in the repo link on Learning Suite.
