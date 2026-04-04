# Frontend (React + Vite)

TypeScript SPA: bookstore catalog, cart, donation link, and **admin CRUD** at **`/adminbooks`**.

**→ Live site, API URL, and setup:** see the [repository root `README.md`](../README.md).

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Routes |
| `src/api/booksApi.ts` | Production API base URL + fetch helpers |
| `src/pages/AdminBooksPage.tsx` | Admin list + delete |
| `src/components/NewBookForm.tsx` | Add book |
| `src/components/EditBookForm.tsx` | Edit book |
| `vite.config.ts` | Dev proxy: `/api` → `http://localhost:5121` |

```bash
npm install
npm run dev
```

Run the **backend** first so `/api` works locally (or temporarily set `API_URL` to `'/api/books'` in `src/api/booksApi.ts`).
