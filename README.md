# Mission 11 – Online Bookstore

ASP.NET Core Web API + React (Vite) app connected to the provided **SQLite** database (`Bookstore.sqlite`). Lists all books with **Bootstrap** styling, **pagination** (default **5 per page**, user-selectable page size), and **sort by title** (A→Z / Z→A).

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (10.x used here)
- [Node.js](https://nodejs.org/) (for the React client)

## Run the API

```bash
cd BookstoreApi
dotnet run --launch-profile http
```

API listens on **http://localhost:5121** (see `Properties/launchSettings.json`).

- Books: `GET /api/books?page=1&pageSize=5&sortDirection=asc`

The database file is at `BookstoreApi/Data/Bookstore.sqlite`.

## Run the React app

In a **second** terminal:

```bash
cd bookstore-ui
npm install
npm run dev
```

Open the URL Vite prints (usually **http://localhost:5173**). The dev server **proxies** `/api` to the API on port 5121.

## Assignment checklist

- [x] Models match `Books` table in SQLite  
- [x] Component lists each book’s fields  
- [x] Pagination, 5 per page default, user can change page size  
- [x] Sort by book title  
- [x] Bootstrap styling  
- [x] Main list component used from `App.tsx`  

Submit: push this folder to **GitHub** and turn in the repo link on Learning Suite.
